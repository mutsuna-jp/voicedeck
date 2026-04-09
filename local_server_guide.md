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

## 3. Alexa スキルとの連携 (Alexa-hosted 経由)

Alexa からのリクエストをローカル PC に届けるために、Amazon のサーバーを中継役として使用します。

### ステップ 1: ngrok 等でローカルサーバーを公開
Alexa からアクセスできるようにします。
```bash
ngrok http 8787
```
発行された URL（例: `https://xxxx.ngrok-free.app`）を控えておきます。

### ステップ 2: Alexa スキルの作成とコードの設定
Alexa Developer Console 内だけで完結する手順を以下のガイドにまとめています。
- [Alexa スキルの作成・設定ガイド (全手順)](file:///e:/MutsunaJP/alexa2streamdeck/public/alexa_skill_setup.md)

このガイドに従って：
1. **Alexa-hosted (Node.js)** を選択してスキルを作成。
2. `public/alexa_hosted_index.js` のコードを貼り付け。
3. 環境変数 `HUB_ALEXA_ENDPOINT` に、ステップ 1 で控えた URL + `/alexa` を設定。

---
これで、あなたの声が Alexa → Amazon サーバー → あなたの PC (oss-hub) → ストリームデック（プラグイン）へと届くようになります！
