<template>
  <Card>
    <template #title>Query contents</template>
    <template #content><Tree :value="queryNodes" selectionMode="single" @node-select="nodeSelect"></Tree></template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "QueryTree",
  props: ["queryNodes"],
  setup(_props, ctx) {
    const expandedKeys = ref({});
    const selectedKey = ref();

    function nodeSelect(node: any) {
      ctx.emit("selected", node);
    }

    return {
      expandedKeys,
      selectedKey,
      nodeSelect
    };
  }
});
</script>

<style scoped></style>
