/**
 * Alexa-hosted (Node.js) 用 ブリッジコード
 * 
 * このコードは Alexa Developer Console の「コード」エディタに貼り付けて使用します。
 * Alexa からのリクエストを、あなたの PC で動作している Hub サーバーへ転送します。
 */

const Alexa = require('ask-sdk-core');

const ForwardToHubHandler = {
    canHandle(handlerInput) {
        return true; // 全てのリクエスト（Launch, Intent等）を Hub へ転送
    },
    async handle(handlerInput) {
        // Alexa Console の「ツール > 環境変数」で設定した URL
        const endpoint = process.env.HUB_ALEXA_ENDPOINT;

        if (!endpoint) {
            return handlerInput.responseBuilder
                .speak('環境変数 HUB_ALEXA_ENDPOINT が設定されていません。Alexa Console のツールから設定してください。')
                .getResponse();
        }

        console.log("Forwarding request to Hub:", endpoint);

        try {
            // Node.js 18+ の標準 fetch を使用
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(handlerInput.requestEnvelope)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Hub Server returned ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log("Hub Response received:", JSON.stringify(result));

            // Hub からのレスポンスをそのまま Alexa へ返す
            // (Hub 側が Alexa のレスポンス形式に従っている必要があります)
            return result;
        } catch (error) {
            console.error("Bridge Error:", error);
            return handlerInput.responseBuilder
                .speak('Hub サーバーへの接続に失敗しました。設定とトンネル（ngrok等）の状態を確認してください。')
                .getResponse();
        }
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak('エラーが発生しました。ログを確認してください。')
            .getResponse();
    }
};

/**
 * 起動設定
 */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(ForwardToHubHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
