import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  Users,
  ChartNoAxesCombined,
  TicketPercent,
  Receipt,
  Wallet,
  Settings2,
  Palette,
  CircleHelp,
  Truck,
  Activity,
} from "lucide-vue-next";
export const navigation = [
  {
    section: "STORE",
    items: [
      {
        label: "Overview",
        page: "Overview",
        icon: LayoutDashboard,
        description: "Your store performance at a glance",
      },
      {
        label: "Orders",
        id: "orders",
        icon: ShoppingBag,
        children: [
          {
            label: "All orders",
            page: "Orders",
            icon: ShoppingBag,
            description: "Manage customer orders and payments",
          },
          {
            label: "Fulfillment",
            page: "Fulfillment",
            icon: Truck,
            description: "Prepare paid orders for shipping",
          },
        ],
      },
      {
        label: "Catalog",
        id: "catalog",
        icon: Package,
        children: [
          {
            label: "Products",
            page: "Products",
            icon: Package,
            description: "Manage your product catalog and pricing",
          },
          {
            label: "Inventory",
            page: "Inventory",
            icon: Boxes,
            description: "Track stock levels and restock products",
          },
        ],
      },
      {
        label: "Customers",
        page: "Customers",
        icon: Users,
        description: "Customer profiles and purchase history",
      },
    ],
  },
  {
    section: "GROWTH",
    items: [
      {
        label: "Analytics",
        page: "Analytics",
        icon: ChartNoAxesCombined,
        description: "Sales, best sellers, and channel reports",
      },
      {
        label: "Discounts",
        page: "Discounts",
        icon: TicketPercent,
        description: "Create and manage promotional codes",
      },
    ],
  },
  {
    section: "FINANCES",
    items: [
      {
        label: "Invoices",
        page: "Invoices",
        icon: Receipt,
        description: "Download order invoices in USD",
      },
      {
        label: "Payments",
        page: "Payments",
        icon: Wallet,
        description: "Review paid, pending, and refunded orders",
      },
      {
        label: "Activity",
        page: "Activity",
        icon: Activity,
        description: "Recent order and inventory updates",
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
            description: "Store details and preferences",
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
        description: "How to use your ecommerce demo",
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
      (item.children || [item]).map((child) => [
        child.page,
        item.children ? item.label : section.section,
      ]),
    ),
  ),
);
