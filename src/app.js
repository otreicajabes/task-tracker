const express = require('express');
const path = require('path');
const TaskService = require('./taskService');

const app = express();
const service = new TaskService();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const wrap = fn => (req, res) => {
  try {
    res.json(fn(req));
  } catch (e) {
    res.status(e.message === 'Task not found' ? 404 : 400).json({ error: e.message });
  }
};

app.get('/api/tasks', wrap(() => service.list()));
app.post('/api/tasks', wrap(req => service.add(req.body.title)));
app.patch('/api/tasks/:id', wrap(req => service.toggle(Number(req.params.id))));
app.delete('/api/tasks/:id', wrap(req => service.remove(Number(req.params.id))));

module.exports = app;