const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'https://todo-list-phi-ten-59.vercel.app' // Adjust this as needed
}));
app.use(express.json());

const tasksFilePath = path.join(__dirname, 'tasks.json');

// Helper functions to read and write tasks
const readTasks = () => {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading tasks file', err);
    return [];
  }
};

const writeTasks = (tasks) => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error writing tasks file', err);
  }
};

// Routes
app.get('/api/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  console.log('Received POST request:', req.body);
  const tasks = readTasks();
  const newTask = req.body;
  
  // Ensure each task has a unique ID
  newTask.id = tasks.length ? Math.max(tasks.map(task => task.id)) + 1 : 1;
  
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  console.log('Received PUT request:', req.body);
  const tasks = readTasks();
  const updatedTask = req.body;
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.status(200).json(updatedTask);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  console.log('Received DELETE request for ID:', req.params.id);
  const tasks = readTasks();
  const taskId = parseInt(req.params.id, 10);
  const updatedTasks = tasks.filter(task => task.id !== taskId);

  if (tasks.length !== updatedTasks.length) {
    writeTasks(updatedTasks);
    res.status(200).json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.all('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
