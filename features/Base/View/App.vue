<template>
  <suspense>
    <template #default>
      <TaskList />
    </template>

    <template #fallback>
      <Placeholder />
    </template>
  </suspense>
</template>

<script lang="ts">
import TaskList from "Task/View/Task.vue";
import Placeholder from "Task/View/Placeholder.vue";
import suspense from "vue";
export default {
  components: { TaskList, Placeholder },
  setup() {},
};
</script>
