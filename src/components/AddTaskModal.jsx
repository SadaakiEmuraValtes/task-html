import { useState, useEffect, useRef } from 'react'

export default function AddTaskModal({ priorities, onAdd, onEdit, onClose, initialTask }) {
  const isEdit = Boolean(initialTask)
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [description, setDescription] = useState(initialTask?.description ?? '')
  const [priority, setPriority] = useState(initialTask?.priority ?? 'medium')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    if (isEdit) {
      onEdit({ title: title.trim(), description: description.trim(), priority })
    } else {
      onAdd({ title: title.trim(), description: description.trim(), priority })
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'タスクを編集' : 'タスクを追加'}</h2>
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
            <button type="submit" className="btn-submit" disabled={!title.trim()}>
              {isEdit ? '保存する' : '追加する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
