<template>
  <div>
    <div class="flex items-center justify-between relative my-16 m-2">
      <input
        placeholder="Add new item..."
        type="text"
        v-model="state.newTask"
        @keyup.enter="addTask"
        class="p-4 pr-20 border-l-4 border-gray-500 bg-gray-200 w-full shadow-inner outline-none"
      />
      <button
        class="shadow text-blue-100 hover:text-blue-200 bg-gray-500 font-semibold py-2 px-4 absolute right-0 mr-2 focus:outline-none"
        @click="addTask"
      >
        Add
      </button>
    </div>

    <div class="flex justify-between">
      <button
        @click="state.filter = 'all'"
        :class="{ 'font-bold bg-gray-300': state.filter === 'all' }"
        class="focus:outline-none rounded-full px-3 py-1 mr-2"
      >
        All
      </button>
      <button
        :class="{ 'font-bold bg-gray-300': state.filter === 'pending' }"
        @click="state.filter = 'pending'"
        class="focus:outline-none rounded-full px-3 py-1 mr-2"
      >
        Pending
      </button>
      <button
        :class="{ 'font-bold bg-gray-300': state.filter === 'done' }"
        @click="state.filter = 'done'"
        class="focus:outline-none rounded-full px-3 py-1 mr-2"
      >
        Done
      </button>
    </div>

    <div class="ml-6 flex justify-between">
      <label class="flex justify-start items-center">
        <div
          class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
        >
          <input
            @change="checkAll"
            type="checkbox"
            class="opacity-0 absolute"
          />
          <svg
            class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none"
            viewBox="0 0 20 20"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </div>
        <div class="select-none ml-2 text-xs">Check All</div>
      </label>
    </div>

    <ul class="m-0 my-4 p-0 list-none w-full">
      <li
        v-for="task in filteredCollection"
        :key="task.name"
        class="bg-white shadow m-2 p-4 flex items-center justify-between"
      >
        <label class="flex justify-start items-center">
          <div
            class="bg-white border-2 rounded border-gray-400 w-6 h-6 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500"
          >
            <input
              type="checkbox"
              class="opacity-0 absolute"
              v-model="task.done"
            />
            <svg
              class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none"
              viewBox="0 0 20 20"
            >
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          </div>

          <div class="select-none ml-2">{{ task.name }}</div>
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, computed} from "vue";
import ky from "ky";
import Kretes from 'kretes';

type Filter = "all" | "pending" | "done";

interface Task {
  name: string;
  done: boolean;
}

interface State {
  newTask: string;
  tasks: Task[];
  filter: Filter;
}

const pause = (ms:number) => new Promise(resolve=>setTimeout(resolve, ms))

export default {
  async setup() {
    let newTask: string = "";
    let tasks: Task[] = [];

    let filter: Filter = "all";

    let state = reactive<State>({
      newTask,
      tasks,
      filter,
    });

    await pause(1000);

    const result = await ky.get("/task").json<Task[]>();
    state.tasks = result;

    const checkAll = () => {
      state.tasks.forEach((t) => (t.done = event.target.checked));
    };
    const addTask = () => {
      if (state.newTask.trim().length === 0) return;
      const recent = { name: state.newTask, done: false }
      state.tasks.push(recent);
      state.newTask = "";
    };

    const filteredCollection = computed(() => {
      switch (state.filter) {
        case 'all':
          return state.tasks;
          break;
        case 'pending':
          return state.tasks.filter(task=>!task.done)
          break;
        case 'done':
          return state.tasks.filter(task=>task.done)
          break;

        default:
          return state.tasks;
          break;
      }
    })

    return { state, addTask, checkAll, filteredCollection };
  },
};
</script>

<style scoped></style>
