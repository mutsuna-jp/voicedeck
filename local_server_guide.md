# ローカル Hub サーバーのセットアップガイド

このガイドでは、Cloudflare Workers を使用せず、自分の PC 上で「Hub サーバー」を動かし、自作の Alexa スキルと連携させる手順を説明します。OSS 版の Hub サーバーは認証機能が排除されており、個人で利用するために最適化されています。

## 1. サーバーの準備と起動

1.  `public/oss-hub` ディレクトリに移動します。
    ```bash
    cd public/oss-hub
    ```
2.  依存関係をインストールします。
    ```bash
    pnpm install
    ```
3.  設定ファイルを作成します。 `example.wrangler.jsonc` を `wrangler.jsonc` にコピーしてください。
4.  `wrangler.jsonc` 内の `GEMINI_API_KEY` に、あなたの Google AI (Gemini) API キーを入力します。
    ```json
    "vars": {
      "GEMINI_API_KEY": "AIza..."
    }
    ```
5.  サーバーをローカルモードで起動します。
    ```bash
    pnpm wrangler dev
    ```
    これで `http://localhost:8787` でサーバーが待機状態になります。

## 2. ストリームデックの設定

1.  ストリームデックの設定画面（Property Inspector）を開きます。
2.  **User Token 欄を空にします。**
    - トークンを空にすると、プラグインは自動的に `http://localhost:8787` を参照します。
3.  「Check Status」を押し、Hub が `🟢 Connected` に、Tier が `PREMIUM` になれば成功です。

## 3. Alexa スキルとの連携 (AWS Lambda 経由)

Alexa からのリクエストをローカル PC に届けるために、AWS Lambda をブリッジとして使用します。

### ステップ 1: ngrok 等でローカルサーバーを公開
Alexa (Lambda) からアクセスできるようにします。
```bash
ngrok http 8787
```
発行された URL（例: `https://xxxx.ngrok-free.app`）を控えておきます。

### ステップ 2: AWS Lambda の作成
1.  [AWS コンソール](https://console.aws.amazon.com/lambda/)で新しい関数を作成します（Node.js 20.x）。
2.  `public/lambda_bridge.js` の内容を Lambda に貼り付けます。
3.  環境変数 `HUB_ALEXA_ENDPOINT` に、ステップ 1 で控えた URL + `/alexa` を設定します。
    - 例: `https://xxxx.ngrok-free.app/alexa`

### ステップ 3: Alexa スキルの設定
1.  [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) で対象スキルの「Endpoint」設定を開きます。
2.  「AWS Lambda ARN」を選択し、作成した Lambda の ARN を入力して保存します。

---
これで、あなたの声が Alexa → AWS Lambda → あなたの PC (oss-hub) → ストリームデックへと届くようになります！
