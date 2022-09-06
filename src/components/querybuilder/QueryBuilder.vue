<template>
  <div class="flex align-items-stretch">
    <div class="flex-initial">
      <QueryTree @selected="onSelect" />
    </div>
    <div>
      <TabView ref="tabview1">
        <TabPanel header="Edit">
          <Card>
            <template #content>
              <ClauseDefinition :clauseDefinitionData="clauseDefinitionDataProp" />
            </template>
            <template #footer>
              <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" @click="cancelChanges" />
              <Button icon="pi pi-check" label="Save" @click="saveChanges" />
            </template>
          </Card>
        </TabPanel>
        <TabPanel header="Display">{{ clauseDefinitionData }} </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QueryTree from "./QueryTree.vue";
import ClauseDefinition from "./ClauseDefinition.vue";
import { Helpers } from "im-library";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;

export default defineComponent({
  name: "QueryBuilder",
  components: { QueryTree, ClauseDefinition },
  setup(_props, _ctx) {
    const clauseDefinitionData = ref({});
    const clauseDefinitionDataProp = ref({});

    function onSelect(nodeContents: any) {
      clauseDefinitionData.value = nodeContents;
      clauseDefinitionDataProp.value = Object.assign(isArrayHasLength(nodeContents) ? [] : {}, nodeContents);
    }

    function cancelChanges() {
      clauseDefinitionDataProp.value = Object.assign(isArrayHasLength(clauseDefinitionData.value) ? [] : {}, clauseDefinitionData.value);
    }

    function saveChanges() {
      clauseDefinitionData.value = Object.assign(isArrayHasLength(clauseDefinitionDataProp.value) ? [] : {}, clauseDefinitionDataProp.value);
    }

    return {
      clauseDefinitionData,
      clauseDefinitionDataProp,
      saveChanges,
      cancelChanges,
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
