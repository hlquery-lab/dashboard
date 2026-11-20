import {
  LayoutDashboard,
  FolderKanban,
  ChartNoAxesCombined,
  Users,
  CreditCard,
  Settings2,
  CircleHelp,
  Columns3,
  CalendarDays,
  Activity,
  Palette,
  FileChartColumn,
  Receipt,
  Wallet,
} from "lucide-vue-next";
export const navigation = [
  {
    section: "WORKSPACE",
    items: [
      { label: "Overview", page: "Overview", icon: LayoutDashboard },
      {
        label: "Projects",
        id: "projects",
        icon: FolderKanban,
        children: [
          {
            label: "All projects",
            page: "Projects",
            icon: FolderKanban,
            description: "Search, filter, and manage your projects",
          },
          {
            label: "Board view",
            page: "Board",
            icon: Columns3,
            description: "Move work through every stage",
          },
          {
            label: "Calendar",
            page: "Calendar",
            icon: CalendarDays,
            description: "Plan around project deadlines",
          },
        ],
      },
      {
        label: "Analytics",
        id: "analytics",
        icon: ChartNoAxesCombined,
        children: [
          {
            label: "Performance report",
            page: "Reports",
            icon: FileChartColumn,
            description: "Review business performance and export data",
          },
          {
            label: "Chart gallery",
            page: "Charts",
            icon: ChartNoAxesCombined,
            description: "Explore interactive business charts",
          },
        ],
      },
      {
        label: "Workspace",
        id: "workspace",
        icon: Users,
        children: [
          {
            label: "Team members",
            page: "Team",
            icon: Users,
            description: "The people behind the projects",
          },
          {
            label: "Activity feed",
            page: "Activity",
            icon: Activity,
            description: "Follow updates across your workspace",
          },
        ],
      },
      {
        label: "Billing",
        id: "billing",
        icon: CreditCard,
        children: [
          {
            label: "Invoices",
            page: "Billing",
            icon: Receipt,
            description: "Review and download sample invoices",
          },
          {
            label: "Payments",
            page: "Payments",
            icon: Wallet,
            description: "See sample payments received",
          },
        ],
      },
    ],
  },
  {
    section: "PREFERENCES",
    items: [
      {
        label: "Settings",
        id: "settings",
        icon: Settings2,
        children: [
          {
            label: "General",
            page: "Settings",
            icon: Settings2,
            description: "Workspace name and preferences",
          },
          {
            label: "Appearance",
            page: "Appearance",
            icon: Palette,
            description: "Theme, density, and navigation",
          },
        ],
      },
      {
        label: "Help center",
        page: "Help",
        icon: CircleHelp,
        description: "Find your way around the demo",
      },
    ],
  },
];
export const navigationPages = navigation.flatMap((section) =>
  section.items.flatMap((item) => item.children || [item]),
);
export const pageGroups = Object.fromEntries(
  navigation.flatMap((section) =>
    section.items.flatMap((item) =>
      (item.children || []).map((child) => [child.page, item.label]),
    ),
  ),
);
