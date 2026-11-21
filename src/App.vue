<script setup>
import {
  computed,
  defineAsyncComponent,
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useStorage } from "@vueuse/core";
import SidebarNavigation from "./components/SidebarNavigation.vue";
import CommandPalette from "./components/CommandPalette.vue";
import { pageGroups, navigationPages } from "./data/navigation.js";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ChartNoAxesCombined,
  Settings2,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  SlidersHorizontal,
  CalendarDays,
  ArrowUpRight,
  MoreHorizontal,
  CircleHelp,
  PanelLeftClose,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
  Check,
  Command,
  Layers,
  CreditCard,
  Clock3,
  CheckCheck,
  Sparkles,
  Ellipsis,
} from "lucide-vue-next";
const WorkspaceChart = defineAsyncComponent(
  () => import("./components/WorkspaceChart.vue"),
);
const ProductivityView = defineAsyncComponent(() => import("./views/ProductivityView.vue"));
const ChartsView = defineAsyncComponent(() => import("./views/ChartsView.vue"));
const CalendarView = defineAsyncComponent(
  () => import("./views/CalendarView.vue"),
);
const BillingView = defineAsyncComponent(
  () => import("./views/BillingView.vue"),
);
const BoardView = defineAsyncComponent(() => import("./views/BoardView.vue"));
const SettingsView = defineAsyncComponent(
  () => import("./views/SettingsView.vue"),
);
const AppearanceView = defineAsyncComponent(
  () => import("./views/AppearanceView.vue"),
);
const ActivityView = defineAsyncComponent(
  () => import("./views/ActivityView.vue"),
);
const PaymentsView = defineAsyncComponent(
  () => import("./views/PaymentsView.vue"),
);
const landingUrl = import.meta.env.VITE_LANDING_URL || "https://hlquery.com";
const legacyPages = {
  "Vista general": "Overview",
  Proyectos: "Projects",
  Equipo: "Team",
  Reportes: "Reports",
  Configuración: "Settings",
  Ayuda: "Help",
};
const pageFromHash = () => {
  const value = decodeURIComponent(location.hash.slice(1));
  return legacyPages[value] || value || "Overview";
};
const page = ref(pageFromHash());
const allowedPages = navigationPages.map((item) => item.page);
if (!allowedPages.includes(page.value)) page.value = "Overview";
const compact = useStorage("hlquery-compact-navigation", false);
const dense = useStorage("hlquery-compact-tables", false);
const contentWidth = useStorage("hlquery-content-width", 1540);
const cardRadius = useStorage("hlquery-card-radius", 11);
const commandOpen = ref(false);
const selectedProjectId = ref(null);
const activityEntries = useStorage("hlquery-activity", [
  {
    id: "sample-1",
    type: "status",
    title: "Sales dashboard is ready for review",
    detail: "The project moved from In progress to In review.",
    project: "Sales dashboard",
    date: "2026-11-20T13:20:00Z",
    to: "In review",
    sample: true,
  },
  {
    id: "sample-2",
    type: "status",
    title: "Brand identity was completed",
    detail: "A finished project. A little more room for what is next.",
    project: "Brand identity",
    date: "2026-11-20T12:20:00Z",
    to: "Completed",
    sample: true,
  },
  {
    id: "sample-3",
    type: "project",
    title: "Booking application was added",
    detail: "A new project joined the workspace.",
    project: "Booking application",
    date: "2026-11-19T14:10:00Z",
    sample: true,
  },
]);
const menuOpen = ref(false),
  query = ref(""),
  period = ref("6 months"),
  status = ref("All statuses"),
  notifications = ref(false),
  profileOpen = ref(false),
  modal = ref(false),
  toast = ref("");
let timer;
const notify = (message) => {
  toast.value = message;
  clearTimeout(timer);
  timer = setTimeout(() => (toast.value = ""), 3800);
};
const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const dark = ref(load("leopemtn-dark", false));
const projectSeed = [
  {
    id: 1,
    name: "Platform redesign",
    client: "Acme Studio",
    initials: "AS",
    color: "violet",
    category: "Web design",
    status: "In progress",
    progress: 72,
    date: "2026-11-28",
    members: ["CM", "JP", "AM"],
    budget: 2400000,
  },
  {
    id: 2,
    name: "Sales dashboard",
    client: "Nova Commerce",
    initials: "NC",
    color: "blue",
    category: "Development",
    status: "In review",
    progress: 90,
    date: "2026-11-24",
    members: ["JP", "VL"],
    budget: 1850000,
  },
  {
    id: 3,
    name: "Brand identity",
    client: "Forma Estudio",
    initials: "FE",
    color: "orange",
    category: "Branding",
    status: "Completed",
    progress: 100,
    date: "2026-11-20",
    members: ["AM", "CM"],
    budget: 950000,
  },
  {
    id: 4,
    name: "Booking application",
    client: "Orbit Digital",
    initials: "OD",
    color: "green",
    category: "Web application",
    status: "In progress",
    progress: 45,
    date: "2026-12-05",
    members: ["VL", "JP", "CM"],
    budget: 3200000,
  },
  {
    id: 5,
    name: "Company website",
    client: "Luma Agency",
    initials: "LA",
    color: "pink",
    category: "Web design",
    status: "Pending",
    progress: 12,
    date: "2026-12-10",
    members: ["AM", "VL"],
    budget: 1200000,
  },
];
const legacyLabels = {
  "En progreso": "In progress",
  "En revisión": "In review",
  Completado: "Completed",
  Pendiente: "Pending",
  "Diseño web": "Web design",
  Desarrollo: "Development",
  "Aplicación web": "Web application",
};
const projects = ref(load("leopemtn-projects", projectSeed));
projects.value = projects.value.map((project) => ({
  ...project,
  status: legacyLabels[project.status] || project.status,
  category: legacyLabels[project.category] || project.category,
}));
const selectedProject = computed(() =>
  projects.value.find((p) => p.id === selectedProjectId.value),
);
const savedName = ref(load("leopemtn-name", "HLQuery Workspace"));
if (savedName.value === "Leopemtn Workspace")
  savedName.value = "HLQuery Workspace";
const workspaceName = ref(savedName.value);
const filtered = computed(() =>
  projects.value.filter(
    (p) =>
      (status.value === "All statuses" || p.status === status.value) &&
      `${p.name} ${p.client} ${p.category}`
        .toLowerCase()
        .includes(query.value.toLowerCase()),
  ),
);
const completed = computed(
  () => projects.value.filter((p) => p.status === "Completed").length,
);
const form = ref({
  name: "",
  client: "",
  category: "Web design",
  date: "",
  budget: 0,
});
const team = [
  {
    name: "Camila Muñoz",
    initials: "CM",
    role: "UX/UI designer",
    email: "camila@example.com",
    color: "violet",
  },
  {
    name: "Juan Pérez",
    initials: "JP",
    role: "Frontend developer",
    email: "juan@example.com",
    color: "blue",
  },
  {
    name: "Antonia Morales",
    initials: "AM",
    role: "Art director",
    email: "antonia@example.com",
    color: "orange",
  },
  {
    name: "Vicente López",
    initials: "VL",
    role: "Full stack developer",
    email: "vicente@example.com",
    color: "green",
  },
];
const visibleTeam = computed(() =>
  team.filter((t) =>
    `${t.name} ${t.role}`.toLowerCase().includes(query.value.toLowerCase()),
  ),
);
const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
const compactNumber = (value) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
const shortDate = (value) =>
  new Date(value + "T12:00:00").toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
function navigate(value) {
  if (!allowedPages.includes(value)) return;
  page.value = value;
  location.hash = value;
  menuOpen.value = false;
  profileOpen.value = false;
  query.value = "";
  document.title = `${value} · HLQuery`;
  nextTick(() => document.querySelector("#main")?.focus());
}
function saveSettings() {
  const value = workspaceName.value.trim();
  if (!value) return;
  savedName.value = value;
  localStorage.setItem("leopemtn-name", JSON.stringify(value));
  notify("Preferences saved");
}
function setTheme(value) {
  dark.value = value;
  localStorage.setItem("leopemtn-dark", JSON.stringify(dark.value));
}
function toggleDark() {
  setTheme(!dark.value);
}
function logActivity(entry) {
  activityEntries.value = [
    {
      ...entry,
      id: Date.now() + Math.random(),
      date: new Date().toISOString(),
      sample: false,
    },
    ...activityEntries.value,
  ].slice(0, 100);
}
function updateProjects(next) {
  if (
    next.length !== projects.value.length ||
    new Set(next.map((p) => p.id)).size !== projects.value.length
  )
    return;
  const before = new Map(projects.value.map((p) => [p.id, p]));
  const changes = next.filter((p) => before.get(p.id)?.status !== p.status);
  projects.value = next.map((p) => ({
    ...p,
    progress:
      p.status === "Completed"
        ? 100
        : p.status === "Pending"
          ? 0
          : p.progress === 100
            ? p.status === "In review"
              ? 90
              : 50
            : p.progress,
  }));
  localStorage.setItem("leopemtn-projects", JSON.stringify(projects.value));
  for (const p of changes)
    logActivity({
      type: "status",
      project: p.name,
      title: `${p.name} moved to ${p.status}`,
      detail: `Status changed from ${before.get(p.id)?.status} to ${p.status}.`,
      to: p.status,
    });
  if (changes.length) notify("Project status updated");
}
function moveProject({ id, status }) {
  if (!["Pending", "In progress", "In review", "Completed"].includes(status))
    return;
  updateProjects(
    projects.value.map((p) => (p.id === id ? { ...p, status } : p)),
  );
}
function openProject(project) {
  selectedProjectId.value = typeof project === "object" ? project.id : project;
}
function createProject() {
  const name = form.value.name.trim(),
    client = form.value.client.trim();
  if (!name || !client) return;
  projects.value.unshift({
    ...form.value,
    name,
    client,
    id: Date.now(),
    initials: client
      .split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    color: "violet",
    status: "Pending",
    progress: 0,
    members: ["CM"],
  });
  localStorage.setItem("leopemtn-projects", JSON.stringify(projects.value));
  modal.value = false;
  form.value = {
    name: "",
    client: "",
    category: "Web design",
    date: "",
    budget: 0,
  };
  logActivity({
    type: "project",
    project: name,
    title: `${name} was created`,
    detail: `A new project for ${client} was added to the workspace.`,
  });
  notify("Project created successfully");
}
function exportCsv() {
  const escape = (value) => '"' + String(value).replaceAll('"', '""') + '"';
  const csv =
    "\uFEFF" +
    [
      ["Project", "Client", "Status", "Progress (%)", "Due date", "Budget CLP"],
      ...filtered.value.map((p) => [
        p.name,
        p.client,
        p.status,
        p.progress,
        p.date,
        p.budget,
      ]),
    ]
      .map((row) => row.map(escape).join(";"))
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "hlquery-projects.csv";
  a.click();
  URL.revokeObjectURL(url);
  notify("Report exported");
}
function keydown(e) {
  if (e.key === "Escape") {
    modal.value = false;
    commandOpen.value = false;
    selectedProjectId.value = null;
    menuOpen.value = false;
    notifications.value = false;
    profileOpen.value = false;
  }
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    commandOpen.value = !commandOpen.value;
  }
}
function hashchange() {
  const value = pageFromHash();
  if (allowedPages.includes(value)) {
    page.value = value;
    document.title = `${value} · HLQuery`;
    query.value = "";
    menuOpen.value = false;
  }
}
const pageDescriptions = {
  Tasks: "Focus on what comes next. Your personal workspace checklist.",
  Clients: "Every relationship, project, and budget in one place.",
  Goals: "Turn your project portfolio into measurable progress.",
  Board: "A place for every project. A clear next step for your team.",
  Activity: "The small steps that move your workspace forward.",
  Appearance: "Settle into a workspace that feels like you.",
  Payments: "Every payment, clearly accounted for. Sample billing data.",
  Charts: "Your business in focus. Explore the numbers behind the progress.",
  Calendar: "Make space for great work. Keep every deadline in view.",
  Billing: "From delivered work to paid invoices. Every detail, together.",
};
const revenueLabels = computed(() =>
  period.value === "This week"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
);
const revenueDatasets = computed(() => [
  {
    label: "Current period",
    data:
      period.value === "This week"
        ? [0.32, 0.41, 0.36, 0.52, 0.48, 0.61, 0.72]
        : [4.2, 6.8, 5.5, 8.4, 10.9, 12.45],
    borderColor: "#1976d3",
    backgroundColor: "#1976d314",
    fill: true,
  },
  {
    label: "Previous period",
    data:
      period.value === "This week"
        ? [0.22, 0.31, 0.28, 0.38, 0.41, 0.44, 0.51]
        : [3.5, 4.5, 4.1, 6.9, 7.8, 9.3],
    borderColor: "#b6c0d5",
    borderDash: [5, 5],
  },
]);
onMounted(() => {
  document.title = `${page.value} · HLQuery`;
  document.addEventListener("keydown", keydown);
  window.addEventListener("hashchange", hashchange);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", keydown);
  window.removeEventListener("hashchange", hashchange);
  clearTimeout(timer);
});
</script>

<template>
  <v-app
    class="workspace"
    :theme="dark ? 'workspaceDark' : 'workspaceLight'"
    :class="{ dark, compact, dense }"
    :style="{
      '--workspace-content-width': contentWidth + 'px',
      '--workspace-card-radius': cardRadius + 'px',
    }"
  >
    <a class="skip-link" href="#main">Skip to content</a>
    <button
      v-if="menuOpen"
      class="backdrop"
      aria-label="Close menu"
      @click="menuOpen = false"
    ></button>
    <aside class="sidebar" :class="{ open: menuOpen }">
      <a href="#Overview" class="brand" @click.prevent="navigate('Overview')"
        ><img
          class="brand-mark"
          src="/logo.png"
          alt=""
          aria-hidden="true"
        /><span class="brand-word">HLQuery<span class="brand-dot">.</span></span
        ><span class="pro-tag">PRO</span></a
      >
      <button class="workspace-switch" @click="navigate('Settings')">
        <span class="workspace-symbol"><Layers :size="19" /></span
        ><span class="workspace-copy"
          ><strong>{{ savedName }}</strong
          ><small>Workspace</small></span
        ><ChevronDown :size="16" />
      </button>
      <SidebarNavigation
        :page="page"
        :compact="compact && !menuOpen"
        :project-count="projects.length"
        :completed-count="projects.filter((project) => project.status === 'Completed').length"
        @search="commandOpen = true"
        @navigate="navigate"
        @expand="compact = false"
      />
      <div class="sidebar-bottom">
        <div class="upgrade">
          <span class="upgrade-icon"><Sparkles :size="22" /></span
          ><strong>Room to grow</strong>
          <p>Your next great project starts here.</p>
          <button @click="modal = true">
            <Plus :size="16" /> Create project
          </button>
        </div>
        <a class="back-site" :href="landingUrl"
          ><ExternalLink :size="17" /><span>Visit website</span></a
        >
        <div class="sidebar-footer">
          <span class="status-dot"></span><span>Demo workspace</span
          ><button aria-label="Collapse navigation" @click="compact = !compact">
            <PanelLeftClose :size="17" />
          </button>
        </div>
      </div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <div class="breadcrumb">
          <button
            class="mobile-menu icon-button"
            aria-label="Open menu"
            @click="menuOpen = true"
          >
            <Menu :size="21" /></button
          ><button
            class="desktop-collapse icon-button"
            aria-label="Toggle compact navigation"
            @click="compact = !compact"
          >
            <Menu :size="19" /></button
          ><span>{{ pageGroups[page] || "Workspace" }}</span
          ><ChevronRight :size="13" /><strong>{{ page }}</strong>
        </div>
        <div class="topbar-tools">
          <button
            class="global-search command-trigger"
            aria-label="Search workspace"
            @click="commandOpen = true"
          >
            <Search :size="17" /><span>Search anything...</span><kbd>⌘ K</kbd>
          </button>
          <button
            class="icon-button mobile-search"
            aria-label="Search workspace"
            @click="commandOpen = true"
          >
            <Search :size="19" />
          </button>
          <button
            class="icon-button theme-button"
            :aria-label="
              dark ? 'Switch to light theme' : 'Switch to dark theme'
            "
            @click="toggleDark"
          >
            <Sun v-if="dark" :size="20" /><Moon v-else :size="19" />
          </button>
          <div class="popover-anchor">
            <button
              class="icon-button notification-button"
              aria-label="Notifications"
              :aria-expanded="notifications"
              @click="
                notifications = !notifications;
                profileOpen = false;
              "
            >
              <Bell :size="19" /><i></i>
            </button>
            <div v-if="notifications" class="popover notifications">
              <strong>Notifications</strong>
              <p>You’re all caught up.</p>
              <div>
                <span class="activity-mark blue"><Check :size="15" /></span
                ><span
                  >Sales dashboard is ready for review.<small
                    >20 minutes ago · Sample data</small
                  ></span
                >
              </div>
            </div>
          </div>
          <span class="toolbar-divider"></span>
          <div class="popover-anchor">
            <button
              class="profile"
              :aria-expanded="profileOpen"
              @click="
                profileOpen = !profileOpen;
                notifications = false;
              "
            >
              <span class="avatar profile-avatar">CF</span
              ><span class="profile-copy"
                ><strong>Carlos F.</strong><small>Administrator</small></span
              ><ChevronDown :size="14" />
            </button>
            <div v-if="profileOpen" class="popover profile-popover">
              <strong>Carlos F.</strong><small>Demo session</small
              ><button @click="navigate('Settings')">
                <Settings2 :size="16" /> Preferences</button
              ><a :href="landingUrl"
                ><ExternalLink :size="16" /> Visit website</a
              >
            </div>
          </div>
        </div>
      </header>
      <main id="main" tabindex="-1">
        <div class="page-heading">
          <div>
            <div class="eyebrow">
              WORKSPACE / {{ page.toUpperCase() }}
              <span class="demo-badge">Live demo</span>
            </div>
            <h1>
              {{ page === "Overview" ? "Welcome back, Carlos" : page
              }}<span v-if="page === 'Overview'" class="wave">✦</span>
            </h1>
            <p>
              {{
                pageDescriptions[page] ||
                (page === "Overview"
                  ? "Here’s what’s happening across your projects and team."
                  : page === "Projects"
                    ? "From the first idea to the final delivery. All in one place."
                    : page === "Team"
                      ? "The people moving your projects forward."
                      : page === "Reports"
                        ? "A clear view of your workspace performance."
                        : page === "Settings"
                          ? "Make this workspace your own."
                          : "Everything you need to get started.")
              }}
            </p>
          </div>
          <div class="heading-actions">
            <button
              v-if="['Overview', 'Reports'].includes(page)"
              class="button"
              @click="exportCsv"
            >
              <Download :size="16" /> Export</button
            ><button
              v-if="
                ['Overview', 'Projects', 'Calendar', 'Board'].includes(page)
              "
              class="button primary"
              @click="modal = true"
            >
              <Plus :size="18" /> New project
            </button>
          </div>
        </div>
        <section
          v-if="['Projects', 'Board', 'Calendar'].includes(page)"
          class="project-pulse"
          aria-label="Project summary"
        >
          <article
            v-for="(stage, index) in [
              'In progress',
              'In review',
              'Pending',
              'Completed',
            ]"
            :key="stage"
            :class="'pulse-tone-' + index"
          >
            <span class="pulse-dot"></span><span>{{ stage }}</span>
            <strong>{{
              projects
                .filter((project) => project.status === stage)
                .length.toString()
                .padStart(2, "0")
            }}</strong>
            <div class="pulse-track" aria-hidden="true">
              <i
                :style="{
                  width:
                    (projects.length
                      ? (projects.filter((project) => project.status === stage)
                          .length /
                          projects.length) *
                        100
                      : 0) + '%',
                }"
              ></i>
            </div>
          </article>
        </section>
        <div
          v-if="['Projects', 'Board', 'Calendar'].includes(page)"
          class="workspace-view-tabs"
          aria-label="Project views"
        >
          <button
            v-for="tab in [
              { page: 'Projects', label: 'List view', icon: FolderKanban },
              { page: 'Board', label: 'Board view', icon: LayoutDashboard },
              { page: 'Calendar', label: 'Calendar', icon: CalendarDays },
            ]"
            :key="tab.page"
            :class="{ selected: page === tab.page }"
            :aria-pressed="page === tab.page"
            @click="navigate(tab.page)"
          >
            <component :is="tab.icon" :size="15" />{{ tab.label }}</button
          ><span>{{ projects.length }} projects in your workspace</span>
        </div>
        <BoardView
          v-if="page === 'Board'"
          :projects="projects"
          @update="updateProjects"
          @move="moveProject"
          @create="modal = true"
          @open="openProject"
        />
        <AppearanceView
          v-if="page === 'Appearance'"
          :dark="dark"
          :dense="dense"
          :compact="compact"
          @theme="setTheme"
          @density="dense = $event"
          @navigation="compact = $event"
        />
        <ProductivityView v-if="['Tasks', 'Clients', 'Goals'].includes(page)" :key="page" :page="page" :projects="projects" @open="openProject" />
        <ActivityView v-if="page === 'Activity'" :entries="activityEntries" />
        <PaymentsView
          v-if="page === 'Payments'"
          @invoices="navigate('Billing')"
        />
        <ChartsView
          v-if="page === 'Charts'"
          :projects="projects"
          :dark="dark"
        />
        <CalendarView
          v-if="page === 'Calendar'"
          :projects="projects"
          @create="modal = true"
          @projects="navigate('Projects')"
        />
        <BillingView v-if="page === 'Billing'" />
        <section v-if="page === 'Overview'" class="welcome-banner">
          <div>
            <span class="welcome-kicker"
              ><span class="live-dot"></span> YOUR SPACE TO DO GREAT WORK.</span
            >
            <h2>A clear view.<br />A better workday.</h2>
            <p>
              {{ projects.filter((p) => p.status !== "Completed").length }}
              active projects. {{ team.length }} teammates. One place to move
              forward.
            </p>
            <v-btn
              color="white"
              class="welcome-button"
              @click="navigate('Charts')"
              >Explore analytics <ArrowUpRight :size="17" class="ml-2"
            /></v-btn>
          </div>
          <div class="welcome-art" aria-hidden="true">
            <div class="art-orbit"></div>
            <div class="art-orbit second"></div>
            <div class="art-chart">
              <span>WORKSPACE MOMENTUM</span
              ><strong>Looking good. <ArrowUpRight :size="22" /></strong>
              <div class="art-bars">
                <i
                  v-for="(height, i) in [28, 45, 36, 60, 50, 75, 66, 95]"
                  :key="i"
                  :style="{ height: height + '%' }"
                ></i>
              </div>
              <small>Every step moves you forward.</small>
            </div>
            <span class="art-bubble"
              ><Check :size="19" /> Project delivered</span
            >
          </div>
        </section>
        <template v-if="page === 'Overview' || page === 'Reports'">
          <div class="overview-tabs">
            <div>
              <button
                :class="{ selected: page === 'Overview' }"
                @click="navigate('Overview')"
              >
                Overview</button
              ><button @click="navigate('Projects')">Projects</button
              ><button @click="navigate('Team')">Team</button
              ><button @click="navigate('Charts')">
                Analytics <ArrowUpRight :size="13" />
              </button>
            </div>
            <span><CalendarDays :size="15" /> November 2026 · Sample data</span>
          </div>
          <section class="stats-grid" aria-label="Indicadores del workspace">
            <article
              v-for="(stat, i) in [
                {
                  label: 'Revenue (CLP)',
                  value: compactNumber(12450000),
                  change: '+12.8%',
                  icon: CreditCard,
                  color: 'violet',
                  bars: [28, 42, 35, 55, 48, 63, 54, 77, 65, 85, 78, 98],
                },
                {
                  label: 'Active projects',
                  value: projects
                    .filter((p) => p.status !== 'Completed')
                    .length.toString()
                    .padStart(2, '0'),
                  change: '+2 new',
                  icon: FolderKanban,
                  color: 'blue',
                  bars: [25, 40, 33, 48, 40, 62, 52, 73, 66, 80, 73, 95],
                },
                {
                  label: 'Team members',
                  value: '04',
                  change: 'Full team',
                  icon: Users,
                  color: 'orange',
                  bars: [32, 32, 47, 47, 47, 62, 62, 62, 78, 78, 95, 95],
                },
                {
                  label: 'Completed projects',
                  value: completed.toString().padStart(2, '0'),
                  change: 'This month',
                  icon: CheckCheck,
                  color: 'green',
                  bars: [18, 30, 25, 41, 35, 50, 60, 52, 72, 67, 80, 95],
                },
              ]"
              :key="stat.label"
              class="card stat-card"
            >
              <div class="stat-top">
                <span>{{ stat.label }}</span
                ><span class="stat-icon" :class="stat.color"
                  ><component :is="stat.icon" :size="18"
                /></span>
              </div>
              <div class="stat-middle">
                <strong>{{ stat.value }}</strong>
                <div class="spark-bars" :class="stat.color" aria-hidden="true">
                  <i
                    v-for="(height, j) in stat.bars"
                    :key="j"
                    :style="{ height: height + '%' }"
                  ></i>
                </div>
              </div>
              <div class="stat-bottom">
                <span :class="i === 0 ? 'positive' : 'muted'"
                  ><ArrowUpRight v-if="i === 0" :size="13" />{{
                    stat.change
                  }}</span
                ><small>{{
                  i === 0
                    ? "vs. last month"
                    : i === 1
                      ? "this month"
                      : i === 2
                        ? "4 collaborators"
                        : "successfully delivered"
                }}</small>
              </div>
            </article>
          </section>
          <section class="charts-grid">
            <article class="card revenue-card">
              <div class="card-header">
                <div>
                  <h2>Revenue overview</h2>
                  <p>Track how your business is performing.</p>
                </div>
                <select v-model="period" aria-label="Chart period">
                  <option>6 months</option>
                  <option>This week</option>
                </select>
              </div>
              <div class="revenue-summary">
                <strong>{{
                  money(period === "6 months" ? 48250000 : 3420000)
                }}</strong
                ><span class="badge green"
                  ><ArrowUpRight :size="13" />18.6%</span
                >
              </div>
              <WorkspaceChart
                :labels="revenueLabels"
                :datasets="revenueDatasets"
                :dark="dark"
                currency
                label="Sample revenue comparison in millions of CLP"
                :height="270"
              />
            </article>
            <article class="card distribution-card">
              <div class="card-header">
                <div>
                  <h2>Project status</h2>
                  <p>Keep every project moving forward.</p>
                </div>
                <FolderKanban :size="19" class="muted" />
              </div>
              <div
                class="donut"
                :style="{
                  background: `conic-gradient(#1976d3 0 ${(projects.filter((p) => p.status === 'In progress').length / projects.length) * 100}%, #48b5eb ${(projects.filter((p) => p.status === 'In progress').length / projects.length) * 100}% ${(projects.filter((p) => ['In progress', 'In review'].includes(p.status)).length / projects.length) * 100}%, #26bd9d ${(projects.filter((p) => ['In progress', 'In review'].includes(p.status)).length / projects.length) * 100}% ${(projects.filter((p) => p.status !== 'Pending').length / projects.length) * 100}%, #e6e9f0 0)`,
                }"
              >
                <div>
                  <strong>{{
                    projects.length.toString().padStart(2, "0")
                  }}</strong
                  ><span>total projects</span>
                </div>
              </div>
              <div class="distribution-legend">
                <div
                  v-for="(state, i) in [
                    'In progress',
                    'In review',
                    'Completed',
                    'Pending',
                  ]"
                  :key="state"
                >
                  <span
                    ><i :class="['violet', 'blue', 'green', 'gray'][i]"></i
                    >{{ state }}</span
                  ><strong>{{
                    projects
                      .filter((p) => p.status === state)
                      .length.toString()
                      .padStart(2, "0")
                  }}</strong>
                </div>
              </div>
            </article>
          </section>
        </template>
        <section
          v-if="['Overview', 'Projects', 'Reports'].includes(page)"
          class="card projects-card"
        >
          <div class="card-header">
            <div class="section-title-line">
              <h2>
                {{ page === "Projects" ? "All projects" : "Recent projects" }}
              </h2>
              <span class="count-pill">{{ projects.length }}</span>
            </div>
            <button
              v-if="page === 'Overview'"
              class="text-button"
              @click="navigate('Projects')"
            >
              View all <ChevronRight :size="15" /></button
            ><button v-else class="button" @click="exportCsv">
              <Download :size="15" /> Export CSV
            </button>
          </div>
          <div class="table-toolbar">
            <div class="table-search">
              <Search :size="16" /><input
                v-model="query"
                aria-label="Search projects"
                placeholder="Search projects or clients..."
              />
            </div>
            <div class="filter-control">
              <SlidersHorizontal :size="15" /><select
                v-model="status"
                aria-label="Filter by status"
              >
                <option>All statuses</option>
                <option>In progress</option>
                <option>In review</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Team</th>
                  <th>Due date</th>
                  <th>Budget</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="project in filtered" :key="project.id">
                  <td>
                    <div class="project-name">
                      <span class="project-icon" :class="project.color">{{
                        project.initials
                      }}</span
                      ><span
                        ><button
                          class="project-title-button"
                          @click="openProject(project)"
                        >
                          {{ project.name }}</button
                        ><small
                          >{{ project.client }} <span>·</span>
                          {{ project.category }}</small
                        ></span
                      >
                    </div>
                  </td>
                  <td>
                    <span
                      class="badge"
                      :class="
                        project.status === 'Completed'
                          ? 'green'
                          : project.status === 'In review'
                            ? 'blue'
                            : project.status === 'Pending'
                              ? 'gray'
                              : 'violet'
                      "
                      ><i></i>{{ project.status }}</span
                    >
                  </td>
                  <td>
                    <div class="progress-cell">
                      <div>
                        <i
                          :style="{ width: project.progress + '%' }"
                          :class="
                            project.status === 'Completed' ? 'green' : 'violet'
                          "
                        ></i>
                      </div>
                      <span>{{ project.progress }}%</span>
                    </div>
                  </td>
                  <td>
                    <div class="avatar-stack">
                      <span
                        v-for="(member, i) in project.members"
                        :key="member"
                        class="avatar"
                        :class="['violet', 'orange', 'blue'][i]"
                        :title="team.find((t) => t.initials === member)?.name"
                        >{{ member }}</span
                      >
                    </div>
                  </td>
                  <td class="date-cell">{{ shortDate(project.date) }}</td>
                  <td class="budget-cell">{{ money(project.budget) }}</td>
                </tr>
                <tr v-if="!filtered.length">
                  <td colspan="6" class="empty-state">
                    No projects match your search.<button
                      class="text-button"
                      @click="
                        query = '';
                        status = 'All statuses';
                      "
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table-footer">
            <span
              >Showing {{ filtered.length }} of
              {{ projects.length }} projects</span
            ><span>Demo data</span>
          </div>
        </section>
        <section v-if="page === 'Overview'" class="bottom-grid">
          <article class="card activity-card">
            <div class="card-header">
              <h2>Recent activity</h2>
              <span class="muted small">Today</span>
            </div>
            <div
              class="activity-item"
              v-for="(activity, i) in [
                {
                  name: 'Juan Pérez',
                  action: 'submitted Sales dashboard for review.',
                  time: '20 minutes ago',
                  icon: FolderKanban,
                  color: 'blue',
                },
                {
                  name: 'Antonia Morales',
                  action: 'completed Brand identity.',
                  time: '1 hour ago',
                  icon: Check,
                  color: 'green',
                },
                {
                  name: 'Camila Muñoz',
                  action: 'added new designs to Platform redesign.',
                  time: '2 hours ago',
                  icon: Layers,
                  color: 'violet',
                },
              ]"
              :key="i"
            >
              <span class="activity-mark" :class="activity.color"
                ><component :is="activity.icon" :size="16"
              /></span>
              <div>
                <p>
                  <strong>{{ activity.name }}</strong> {{ activity.action }}
                </p>
                <small>{{ activity.time }}</small>
              </div>
            </div>
          </article>
          <article class="next-card">
            <span class="next-eyebrow"
              ><Sparkles :size="16" /> MAKE ROOM FOR WHAT’S NEXT</span
            >
            <h2>Great ideas.<br />Better outcomes.</h2>
            <p>
              Bring your next idea to life. Give your team a clear plan and a
              shared place to work.
            </p>
            <button class="button" @click="modal = true">
              <Plus :size="17" /> Create a project
            </button>
            <div class="decorative-orbit" aria-hidden="true"></div>
          </article>
        </section>
        <section v-if="page === 'Team'" class="team-section">
          <div class="team-banner">
            <span class="team-banner-icon"><Users :size="28" /></span>
            <div>
              <span class="panel-kicker">BETTER TOGETHER</span>
              <h2>Good people. Great work.</h2>
              <p>A shared view of the people behind your projects.</p>
            </div>
            <div class="team-banner-count">
              <strong>{{ team.length.toString().padStart(2, "0") }}</strong
              ><span>team members</span>
            </div>
          </div>
          <div class="team-grid">
            <article
              v-for="person in visibleTeam"
              :key="person.initials"
              class="card member-card"
              :class="'member-tone-' + person.color"
            >
              <div class="member-cover" aria-hidden="true">
                <i></i><i></i><i></i>
              </div>
              <span class="member-avatar" :class="person.color">{{
                person.initials
              }}</span>
              <h2>{{ person.name }}</h2>
              <p>{{ person.role }}</p>
              <span class="member-email">{{ person.email }}</span>
              <span class="badge green">Team member</span>
              <div class="member-assignment">
                <span>Assigned projects</span
                ><strong>{{
                  projects.filter((project) =>
                    project.members.includes(person.initials),
                  ).length
                }}</strong>
              </div>
              <div class="member-completion">
                <span>Completed assignments</span
                ><strong
                  >{{
                    projects.filter(
                      (project) =>
                        project.members.includes(person.initials) &&
                        project.status === "Completed",
                    ).length
                  }}
                  /
                  {{
                    projects.filter((project) =>
                      project.members.includes(person.initials),
                    ).length
                  }}</strong
                >
              </div>
              <progress
                class="member-progress"
                :value="
                  projects.filter(
                    (project) =>
                      project.members.includes(person.initials) &&
                      project.status === 'Completed',
                  ).length
                "
                :max="
                  projects.filter((project) =>
                    project.members.includes(person.initials),
                  ).length || 1
                "
                :aria-label="person.name + ' completed assignments'"
              ></progress>
            </article>
            <p v-if="!visibleTeam.length" class="empty-state">
              No team members found.
            </p>
          </div>
        </section>
        <SettingsView
          v-if="page === 'Settings'"
          v-model:name="workspaceName"
          :dark="dark"
          :dense="dense"
          :compact="compact"
          :content-width="contentWidth"
          :card-radius="cardRadius"
          :project-count="projects.length"
          :completed-count="completed"
          @save="saveSettings"
          @theme="setTheme"
          @density="dense = $event"
          @navigation="compact = $event"
          @width="contentWidth = $event"
          @radius="cardRadius = $event"
          @appearance="navigate('Appearance')"
        />
        <section v-if="page === 'Help'" class="help-grid">
          <div class="help-banner">
            <span><CircleHelp :size="28" /></span>
            <div>
              <span class="panel-kicker">A LITTLE GUIDANCE</span>
              <h2>Make yourself at home.</h2>
              <p>Quick answers to keep your work moving.</p>
            </div>
          </div>
          <details
            v-for="item in [
              {
                q: 'How do I create a project?',
                a: 'Select New project and enter its name, client, category, due date, and budget. It will appear at the top of the table and be saved in this browser.',
              },
              {
                q: 'Can I export projects?',
                a: 'Yes. Export creates a CSV file containing the projects matching your search and status filter.',
              },
              {
                q: 'Is this real data?',
                a: 'This workspace is a demo. Metrics and team members use sample data. No backend or authentication is connected.',
              },
              {
                q: 'Where are my changes saved?',
                a: 'Projects and preferences are stored locally in this browser. Clearing browser data removes your changes. They are not shared across devices.',
              },
            ]"
            :key="item.q"
            class="card"
          >
            <summary>{{ item.q }}<ChevronDown :size="18" /></summary>
            <p>{{ item.a }}</p>
          </details>
        </section>
        <footer class="main-footer">
          <span
            >© 2026 HLQuery<span class="footer-separator">·</span>Built to move
            forward.</span
          ><a :href="landingUrl">Website</a
          ><button @click="navigate('Help')">Help and resources</button
          ><span class="version">Workspace v2.1</span>
        </footer>
      </main>
    </div>
    <CommandPalette
      v-model="commandOpen"
      :projects="projects"
      @navigate="navigate"
      @project="openProject"
    />
    <v-dialog
      :model-value="!!selectedProject"
      max-width="540"
      @update:model-value="
        (value) => {
          if (!value) selectedProjectId = null;
        }
      "
      ><v-card v-if="selectedProject" class="project-detail-dialog"
        ><v-card-title class="dialog-title"
          ><div>
            <span class="panel-kicker">PROJECT DETAILS</span>
            <h2>{{ selectedProject.name }}</h2>
          </div>
          <v-btn
            icon
            size="small"
            variant="text"
            aria-label="Close project details"
            @click="selectedProjectId = null"
            ><X :size="19" /></v-btn></v-card-title
        ><v-card-text
          ><div class="project-detail-client">
            <span class="project-icon" :class="selectedProject.color">{{
              selectedProject.initials
            }}</span>
            <div>
              <strong>{{ selectedProject.client }}</strong
              ><small>{{ selectedProject.category }}</small>
            </div>
          </div>
          <dl class="invoice-details">
            <div>
              <dt>Due date</dt>
              <dd>{{ shortDate(selectedProject.date) }}</dd>
            </div>
            <div>
              <dt>Budget (CLP)</dt>
              <dd>{{ money(selectedProject.budget) }}</dd>
            </div>
            <div>
              <dt>Progress</dt>
              <dd>{{ selectedProject.progress }}%</dd>
            </div>
          </dl>
          <v-select
            :model-value="selectedProject.status"
            :items="['Pending', 'In progress', 'In review', 'Completed']"
            label="Project status"
            hide-details
            @update:model-value="
              (status) => moveProject({ id: selectedProject.id, status })
            "
          />
          <p class="settings-note mt-5">
            Project updates are saved in this browser.
          </p>
          <div class="dialog-actions">
            <v-btn color="primary" @click="selectedProjectId = null"
              >Done</v-btn
            >
          </div></v-card-text
        ></v-card
      ></v-dialog
    >
    <v-dialog v-model="modal" max-width="560" scrollable>
      <v-card class="project-dialog">
        <v-card-title class="dialog-title"
          ><div>
            <span class="panel-kicker">SOMETHING GREAT STARTS HERE</span>
            <h2>Start a new project</h2>
          </div>
          <v-btn
            variant="text"
            icon
            size="small"
            aria-label="Close project dialog"
            @click="modal = false"
            ><X :size="20" /></v-btn
        ></v-card-title>
        <v-card-text>
          <p class="dialog-intro">
            Give your team a clear starting point. You can build from here.
          </p>
          <form @submit.prevent="createProject">
            <v-text-field
              v-model="form.name"
              label="Project name"
              placeholder="e.g. Website redesign"
              required
              maxlength="80"
              pattern=".*\S.*"
              autofocus
            />
            <v-text-field
              v-model="form.client"
              label="Client"
              placeholder="Client name"
              required
              maxlength="60"
              pattern=".*\S.*"
            />
            <div class="dialog-form-row">
              <v-select
                v-model="form.category"
                label="Category"
                :items="[
                  'Web design',
                  'Development',
                  'Branding',
                  'Web application',
                ]"
              /><v-text-field
                v-model="form.date"
                label="Due date"
                type="date"
                required
              />
            </div>
            <v-text-field
              v-model.number="form.budget"
              label="Budget (CLP)"
              type="number"
              min="0"
              max="999999999999"
              required
            />
            <p class="settings-note">Saved locally in this browser.</p>
            <div class="dialog-actions">
              <v-btn variant="text" @click="modal = false">Cancel</v-btn
              ><v-btn color="primary" type="submit"
                ><Plus :size="17" class="mr-2" />Create project</v-btn
              >
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      :model-value="!!toast"
      :timeout="3800"
      color="primary"
      rounded="lg"
      @update:model-value="
        (value) => {
          if (!value) toast = '';
        }
      "
      ><Check :size="17" class="mr-2" />{{ toast
      }}<template #actions
        ><v-btn
          variant="text"
          aria-label="Dismiss notification"
          @click="toast = ''"
          ><X :size="17" /></v-btn></template
    ></v-snackbar>
  </v-app>
</template>
