import { useState, useCallback } from 'react'
import Board from './components/Board'
import AddTaskModal from './components/AddTaskModal'
import './App.css'

export const COLUMNS = [
  { id: 'todo',        label: '未着手',  color: '#6366f1' },
  { id: 'in-progress', label: '進行中',  color: '#f59e0b' },
  { id: 'done',        label: '完了',    color: '#22c55e' },
]

export const PRIORITIES = [
  { value: 'high',   label: '高', color: '#ef4444' },
  { value: 'medium', label: '中', color: '#f59e0b' },
  { value: 'low',    label: '低', color: '#6366f1' },
]

const SAMPLE_TASKS = [
  { id: '1', title: 'デザインレビュー',  description: 'UIモックのレビューを実施する',        priority: 'high',   status: 'todo',        createdAt: Date.now() - 3000 },
  { id: '2', title: 'API設計',           description: 'REST APIのエンドポイントを設計する',   priority: 'medium', status: 'in-progress', createdAt: Date.now() - 2000 },
  { id: '3', title: 'ユニットテスト作成', description: '各コンポーネントのテストを書く',       priority: 'low',    status: 'done',        createdAt: Date.now() - 1000 },
]

function loadTasks() {
  try {
    const saved = localStorage.getItem('task_html_tasks')
    return saved ? JSON.parse(saved) : SAMPLE_TASKS
  } catch {
    return SAMPLE_TASKS
  }
}

function saveTasks(tasks) {
  localStorage.setItem('task_html_tasks', JSON.stringify(tasks))
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const updateTasks = useCallback((updater) => {
    setTasks(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveTasks(next)
      return next
    })
  }, [])

  const addTask = useCallback(({ title, description, priority }) => {
    const task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      status: 'todo',
      createdAt: Date.now(),
    }
    updateTasks(prev => [task, ...prev])
  }, [updateTasks])

  const deleteTask = useCallback((id) => {
    updateTasks(prev => prev.filter(t => t.id !== id))
  }, [updateTasks])

  const moveTask = useCallback((id, newStatus) => {
    updateTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }, [updateTasks])

  const updatePriority = useCallback((id, priority) => {
    updateTasks(prev => prev.map(t => t.id === id ? { ...t, priority } : t))
  }, [updateTasks])

  const editTask = useCallback((id, { title, description, priority }) => {
    updateTasks(prev => prev.map(t => t.id === id ? { ...t, title, description, priority } : t))
  }, [updateTasks])

  const counts = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id).length
    return acc
  }, {})

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">📋 タスク管理ボード</h1>
          <div className="header-right">
            <div className="header-stats">
              {COLUMNS.map(col => (
                <span key={col.id} className="stat-badge" style={{ borderColor: col.color, color: col.color }}>
                  {col.label} <strong>{counts[col.id]}</strong>
                </span>
              ))}
            </div>
            <button className="btn-add" onClick={() => setShowModal(true)}>
              ＋ タスク追加
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <Board
          tasks={tasks}
          columns={COLUMNS}
          priorities={PRIORITIES}
          onMove={moveTask}
          onDelete={deleteTask}
          onUpdatePriority={updatePriority}
          onEdit={(task) => setEditingTask(task)}
        />
      </main>

      {showModal && (
        <AddTaskModal
          priorities={PRIORITIES}
          onAdd={addTask}
          onClose={() => setShowModal(false)}
        />
      )}
      {editingTask && (
        <AddTaskModal
          priorities={PRIORITIES}
          initialTask={editingTask}
          onEdit={(data) => editTask(editingTask.id, data)}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}
