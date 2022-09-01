<template>
  <div class="flex align-items-stretch">
    <div class="flex-initial">
      <QueryTree />
    </div>
    <div><ClauseDefinition /></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QueryTree from "./QueryTree.vue";
import ClauseDefinition from "./ClauseDefinition.vue";

export default defineComponent({
  name: "QueryBuilder",
  components: { QueryTree, ClauseDefinition }
});
</script>

<style scoped>
.query-builder-container {
  height: 100%;
}
.full-height {
  height: 100%;
}
.p-tree {
  height: 100%;
}
.p-card {
  box-shadow: none;
  height: 100%;
}
</style>
