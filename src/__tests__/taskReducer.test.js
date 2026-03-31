import { describe, it, expect } from 'vitest'
import { taskReducer, ACTIONS, initialState } from '../reducers/taskReducer'

// El reducer es una función pura: no necesita montar componentes
const task1 = { id: '1', text: 'Primera tarea', completed: false }
const task2 = { id: '2', text: 'Segunda tarea', completed: false }

function stateWith(...tasks) {
  return { ...initialState, tasks }
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe('taskReducer — estado inicial', () => {
  it('define lista de tareas vacía', () => {
    expect(initialState.tasks).toEqual([])
  })

  it('define filtro inicial "all"', () => {
    expect(initialState.filter).toBe('all')
  })

  it('devuelve el mismo estado ante una acción desconocida', () => {
    const state = taskReducer(initialState, { type: 'ACCION_INEXISTENTE' })
    expect(state).toBe(initialState) // misma referencia
  })
})

// ─── ADD_TASK ─────────────────────────────────────────────────────────────────

describe('taskReducer — ADD_TASK', () => {
  it('agrega la tarea al array', () => {
    const state = taskReducer(initialState, { type: ACTIONS.ADD_TASK, payload: task1 })
    expect(state.tasks).toHaveLength(1)
    expect(state.tasks[0]).toEqual(task1)
  })

  it('acumula varias tareas sin reemplazar las anteriores', () => {
    const s1 = taskReducer(initialState,  { type: ACTIONS.ADD_TASK, payload: task1 })
    const s2 = taskReducer(s1, { type: ACTIONS.ADD_TASK, payload: task2 })
    expect(s2.tasks).toHaveLength(2)
  })

  it('no modifica el filtro activo', () => {
    const base = { ...initialState, filter: 'pending' }
    const state = taskReducer(base, { type: ACTIONS.ADD_TASK, payload: task1 })
    expect(state.filter).toBe('pending')
  })
})

// ─── DELETE_TASK ──────────────────────────────────────────────────────────────

describe('taskReducer — DELETE_TASK', () => {
  it('elimina la tarea con el id indicado', () => {
    const base  = stateWith(task1, task2)
    const state = taskReducer(base, { type: ACTIONS.DELETE_TASK, payload: '1' })
    expect(state.tasks).toHaveLength(1)
    expect(state.tasks[0].id).toBe('2')
  })

  it('no modifica otras tareas al eliminar', () => {
    const base  = stateWith(task1, task2)
    const state = taskReducer(base, { type: ACTIONS.DELETE_TASK, payload: '1' })
    expect(state.tasks[0]).toEqual(task2)
  })

  it('devuelve lista vacía al eliminar la única tarea', () => {
    const base  = stateWith(task1)
    const state = taskReducer(base, { type: ACTIONS.DELETE_TASK, payload: '1' })
    expect(state.tasks).toEqual([])
  })
})

// ─── TOGGLE_TASK ──────────────────────────────────────────────────────────────

describe('taskReducer — TOGGLE_TASK', () => {
  it('cambia completed a true en una tarea pendiente', () => {
    const base  = stateWith(task1)
    const state = taskReducer(base, { type: ACTIONS.TOGGLE_TASK, payload: '1' })
    expect(state.tasks[0].completed).toBe(true)
  })

  it('cambia completed a false en una tarea completada', () => {
    const completedTask = { ...task1, completed: true }
    const base  = stateWith(completedTask)
    const state = taskReducer(base, { type: ACTIONS.TOGGLE_TASK, payload: '1' })
    expect(state.tasks[0].completed).toBe(false)
  })

  it('no modifica otras tareas al hacer toggle', () => {
    const base  = stateWith(task1, task2)
    const state = taskReducer(base, { type: ACTIONS.TOGGLE_TASK, payload: '1' })
    expect(state.tasks[1].completed).toBe(false) // task2 sin cambios
  })
})

// ─── UPDATE_TASK ──────────────────────────────────────────────────────────────

describe('taskReducer — UPDATE_TASK', () => {
  it('actualiza el texto de la tarea indicada', () => {
    const base  = stateWith(task1)
    const state = taskReducer(base, {
      type: ACTIONS.UPDATE_TASK,
      payload: { id: '1', changes: { text: 'Texto nuevo' } },
    })
    expect(state.tasks[0].text).toBe('Texto nuevo')
  })

  it('conserva las propiedades no actualizadas', () => {
    const base  = stateWith(task1)
    const state = taskReducer(base, {
      type: ACTIONS.UPDATE_TASK,
      payload: { id: '1', changes: { text: 'Nuevo' } },
    })
    expect(state.tasks[0].completed).toBe(false)
    expect(state.tasks[0].id).toBe('1')
  })

  it('no modifica otras tareas al actualizar una', () => {
    const base  = stateWith(task1, task2)
    const state = taskReducer(base, {
      type: ACTIONS.UPDATE_TASK,
      payload: { id: '1', changes: { text: 'Modificada' } },
    })
    expect(state.tasks[1]).toEqual(task2)
  })
})

// ─── SET_FILTER ───────────────────────────────────────────────────────────────

describe('taskReducer — SET_FILTER', () => {
  it('cambia el filtro a "pending"', () => {
    const state = taskReducer(initialState, { type: ACTIONS.SET_FILTER, payload: 'pending' })
    expect(state.filter).toBe('pending')
  })

  it('cambia el filtro a "completed"', () => {
    const state = taskReducer(initialState, { type: ACTIONS.SET_FILTER, payload: 'completed' })
    expect(state.filter).toBe('completed')
  })

  it('vuelve el filtro a "all"', () => {
    const base  = { ...initialState, filter: 'pending' }
    const state = taskReducer(base, { type: ACTIONS.SET_FILTER, payload: 'all' })
    expect(state.filter).toBe('all')
  })

  it('no modifica la lista de tareas al cambiar el filtro', () => {
    const base  = stateWith(task1, task2)
    const state = taskReducer(base, { type: ACTIONS.SET_FILTER, payload: 'completed' })
    expect(state.tasks).toEqual([task1, task2])
  })
})

// ─── Inmutabilidad ────────────────────────────────────────────────────────────

describe('taskReducer — inmutabilidad', () => {
  it('no muta el estado original al agregar', () => {
    const base = stateWith(task1)
    taskReducer(base, { type: ACTIONS.ADD_TASK, payload: task2 })
    expect(base.tasks).toHaveLength(1)
  })

  it('no muta el estado original al eliminar', () => {
    const base = stateWith(task1, task2)
    taskReducer(base, { type: ACTIONS.DELETE_TASK, payload: '1' })
    expect(base.tasks).toHaveLength(2)
  })

  it('no muta el estado original al hacer toggle', () => {
    const base = stateWith(task1)
    taskReducer(base, { type: ACTIONS.TOGGLE_TASK, payload: '1' })
    expect(base.tasks[0].completed).toBe(false)
  })
})
