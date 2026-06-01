import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({ sections: [], tasks: [], notes: [] })
})

// ── addSection ──────────────────────────────────────────────────────────────

describe('addSection', () => {
  it('creates a section with correct fields', () => {
    useAppStore.getState().addSection({ name: 'Work', icon: 'work', color: '#fff' })
    const { sections } = useAppStore.getState()
    expect(sections).toHaveLength(1)
    expect(sections[0].name).toBe('Work')
    expect(sections[0].icon).toBe('work')
    expect(sections[0].id).toBeDefined()
    expect(sections[0].created_at).toBeDefined()
    expect(sections[0].order).toBe(0)
  })

  it('increments order for subsequent sections', () => {
    useAppStore.getState().addSection({ name: 'A', icon: 'a', color: '#000' })
    useAppStore.getState().addSection({ name: 'B', icon: 'b', color: '#111' })
    const { sections } = useAppStore.getState()
    expect(sections[0].order).toBe(0)
    expect(sections[1].order).toBe(1)
  })
})

// ── deleteSection ────────────────────────────────────────────────────────────

describe('deleteSection', () => {
  it('removes the section and cascades to tasks and notes', () => {
    useAppStore.setState({
      sections: [{ id: 's1', name: 'Work', icon: 'work', color: '#fff', order: 0, created_at: new Date().toISOString() }],
      tasks: [{ id: 't1', section_id: 's1', title: 'Task A', status: 'open', priority: 'medium', created_at: new Date().toISOString() }],
      notes: [{ id: 'n1', section_id: 's1', body: 'Note A', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }],
    })

    useAppStore.getState().deleteSection('s1')

    const state = useAppStore.getState()
    expect(state.sections).toHaveLength(0)
    expect(state.tasks).toHaveLength(0)
    expect(state.notes).toHaveLength(0)
  })

  it('does not remove tasks / notes belonging to other sections', () => {
    useAppStore.setState({
      sections: [
        { id: 's1', name: 'Work', icon: 'work', color: '#fff', order: 0, created_at: new Date().toISOString() },
        { id: 's2', name: 'Life', icon: 'home', color: '#eee', order: 1, created_at: new Date().toISOString() },
      ],
      tasks: [
        { id: 't1', section_id: 's1', title: 'Task S1', status: 'open', priority: 'low', created_at: new Date().toISOString() },
        { id: 't2', section_id: 's2', title: 'Task S2', status: 'open', priority: 'low', created_at: new Date().toISOString() },
      ],
      notes: [],
    })

    useAppStore.getState().deleteSection('s1')

    const { tasks } = useAppStore.getState()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe('t2')
  })
})

// ── addTask / updateTask / deleteTask ────────────────────────────────────────

describe('task CRUD', () => {
  it('addTask creates a task and returns its id', () => {
    const id = useAppStore.getState().addTask({
      section_id: 's1',
      title: 'My Task',
      status: 'open',
      priority: 'high',
    })
    const { tasks } = useAppStore.getState()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(id)
    expect(tasks[0].title).toBe('My Task')
    expect(tasks[0].status).toBe('open')
    expect(tasks[0].priority).toBe('high')
  })

  it('updateTask patches the correct task', () => {
    const id = useAppStore.getState().addTask({
      section_id: 's1',
      title: 'Original',
      status: 'open',
      priority: 'low',
    })
    useAppStore.getState().updateTask(id, { title: 'Updated', status: 'done' })
    const task = useAppStore.getState().tasks.find(t => t.id === id)!
    expect(task.title).toBe('Updated')
    expect(task.status).toBe('done')
  })

  it('deleteTask removes only the targeted task', () => {
    const id1 = useAppStore.getState().addTask({ section_id: 's1', title: 'A', status: 'open', priority: 'low' })
    useAppStore.getState().addTask({ section_id: 's1', title: 'B', status: 'open', priority: 'low' })
    useAppStore.getState().deleteTask(id1)
    const { tasks } = useAppStore.getState()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].title).toBe('B')
  })
})

// ── tasksDueToday ────────────────────────────────────────────────────────────

describe('tasksDueToday', () => {
  it('returns non-done tasks whose due_date is today', () => {
    const today = new Date().toISOString()
    useAppStore.setState({
      sections: [],
      tasks: [
        { id: 't1', section_id: 's1', title: 'Due today open', status: 'open', priority: 'medium', due_date: today, created_at: today },
        { id: 't2', section_id: 's1', title: 'Due today done', status: 'done', priority: 'low', due_date: today, created_at: today },
        { id: 't3', section_id: 's1', title: 'No due date', status: 'open', priority: 'low', created_at: today },
      ],
      notes: [],
    })

    const result = useAppStore.getState().tasksDueToday()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('t1')
  })
})

// ── tasksUpcoming ────────────────────────────────────────────────────────────

describe('tasksUpcoming', () => {
  it('returns non-done tasks due in the next 7 days, not today', () => {
    const today = new Date().toISOString()
    const inThreeDays = new Date(Date.now() + 3 * 86400000).toISOString()
    const inTenDays = new Date(Date.now() + 10 * 86400000).toISOString()

    useAppStore.setState({
      sections: [],
      tasks: [
        { id: 't1', section_id: 's1', title: 'Today open', status: 'open', priority: 'low', due_date: today, created_at: today },
        { id: 't2', section_id: 's1', title: 'Three days open', status: 'open', priority: 'low', due_date: inThreeDays, created_at: today },
        { id: 't3', section_id: 's1', title: 'Three days done', status: 'done', priority: 'low', due_date: inThreeDays, created_at: today },
        { id: 't4', section_id: 's1', title: 'Ten days open', status: 'open', priority: 'low', due_date: inTenDays, created_at: today },
      ],
      notes: [],
    })

    const result = useAppStore.getState().tasksUpcoming()
    // only t2 qualifies: open, not today, within 7 days
    expect(result.map(t => t.id)).toContain('t2')
    expect(result.map(t => t.id)).not.toContain('t1') // today
    expect(result.map(t => t.id)).not.toContain('t3') // done
    expect(result.map(t => t.id)).not.toContain('t4') // beyond 7 days
  })
})

// ── openTaskCountBySection ───────────────────────────────────────────────────

describe('openTaskCountBySection', () => {
  it('counts only non-done tasks for the given section', () => {
    useAppStore.setState({
      sections: [],
      tasks: [
        { id: 't1', section_id: 's1', title: 'Open', status: 'open', priority: 'low', created_at: new Date().toISOString() },
        { id: 't2', section_id: 's1', title: 'In Progress', status: 'in_progress', priority: 'low', created_at: new Date().toISOString() },
        { id: 't3', section_id: 's1', title: 'Done', status: 'done', priority: 'low', created_at: new Date().toISOString() },
        { id: 't4', section_id: 's2', title: 'Other section', status: 'open', priority: 'low', created_at: new Date().toISOString() },
      ],
      notes: [],
    })

    expect(useAppStore.getState().openTaskCountBySection('s1')).toBe(2)
    expect(useAppStore.getState().openTaskCountBySection('s2')).toBe(1)
    expect(useAppStore.getState().openTaskCountBySection('s3')).toBe(0)
  })
})
