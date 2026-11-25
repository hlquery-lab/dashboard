<script setup>
import { money } from "../utils/currency.js";
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { Search, Plus, Download, Flag, NotebookPen, Files, UsersRound, Trash2, ArrowUpRight } from "lucide-vue-next";
const props = defineProps({ page: String, projects: Array });
const emit = defineEmits(["open"]);
const search = ref("");
const title = ref("");
const body = ref("");
const notes = useStorage("hlquery-workspace-notes", []);
const filteredProjects = computed(() => props.projects.filter(p => `${p.name} ${p.client}`.toLowerCase().includes(search.value.toLowerCase())));
const milestones = computed(() => [...filteredProjects.value].sort((a, b) => a.date.localeCompare(b.date)));
const members = computed(() => [...new Set(props.projects.flatMap(p => p.members))].sort().map(initials => ({
  initials,
  projects: props.projects.filter(p => p.members.includes(initials)),
  active: props.projects.filter(p => p.members.includes(initials) && p.status !== "Completed"),
})).filter(member => `${member.initials} ${member.projects.map(p => p.name).join(" ")}`.toLowerCase().includes(search.value.toLowerCase())));
const visibleNotes = computed(() => notes.value.filter(n => `${n.title} ${n.body}`.toLowerCase().includes(search.value.toLowerCase())));
const count = computed(() => props.page === "Notes" ? notes.value.length : props.page === "Workload" ? members.value.length : props.projects.length);
const icons = { Milestones: Flag, Notes: NotebookPen, Files, Workload: UsersRound };
function addNote() {
  if (!title.value.trim()) return;
  notes.value.unshift({ id: crypto.randomUUID(), title: title.value.trim(), body: body.value.trim() });
  title.value = "";
  body.value = "";
  search.value = "";
}
function download(project) {
  const content = `${project.name}\nClient: ${project.client}\nStatus: ${project.status}\nProgress: ${project.progress}%\nDue date: ${project.date}\nTeam: ${project.members.join(", ")}\nBudget (USD): ${money(project.budget)}\n`;
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-summary.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
</script>
<template>
  <section class="resource-view" :aria-label="page">
    <div class="resource-toolbar card">
      <div class="resource-heading"><span class="resource-symbol"><component :is="icons[page]" :size="21" /></span><div><h2>{{ page === 'Files' ? 'Project summaries' : page === 'Workload' ? 'Team assignments' : page }}</h2><p>{{ count }} {{ page === 'Notes' ? 'saved notes' : page === 'Workload' ? 'team members' : 'projects in your workspace' }}</p></div></div>
      <label class="resource-search"><Search :size="16" /><input v-model="search" :aria-label="`Search ${page.toLowerCase()}`" placeholder="Search…" type="search" /></label>
    </div>
    <form v-if="page === 'Notes'" class="note-composer card" @submit.prevent="addNote">
      <label for="note-title">Capture an idea</label>
      <input id="note-title" v-model="title" placeholder="Note title" required maxlength="160" />
      <textarea v-model="body" aria-label="Note content" placeholder="Ideas, meeting notes, or something to remember…" rows="3" maxlength="10000"></textarea>
      <button class="button primary" type="submit" :disabled="!title.trim()"><Plus :size="16" /> Save note</button>
    </form>
    <div v-if="page === 'Notes'" class="resource-grid">
      <article v-for="note in visibleNotes" :key="note.id" class="resource-card card note-card"><NotebookPen :size="20" /><h3>{{ note.title }}</h3><p>{{ note.body }}</p><button class="note-delete" :aria-label="`Delete note: ${note.title}`" @click="notes = notes.filter(n => n.id !== note.id)"><Trash2 :size="16" /></button></article>
      <div v-if="!visibleNotes.length" class="resource-empty card"><NotebookPen :size="28" /><h3>{{ search ? 'No matching notes' : 'Room for your next idea' }}</h3><p>{{ search ? 'Try a different search.' : 'Write your first note above. It will be here when you return.' }}</p></div>
    </div>
    <div v-else-if="page === 'Workload'" class="resource-grid">
      <article v-for="member in members" :key="member.initials" class="resource-card card"><div class="member-top"><span class="member-avatar">{{ member.initials }}</span><span class="resource-pill">{{ member.active.length }} active</span></div><h3>Team member {{ member.initials }}</h3><p>{{ member.projects.length }} assigned projects · {{ member.projects.length - member.active.length }} completed</p><div class="assignment-list"><button v-for="project in member.projects" :key="project.id" @click="emit('open', project)"><span>{{ project.name }}</span><ArrowUpRight :size="14" /></button></div></article>
      <p v-if="!members.length" class="resource-empty card">No team members match your search.</p>
    </div>
    <div v-else class="resource-list card">
      <article v-for="project in page === 'Milestones' ? milestones : filteredProjects" :key="project.id" class="resource-row"><span class="resource-symbol"><component :is="icons[page]" :size="19" /></span><div class="resource-project"><button @click="emit('open', project)">{{ project.name }}</button><p>{{ project.client }} · {{ page === 'Milestones' ? `Due ${project.date}` : 'Project summary · TXT' }}</p></div><div v-if="page === 'Milestones'" class="milestone-progress"><span>{{ project.status }} · {{ project.progress }}%</span><progress :value="project.progress" max="100" :aria-label="`${project.name} progress`"></progress></div><button v-else class="button" :aria-label="`Download ${project.name} summary`" @click="download(project)"><Download :size="16" /><span>Download</span></button></article>
      <p v-if="!filteredProjects.length" class="resource-empty">No projects match your search.</p>
    </div>
  </section>
</template>
<style scoped>
.resource-view { display: grid; gap: 22px; }
.resource-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px; }
.resource-heading, .resource-row, .member-top { display: flex; align-items: center; gap: 14px; }
.resource-heading h2 { font-size: 15px; font-weight: 650; }
.resource-view p { color: var(--muted); font-size: 12px; line-height: 1.7; margin: 5px 0 0; }
.resource-symbol { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; color: var(--primary); background: var(--primary-soft); flex-shrink: 0; }
.resource-search { display: flex; flex-direction: row; margin: 0; align-items: center; gap: 9px; color: var(--muted); border: 1px solid var(--line); border-radius: 9px; padding: 10px 12px; }
.resource-search input { border: 0; background: transparent; padding: 0; margin: 0; min-height: 0; border-radius: 0; box-shadow: none; min-width: 0; width: 180px; outline: none; font-size: 12px; color: var(--text); }
.resource-search:focus-within { outline: 2px solid var(--primary); }
.resource-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 18px; }
.resource-card { padding: 23px; min-width: 0; position: relative; }
.resource-card h3 { font-size: 14px; margin-top: 18px; overflow-wrap: anywhere; }
.note-card > svg { color: var(--primary); }
.note-card p { white-space: pre-wrap; overflow-wrap: anywhere; }
.note-card h3 { padding-right: 22px; }
.note-delete { position: absolute; right: 16px; top: 18px; color: var(--muted); padding: 8px; border-radius: 7px; }
.note-delete:hover { background: var(--primary-soft); color: var(--primary); }
.note-composer { padding: 23px; display: grid; gap: 13px; }
.note-composer label { font-size: 14px; font-weight: 650; }
.note-composer input, .note-composer textarea { border: 1px solid var(--line); border-radius: 8px; padding: 12px; color: var(--text); font: inherit; font-size: 13px; width: 100%; background: var(--canvas); }
.note-composer textarea { resize: vertical; }
.note-composer button { justify-self: end; }
.note-composer button:disabled { opacity: .5; cursor: default; }
.resource-empty { grid-column: 1 / -1; text-align: center; padding: 44px 20px; color: var(--muted); }
.resource-empty > svg { margin: 0 auto 10px; }
.resource-empty h3 { font-size: 15px; color: var(--text); }
.member-top { justify-content: space-between; }
.member-avatar { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: var(--primary-soft); color: var(--primary); font-weight: 650; font-size: 13px; }
.resource-pill { font-size: 11px; padding: 5px 9px; background: var(--primary-soft); color: var(--primary); border-radius: 20px; }
.assignment-list { display: grid; gap: 7px; margin-top: 20px; }
.assignment-list button { display: flex; align-items: center; justify-content: space-between; gap: 10px; text-align: left; color: var(--text); border-top: 1px solid var(--line); padding: 10px 0 3px; font-size: 12px; }
.assignment-list span { overflow-wrap: anywhere; min-width: 0; }
.assignment-list svg { flex-shrink: 0; color: var(--muted); }
.resource-row { padding: 21px 23px; }
.resource-row + .resource-row { border-top: 1px solid var(--line); }
.resource-project { flex: 1; min-width: 0; }
.resource-project button { text-align: left; color: var(--text); font-weight: 600; font-size: 13px; overflow-wrap: anywhere; }
.resource-project button:hover, .assignment-list button:hover { color: var(--primary); }
.milestone-progress { display: grid; gap: 8px; width: 160px; font-size: 11px; color: var(--muted); }
.milestone-progress progress { width: 100%; height: 5px; accent-color: var(--primary); }
@media (max-width: 700px) { .resource-toolbar { align-items: stretch; flex-direction: column; } .resource-search input { width: 100%; } .resource-row { flex-wrap: wrap; padding: 18px; } .milestone-progress { width: 100%; margin-left: 56px; } .resource-row .button { margin-left: 56px; } }
</style>
