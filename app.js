import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (err) {
      alert('Failed to fetch tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTitle.trim()) {
      alert('Title is required');
      return;
    }
    try {
      await createTask({ title: newTitle, description: newDescription });
      setNewTitle('');
      setNewDescription('');
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingTitle(task.title);
    setEditingDescription(task.description);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const handleUpdateTask = async () => {
    if (!editingTitle.trim()) {
      alert('Title is required');
      return;
    }
    try {
      await updateTask(editingTaskId, {
        title: editingTitle,
        description: editingDescription
      });
      cancelEditing();
      fetchTasks();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Keploy Task Manager</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: '60%', padding: 8, marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Task description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ width: '30%', padding: 8, marginRight: 10 }}
        />
        <button onClick={handleAddTask} style={{ padding: '8px 16px' }}>
          Add Task
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.length === 0 && <li>No tasks found</li>}
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              marginBottom: 10,
              padding: 10,
              border: '1px solid #ccc',
              borderRadius: 4,
              backgroundColor: task.completed ? '#d4edda' : 'white'
            }}
          >
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={{ width: '40%', padding: 6, marginRight: 10 }}
                />
                <input
                  type="text"
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  style={{ width: '40%', padding: 6, marginRight: 10 }}
                />
                <button onClick={handleUpdateTask} style={{ marginRight: 5 }}>
                  Save
                </button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  style={{ marginRight: 10 }}
                />
                <strong>{task.title}</strong> - {task.description || <em>No description</em>}
                <div style={{ float: 'right' }}>
                  <button onClick={() => startEditing(task)} style={{ marginRight: 5 }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
