const express = require('express');
const dotenv = require('dotenv')

const cors = require('cors')
dotenv.config();

const connectdb = require('./config.mongodb');
const Todo = require('./modules/todo')


// mongoDB Databse connection
if (!process.env.MONGO_URL) {
  console.error('MONGO_URL is not defined in environment variables');
} else {
  connectdb();
}


const app = express();

const port = process.env.PORT || 3000;


app.use(cors());
// middleware
app.use(express.json());


// CURD 

// 1. Create :
app.post('/api/todos', async (req, res) => {
    try {
        const newTodo = await Todo.create({
            text: req.body.text
        });
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// 2 Read : Get all Todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({message: error.message });
  }
});


// 3 post : update todos
app.put('/api/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. DELETE: Todo Remove Karna
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;