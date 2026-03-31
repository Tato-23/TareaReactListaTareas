import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../App'

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

// Espera a que los componentes lazy terminen de cargar
async function renderApp() {
  render(<App />)
  // findBy espera hasta que el componente lazy se renderice
  await screen.findByPlaceholderText('Nueva tarea...', {}, { timeout: 3000 })
}

// ─── Carga inicial ────────────────────────────────────────────────────────────

describe('App — carga con Suspense', () => {
  it('muestra el fallback de carga mientras resuelven los componentes lazy', () => {
    render(<App />)
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('muestra el formulario y los filtros tras la carga', async () => {
    await renderApp()
    expect(screen.getByPlaceholderText('Nueva tarea...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument()
  })

  it('muestra el mensaje de lista vacía al inicio', async () => {
    await renderApp()
    expect(screen.getByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })
})

// ─── Flujo: agregar tarea ─────────────────────────────────────────────────────

describe('App — agregar una nueva tarea', () => {
  it('aparece en la lista al agregarla', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Hacer ejercicio')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByText('Hacer ejercicio')).toBeInTheDocument()
  })

  it('el campo queda vacío después de agregar', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Leer un libro')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByPlaceholderText('Nueva tarea...')).toHaveValue('')
  })

  it('no agrega una tarea vacía', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })

  it('agrega varias tareas y todas aparecen en la lista', async () => {
    const user = userEvent.setup()
    await renderApp()
    const input = screen.getByPlaceholderText('Nueva tarea...')

    for (const texto of ['Tarea 1', 'Tarea 2', 'Tarea 3']) {
      await user.type(input, texto)
      await user.click(screen.getByRole('button', { name: 'Agregar' }))
    }

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})

// ─── Flujo: marcar como completada ───────────────────────────────────────────

describe('App — marcar tarea como completada', () => {
  it('el checkbox se marca al hacer click', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Tarea a completar')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('aplica la clase de tachado al completar la tarea', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Tarea a completar')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('checkbox'))

    // CSS Modules genera hashes; verificamos que el nombre de clase contiene 'textDone'
    expect(screen.getByText('Tarea a completar').className).toContain('textDone')
  })

  it('se puede desmarcar una tarea completada', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Tarea')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('checkbox'))

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
})

// ─── Flujo: eliminar tarea ────────────────────────────────────────────────────

describe('App — eliminar una tarea', () => {
  it('la tarea desaparece de la lista al eliminarla', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Tarea a eliminar')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('button', { name: /eliminar/i }))

    expect(screen.queryByText('Tarea a eliminar')).not.toBeInTheDocument()
  })

  it('muestra el mensaje vacío al eliminar la última tarea', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Única tarea')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('button', { name: /eliminar/i }))

    expect(screen.getByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })

  it('solo elimina la tarea seleccionada y conserva las demás', async () => {
    const user = userEvent.setup()
    await renderApp()
    const input = screen.getByPlaceholderText('Nueva tarea...')

    await user.type(input, 'Tarea que queda')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.type(input, 'Tarea que se borra')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    const eliminarBtns = screen.getAllByRole('button', { name: /eliminar/i })
    await user.click(eliminarBtns[1]) // segundo item

    expect(screen.getByText('Tarea que queda')).toBeInTheDocument()
    expect(screen.queryByText('Tarea que se borra')).not.toBeInTheDocument()
  })
})

// ─── Flujo: filtrar tareas ────────────────────────────────────────────────────

describe('App — filtrar tareas por estado', () => {
  async function setupDoseTareas(user, input) {
    await user.type(input, 'Tarea pendiente')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.type(input, 'Tarea completada')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    // Marcar la segunda como completada
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[1])
  }

  it('el filtro "Pendientes" muestra solo tareas sin completar', async () => {
    const user = userEvent.setup()
    await renderApp()
    await setupDoseTareas(user, screen.getByPlaceholderText('Nueva tarea...'))

    await user.click(screen.getByRole('button', { name: 'Pendientes' }))

    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
    expect(screen.queryByText('Tarea completada')).not.toBeInTheDocument()
  })

  it('el filtro "Completadas" muestra solo tareas completadas', async () => {
    const user = userEvent.setup()
    await renderApp()
    await setupDoseTareas(user, screen.getByPlaceholderText('Nueva tarea...'))

    await user.click(screen.getByRole('button', { name: 'Completadas' }))

    expect(screen.getByText('Tarea completada')).toBeInTheDocument()
    expect(screen.queryByText('Tarea pendiente')).not.toBeInTheDocument()
  })

  it('el filtro "Todas" muestra todas las tareas', async () => {
    const user = userEvent.setup()
    await renderApp()
    await setupDoseTareas(user, screen.getByPlaceholderText('Nueva tarea...'))

    await user.click(screen.getByRole('button', { name: 'Completadas' }))
    await user.click(screen.getByRole('button', { name: 'Todas' }))

    expect(screen.getByText('Tarea pendiente')).toBeInTheDocument()
    expect(screen.getByText('Tarea completada')).toBeInTheDocument()
  })

  it('el filtro "Pendientes" muestra lista vacía si todas están completadas', async () => {
    const user = userEvent.setup()
    await renderApp()
    const input = screen.getByPlaceholderText('Nueva tarea...')

    await user.type(input, 'Única tarea')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Pendientes' }))

    expect(screen.getByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })
})
