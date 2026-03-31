import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTasks } from '../hooks/useTasks'

const localStorageMock = (() => {
  let store = {}
  return {
    getItem: key => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    clear: () => { store = {} },
  }
})()

beforeEach(() => {
  vi.stubGlobal('localStorage', localStorageMock)
  localStorageMock.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// ─── Agregar tareas ───────────────────────────────────────────────────────────

describe('useTasks — agregar tareas', () => {
  it('inicia con lista vacía', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })

  it('agrega una tarea con texto, id único y completed=false', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Comprar leche') })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe('Comprar leche')
    expect(result.current.tasks[0].completed).toBe(false)
    expect(result.current.tasks[0].id).toBeDefined()
  })

  it('agrega múltiples tareas y las acumula', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Tarea 1')
      result.current.addTask('Tarea 2')
      result.current.addTask('Tarea 3')
    })
    expect(result.current.tasks).toHaveLength(3)
  })

  it('cada tarea recibe un id único', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Tarea A')
      result.current.addTask('Tarea B')
    })
    const [a, b] = result.current.tasks
    expect(a.id).not.toBe(b.id)
  })

  it('recorta espacios al agregar una tarea', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('  Tarea con espacios  ') })
    expect(result.current.tasks[0].text).toBe('Tarea con espacios')
  })

  it('no agrega tarea con texto vacío', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('') })
    expect(result.current.tasks).toHaveLength(0)
  })

  it('no agrega tarea con solo espacios', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('   ') })
    expect(result.current.tasks).toHaveLength(0)
  })
})

// ─── Eliminar tareas ──────────────────────────────────────────────────────────

describe('useTasks — eliminar tareas', () => {
  it('elimina la tarea con el id indicado', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea a eliminar') })
    const id = result.current.tasks[0].id
    act(() => { result.current.deleteTask(id) })
    expect(result.current.tasks).toHaveLength(0)
  })

  it('no elimina otras tareas al borrar una', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Conservar')
      result.current.addTask('Eliminar')
    })
    const id = result.current.tasks.find(t => t.text === 'Eliminar').id
    act(() => { result.current.deleteTask(id) })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe('Conservar')
  })
})

// ─── Actualizar tareas ────────────────────────────────────────────────────────

describe('useTasks — actualizar tareas', () => {
  it('actualiza el texto de una tarea', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Texto original') })
    const id = result.current.tasks[0].id
    act(() => { result.current.updateTask(id, { text: 'Texto actualizado' }) })
    expect(result.current.tasks[0].text).toBe('Texto actualizado')
  })

  it('no modifica otras tareas al actualizar una', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Sin cambios')
      result.current.addTask('A actualizar')
    })
    const id = result.current.tasks.find(t => t.text === 'A actualizar').id
    act(() => { result.current.updateTask(id, { text: 'Actualizada' }) })
    expect(result.current.tasks.find(t => t.text === 'Sin cambios')).toBeDefined()
  })
})

// ─── Marcar como completada ───────────────────────────────────────────────────

describe('useTasks — marcar tarea como completada', () => {
  it('marca una tarea como completada', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea') })
    const id = result.current.tasks[0].id
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks[0].completed).toBe(true)
  })

  it('desmarca una tarea ya completada', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea') })
    const id = result.current.tasks[0].id
    act(() => { result.current.toggleTask(id) })
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks[0].completed).toBe(false)
  })

  it('no modifica otras tareas al hacer toggle', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Sin cambios')
      result.current.addTask('A completar')
    })
    const id = result.current.tasks.find(t => t.text === 'A completar').id
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks.find(t => t.text === 'Sin cambios').completed).toBe(false)
  })
})

// ─── Filtrado ─────────────────────────────────────────────────────────────────

describe('useTasks — filtrar tareas por estado', () => {
  it('el filtro inicial es "all"', () => {
    const { result } = renderHook(() => useTasks())
    expect(result.current.filter).toBe('all')
  })

  it('muestra todas las tareas con filtro "all"', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Pendiente')
      result.current.addTask('Completada')
    })
    const id = result.current.tasks.find(t => t.text === 'Completada').id
    act(() => { result.current.toggleTask(id) })
    expect(result.current.tasks).toHaveLength(2)
  })

  it('filtra solo las tareas pendientes', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Pendiente')
      result.current.addTask('Completada')
    })
    const id = result.current.tasks.find(t => t.text === 'Completada').id
    act(() => {
      result.current.toggleTask(id)
      result.current.setFilter('pending')
    })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe('Pendiente')
  })

  it('filtra solo las tareas completadas', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Pendiente')
      result.current.addTask('Completada')
    })
    const id = result.current.tasks.find(t => t.text === 'Completada').id
    act(() => {
      result.current.toggleTask(id)
      result.current.setFilter('completed')
    })
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe('Completada')
  })

  it('devuelve lista vacía si no hay tareas completadas y el filtro es "completed"', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Solo pendiente')
      result.current.setFilter('completed')
    })
    expect(result.current.tasks).toHaveLength(0)
  })

  it('devuelve lista vacía si no hay tareas pendientes y el filtro es "pending"', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea') })
    const id = result.current.tasks[0].id
    act(() => {
      result.current.toggleTask(id)
      result.current.setFilter('pending')
    })
    expect(result.current.tasks).toHaveLength(0)
  })
})

// ─── Persistencia en localStorage ────────────────────────────────────────────

describe('useTasks — persistencia en localStorage', () => {
  it('guarda las tareas en localStorage al agregar', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea persistida') })
    const stored = JSON.parse(localStorage.getItem('tasks'))
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Tarea persistida')
  })

  it('actualiza localStorage al eliminar una tarea', () => {
    const { result } = renderHook(() => useTasks())
    act(() => {
      result.current.addTask('Tarea 1')
      result.current.addTask('Tarea 2')
    })
    const id = result.current.tasks[0].id
    act(() => { result.current.deleteTask(id) })
    const stored = JSON.parse(localStorage.getItem('tasks'))
    expect(stored).toHaveLength(1)
  })

  it('actualiza localStorage al marcar una tarea como completada', () => {
    const { result } = renderHook(() => useTasks())
    act(() => { result.current.addTask('Tarea') })
    const id = result.current.tasks[0].id
    act(() => { result.current.toggleTask(id) })
    const stored = JSON.parse(localStorage.getItem('tasks'))
    expect(stored[0].completed).toBe(true)
  })

  it('carga las tareas guardadas al inicializar', () => {
    localStorage.setItem('tasks', JSON.stringify([
      { id: '1', text: 'Tarea guardada', completed: false }
    ]))
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].text).toBe('Tarea guardada')
  })

  it('inicia con lista vacía si localStorage está corrupto', () => {
    localStorage.setItem('tasks', 'json-invalido{{{')
    const { result } = renderHook(() => useTasks())
    expect(result.current.tasks).toEqual([])
  })
})
