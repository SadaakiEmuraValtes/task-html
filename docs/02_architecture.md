# アーキテクチャ設計書

**プロジェクト名:** task-html — タスク管理カンバンボード
**作成日:** 2026-03-15
**バージョン:** 1.0

---

## 1. 技術スタック

| 項目 | 採用技術 | バージョン |
|------|---------|-----------|
| UIフレームワーク | React | 18 |
| ビルドツール | Vite | 8 |
| スタイリング | バニラ CSS | — |
| 状態管理 | React useState / useCallback | — |
| 永続化 | Web Storage API (localStorage) | — |
| 配信 | GitHub Pages (gh-pages ブランチ) | — |

外部ライブラリ・状態管理ライブラリは使用しない。

---

## 2. ディレクトリ構成

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
├── dist/                         # ビルド成果物（gitignore）
├── vite.config.js
└── package.json
```

---

## 3. コンポーネント構成

```
App
├── header
│   ├── stat-badge × 3（列ごとの件数）
│   ├── filter-bar（優先度フィルタ）
│   └── btn-add（タスク追加ボタン）
├── Board
│   └── Column × 3
│       └── TaskCard × N
└── AddTaskModal（条件付きレンダリング × 2: 追加用・編集用）
```

---

## 4. 状態管理

状態はすべて `App.jsx` に集約し、子コンポーネントへ props で伝達する（単方向データフロー）。

### App の state

| state | 型 | 初期値 | 説明 |
|-------|----|--------|------|
| `tasks` | `Task[]` | localStorage または SAMPLE_TASKS | タスク一覧 |
| `showModal` | `boolean` | `false` | タスク追加モーダルの表示状態 |
| `editingTask` | `Task \| null` | `null` | 編集中のタスク（null = 非表示） |
| `filterPriority` | `'all' \| 'high' \| 'medium' \| 'low'` | `'all'` | 優先度フィルタの選択値 |

### 派生値（レンダリング時計算）

| 変数 | 説明 |
|------|------|
| `filteredTasks` | `filterPriority` で絞り込んだ tasks。Board に渡す |
| `counts` | 列ごとの全件数（フィルタ対象外）。ヘッダーバッジに使用 |

---

## 5. データフロー

```
localStorage
    │ loadTasks() (初期化時)
    ▼
App.tasks ──────────────────────────────────┐
    │ filterPriority でフィルタ              │ saveTasks() (更新時)
    ▼                                        │
filteredTasks → Board → Column → TaskCard   │
                                    │        │
         ユーザー操作（移動・削除・編集）    │
                    │                        │
             App のハンドラ ────────────────┘
        (updateTasks 経由で state と localStorage を同時更新)
```

---

## 6. ハンドラ一覧 (App.jsx)

| ハンドラ | 引数 | 処理 |
|---------|------|------|
| `addTask` | `{ title, description, priority }` | 新規タスク生成、tasks 先頭に追加 |
| `editTask` | `id, { title, description, priority }` | 対象タスクのフィールドを上書き |
| `deleteTask` | `id` | 対象タスクを tasks から除去 |
| `moveTask` | `id, newStatus` | 対象タスクの `status` を更新 |
| `updatePriority` | `id, priority` | 対象タスクの `priority` を更新 |
| `updateTasks` | `updater (fn \| array)` | 上記すべてが内部で呼ぶ共通関数。state と localStorage を同期更新 |

---

## 7. ドラッグ&ドロップ実装方針

HTML5 標準の Drag and Drop API を使用（外部ライブラリ不使用）。

### 問題: dragenter/dragleave の入れ子イベント

子要素（TaskCard）への移動でも `dragleave` が発火し、列のハイライトが誤って消える。

### 解決: dragCounter による参照カウント

```js
// Board.jsx
const dragCounter = useRef({})  // { colId: count }

onDragEnter(colId) → counter[colId]++; setOverColId(colId)
onDragLeave(colId) → counter[colId]--; counter <= 0 なら overColId をリセット
onDrop(colId)      → counter をリセット; onMove 呼び出し
onDragEnd          → 全 state をリセット
```

---

## 8. ビルドと配信

```
src/ → Vite build → dist/
                       └─→ gh-pages ブランチ → GitHub Pages
```

- `vite.config.js` に `base: '/task-html/'` を設定（GitHub Pages のサブパス対応）
- master ブランチ: ソースコード
- gh-pages ブランチ: ビルド成果物のみ（手動デプロイ）
