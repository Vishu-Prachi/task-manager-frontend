import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tasks";

export const taskService = {
  getTasks: () => axios.get(API_BASE_URL),

  createTask: (task) => axios.post(API_BASE_URL, task),

  updateTask: (id, task) =>
    axios.put(`${API_BASE_URL}/${id}`, task),

  deleteTask: (id) =>
    axios.delete(`${API_BASE_URL}/${id}`),

  markComplete: (id) =>
    axios.put(`${API_BASE_URL}/${id}/complete`)
};