import { createVuetify } from "vuetify";
import {
  VApp,
  VBtn,
  VCard,
  VCardText,
  VCardTitle,
  VDialog,
  VTextField,
  VSelect,
  VChip,
  VSnackbar,
  VSwitch,
  VDataTable,
  VDivider,
} from "vuetify/components";
import { Ripple } from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import "vuetify/styles";

export default createVuetify({
  components: {
    VApp,
    VBtn,
    VCard,
    VCardText,
    VCardTitle,
    VDialog,
    VTextField,
    VSelect,
    VChip,
    VSnackbar,
    VSwitch,
    VDataTable,
    VDivider,
  },
  directives: { Ripple },
  icons: { defaultSet: "mdi", aliases, sets: { mdi } },
  theme: {
    defaultTheme: "workspaceLight",
    themes: {
      workspaceLight: {
        dark: false,
        colors: {
          primary: "#1976d3",
          background: "#f7f8fc",
          surface: "#ffffff",
          "on-surface": "#182230",
          success: "#089977",
        },
      },
      workspaceDark: {
        dark: true,
        colors: {
          primary: "#1976d3",
          background: "#10131e",
          surface: "#1a1e2d",
          "on-surface": "#eff2fc",
          success: "#52d9b0",
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: "lg",
      elevation: 0,
      style: "text-transform: none; letter-spacing: 0; font-weight: 600;",
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
    },
    VSelect: { variant: "outlined", density: "comfortable", color: "primary" },
    VCard: { rounded: "xl", elevation: 0 },
  },
});
