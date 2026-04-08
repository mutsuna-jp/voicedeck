# Alexa スキルの設定ガイド (機能拡張版)

Stream Deck MCP を介して任意のアクションを呼び出すための、最新の「対話モデル (Interaction Model)」の設定です。

## 1. インテントとスロットの作成

1. [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask) にログイン。
2. **「Interaction Model」 > 「JSON Editor」** に以下の JSON を貼り付けます。

### 最新の JSON モデル

```json
{
  "interactionModel": {
    "languageModel": {
      "invocationName": "ボイスデッキ",
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

## 2. 公開用サンプルフレーズ（ベータテスト用）

ベータテストや公開申請時に使用する 3 つのサンプルフレーズ案です：

1. **「アレクサ、パソコン操作で 設定を開く を実行して」**
2. **「アレクサ、パソコン操作で アクションを教えて」**
3. **「アレクサ、パソコン操作で ヘルプを開いて」**

## 3. モデルの保存とビルド

1. JSON を貼り付けたら **「Save Model」** をクリック。
2. 次に **「Build Model」** をクリックして完了です。

## 4. エンドポイント (Endpoint) の設定

1. **「Endpoint」** メニューを選択します。
2. **「AWS Lambda ARN (Recommended for Developers)」** を選択します。
    - ローカル開発や OSS 運用の場合、AWS Lambda を使用することで SSL 証明書の管理が不要になります。
3. 作成した Lambda 関数の ARN を入力します。
    - 詳細は `public/local_server_guide.md` を参照してください。
