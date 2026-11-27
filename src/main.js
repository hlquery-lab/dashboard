import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins.js";
import { createI18n } from "vue-i18n";
import "./style.css";
import "./workspace.css";

import "./navigation.css";
import "./metronic.css";
import "./dashboard.css";
import "./commerce/commerce.css";
import "./profile.css";
import "../../shared/brand-typography.css";

const i18n = createI18n({ legacy: false, locale: localStorage.getItem("hlquery-locale") || "en", fallbackLocale: "en", messages: {
  en: { language: "Language", search: "Search orders, pages…", store: "Store", showcase: "Showcase", preferences: "Preferences", quickSearch: "Quick search", home: "Overview", orders: "Orders", fulfillment: "Fulfillment", products: "Products", inventory: "Inventory", customers: "Customers", analytics: "Analytics", settings: "Settings", appearance: "Appearance", activity: "Activity", authentication: "Authentication", searchResults: "Search results", createOrder: "Create order", website: "HLQuery website", demoStore: "Demo store", owner: "Store owner", help: "Help center", login1: "Login 01", login2: "Login 02", signup1: "Sign up 01", signup2: "Sign up 02" },
  es: { language: "Idioma", search: "Buscar pedidos, páginas…", store: "Tienda", showcase: "Muestras", preferences: "Preferencias", quickSearch: "Búsqueda rápida", home: "Resumen", orders: "Pedidos", fulfillment: "Preparación", products: "Productos", inventory: "Inventario", customers: "Clientes", analytics: "Analítica", settings: "Configuración", appearance: "Apariencia", activity: "Actividad", authentication: "Autenticación", searchResults: "Resultados de búsqueda", createOrder: "Crear pedido", website: "Sitio web de HLQuery", demoStore: "Tienda de demostración", owner: "Propietario", help: "Centro de ayuda", login1: "Inicio de sesión 01", login2: "Inicio de sesión 02", signup1: "Registro 01", signup2: "Registro 02" },
  fr: { language: "Langue", search: "Rechercher commandes, pages…", store: "Boutique", showcase: "Exemples", preferences: "Préférences", quickSearch: "Recherche rapide", home: "Vue d’ensemble", orders: "Commandes", fulfillment: "Expédition", products: "Produits", inventory: "Stock", customers: "Clients", analytics: "Analytique", settings: "Paramètres", appearance: "Apparence", activity: "Activité", authentication: "Authentification", searchResults: "Résultats de recherche", createOrder: "Créer une commande", website: "Site HLQuery", demoStore: "Boutique de démonstration", owner: "Propriétaire", help: "Centre d’aide", login1: "Connexion 01", login2: "Connexion 02", signup1: "Inscription 01", signup2: "Inscription 02" },
} });
createApp(App).use(i18n).use(vuetify).mount("#app");
