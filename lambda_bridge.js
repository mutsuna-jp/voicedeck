/**
 * Alexa to VoiceDeck Hub Bridge (AWS Lambda)
 * 
 * このスクリプトは、Alexa 開発者コンソールのエンドポイントとして Lambda を使用する場合に使用します。
 * Alexa から届いたリクエストを、あなたの Hub サーバー（クラウドまたは ngrok 経由のローカル）へ転送します。
 */

// あなたの Hub サーバーの URL（最後の /alexa まで含めてください）
// 例: "https://your-ngrok-url.ngrok-free.app/alexa"
const HUB_ALEXA_ENDPOINT = process.env.HUB_ALEXA_ENDPOINT || "https://voicedeck.mutsuna.jp/alexa";

export const handler = async (event) => {
    console.log("Alexa Request Received:", JSON.stringify(event, null, 2));

    try {
        // Hub サーバーへリクエストを転送
        // アカウントリンクをスキップする場合でも、Alexa はセッション情報を送ってくるため
        // そのまま Hub サーバーへ渡します。
        const response = await fetch(HUB_ALEXA_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hub Server returned ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("Hub Response:", JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error("Bridge Error:", error);
        
        // エラー時の音声応答
        return {
            version: "1.0",
            response: {
                outputSpeech: {
                    type: "PlainText",
                    text: "サーバーへの接続に失敗しました。設定を確認してください。"
                },
                shouldEndSession: true
            }
        };
    }
};
