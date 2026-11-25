<script setup>
import { computed, ref } from "vue";
import {
  ArrowUpRight,
  Activity,
  ChartColumn,
  CircleDot,
  Radar,
} from "lucide-vue-next";
import WorkspaceChart from "../components/WorkspaceChart.vue";
const props = defineProps({ projects: Array, dark: Boolean });
const period = ref("6 months");
const weekly = computed(() => period.value === "This week");
const labels = computed(() =>
  weekly.value
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
);
const revenue = computed(() => [
  {
    label: "Revenue",
    data: weekly.value
      ? [1.2, 1.8, 1.5, 2.3, 2, 3.1, 3.4]
      : [4.2, 6.8, 5.5, 8.4, 10.9, 12.45],
    borderColor: "#1976d3",
    backgroundColor: "#1976d314",
    fill: true,
  },
  {
    label: "Previous period",
    data: weekly.value
      ? [0.9, 1.2, 1.4, 1.6, 1.4, 2, 2.1]
      : [3.5, 4.5, 4.1, 6.9, 7.8, 9.3],
    borderColor: "#aeb9d2",
    borderDash: [5, 5],
  },
]);
const delivery = computed(() => [
  {
    label: "Completed",
    data: weekly.value ? [2, 4, 3, 6, 5, 2, 1] : [4, 6, 5, 8, 9, 11],
    backgroundColor: "#1976d3",
    maxBarThickness: 22,
  },
  {
    label: "Started",
    data: weekly.value ? [3, 5, 4, 5, 7, 3, 2] : [6, 7, 8, 10, 11, 14],
    backgroundColor: "#bbdefb",
    maxBarThickness: 22,
  },
]);
const statuses = ["In progress", "In review", "Completed", "Pending"];
const distribution = computed(() => [
  {
    label: "Projects",
    data: statuses.map(
      (s) => props.projects.filter((p) => p.status === s).length,
    ),
    backgroundColor: ["#1976d3", "#48b5eb", "#26bd9d", "#e5e9f2"],
    borderWidth: 0,
    hoverOffset: 8,
  },
]);
const capacity = [
  {
    label: "Current",
    data: [88, 72, 90, 65, 82],
    borderColor: "#1976d3",
    backgroundColor: "#1976d325",
    pointRadius: 3,
  },
  {
    label: "Target",
    data: [90, 85, 85, 85, 90],
    borderColor: "#26bd9d",
    backgroundColor: "#26bd9d10",
    borderDash: [4, 4],
    pointRadius: 0,
  },
];
</script>
<template>
  <div class="module-toolbar">
    <div>
      <span class="live-dot"></span><strong>Performance studio</strong
      ><span class="muted"> · Sample business metrics</span>
    </div>
    <v-select
      v-model="period"
      :items="['6 months', 'This week']"
      aria-label="Analytics period"
      hide-details
      class="period-select"
    />
  </div>
  <section class="analytics-grid">
    <article class="card analytics-panel wide-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">BUSINESS GROWTH</span>
          <h2>Revenue performance</h2>
          <p>Compare revenue with the previous period.</p>
        </div>
        <Activity :size="21" class="muted" />
      </div>
      <div class="analytics-value">
        <strong>{{ weekly ? "$15.3M" : "$48.25M" }}</strong
        ><span class="badge green"><ArrowUpRight :size="14" />18.6%</span
        ><small>USD · Sample data</small>
      </div>
      <WorkspaceChart
        :labels="labels"
        :datasets="revenue"
        :dark="dark"
        currency
        label="Sample revenue comparison by period, in millions of USD"
        :height="290"
      />
    </article>
    <article class="card analytics-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">WORK IN MOTION</span>
          <h2>Project distribution</h2>
          <p>Based on projects in this workspace.</p>
        </div>
        <CircleDot :size="21" class="muted" />
      </div>
      <WorkspaceChart
        type="doughnut"
        :labels="statuses"
        :datasets="distribution"
        :dark="dark"
        :label="`Status distribution of ${projects.length} workspace projects`"
        :height="330"
      />
      <p class="panel-footnote">
        {{ projects.length }} projects across {{ statuses.length }} stages
      </p>
    </article>
    <article class="card analytics-panel wide-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">DELIVERY MOMENTUM</span>
          <h2>From kickoff to done</h2>
          <p>Projects started and completed each period.</p>
        </div>
        <ChartColumn :size="21" class="muted" />
      </div>
      <WorkspaceChart
        type="bar"
        :labels="labels"
        :datasets="delivery"
        :dark="dark"
        label="Sample project starts and completions by period"
        :height="285"
      />
    </article>
    <article class="card analytics-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">TEAM HEALTH</span>
          <h2>A balanced workspace</h2>
          <p>Sample performance against your targets.</p>
        </div>
        <Radar :size="21" class="muted" />
      </div>
      <WorkspaceChart
        type="radar"
        :labels="[
          'Delivery',
          'Capacity',
          'Quality',
          'Planning',
          'Collaboration',
        ]"
        :datasets="capacity"
        :dark="dark"
        label="Sample team performance compared with targets across five dimensions"
        :height="285"
      />
    </article>
  </section>
</template>
