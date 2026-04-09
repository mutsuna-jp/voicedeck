# Mutsuna Voice Deck (Voice Bridge for Alexa & Stream Deck)

Amazon Alexa から Stream Deck のアクションを声で実行するためのブリッジシステムです。

> \[!IMPORTANT]
> **免責事項**\
> 本プロジェクトは非公式のツールであり、Amazon.com, Inc. や Elgato (Corsair Gaming, Inc.) との提携、承認、後援はありません。

## 🌟 主な機能

* **柔軟な音声操作**: 「アレクサ、Voice Deckで『配信準備』を実行して」のように指示可能。

* **AIによる意味解釈 (Gemini)**: 言い回しが少し違っても、AIが最適なアクションを推論して実行します。

* **プラグイン連携**: Stream Deck プラグインとして動作するため、OSを問わず（Windows/Mac）利用可能です。

## 🚀 リリース情報 - v0.2.0.0

### 🎉 新機能と改善

* **AIマッチングのハイブリッド化**: Hub（サーバー）側でのAI処理とローカル処理（APIキー）を統合しました。

* **認証システムの永続化**: Better Auth を導入し、`userToken` による永続的なログインに対応。ブラウザの状態に依存せず安定した動作が可能になりました。

* **アイコンの動的更新**: Hubとの接続状態を監視し、ボタンのアイコンがリアルタイムで変化するように改善しました。

* **リブランディング**: 内部およびマニフェストから Alexa への依存表記を整理し、"Mutsuna Voice Deck" として統一しました。

[全バージョンの変更履歴を確認する](./CHANGELOG.md)

## 🛠️ インストール手順

### 1. プラグインのインストール

以下のいずれかの方法でプラグインをインストールしてください。

* **\[推奨] Stream Deck Marketplace から入手**
  [Mutsuna Voice Deck を Marketplace で見る](https://marketplace.elgato.com/product/jp-mutsuna-voicedeck)
  *(※現在公開申請中です。公開後にこちらから直接インストール可能になります)*

* **GitHub Releases から入手 (手動インストール)**
  [最新の .streamDeckPlugin をダウンロード](https://github.com/mutsuna-jp/voicedeck/releases/latest)
  ファイルをダウンロードし、 Stream Deck にインストールしてください。

### 2. 初期設定

Stream Deck の設定画面から以下の設定を行います。

1. **User Token** : [Mutsuna Hub](https://voicedeck.mutsuna.jp) にログインして発行されたトークンを入力します。
2. **Gemini API Key** : Google AI Studio で発行した API キーを入力します。
3. **GeminiModel** : 使用するモデルを選択します。

### 3. Alexaスキルの有効化

Alexa アプリで「Mutsuna Voice Deck」スキルを有効にし、アカウントリンクを行ってください。
現在はアレクサスキルはクローズド公開のため利用には申請が必要です。
[info@mutsuna.jp](mailto:[EMAIL_ADDRESS])までご連絡ください。

## 🛠️ 開発者・上級者向け（セルフホスト）

本プロジェクトは完全にオープンソースであり、提供されている Hub サーバーを介さずに、ご自身の環境で独自のシステムを構築することも可能です。

*   **Hub サーバーのセルフホスト**: `public/oss-hub` にあるコードを使用して、独自の Cloudflare Workers 等でブリッジサーバーを運用できます。
*   **独自の Alexa スキル**: 独自のスキルを作成し、自身で運用するエンドポイントに接続することで、クローズド公開の制限を受けずに利用可能です。
*   **詳細ガイド**: 設定方法の詳細は [local_server_guide.md](./local_server_guide.md) および [alexa_skill_setup.md](./alexa_skill_setup.md) を参照してください。

## 📄 ライセンス

MIT
