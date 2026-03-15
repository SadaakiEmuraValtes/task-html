# コンポーネント設計書

**プロジェクト名:** task-html — タスク管理カンバンボード
**作成日:** 2026-03-15
**バージョン:** 1.0

---

## 1. コンポーネント一覧

| コンポーネント | ファイル | 役割 |
|--------------|---------|------|
| App | `src/App.jsx` | 状態管理・ルートレンダリング |
| Board | `src/components/Board.jsx` | D&D 制御・列への props 配布 |
| Column | `src/components/Column.jsx` | 1列の表示・D&D イベント受信 |
| TaskCard | `src/components/TaskCard.jsx` | 1タスクの表示・ユーザー操作 |
| AddTaskModal | `src/components/AddTaskModal.jsx` | タスク追加・編集フォーム |

---

## 2. App

### 責務
- タスク一覧の状態保持と localStorage との同期
- 優先度フィルタ状態の保持
- モーダル（追加・編集）の表示制御
- 全ハンドラの定義

### Props
なし（ルートコンポーネント）

### State

| state | 型 | 説明 |
|-------|----|------|
| `tasks` | `Task[]` | 全タスク一覧 |
| `showModal` | `boolean` | 追加モーダル表示フラグ |
| `editingTask` | `Task \| null` | 編集対象タスク |
| `filterPriority` | `string` | 優先度フィルタ値 |

### 定数

```js
export const COLUMNS   // カラム定義配列
export const PRIORITIES // 優先度定義配列
```

---

## 3. Board

### 責務
- ドラッグ&ドロップ状態の管理（draggedId, overColId, dragCounter）
- ◀ ▶ ボタンによる列間移動ロジック
- Column への props 配布

### Props

| prop | 型 | 説明 |
|------|----|------|
| `tasks` | `Task[]` | フィルタ済みタスク一覧 |
| `columns` | `Column[]` | カラム定義配列 |
| `priorities` | `Priority[]` | 優先度定義配列 |
| `onMove` | `(id, status) => void` | 列移動ハンドラ |
| `onDelete` | `(id) => void` | 削除ハンドラ |
| `onUpdatePriority` | `(id, priority) => void` | 優先度変更ハンドラ |
| `onEdit` | `(task) => void` | 編集開始ハンドラ |

### 内部 State

| state | 型 | 説明 |
|-------|----|------|
| `draggedId` | `string \| null` | ドラッグ中のタスク ID |
| `overColId` | `string \| null` | ドロップ先候補の列 ID |
| `dragCounter` | `ref<object>` | 列ごとの dragenter カウント |

---

## 4. Column

### 責務
- 1カラムの描画（ヘッダー・件数・タスクリスト・空状態）
- D&D イベント（dragOver / dragEnter / dragLeave / drop）の受信と上位への伝達

### Props

| prop | 型 | 説明 |
|------|----|------|
| `column` | `{ id, label, color }` | カラム定義 |
| `tasks` | `Task[]` | このカラムのタスク一覧 |
| `priorities` | `Priority[]` | 優先度定義配列 |
| `isOver` | `boolean` | ドロップ先ハイライトフラグ |
| `draggedId` | `string \| null` | ドラッグ中の ID（TaskCard の透過制御用） |
| `onDragStart` | `(id) => void` | ドラッグ開始 |
| `onDragEnd` | `() => void` | ドラッグ終了 |
| `onDragEnter` | `() => void` | 列への enter |
| `onDragLeave` | `() => void` | 列からの leave |
| `onDrop` | `() => void` | ドロップ |
| `onDelete` | `(id) => void` | 削除 |
| `onUpdatePriority` | `(id, priority) => void` | 優先度変更 |
| `onEdit` | `(task) => void` | 編集開始 |
| `onMoveLeft` | `((id) => void) \| null` | 左移動（最左列は null） |
| `onMoveRight` | `((id) => void) \| null` | 右移動（最右列は null） |

### 表示ロジック
- `isOver === true` → `.column--over` クラス付与（ボーダー・グロー表示）
- `tasks.length === 0` → 「タスクなし」プレースホルダ表示

---

## 5. TaskCard

### 責務
- タスク情報の表示（タイトル・説明・優先度バッジ・作成日）
- 優先度バッジのドロップダウンメニュー管理
- 各アクションボタン（◀ ▶ ✏ ✕）の配置
- ドラッグハンドル（draggable 属性）

### Props

| prop | 型 | 説明 |
|------|----|------|
| `task` | `Task` | タスクオブジェクト |
| `priorities` | `Priority[]` | 優先度定義配列 |
| `isDragging` | `boolean` | このカードがドラッグ中か |
| `onDragStart` | `() => void` | ドラッグ開始 |
| `onDragEnd` | `() => void` | ドラッグ終了 |
| `onDelete` | `() => void` | 削除 |
| `onUpdatePriority` | `(priority) => void` | 優先度変更 |
| `onEdit` | `() => void` | 編集開始 |
| `onMoveLeft` | `(() => void) \| null` | 左移動（null = ボタン非表示） |
| `onMoveRight` | `(() => void) \| null` | 右移動（null = ボタン非表示） |

### 内部 State

| state | 型 | 説明 |
|-------|----|------|
| `showPriorityMenu` | `boolean` | 優先度変更ドロップダウンの表示フラグ |

### 表示ロジック
- `isDragging === true` → `.task-card--dragging`（opacity 低下・縮小）
- `task.status === 'done'` → `.task-card--done`（タイトル取り消し線・緑ボーダー）
- `showPriorityMenu === true` → 優先度ドロップダウン表示。`onMouseLeave` で閉じる
- `onMoveLeft` が null → ◀ ボタン非表示（最左列）
- `onMoveRight` が null → ▶ ボタン非表示（最右列）

---

## 6. AddTaskModal

### 責務
- タスク追加・編集フォームの表示
- `initialTask` の有無で追加/編集モードを切り替え
- Escape キー・オーバーレイクリックによる閉じる操作

### Props

| prop | 型 | 説明 |
|------|----|------|
| `priorities` | `Priority[]` | 優先度定義配列 |
| `onAdd` | `(data) => void` | 追加モード時のコールバック |
| `onEdit` | `(data) => void` | 編集モード時のコールバック |
| `onClose` | `() => void` | 閉じるコールバック |
| `initialTask` | `Task \| undefined` | 編集対象（未指定 = 追加モード） |

### モード切り替え

| 条件 | モード | ボタンラベル | 送信先 |
|------|--------|------------|--------|
| `initialTask` なし | 追加 | 追加する | `onAdd` |
| `initialTask` あり | 編集 | 保存する | `onEdit` |

### フォームフィールド

| フィールド | 種別 | 初期値 | バリデーション |
|-----------|------|--------|--------------|
| タイトル | text input | `initialTask.title \| ''` | 必須・最大80文字 |
| 説明 | textarea | `initialTask.description \| ''` | 任意・最大300文字 |
| 優先度 | ボタングループ | `initialTask.priority \| 'medium'` | 必須（常にいずれかが選択） |

### 副作用（useEffect）
- マウント時: タイトル input にフォーカス + 全選択（`focus()` + `select()`）
- マウント時: `keydown` イベントリスナー登録（Escape で `onClose`）
- アンマウント時: イベントリスナー削除

---

## 7. 型定義（概念）

```ts
type Task = {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'done'
  createdAt: number
}

type ColumnDef = {
  id: 'todo' | 'in-progress' | 'done'
  label: string
  color: string  // CSS カラーコード
}

type Priority = {
  value: 'high' | 'medium' | 'low'
  label: string  // '高' | '中' | '低'
  color: string  // CSS カラーコード
}
```
