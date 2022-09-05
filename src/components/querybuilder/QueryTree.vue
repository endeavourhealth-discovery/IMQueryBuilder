<template>
  <Card>
    <template #title>Query contents</template>
    <template #content><Tree :value="nodes" selectionMode="single" @node-select="nodeSelect"></Tree></template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { allNodeShapesQuery } from "./../../files/ExampleQueries";

export default defineComponent({
  name: "QueryTree",
  setup(_props, ctx) {
    const nodes = ref();
    const expandedKeys = ref({});
    const selectedKey = ref();

    function nodeSelect(node: any) {
      ctx.emit("selected", node.children || node.data);
    }

    nodes.value = allNodeShapesQuery.tree;

    return {
      nodes,
      expandedKeys,
      selectedKey,
      nodeSelect
    };
  }
});
</script>

<style scoped></style>
