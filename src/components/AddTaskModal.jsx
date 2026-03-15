import { useState, useEffect, useRef } from 'react'

export default function AddTaskModal({ priorities, onAdd, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: description.trim(), priority })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2>タスクを追加</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-label">
            タイトル <span className="required">*</span>
            <input
              ref={inputRef}
              className="form-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
              maxLength={80}
            />
          </label>

          <label className="form-label">
            説明
            <textarea
              className="form-input form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="詳細（任意）"
              rows={3}
              maxLength={300}
            />
          </label>

          <label className="form-label">
            優先度
            <div className="priority-select">
              {priorities.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`priority-option ${priority === p.value ? 'priority-option--active' : ''}`}
                  style={{
                    '--p-color': p.color,
                    borderColor: priority === p.value ? p.color : 'transparent',
                    color: priority === p.value ? p.color : '#666',
                    background: priority === p.value ? p.color + '15' : '#f5f5f5',
                  }}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}優先度
                </button>
              ))}
            </div>
          </label>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>キャンセル</button>
            <button type="submit" className="btn-submit" disabled={!title.trim()}>追加する</button>
          </div>
        </form>
      </div>
    </div>
  )
}
