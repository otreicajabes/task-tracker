class TaskService {
  constructor() { this.tasks = []; this.nextId = 1; }

  add(title) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title is required');
    }
    const task = { id: this.nextId++, title: title.trim(), done: false };
    this.tasks.push(task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    task.done = !task.done;
    return task;
  }

  remove(id) {
    const i = this.tasks.findIndex(t => t.id === id);
    if (i === -1) throw new Error('Task not found');
    return this.tasks.splice(i, 1)[0];
  }

  list() { return this.tasks; }
}

module.exports = TaskService;