import { Hono } from "hono";
import { DurableObject } from "cloudflare:workers";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * 簡易版 Relay Server (Durable Object)
 * 認証なしで全ての PC クライアント接続を許可します。
 */
export class RelayServer extends DurableObject {
  private sessions: Set<WebSocket> = new Set();
  private pendingResponses: Map<string, { resolve: (v: any) => void, timer: any }> = new Map();

  constructor(ctx: DurableObjectState, env: any) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    const pair = new (globalThis as any).WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    this.ctx.acceptWebSocket(server);
    this.sessions.add(server);
    return new Response(null, { status: 101, webSocket: client } as any);
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    try {
      const data = JSON.parse(String(message));
      
      // AI 判定結果の処理
      if (data?.type === "intent_result" && data?.requestId) {
        const pending = this.pendingResponses.get(data.requestId);
        if (pending) {
          clearTimeout(pending.timer);
          this.pendingResponses.delete(data.requestId);
          pending.resolve(data);
          return;
        }
      }

      // 認証成功を擬似的に返す（互換性のため）
      if (data?.type === "auth") {
        ws.send(JSON.stringify({ type: "auth_success" }));
        return;
      }

      if (data?.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }));
        return;
      }
    } catch (err) {}
  }

  async webSocketClose(ws: WebSocket) {
    this.sessions.delete(ws);
  }

  /**
   * Alexa 命令を PC へ転送
   */
  async sendCommand(command: any) {
    const requestId = crypto.randomUUID();
    const message = JSON.stringify({
      type: "intent_request",
      requestId,
      intent: command.intent,
      slots: command.slots,
    });

    const sessions = Array.from(this.sessions);
    if (sessions.length === 0) {
      return { success: false, speechText: "PCがオフラインです" };
    }

    sessions.forEach(s => s.send(message));

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.pendingResponses.delete(requestId);
        resolve({ success: false, speechText: "PCから応答がありませんでした" });
      }, 7000);
      this.pendingResponses.set(requestId, { resolve, timer });
    });
  }
}

/**
 * Hono アプリケーション本体
 */
const app = new Hono<{ Bindings: { RELAY: DurableObjectNamespace<RelayServer>, GEMINI_API_KEY: string } }>();

// Alexa からの受付
app.post("/alexa", async (c) => {
  const body = await c.req.json();
  const id = c.env.RELAY.idFromName("oss-default-user");
  const relay = c.env.RELAY.get(id);

  if (body?.request?.type === "IntentRequest") {
    const result = await relay.sendCommand({
      intent: body.request.intent.name,
      slots: body.request.intent.slots,
    });
    return c.json({ version: "1.0", response: { outputSpeech: { type: "PlainText", text: (result as any).speechText || "了解しました" } } });
  }
  return c.json({ version: "1.0", response: { outputSpeech: { type: "PlainText", text: "準備完了です" } } });
});

// PC クライアントのリレー (WebSocket)
app.all("/relay", async (c) => {
  const id = c.env.RELAY.idFromName("oss-default-user");
  return c.env.RELAY.get(id).fetch(c.req.raw);
});

// ステータス API (常に PREMIUM)
app.get("/api/user/status", (c) => c.json({ success: true, tier: "PREMIUM", email: "oss@example.com" }));

// AI アクションマッチング
app.post("/api/ai/match-action", async (c) => {
  const { userInput, actions, userGeminiApiKey, model: modelName } = await c.req.json();
  const apiKey = userGeminiApiKey || c.env.GEMINI_API_KEY;

  if (!apiKey) return c.json({ error: "Gemini API Key required" }, 400);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName || "gemini-3.1-flash-lite-preview" });
    const prompt = `ユーザーの言葉 "${userInput}" に最も近い ID を以下から選び、IDのみ回答してください: ${JSON.stringify(actions)}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return c.json({ success: true, matchedActionId: text === "null" ? null : text });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
