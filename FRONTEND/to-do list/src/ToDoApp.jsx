import React, { useState, useEffect } from 'react';
import axios from 'axios'; // To handle API calls
import './ToDoApp.css';

const ToDoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [error, setError] = useState(null); // For handling errors

  // Fetch all tasks on component load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  const addTask = async () => {
    if (!taskName) {
      setError('Task name is required.');
      return;
    }

    const newTask = { name: taskName, description: taskDesc };
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setTaskName('');
      setTaskDesc(''); // Clear inputs after adding task
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }; // Create a new object to avoid mutating the original
      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTask); // Update task status in DB
      fetchTasks(); // Refresh task list
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

      <input
        type="text"
        placeholder="Task Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <textarea
        placeholder="Task Description"
        value={taskDesc}
        onChange={(e) => setTaskDesc(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {Array.isArray(tasks) && tasks.map((task) => ( // Ensure tasks is an array
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task)}
            />
            {task.name} - {task.description}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoApp;
