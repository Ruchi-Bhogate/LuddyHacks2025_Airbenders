
import React, { useState, useEffect } from 'react';

import { FaCheck, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa'; // Added FaTimes for cancel edit
import './TodoList.css'; // Import the styles for EditableTodoList

const TodoList = ({ tasks = [], loading }) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Capitalize and initialize todos with 'isCompleted' = false
    const initTodos = tasks.map((task) => ({
      text: task.charAt(0).toUpperCase() + task.slice(1),
      isCompleted: false,
    }));
    setTodos(initTodos);
  }, [tasks]);
  const [newTodo, setNewTodo] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTodo, setEditedTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { text: newTodo, isCompleted: false }]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditedTodo(todos[index].text);
  };

  const handleSaveEdit = () => {
    const updatedTodos = todos.map((todo, index) =>
      index === editingIndex ? { ...todo, text: editedTodo } : todo
    );
    setTodos(updatedTodos);
    setEditingIndex(null);
    setEditedTodo('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedTodo('');
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, isCompleted: !todo.isCompleted } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="todo-list">

     {loading ? (
  <p>Loading...</p>
) : (
  <ul>
    {todos.map((todo, index) => (
      <li key={index} className={todo.isCompleted ? 'completed' : ''}>
        <span>{todo.text}</span>
        <div className="todo-actions">
          <button onClick={() => handleToggleComplete(index)}>
            <FaCheck color={todo.isCompleted ? '#2ecc71' : '#3498db'} />
          </button>
          <button onClick={() => handleEditTodo(index)}>
            <FaEdit color="#f39c12" />
          </button>
          <button onClick={() => handleDeleteTodo(index)}>
            <FaTrashAlt color="#e74c3c" />
          </button>
        </div>
      </li>
    ))}
  </ul>
)}


      <div>
        {editingIndex !== null ? (
          <div className='edit-test'>
            <input
              type="text"
              value={editedTodo}
              onChange={(e) => setEditedTodo(e.target.value)}
              placeholder="Edit your task"
            />
            <div className="todo-action-edit">
              <button onClick={handleSaveEdit} style={{ backgroundColor: '#27ae60' }}>
                <FaCheck color="#fff" />
              </button>
              <button onClick={handleCancelEdit} className="cancel-edit-button" style={{ backgroundColor: '#e74c3c' }}>
                <FaTimes color="#fff" />
              </button>
            </div>
          </div>
        ) : (
          <div className="add-task-section">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
            />
            <button onClick={handleAddTodo} style={{ backgroundColor: '#3498db' }}>
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
