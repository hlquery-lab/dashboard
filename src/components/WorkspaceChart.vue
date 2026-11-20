<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  RadarController,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
);
const props = defineProps({
  type: { type: String, default: "line" },
  labels: Array,
  datasets: Array,
  dark: Boolean,
  label: String,
  height: { type: Number, default: 270 },
  currency: Boolean,
});
const canvas = ref(null);
let chart;
function render() {
  chart?.destroy();
  if (!canvas.value) return;
  const text = props.dark ? "#a7b2ca" : "#7d879e";
  const grid = props.dark ? "#ffffff0d" : "#2436560c";
  const cartesian = ["line", "bar"].includes(props.type);
  chart = new Chart(canvas.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets.map((d) => ({
        tension: 0.38,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderRadius: 5,
        ...d,
        data: [...d.data],
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 450,
      },
      interaction: {
        mode: props.type === "doughnut" ? "nearest" : "index",
        intersect: false,
      },
      cutout: "76%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: text,
            usePointStyle: true,
            boxWidth: 7,
            boxHeight: 7,
            padding: 22,
            font: { family: "Inter, sans-serif", size: 11 },
          },
        },
        tooltip: {
          backgroundColor: "#182230",
          padding: 12,
          cornerRadius: 10,
          callbacks: props.currency
            ? { label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y}M CLP` }
            : {},
        },
      },
      scales: cartesian
        ? {
            x: {
              grid: { display: false },
              border: { display: false },
              ticks: { color: text, font: { size: 11 } },
            },
            y: {
              beginAtZero: true,
              grid: { color: grid },
              border: { display: false, dash: [4, 4] },
              ticks: {
                color: text,
                maxTicksLimit: 5,
                callback: (v) => (props.currency ? `$${v}M` : v),
              },
            },
          }
        : props.type === "radar"
          ? {
              r: {
                grid: { color: grid },
                angleLines: { color: grid },
                pointLabels: { color: text },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100,
              },
            }
          : {},
    },
  });
}
onMounted(render);
watch(() => [props.type, props.labels, props.datasets, props.dark], render, {
  deep: true,
});
onBeforeUnmount(() => chart?.destroy());
</script>
<template>
  <div class="interactive-chart" :style="{ height: height + 'px' }">
    <canvas ref="canvas" role="img" :aria-label="label">{{ label }}</canvas>
  </div>
</template>
<style scoped>
.interactive-chart {
  position: relative;
  width: 100%;
  min-width: 0;
}
</style>
