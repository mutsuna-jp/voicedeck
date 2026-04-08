# mutsuna-voice-deck (Voice Bridge for Alexa & Stream Deck)

Amazon Alexa から Stream Deck のアクションを声で実行するためのブリッジツールです。

> [!IMPORTANT]
> **免責事項（Disclaimer）**  
> 本プロジェクトは非公式のツールであり、Amazon.com, Inc. や Elgato (Corsair Gaming, Inc.) との提携、承認、後援はありません。

## 🌟 特徴

- **柔軟な音声操作**: 「アレクサ、パソコン操作で『設定を開く』を実行して」のように指示可能。
- **AIによる意味解釈 (Gemini)**: 言い回しが少し違っても、AIが最適なアクションを推論して実行します。
- **MCP (Model Context Protocol) 準拠**: Elgato公式のMCPサーバーを介してセキュアに操作。

## 🛠️ セットアップ手順

### 1. インストール

npm経由でインストールできます：

```bash
npm install -g mutsuna-voice-deck
```

### 2. 環境変数の設定

以下の項目を設定した `.env` ファイルを、実行するディレクトリに作成してください。

```env
GEMINI_API_KEY=あなたのGoogleAIのAPIキー
# (オプション) ポート番号を指定する場合
# PORT=8787
```

### 3. Alexaスキルの作成

[Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) でカスタムスキルを作成してください。
対話モデルの詳細は、同梱の `alexa_skill_setup.md` を参照してください。

### 4. 実行

```bash
mutsuna-voice-deck
```

起動すると、`http://localhost:8787/alexa` がエンドポイントになります。  
(非公開テストなどで利用する場合は、ngrok や Cloudflare Tunnel 等で外部公開してください)

## 📄 ライセンス

MIT
