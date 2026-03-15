import { useState } from 'react'

export default function TaskCard({
  task, priorities, isDragging,
  onDragStart, onDragEnd,
  onDelete, onUpdatePriority, onEdit,
  onMoveLeft, onMoveRight,
}) {
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)
  const priority = priorities.find(p => p.value === task.priority) || priorities[1]

  const isDone = task.status === 'done'

  return (
    <div
      className={`task-card ${isDragging ? 'task-card--dragging' : ''} ${isDone ? 'task-card--done' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="task-card-header">
        <span
          className="priority-badge"
          style={{ background: priority.color + '22', color: priority.color, borderColor: priority.color + '55' }}
          onClick={() => setShowPriorityMenu(v => !v)}
          title="優先度を変更"
        >
          {priority.label}
          {showPriorityMenu && (
            <div className="priority-menu" onMouseLeave={() => setShowPriorityMenu(false)}>
              {priorities.map(p => (
                <button
                  key={p.value}
                  className="priority-menu-item"
                  style={{ color: p.color }}
                  onClick={(e) => { e.stopPropagation(); onUpdatePriority(p.value); setShowPriorityMenu(false) }}
                >
                  {p.label}優先度
                </button>
              ))}
            </div>
          )}
        </span>

        <div className="task-card-actions">
          {onMoveLeft && (
            <button className="icon-btn" onClick={onMoveLeft} title="左へ移動">◀</button>
          )}
          {onMoveRight && (
            <button className="icon-btn" onClick={onMoveRight} title="右へ移動">▶</button>
          )}
          <button className="icon-btn icon-btn--edit" onClick={onEdit} title="編集">✏</button>
          <button className="icon-btn icon-btn--delete" onClick={onDelete} title="削除">✕</button>
        </div>
      </div>

      <p className="task-title">{task.title}</p>
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className="task-date">{new Date(task.createdAt).toLocaleDateString('ja-JP')}</span>
        {isDone && <span className="done-badge">✓ 完了</span>}
      </div>
    </div>
  )
}
