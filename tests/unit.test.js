const TaskService = require('../src/taskService');

describe('TaskService core logic', () => {
  let svc;

  // Fresh, empty service before every test so tests don't affect each other
  beforeEach(() => {
    svc = new TaskService();
  });

  // Test 1: adding a task
  test('add() creates a trimmed, incomplete task with an id', () => {
    const t = svc.add('  Write report  ');
    expect(t).toEqual({ id: 1, title: 'Write report', done: false });
    expect(svc.list()).toHaveLength(1);
  });

  // Test 2: validation
  test('add() rejects empty titles', () => {
    expect(() => svc.add('   ')).toThrow('Title is required');
    expect(() => svc.add()).toThrow('Title is required');
  });

  // Test 3: toggle, remove, and unknown ids
  test('toggle() flips done and remove() deletes; unknown ids throw', () => {
    const t = svc.add('Task A');
    expect(svc.toggle(t.id).done).toBe(true);
    expect(svc.toggle(t.id).done).toBe(false);

    svc.remove(t.id);
    expect(svc.list()).toHaveLength(0);

    expect(() => svc.toggle(999)).toThrow('Task not found');
  });
});