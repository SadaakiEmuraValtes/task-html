import TaskCard from './TaskCard'

export default function Column({
  column, tasks, priorities, isOver, draggedId,
  onDragStart, onDragEnd, onDragEnter, onDragLeave, onDrop,
  onDelete, onUpdatePriority, onEdit, onMoveLeft, onMoveRight,
}) {
  return (
    <div
      className={`column ${isOver ? 'column--over' : ''}`}
      style={{ '--col-color': column.color }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="column-header">
        <span className="column-dot" />
        <h2 className="column-title">{column.label}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div className="column-body">
        {tasks.length === 0 && (
          <div className="column-empty">タスクなし</div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            priorities={priorities}
            isDragging={draggedId === task.id}
            onDragStart={() => onDragStart(task.id)}
            onDragEnd={onDragEnd}
            onDelete={() => onDelete(task.id)}
            onUpdatePriority={(p) => onUpdatePriority(task.id, p)}
            onEdit={() => onEdit(task)}
            onMoveLeft={onMoveLeft ? () => onMoveLeft(task.id) : null}
            onMoveRight={onMoveRight ? () => onMoveRight(task.id) : null}
          />
        ))}
      </div>
    </div>
  )
}
