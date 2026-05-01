import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Task
  const handleSubmit = async () => {
    if (!form.title.trim()) return;

    try {
      if (editingId) {
        // Update
        await axios.put(`${API}/${editingId}`, {
          ...form,
          completed: false,
        });
        setEditingId(null);
      } else {
        // Create
        await axios.post(API, {
          ...form,
          completed: false,
        });
      }

      setForm({ title: "", description: "" });
      fetchTasks();
    } catch {
      setError("Operation failed");
    }
  };

  // Edit task
  const editTask = (task) => {
    setForm({ title: task.title, description: task.description });
    setEditingId(task.id);
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  // Mark complete
  const markComplete = async (id) => {
    await axios.put(`${API}/${id}/complete`);
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="form">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div className="task-info">
              <h3 className={task.completed ? "completed" : ""}>
                {task.title}
              </h3>
              <p>{task.description}</p>
            </div>

            <div className="actions">
              {!task.completed && (
                <button onClick={() => markComplete(task.id)}>
                  ✔
                </button>
              )}
              <button onClick={() => editTask(task)}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;