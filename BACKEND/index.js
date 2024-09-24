const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://admin:%40mongo123@cluster0.srtos.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0') 
    .then(() => console.log('MongoDB Atlas connected!'))
    .catch((error) => console.error('MongoDB connection failed:', error));

// Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask); // Respond with 201 Created
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// PUT update task (complete status)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    task.completed = req.body.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
