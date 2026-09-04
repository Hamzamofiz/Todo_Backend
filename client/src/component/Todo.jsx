import React, { useState, useEffect } from 'react';
import './todo.css';

const API_URL = 'http://localhost:3000/api/todos';

const Todo = () => {
  const [input, setInput] = useState("");
  const [todo, setTodo] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. Initial Render Par Backend Se Todos Fetch Karna
  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodo(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. CREATE: Backend Par Post Request
  const addTodo = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return alert('add task');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const newTodo = await res.json();
      
      setTodo([newTodo, ...todo]); // State update with DB item
      setInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 3. EDIT Mode Enable Karna
  const handelEdit = (item) => {
    setIsEdit(true);
    setEditId(item._id); // MongoDB ki _id store ki
    setInput(item.text);
  };

  // 4. UPDATE: Backend Par PUT Request
  const updatetodo = async () => {
    if (input.trim() === "") return alert('add task');

    try {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const updatedItem = await res.json();

      setTodo(todo.map((item) => (item._id === editId ? updatedItem : item)));
      setInput("");
      setIsEdit(false);
      setEditId(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 5. DELETE: Backend Par DELETE Request
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTodo(todo.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div>
      <h1>TODO</h1>
      <div className="todo">
        <div className="inputs">
          <input
            type="text"
            placeholder='enter your task'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {isEdit ? (
            <button onClick={updatetodo}>save</button>
          ) : (
            <button onClick={addTodo}>Add</button>
          )}
        </div>

        <div className="showtodo">
          <ul>
            {todo.map((val) => (
              <li key={val._id}>
                {val.text}
                <span>
                  <button onClick={() => handelEdit(val)}>Edit</button>
                  <button onClick={() => deleteTask(val._id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Todo;