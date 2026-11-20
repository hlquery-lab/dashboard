# HLQuery Workspace

Demo independiente de Vue 3, Vuetify 4 y Vite, con diseño propio inspirado en la navegación y organización de Metronic. Incluye tema claro y oscuro, navegación adaptable a móviles y submenús desplegables inspirados en Metronic, con el color principal #1976d3.

```sh
npm install
npm run dev
```

Disponible en http://localhost:5174. `npm run build` genera `dist/`; `npm run preview` sirve el build en el puerto 4174.

## Vistas y acciones

- Overview: indicadores, resumen de ingresos interactivo y actividad de ejemplo.
- Projects: búsqueda, filtros, creación con diálogo Vuetify, detalle con cambios de estado y exportación CSV.
- Board: tablero Kanban con Vue Draggable 4; mueve proyectos por arrastre o con el selector de estado accesible. Los cambios se guardan y se reflejan en la lista, los gráficos y el registro de actividad.
- Team: colaboradores y proyectos asignados.
- Reports: resumen del workspace y exportación de proyectos.
- Charts: gráficos interactivos de líneas, barras, distribución y radar con Chart.js; selector semanal/semestral. La distribución usa los proyectos del navegador; las otras métricas son ejemplos.
- Calendar: calendario mensual con navegación, selección de día y agenda basada en las fechas de los proyectos.
- Billing: facturas de ejemplo con búsqueda, filtro, ordenamiento, detalle y descarga de texto. No procesa pagos ni emite documentos tributarios.
- Payments: resumen de pagos recibidos de ejemplo y exportación CSV.
- Activity: registro de las creaciones y cambios de estado locales, con filtros y actividad inicial de ejemplo.
- Appearance: tema, densidad de tablas y navegación compacta persistentes.
- Settings y Help: preferencias generales y ayuda del demo.
- Búsqueda rápida con Ctrl/⌘ + K: abre páginas o encuentra proyectos por nombre o cliente.

Los proyectos y las preferencias persisten en localStorage. Las cifras financieras, colaboradores, facturas y actividad inicial son datos de demostración. La actividad de tus creaciones y cambios de estado se registra localmente. No incluye API, autenticación ni sincronización entre dispositivos.

## Verificación

```sh
npx playwright install chromium
npm test
```

Las seis pruebas de navegador cubren navegación anidada e historial, gráficos, calendario, facturas, pagos, creación de proyectos, persistencia, arrastre Kanban, cambios de estado, registro de actividad, preferencias de apariencia, búsqueda con teclado y anchos móviles. `npm run test:ui` abre Playwright UI.

Configura `VITE_LANDING_URL` antes del build para enlazar la landing publicada. El valor predeterminado de desarrollo es http://localhost:5173.

La interfaz usa Vuetify y Lucide; Chart.js se ocupa de los gráficos, VueUse de las preferencias persistentes, AutoAnimate de los submenús y Vue Draggable 4 del tablero. Las animaciones respetan la preferencia de movimiento reducido.
