<script setup>
import { ref, watch, nextTick } from "vue";
import draggable from "vuedraggable";
import { useMediaQuery } from "@vueuse/core";
import {
  GripVertical,
  CalendarDays,
  Plus,
  ArrowRight,
  Columns3,
} from "lucide-vue-next";
const props = defineProps({ projects: Array });
const emit = defineEmits(["update", "move", "create", "open"]);
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const statuses = ["Pending", "In progress", "In review", "Completed"];
const lanes = ref([]);
watch(
  () => props.projects,
  (projects) => {
    lanes.value = statuses.map((status) => ({
      status,
      items: projects.filter((p) => p.status === status).map((p) => ({ ...p })),
    }));
  },
  { immediate: true, deep: true },
);
async function onDrop() {
  await nextTick();
  emit(
    "update",
    lanes.value.flatMap((lane) =>
      lane.items.map((project) => ({ ...project, status: lane.status })),
    ),
  );
}
const date = (value) =>
  value
    ? new Date(value + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "No date";
</script>
<template>
  <div class="board-intro">
    <span><Columns3 :size="16" />A little structure. A lot of momentum.</span
    ><span class="muted"
      >Drag by the handle, or use “Move to” on any card.</span
    >
  </div>
  <div class="kanban-scroll">
    <div class="kanban-board">
      <section
        v-for="(lane, i) in lanes"
        :key="lane.status"
        class="kanban-lane"
        :aria-label="lane.status"
      >
        <header class="lane-heading">
          <span class="lane-dot" :class="`lane-tone-${i}`"></span>
          <h2>{{ lane.status }}</h2>
          <span class="lane-count">{{ lane.items.length }}</span>
        </header>
        <draggable
          v-model="lane.items"
          group="projects"
          item-key="id"
          :animation="reducedMotion ? 0 : 180"
          handle=".drag-handle"
          ghost-class="kanban-ghost"
          chosen-class="kanban-chosen"
          class="kanban-dropzone"
          :aria-label="`${lane.status} projects`"
          @end="onDrop"
        >
          <template #item="{ element: project }">
            <article class="kanban-card" :data-project-id="project.id">
              <div class="kanban-card-top">
                <span class="kanban-category">{{ project.category }}</span
                ><span
                  class="drag-handle"
                  title="Drag to move project"
                  aria-hidden="true"
                  ><GripVertical :size="16"
                /></span>
              </div>
              <h3>
                <button @click="emit('open', project.id)">
                  {{ project.name }}
                </button>
              </h3>
              <p>{{ project.client }}</p>
              <div class="kanban-progress">
                <span
                  >Progress <strong>{{ project.progress }}%</strong></span
                >
                <div>
                  <i
                    :style="{ width: project.progress + '%' }"
                    :class="{ 'is-completed': project.status === 'Completed' }"
                  ></i>
                </div>
              </div>
              <div class="kanban-card-bottom">
                <span class="kanban-members"
                  ><span
                    v-for="member in project.members.slice(0, 3)"
                    :key="member"
                    >{{ member }}</span
                  ></span
                ><span
                  ><CalendarDays :size="12" />{{ date(project.date) }}</span
                >
              </div>
              <v-select
                :model-value="lane.status"
                :items="statuses"
                :label="`Move ${project.name} to`"
                density="compact"
                variant="outlined"
                hide-details
                class="board-move-select"
                @update:model-value="
                  (status) => emit('move', { id: project.id, status })
                "
              />
            </article>
          </template>
          <template #footer
            ><div v-if="!lane.items.length" class="lane-empty">
              <ArrowRight :size="18" /><span>Room for what’s next.</span
              ><small>Move a project into this stage.</small>
            </div></template
          >
        </draggable>
        <button class="lane-add" @click="emit('create')">
          <Plus :size="14" />New project
        </button>
      </section>
    </div>
  </div>
  <p class="board-note">
    Changes are saved in this browser and reflected in the project list, charts,
    and calendar.
  </p>
</template>
