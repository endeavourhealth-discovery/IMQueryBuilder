<template>
  <div class="flex align-items-stretch">
    <div class="flex-initial">
      <QueryTree @selected="onSelect" />
    </div>
    <div>
      <TabView ref="tabview1">
        <TabPanel header="Edit"><ClauseDefinition :clauseDefinitionData="clauseDefinitionData" /> </TabPanel>
        <TabPanel header="Display">{{ clauseDefinitionData }} </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QueryTree from "./QueryTree.vue";
import ClauseDefinition from "./ClauseDefinition.vue";

export default defineComponent({
  name: "QueryBuilder",
  components: { QueryTree, ClauseDefinition },
  setup(_props, _ctx) {
    const clauseDefinitionData = ref({});

    function onSelect(nodeContents: any) {
      clauseDefinitionData.value = nodeContents;
    }

    return {
      clauseDefinitionData,
      onSelect
    };
  }
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
