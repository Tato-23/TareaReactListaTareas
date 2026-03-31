/**
 * taskReducer — Manejo de estado complejo con useReducer
 *
 * DECISIÓN DE DISEÑO:
 * Se usa useReducer en lugar de múltiples useState porque:
 *
 * 1. Estado relacionado en un solo objeto: `tasks` y `filter` siempre
 *    cambian juntos o en respuesta a las mismas acciones. Mantenerlos
 *    separados con useState obliga a coordinar varios setters.
 *
 * 2. Lógica centralizada y predecible: todas las transiciones de estado
 *    están en una función pura. Esto facilita razonar sobre el estado,
 *    depurar y extender la app sin efectos secundarios inesperados.
 *
 * 3. Testabilidad: el reducer es una función pura (input → output)
 *    que se puede probar sin montar componentes ni mockear hooks.
 *
 * 4. Escalabilidad: agregar nuevas acciones (ej. REORDER_TASK,
 *    EDIT_TASK, CLEAR_COMPLETED) solo requiere un nuevo case en el
 *    switch, sin tocar los componentes.
 */

export const ACTIONS = {
  ADD_TASK:    'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_TASK: 'TOGGLE_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  SET_FILTER:  'SET_FILTER',
}

export const initialState = {
  tasks:  [],
  filter: 'all',
}

export function taskReducer(state, action) {
  switch (action.type) {

    case ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] }

    case ACTIONS.DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case ACTIONS.TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      }

    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.changes } : t
        ),
      }

    case ACTIONS.SET_FILTER:
      return { ...state, filter: action.payload }

    default:
      return state
  }
}
