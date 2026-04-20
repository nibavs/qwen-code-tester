import { useState } from 'react'
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core'
import './App.css'

// Sample food items with calories
const initialFoodItems = [
  { id: 'apple', name: 'Apple', calories: 95 },
  { id: 'banana', name: 'Banana', calories: 105 },
  { id: 'orange', name: 'Orange', calories: 62 },
  { id: 'chicken', name: 'Chicken Breast', calories: 165 },
  { id: 'rice', name: 'Rice (1 cup)', calories: 206 },
  { id: 'egg', name: 'Egg', calories: 78 },
  { id: 'bread', name: 'Bread Slice', calories: 79 },
  { id: 'cheese', name: 'Cheese (30g)', calories: 113 },
]

// Draggable Food Item Component
function DraggableFood({ id, name, calories, onRemove }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="draggable-item"
      onClick={onRemove ? (e) => { e.stopPropagation(); onRemove(id); } : undefined}
    >
      <span className="food-name">{name}</span>
      <span className="food-calories">{calories} cal</span>
    </div>
  )
}

// Droppable Container Component
function DroppableContainer({ children, totalCalories }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'droppable-container',
  })

  const style = {
    backgroundColor: isOver ? '#e8f5e9' : '#f5f5f5',
    border: isOver ? '2px dashed #4caf50' : '2px dashed #ccc',
  }

  return (
    <div ref={setNodeRef} style={style} className="droppable-container">
      <h3>Dish Container</h3>
      <p className="total-calories">Total Calories: {totalCalories}</p>
      <div className="dropped-items">
        {children.length > 0 ? children : <p className="empty-message">Drop food items here</p>}
      </div>
    </div>
  )
}

function App() {
  const [availableItems, setAvailableItems] = useState(initialFoodItems)
  const [dishItems, setDishItems] = useState([])
  const [totalCalories, setTotalCalories] = useState(0)

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    const draggedItemId = active.id

    // Check if dropping into the droppable container
    if (over.id === 'droppable-container') {
      const item = availableItems.find((item) => item.id === draggedItemId)
      
      if (item && !dishItems.find((dishItem) => dishItem.id === draggedItemId)) {
        // Add to dish
        setDishItems([...dishItems, item])
        setAvailableItems(availableItems.filter((item) => item.id !== draggedItemId))
        setTotalCalories(totalCalories + item.calories)
      }
    }
  }

  const handleRemoveFromDish = (itemId) => {
    const item = dishItems.find((dishItem) => dishItem.id === itemId)
    
    if (item) {
      // Remove from dish and add back to available items
      setDishItems(dishItems.filter((dishItem) => dishItem.id !== itemId))
      setAvailableItems([...availableItems, item])
      setTotalCalories(totalCalories - item.calories)
    }
  }

  return (
    <div className="app-container">
      <h1>Calorie Tracker with Drag & Drop</h1>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="main-content">
          {/* Available Food Items */}
          <div className="container">
            <h2>Available Food Items</h2>
            <div className="items-container">
              {availableItems.map((item) => (
                <DraggableFood
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  calories={item.calories}
                />
              ))}
            </div>
          </div>

          {/* Droppable Dish Container */}
          <div className="container">
            <DroppableContainer 
              totalCalories={totalCalories}
            >
              {dishItems.map((item) => (
                <DraggableFood
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  calories={item.calories}
                  onRemove={handleRemoveFromDish}
                />
              ))}
            </DroppableContainer>
          </div>
        </div>
      </DndContext>
    </div>
  )
}

export default App
