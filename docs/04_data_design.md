# データ設計書

**プロジェクト名:** task-html — タスク管理カンバンボード
**作成日:** 2026-03-15
**バージョン:** 1.0

---

## 1. データストア

外部データベース・APIは使用しない。
ブラウザの **localStorage** のみを永続化ストアとして使用する。

---

## 2. localStorage スキーマ

### キー: `task_html_tasks`

**型:** JSON 文字列（`Task[]` の配列）

**保存タイミング:** タスクの追加・編集・削除・移動・優先度変更のたびに全件上書き保存

**読み込みタイミング:** アプリ初期化時（`useState` の初期値関数 `loadTasks()`）

**初回起動時（キーが存在しない場合）:** SAMPLE_TASKS（3件）を使用

---

## 3. Task オブジェクト

### フィールド定義

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `id` | string | ○ | `crypto.randomUUID()` で生成するUUID v4 |
| `title` | string | ○ | タスクのタイトル（最大80文字） |
| `description` | string | ○ | タスクの説明（最大300文字、空文字可） |
| `priority` | string | ○ | 優先度: `'high'` / `'medium'` / `'low'` |
| `status` | string | ○ | ステータス: `'todo'` / `'in-progress'` / `'done'` |
| `createdAt` | number | ○ | 作成日時（`Date.now()` による UNIX ミリ秒） |

### JSON 例

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "デザインレビュー",
    "description": "UIモックのレビューを実施する",
    "priority": "high",
    "status": "todo",
    "createdAt": 1741996800000
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "API設計",
    "description": "REST APIのエンドポイントを設計する",
    "priority": "medium",
    "status": "in-progress",
    "createdAt": 1741996801000
  }
]
```

---

## 4. 列挙値

### priority

| 値 | 表示ラベル | カラー |
|----|----------|--------|
| `'high'` | 高 | `#ef4444`（赤） |
| `'medium'` | 中 | `#f59e0b`（黄） |
| `'low'` | 低 | `#6366f1`（紫） |

### status（カンバン列）

| 値 | 表示ラベル | カラー |
|----|----------|--------|
| `'todo'` | 未着手 | `#6366f1`（紫） |
| `'in-progress'` | 進行中 | `#f59e0b`（黄） |
| `'done'` | 完了 | `#22c55e`（緑） |

---

## 5. サンプルデータ（初回起動時）

localStorage が空の場合のみ使用する。

| id | title | description | priority | status |
|----|-------|-------------|----------|--------|
| `'1'` | デザインレビュー | UIモックのレビューを実施する | high | todo |
| `'2'` | API設計 | REST APIのエンドポイントを設計する | medium | in-progress |
| `'3'` | ユニットテスト作成 | 各コンポーネントのテストを書く | low | done |

---

## 6. データ操作

### 追加

```js
const task = {
  id: crypto.randomUUID(),
  title, description, priority,
  status: 'todo',          // 常に未着手列の先頭に追加
  createdAt: Date.now(),
}
tasks = [task, ...tasks]   // 先頭に挿入
```

### 編集

```js
tasks = tasks.map(t =>
  t.id === id ? { ...t, title, description, priority } : t
)
// status, createdAt, id は変更しない
```

### 削除

```js
tasks = tasks.filter(t => t.id !== id)
```

### 移動（status 変更）

```js
tasks = tasks.map(t =>
  t.id === id ? { ...t, status: newStatus } : t
)
```

### 優先度変更

```js
tasks = tasks.map(t =>
  t.id === id ? { ...t, priority } : t
)
```

---

## 7. エラーハンドリング

localStorage の読み込みは `try/catch` で囲み、JSON パース失敗時は SAMPLE_TASKS にフォールバックする。

```js
function loadTasks() {
  try {
    const saved = localStorage.getItem('task_html_tasks')
    return saved ? JSON.parse(saved) : SAMPLE_TASKS
  } catch {
    return SAMPLE_TASKS
  }
}
```

---

## 8. フィルタリング（メモリ内）

フィルタ結果は localStorage に保存せず、レンダリング時に毎回計算する。

```js
const filteredTasks = filterPriority === 'all'
  ? tasks
  : tasks.filter(t => t.priority === filterPriority)
```

- `filteredTasks` → Board（表示用）
- `tasks`（フィルタ前）→ ヘッダーの列ごと件数バッジ（全件表示）
