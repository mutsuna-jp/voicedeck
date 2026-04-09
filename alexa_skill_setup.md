# Alexa スキルの作成・設定ガイド (Amazon ホスト版)

このガイドでは、AWS アカウントを用意することなく、Alexa の管理画面内だけで完結する **「Alexa-hosted (Node.js)」** を使って、あなたの PC (OSS Hub) と連携させる手順を解説します。

---

## 全体図
1.  **Alexa クラウド**: 声を受け取り、PCへ命令を飛ばす（中継役）。
2.  **あなたの PC**: 命令を受け取り、ストリームデックのプラグインを動かす（コントローラー）。

---

## STEP 1: スキルの新規作成

1.  [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) にログインします。
2.  **「スキルの作成」** ボタンをクリックします。

### 1-1. 基本情報の入力
*   **スキル名**: `OSS Voice Deck` などの好きな名前。
*   **プライマリロケール**: **「日本語」**。
*   「次へ」をクリック。

### 1-2. モデルの選択
*   **「カスタム」** を選択して「次へ」。

### 1-3. ホスティングサービスの選択
*   **「Alexa-hosted (Node.js)」** を選択します。
    *   *※これにより、Amazon のサーバー上で無料でプログラムを動かせます。*
*   「次へ」をクリック。

### 1-4. テンプレートの選択
*   **「Start from Scratch (一から作成)」** を選択し、右上の **「スキルを作成」** をクリックします。
    *   *※作成完了まで約 1 分かかります。*

---

## STEP 2: 対話モデル（JSON エディター）の一括設定

Alexa があなたの言葉を理解するための設定を行います。

1.  左メニューの **「対話モデル」 > 「JSONエディター」** を開きます。
2.  既存のコードをすべて削除し、[public/alexa_skill_setup.md](file:///e:/MutsunaJP/alexa2streamdeck/public/alexa_skill_setup.md#InteractionModel) (下記) の JSON を貼り付けます。
    *   *※この JSON には、呼び出し名「テスト用ツール」などの設定が含まれています。*

```json
{
  "interactionModel": {
    "languageModel": {
      "invocationName": "テスト用ツール",
      "intents": [
        {
          "name": "ExecuteActionIntent",
          "slots": [
            {
              "name": "ActionName",
              "type": "AMAZON.SearchQuery"
            }
          ],
          "samples": [
            "{ActionName} を実行して",
            "{ActionName} をやって",
            "{ActionName} をオンにして",
            "{ActionName} をオフにして",
            "{ActionName} を起動して",
            "{ActionName} を開いて",
            "{ActionName} をして"
          ]
        },
        {
          "name": "ListActionsIntent",
          "slots": [],
          "samples": [
            "アクションを教えて",
            "何ができるの",
            "一覧を教えて",
            "アクションリストを見せて"
          ]
        },
        {
          "name": "AMAZON.CancelIntent",
          "samples": []
        },
        {
          "name": "AMAZON.HelpIntent",
          "samples": ["ヘルプ", "使い方を教えて", "ヘルプを開いて"]
        },
        {
          "name": "AMAZON.StopIntent",
          "samples": []
        },
        {
          "name": "AMAZON.NavigateHomeIntent",
          "samples": []
        }
      ],
      "types": []
    }
  }
}
```

3.  **「モデルを保存」** をクリックし、次に **「モデルをビルド」** をクリックして完了を待ちます。

---

## STEP 3: ブリッジコードの実装

中継プログラムを貼り付けます。

1.  上部タブの **「コード」** をクリックします。
2.  左メニューの `index.js` を開き、内容をすべて削除します。
3.  [public/alexa_hosted_index.js](file:///e:/MutsunaJP/alexa2streamdeck/public/alexa_hosted_index.js) の内容をすべて貼り付けます。
4.  右上の **「保存 (Save)」** を押した後、 **「デプロイ (Deploy)」** をクリックします。

### 3-1. 環境変数 (送信先 URL) の設定
1.  コードエディタ左下の **「ツール」 > 「環境変数」** を開きます。
2.  **「環境変数を追加」** をクリックし、以下を入力します：
    *   **キー**: `HUB_ALEXA_ENDPOINT`
    *   **値**: あなたの Hub サーバーの公開URL（例: `https://xxxx.ngrok-free.app/alexa`）
3.  「保存」をクリックします。

---

## STEP 4: テスト

1.  上部タブの **「テスト」** を開きます。
2.  [非公開] を **「開発中」** に切り替えます。
3.  アレクサに話しかけるか、テキストを入力してください：
    *   「テスト用ツールで アクションを教えて」
    *   「テスト用ツールで [アクション名] を実行して」

これで完了です！
この設定により、アレクサの声はクラウドを通り、ngrok 経由であなたの PC へ届きます。
