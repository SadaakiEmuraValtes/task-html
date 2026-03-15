# 📋 タスク管理カンバンボード

カンバンボード形式でタスクを視覚的に管理できるシンプルなWebアプリケーションです。
サーバー不要・ブラウザのみで動作し、データはlocalStorageに自動保存されます。

## デモ

GitHub Pages でホストされています: https://sadaakiemuravaltes.github.io/task-html/

---

## 機能

- **3列カンバンボード** — 未着手 / 進行中 / 完了 の3列でタスクを管理
- **タスク CRUD** — タスクの追加・編集・削除
- **ドラッグ&ドロップ** — タスクカードをドラッグして列間を移動
- **ボタン移動** — ◀ ▶ ボタンで隣の列へ移動
- **優先度管理** — 高 / 中 / 低 の3段階で優先度を設定・変更
- **優先度フィルタ** — 指定した優先度のタスクのみを表示
- **自動保存** — 操作のたびにlocalStorageへ自動保存

---

## 技術スタック

| 項目 | 採用技術 |
|------|---------|
| UIフレームワーク | React 19 |
| ビルドツール | Vite 8 |
| スタイリング | バニラ CSS |
| 状態管理 | React useState / useCallback |
| 永続化 | localStorage |
| 配信 | GitHub Pages |

外部の状態管理ライブラリは使用していません。

---

## ディレクトリ構成

```
task-html/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.jsx                  # エントリポイント
│   ├── App.jsx                   # ルートコンポーネント・状態管理
│   ├── App.css                   # 全コンポーネントのスタイル
│   ├── index.css                 # グローバルリセット
│   └── components/
│       ├── Board.jsx             # ドラッグ&ドロップ制御
│       ├── Column.jsx            # カラム表示
│       ├── TaskCard.jsx          # タスクカード
│       └── AddTaskModal.jsx      # 追加・編集モーダル
├── docs/                         # 設計書
├── vite.config.js
└── package.json
```

---

## セットアップ

### 必要環境

- Node.js 18 以上
- npm

### インストールと起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動 (http://localhost:5173)
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## 設計ドキュメント

詳細な設計情報は [`docs/`](./docs/) を参照してください。

| ドキュメント | 内容 |
|------------|------|
| [要件定義書](./docs/01_requirements.md) | 機能要件・非機能要件・制約事項 |
| [アーキテクチャ設計書](./docs/02_architecture.md) | 技術スタック・コンポーネント構成・状態管理 |
| [コンポーネント設計書](./docs/03_component_design.md) | 各コンポーネントの詳細設計 |
| [データ設計書](./docs/04_data_design.md) | データモデル・localStorage仕様 |
| [UI設計書](./docs/05_ui_design.md) | 画面レイアウト・スタイリング方針 |

---

## 制約事項

- タスクの共有・同期機能は対象外（localStorageはブラウザ単位）
- ユーザー認証・アカウント管理は対象外
- タスクの期限・通知機能は対象外
- 最小画面幅: 720px
