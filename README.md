<div align="center">

<img src="public/logo.png" alt="Logo de HLQuery" width="96" />

# HLQuery · Dashboard

**Everyday Supply — tu tienda de ejemplo, de la venta a la entrega.**

Vue 3 · Vuetify · Chart.js · Vite · Lucide

[🏠 Inicio](../README.md) · [🌐 Landing](../landing/README.md) · [🚀 Iniciar](#-iniciar) · [🛍️ Explorar](#-explora-la-tienda)

</div>

---

## 🚀 Iniciar

Desde `dash/`:

```bash
npm install
npm run dev
```

**[Abrir dashboard →](http://localhost:5174)** · Para iniciar también la landing, ejecuta `./etc/scripts/x2` desde la raíz.

## 🛍️ Explora la tienda

| | Sección | Qué puedes hacer |
| :---: | :--- | :--- |
| 📈 | **Overview y analítica** | Consultar ventas, pedidos, ticket promedio, unidades vendidas, categorías, canales y productos destacados. |
| 🛒 | **Pedidos** | Buscar, filtrar, paginar, exportar y crear pedidos con descuentos. |
| 🚚 | **Preparación y entrega** | Registrar el pago y avanzar por preparación, envío y entrega. |
| 📦 | **Productos e inventario** | Crear y editar productos, SKU únicos, precios con centavos, ilustraciones, publicación y reposiciones. |
| 👥 | **Clientes** | Revisar perfiles, direcciones, historial de compras, clientes recurrentes y ventas pagadas acumuladas. |
| 🏷️ | **Descuentos** | Crear códigos porcentuales con mínimo de compra opcional; activarlos o pausarlos. |
| 🧾 | **Facturas y pagos** | Consultar totales, exportar CSV y descargar facturas de ejemplo con detalle de artículos. |
| 🎨 | **Preferencias** | Cambiar nombre de tienda, tema claro/oscuro, tablas y navegación compactas, esquinas y ancho del contenido. |

**Encuentra lo que buscas:** `Ctrl+K` en Windows/Linux o `⌘K` en macOS abre la búsqueda de páginas y pedidos.

## 🧭 Un recorrido para probar

1. **Crea un producto** publicado, con precio y stock disponible.
2. **Crea un pedido** con ese producto y, si quieres, un descuento activo.
3. **Marca el pago** antes de comenzar la preparación.
4. **Avanza el pedido** por preparación, envío y entrega.
5. **Revisa sus resultados** en analítica y descarga su factura de ejemplo.

<details>
<summary>📋 Reglas de pedidos, stock y descuentos</summary>

- Los productos en borrador, archivados o sin stock no se pueden agregar a un pedido nuevo.
- Los pagos pendientes deben marcarse como pagados antes de preparar el pedido.
- Cancelar un pedido aún no enviado devuelve el stock y deja su pago como **Refunded** o **Voided**, según corresponda.
- Los descuentos se validan antes de crear el pedido.
- Los precios quedan guardados en las líneas del pedido: editar el catálogo después no cambia una compra anterior.
- Las métricas financieras cuentan pedidos pagados y no cancelados.

</details>

## 💾 Datos de la demo

| Dato | Comportamiento |
| :--- | :--- |
| 💵 Moneda | Todos los importes están en USD. |
| 📅 Fecha de referencia | 23 de noviembre de 2026, también para los nuevos pedidos de ejemplo. |
| 🗃️ Persistencia | Los registros de comercio se guardan en `localStorage`, bajo `hlquery-commerce-v1`. |
| 🧩 Datos anteriores | Los registros de la demo previa se conservan por separado. |

Los registros pertenecen al navegador que uses; borrar su almacenamiento elimina los cambios locales.

<details>
<summary>🔎 Qué simula esta tienda</summary>

La demo funciona sin backend, autenticación ni tienda pública conectada. Los pagos, reembolsos y cambios de entrega modifican únicamente registros de ejemplo.

No procesa cobros, envía correos, calcula impuestos ni se integra con transportistas. El envío del checkout de ejemplo es gratis y las facturas descargadas son documentos de muestra.

</details>

<details>
<summary>🧪 Compilación y pruebas</summary>

Desde `dash/`:

| Comando | Resultado |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo en el puerto 5174. |
| `npm run build` | Compilación en `dist/`. |
| `npm run preview` | Vista previa de la compilación en el puerto 4174. |
| `npm test` | Pruebas de navegador con Playwright. |
| `npm run test:ui` | Interfaz interactiva de Playwright. |

Si necesitas instalar el navegador de pruebas:

```bash
npx playwright install chromium
```

Para cambiar el enlace de regreso a la landing, configura `VITE_LANDING_URL` antes de compilar. Consulta [.env.example](.env.example).

</details>

---

<div align="center">

[⬅ Volver al proyecto](../README.md) · [🌐 Ver la landing](../landing/README.md)

</div>
