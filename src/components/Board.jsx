import { useState, useRef } from 'react'
import Column from './Column'

export default function Board({ tasks, columns, priorities, onMove, onDelete, onUpdatePriority, onEdit }) {
  const [draggedId, setDraggedId] = useState(null)
  const [overColId, setOverColId] = useState(null)
  const dragCounter = useRef({})

  const handleDragStart = (id) => {
    setDraggedId(id)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setOverColId(null)
    dragCounter.current = {}
  }

  const handleDragEnterCol = (colId) => {
    dragCounter.current[colId] = (dragCounter.current[colId] || 0) + 1
    setOverColId(colId)
  }

  const handleDragLeaveCol = (colId) => {
    dragCounter.current[colId] = (dragCounter.current[colId] || 1) - 1
    if (dragCounter.current[colId] <= 0) {
      setOverColId(prev => prev === colId ? null : prev)
    }
  }

  const handleDrop = (colId) => {
    if (draggedId) {
      onMove(draggedId, colId)
    }
    setDraggedId(null)
    setOverColId(null)
    dragCounter.current = {}
  }

  const getColumnIndex = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return -1
    return columns.findIndex(c => c.id === task.status)
  }

  const moveLeft = (taskId) => {
    const idx = getColumnIndex(taskId)
    if (idx > 0) onMove(taskId, columns[idx - 1].id)
  }

  const moveRight = (taskId) => {
    const idx = getColumnIndex(taskId)
    if (idx < columns.length - 1) onMove(taskId, columns[idx + 1].id)
  }

  return (
    <div className="board">
      {columns.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.id)
        const colIdx = columns.indexOf(col)
        return (
          <Column
            key={col.id}
            column={col}
            tasks={colTasks}
            priorities={priorities}
            isOver={overColId === col.id && draggedId !== null}
            draggedId={draggedId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragEnter={() => handleDragEnterCol(col.id)}
            onDragLeave={() => handleDragLeaveCol(col.id)}
            onDrop={() => handleDrop(col.id)}
            onDelete={onDelete}
            onUpdatePriority={onUpdatePriority}
            onEdit={onEdit}
            onMoveLeft={colIdx > 0 ? moveLeft : null}
            onMoveRight={colIdx < columns.length - 1 ? moveRight : null}
          />
        )
      })}
    </div>
  )
}
