import { expect, test, describe } from "vitest";
import { SELF } from "cloudflare:test";

describe("VoiceDeck OSS Hub API", () => {
  test("GET /api/user/status should return PREMIUM status", async () => {
    const res = await SELF.fetch("http://localhost/api/user/status");
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
      success: true,
      tier: "PREMIUM",
      email: "oss@example.com",
    });
  });

  test("POST /alexa should respond with voice output", async () => {
    const alexaRequest = {
      version: "1.0",
      request: {
        type: "LaunchRequest",
        requestId: "req-123",
      },
    };

    const res = await SELF.fetch("http://localhost/alexa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alexaRequest),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.response.outputSpeech.text).toBe("準備完了です");
  });

  test("GET /relay should initiate websocket upgrade", async () => {
    const res = await SELF.fetch("http://localhost/relay", {
      headers: { Upgrade: "websocket" },
    });
    // Cloudflare test environment handling of WS might vary, but 101 is success
    expect(res.status).toBe(101);
  });
});
