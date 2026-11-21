<script setup>
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import {
  Plus,
  Search,
  CheckCheck,
  Target,
  FolderKanban,
  ArrowUpRight,
  ContactRound,
  ListTodo,
} from "lucide-vue-next";
const props = defineProps({ page: String, projects: Array });
const emit = defineEmits(["open"]);
const search = ref("");
const taskTitle = ref("");
const filter = ref("All tasks");
const tasks = useStorage("hlquery-personal-tasks", [
  {
    id: "brief",
    title: "Review the platform redesign brief",
    done: false,
    priority: "High",
  },
  {
    id: "feedback",
    title: "Send feedback on the sales dashboard",
    done: false,
    priority: "High",
  },
  {
    id: "planning",
    title: "Plan next week’s project milestones",
    done: false,
    priority: "Normal",
  },
  {
    id: "brand",
    title: "Approve the brand identity handoff",
    done: true,
    priority: "Normal",
  },
]);
const done = computed(() => tasks.value.filter((task) => task.done).length);
const visibleTasks = computed(() =>
  tasks.value.filter(
    (task) =>
      (filter.value === "All tasks" ||
        (filter.value === "Completed" ? task.done : !task.done)) &&
      task.title.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
const clients = computed(() =>
  [...new Set(props.projects.map((project) => project.client))].map((name) => {
    const projects = props.projects.filter(
      (project) => project.client === name,
    );
    return {
      name,
      projects,
      initials: projects[0].initials,
      budget: projects.reduce((sum, project) => sum + project.budget, 0),
      progress: Math.round(
        projects.reduce((sum, project) => sum + project.progress, 0) /
          projects.length,
      ),
    };
  }),
);
const visibleClients = computed(() =>
  clients.value.filter((client) =>
    client.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
const completed = computed(
  () =>
    props.projects.filter((project) => project.status === "Completed").length,
);
const progress = computed(() =>
  props.projects.length
    ? Math.round(
        props.projects.reduce((sum, project) => sum + project.progress, 0) /
          props.projects.length,
      )
    : 0,
);
const budget = computed(() =>
  props.projects.reduce((sum, project) => sum + project.budget, 0),
);
const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
const goals = computed(() => [
  {
    name: "Deliver the portfolio",
    description: "Complete every project in the current workspace.",
    value: completed.value,
    target: props.projects.length,
    percent: props.projects.length
      ? Math.round((completed.value / props.projects.length) * 100)
      : 0,
    unit: "projects delivered",
    icon: FolderKanban,
  },
  {
    name: "Move every project forward",
    description: "Bring average project progress to 100%.",
    value: progress.value,
    target: 100,
    percent: progress.value,
    unit: "average progress",
    icon: Target,
  },
  {
    name: "Clear your checklist",
    description: "Complete the tasks on your personal list.",
    value: done.value,
    target: tasks.value.length,
    percent: tasks.value.length
      ? Math.round((done.value / tasks.value.length) * 100)
      : 0,
    unit: "tasks completed",
    icon: CheckCheck,
  },
]);
function addTask() {
  const title = taskTitle.value.trim();
  if (!title) return;
  tasks.value.push({
    id: crypto.randomUUID(),
    title,
    done: false,
    priority: "Normal",
  });
  taskTitle.value = "";
  filter.value = "All tasks";
  search.value = "";
}
</script>

<template>
  <div class="productivity-view">
    <section class="productivity-stats" aria-label="Page metrics">
      <article class="card">
        <span class="productivity-stat-icon"
          ><component
            :is="
              page === 'Clients'
                ? ContactRound
                : page === 'Goals'
                  ? Target
                  : ListTodo
            "
            :size="20"
        /></span>
        <div>
          <p>
            {{
              page === "Clients"
                ? "Client relationships"
                : page === "Goals"
                  ? "Goals in focus"
                  : "Total tasks"
            }}
          </p>
          <strong>{{
            page === "Clients"
              ? clients.length
              : page === "Goals"
                ? goals.length
                : tasks.length
          }}</strong>
        </div>
      </article>
      <article class="card">
        <span class="productivity-stat-icon tone-green"
          ><CheckCheck :size="20"
        /></span>
        <div>
          <p>
            {{ page === "Tasks" ? "Tasks completed" : "Projects delivered" }}
          </p>
          <strong
            >{{ page === "Tasks" ? done : completed
            }}<small>
              / {{ page === "Tasks" ? tasks.length : projects.length }}</small
            ></strong
          >
        </div>
      </article>
      <article class="card">
        <span class="productivity-stat-icon tone-violet"
          ><ArrowUpRight :size="20"
        /></span>
        <div>
          <p>
            {{
              page === "Clients"
                ? "Portfolio budget"
                : "Average project progress"
            }}
          </p>
          <strong>{{
            page === "Clients" ? money(budget) : progress + "%"
          }}</strong>
        </div>
      </article>
    </section>

    <section v-if="page === 'Tasks'" class="card productivity-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">MAKE ROOM FOR PROGRESS</span>
          <h2>Your next steps</h2>
          <p>A personal checklist, saved in this browser.</p>
        </div>
        <span class="productivity-pill"
          >{{ tasks.length - done }} remaining</span
        >
      </div>
      <form class="task-create" @submit.prevent="addTask">
        <input
          v-model="taskTitle"
          aria-label="New task"
          placeholder="What needs to get done?"
          maxlength="160"
          required
        /><button
          class="button primary"
          type="submit"
          :disabled="!taskTitle.trim()"
        >
          <Plus :size="16" /> Add task
        </button>
      </form>
      <div class="productivity-toolbar">
        <label class="productivity-search"
          ><Search :size="16" /><input
            v-model="search"
            aria-label="Search tasks"
            placeholder="Search tasks…" /></label
        ><select v-model="filter" aria-label="Filter tasks">
          <option>All tasks</option>
          <option>Open</option>
          <option>Completed</option>
        </select>
      </div>
      <div class="task-list">
        <label
          v-for="task in visibleTasks"
          :key="task.id"
          class="task-row"
          :class="{ 'task-done': task.done }"
          ><input
            v-model="task.done"
            type="checkbox"
            :aria-label="task.title"
          /><span>{{ task.title }}</span
          ><small :class="{ 'priority-high': task.priority === 'High' }">{{
            task.priority
          }}</small></label
        >
        <p v-if="!visibleTasks.length" class="productivity-empty">
          No tasks match this view.
        </p>
      </div>
    </section>

    <template v-else-if="page === 'Clients'">
      <div class="productivity-toolbar">
        <label class="productivity-search"
          ><Search :size="16" /><input
            v-model="search"
            aria-label="Search clients"
            placeholder="Search clients…" /></label
        ><span class="muted">From your workspace projects</span>
      </div>
      <div class="client-grid">
        <article
          v-for="client in visibleClients"
          :key="client.name"
          class="card client-card"
        >
          <div class="client-heading">
            <span class="client-avatar">{{ client.initials }}</span
            ><span class="productivity-pill"
              >{{ client.projects.length }}
              {{ client.projects.length === 1 ? "project" : "projects" }}</span
            >
          </div>
          <h2>{{ client.name }}</h2>
          <p>
            Portfolio budget <strong>{{ money(client.budget) }}</strong>
          </p>
          <div class="goal-label">
            <span>Project progress</span><strong>{{ client.progress }}%</strong>
          </div>
          <div class="productivity-track">
            <i :style="{ width: client.progress + '%' }"></i>
          </div>
          <button
            v-for="project in client.projects"
            :key="project.id"
            class="client-project"
            @click="emit('open', project)"
          >
            <FolderKanban :size="15" /><span>{{ project.name }}</span
            ><ArrowUpRight :size="15" />
          </button>
        </article>
      </div>
      <p v-if="!visibleClients.length" class="productivity-empty">
        No clients match your search.
      </p>
    </template>

    <template v-else>
      <div class="goals-intro">
        <span class="productivity-stat-icon"><Target :size="22" /></span>
        <div>
          <h2>A clear direction. Measurable progress.</h2>
          <p>
            These goals update as you complete tasks and move projects forward.
          </p>
        </div>
        <span class="productivity-pill">Workspace goals</span>
      </div>
      <div class="goals-grid">
        <article v-for="goal in goals" :key="goal.name" class="card goal-card">
          <div class="client-heading">
            <span class="productivity-stat-icon"
              ><component :is="goal.icon" :size="21" /></span
            ><span
              class="productivity-pill"
              :class="{ 'goal-complete': goal.percent === 100 }"
              >{{ goal.percent === 100 ? "Achieved" : "In progress" }}</span
            >
          </div>
          <h2>{{ goal.name }}</h2>
          <p>{{ goal.description }}</p>
          <div class="goal-number">
            {{ goal.value }}<small> / {{ goal.target }}</small>
          </div>
          <div class="goal-label">
            <span>{{ goal.unit }}</span
            ><strong>{{ goal.percent }}%</strong>
          </div>
          <div class="productivity-track">
            <i :style="{ width: goal.percent + '%' }"></i>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.productivity-stats,
.client-grid,
.goals-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 24px;
}
.productivity-stats article {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
}
.productivity-stat-icon {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
  flex-shrink: 0;
}
.tone-green {
  background: #19a67515;
  color: #19a675;
}
.tone-violet {
  background: #805ad515;
  color: #9565db;
}
.productivity-stats p,
.client-card p,
.goal-card p,
.goals-intro p {
  font-size: 12px;
  color: var(--muted);
  margin: 0 0 8px;
}
.productivity-stats strong {
  font-size: 25px;
  letter-spacing: -0.04em;
  font-weight: 650;
}
.productivity-stats small,
.goal-number small {
  font-size: 15px;
  color: var(--muted);
  font-weight: 450;
}
.productivity-panel {
  overflow: hidden;
}
.productivity-pill {
  font-size: 10px;
  font-weight: 600;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 5px;
  padding: 5px 9px;
  white-space: nowrap;
}
.task-create,
.productivity-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
}
.task-create {
  padding: 0 24px 24px;
}
.task-create > input {
  flex: 1;
  min-width: 0;
}
.task-create input,
.productivity-search,
.productivity-toolbar select {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  padding: 11px 13px;
  font: inherit;
  font-size: 12px;
}
.productivity-toolbar {
  justify-content: space-between;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.productivity-panel .productivity-toolbar {
  padding: 18px 24px;
  margin: 0;
  background: var(--hover);
  border-block: 1px solid var(--line);
}
.productivity-search {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
}
.productivity-search input {
  background: transparent;
  border: 0;
  color: var(--text);
  font: inherit;
  min-width: 0;
  width: 100%;
}
.task-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 21px 24px;
  cursor: pointer;
}
.task-row + .task-row {
  border-top: 1px solid var(--line);
}
.task-row input {
  width: 17px;
  height: 17px;
  accent-color: var(--primary);
  flex-shrink: 0;
}
.task-row > span {
  flex: 1;
  font-size: 13px;
}
.task-row small {
  font-size: 10px;
  color: var(--muted);
  padding: 4px 8px;
  border-radius: 5px;
  background: var(--hover);
}
.task-row .priority-high {
  background: #f59e0b12;
  color: #bb7e0e;
}
.task-done > span {
  text-decoration: line-through;
  color: var(--muted);
}
.productivity-empty {
  text-align: center;
  padding: 36px;
  color: var(--muted);
}
.client-card,
.goal-card {
  padding: 25px;
}
.client-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}
.client-avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 15px;
  font-weight: 700;
}
.client-card h2,
.goal-card h2,
.goals-intro h2 {
  font-size: 16px;
  font-weight: 650;
  margin-bottom: 8px;
}
.client-card p strong {
  display: block;
  color: var(--text);
  font-size: 18px;
  margin-top: 8px;
  font-weight: 600;
}
.goal-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--muted);
  margin: 22px 0 9px;
}
.goal-label strong {
  color: var(--text);
}
.productivity-track {
  height: 6px;
  background: var(--primary-soft);
  border-radius: 8px;
  overflow: hidden;
}
.productivity-track i {
  display: block;
  height: 100%;
  background: var(--primary);
  border-radius: 8px;
}
.client-project {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 9px;
  text-align: left;
  margin-top: 20px;
  padding-top: 17px;
  border-top: 1px solid var(--line);
  color: var(--primary);
  font-size: 12px;
}
.client-project span {
  flex: 1;
}
.goals-intro {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 0 30px;
}
.goals-intro > div {
  flex: 1;
}
.goals-intro p {
  margin: 0;
}
.goal-card p {
  line-height: 1.8;
  min-height: 44px;
}
.goal-number {
  font-size: 40px;
  font-weight: 650;
  letter-spacing: -0.05em;
  margin-top: 27px;
}
.goal-complete {
  color: #19a675;
  background: #19a67515;
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
input:focus-visible,
select:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
@media (max-width: 1200px) {
  .productivity-stats,
  .client-grid,
  .goals-grid {
    gap: 14px;
  }
  .productivity-stats article {
    padding: 18px;
    gap: 12px;
  }
  .productivity-stats strong {
    font-size: 20px;
  }
  .client-grid,
  .goals-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 700px) {
  .productivity-stats,
  .client-grid,
  .goals-grid {
    grid-template-columns: 1fr;
  }
  .productivity-stats {
    gap: 10px;
  }
  .task-create {
    padding-inline: 16px;
    gap: 9px;
  }
  .task-create .button {
    padding-inline: 10px;
  }
  .task-row {
    padding: 18px 16px;
  }
  .goals-intro {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .productivity-search {
    flex: 1;
    min-width: 0;
  }
  .productivity-toolbar > .muted {
    font-size: 11px;
  }
}
</style>
