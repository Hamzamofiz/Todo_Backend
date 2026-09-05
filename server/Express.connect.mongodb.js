const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const connectdb = require('./config.mongodb');
const Todo = require('./modules/todo');

const app = express();

app.use(cors());
app.use(express.json());

// Database connection middleware for Serverless
app.use(async (req, res, next) => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error('MONGO_URL environment variable is missing');
    }
    await connectdb();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({ message: 'Database Connection Error', error: error.message });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Todo Backend API is running properly' });
});

// 1. CREATE: Add Todo
app.post('/api/todos', async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ message: 'Todo text is required' });
    }
    const newTodo = await Todo.create({ text: req.body.text });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. READ: Get all Todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. UPDATE: Edit Todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE: Remove Todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Local Development Server Listen
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;