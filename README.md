# Lista de Tareas — Aplicación React

Aplicación de gestión de tareas desarrollada con React 19 y Vite como proyecto del Bloque 2. Permite agregar, completar, eliminar y filtrar tareas, con persistencia en `localStorage` y modo oscuro automático.

---

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior

---

## Instalación y comandos


npm install       # instalar dependencias
npm run dev       # servidor de desarrollo en http://localhost:5173
npm run test:run  # ejecutar todas las pruebas
npm run build     # compilar para producción

## Estructura del proyecto

El código fuente está organizado en carpetas por responsabilidad:

- **`components/`** — componentes de UI: `Header`, `TaskForm`, `TaskList`, `TaskItem`, `FilterButtons`
- **`hooks/`** — lógica de estado: `useTasks` maneja las tareas y el filtro activo
- **`reducers/`** — `taskReducer` define cómo cambia el estado ante cada acción
- **`context/`** — `TaskContext` distribuye el estado a todos los componentes
- **`__tests__/`** — pruebas unitarias y de integración

---

## Decisiones de implementación

### useReducer + Context

Se usa `useReducer` en lugar de múltiples `useState` porque todas las acciones sobre tareas (agregar, eliminar, completar, filtrar) modifican el mismo estado. Centralizar la lógica en un reducer facilita el mantenimiento y permite probar las transiciones de estado como funciones puras, sin necesidad de montar componentes.

`TaskContext` distribuye ese estado a todos los componentes, evitando pasar props en cascada.

### React.lazy y Suspense

`TaskForm` y `FilterButtons` se cargan de forma diferida porque no son necesarios en el primer render. Cada componente tiene su propio `<Suspense>` para que se muestren de manera independiente cuando terminan de cargar.

### CSS Modules

Cada componente tiene su propio archivo `.module.css`. Vite genera nombres de clase únicos automáticamente, lo que evita conflictos entre estilos. Las variables CSS en `index.css` manejan el tema claro y oscuro sin código JavaScript.

