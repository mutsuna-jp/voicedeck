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
      "invocationName": "パソコン操作",
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
            "ストリームデックで {ActionName} を実行して",
            "パソコン操作で {ActionName} を実行して"
          ]
        },
        {
          "name": "ListActionsIntent",
          "samples": [
            "アクションの一覧を教えて",
            "何ができるか教えて",
            "操作の一覧を教えて",
            "アクションリストを見せて"
          ]
        },
        {
          "name": "AMAZON.CancelIntent",
          "samples": []
        },
        {
          "name": "AMAZON.HelpIntent",
          "samples": [
            "ヘルプ",
            "使い方を教えて",
            "ヘルプを開いて"
          ]
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
