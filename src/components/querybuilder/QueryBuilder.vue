<template>
  <div class="formgrid grid">
    <div class="col-3"><QueryTree :queryNodes="queryNodes" @selected="onSelect" /></div>
    <div class="col">
      <TabView ref="tabview1">
        <TabPanel header="Edit">
          <Card>
            <template #content>
              <div v-for="property in currentQueryObject.children" :key="property.key">
                <PropertyInput
                  :property="property"
                  :parentType="currentQueryObject.type"
                  @changeCurrentObject="updateCurrentObject"
                  @removeProperty="deleteProperty"
                />
              </div>
            </template>
            <template #footer>
              <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" @click="cancelChanges" />
              <Button icon="pi pi-plus" label="Add" class="p-button-success" @click="addProperty" />
              <Button icon="pi pi-check" label="Save" @click="saveChanges" />
            </template>
          </Card>
        </TabPanel>
        <TabPanel header="Display"><VueJsonPretty class="json" :path="'res'" :data="currentQueryObject" /></TabPanel>
      </TabView>
    </div>
  </div>
  <VueJsonPretty class="json" :path="'res'" :data="fullQuery" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import QueryTree from "./QueryTree.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { Helpers } from "im-library";
import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import PropertyInput from "./definitionComponents/PropertyInput.vue";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;

export default defineComponent({
  name: "QueryBuilder",
  components: { QueryTree, VueJsonPretty, PropertyInput },
  setup(_props, _ctx) {
    const initNode = {
      key: 0,
      label: "query",
      type: { firstType: "org.endeavourhealth.imapi.model.iml.Query" },
      value: "",
      children: []
    } as QueryObject;
    const fullQuery = ref<QueryObject>(initNode);
    const currentQueryObject = ref<QueryObject>(initNode);
    const queryNodes = ref({});

    queryNodes.value = [fullQuery.value];

    function onSelect(nodeContents: any) {
      currentQueryObject.value = nodeContents;
    }

    function cancelChanges() {
      currentQueryObject.value = {} as QueryObject;
    }

    function saveChanges() {
      console.log("save");
    }

    function addProperty() {
      if (!isArrayHasLength(currentQueryObject.value.children)) {
        currentQueryObject.value.children = [];
      }
      currentQueryObject.value.children!.push({ key: Math.floor(Math.random() * 9999999999999999) } as QueryObject);
    }

    function updateCurrentObject(newQueryObject: QueryObject) {
      currentQueryObject.value = newQueryObject;
    }

    function deleteProperty(propertyName: string) {
      currentQueryObject.value.children = currentQueryObject.value.children?.filter(property => property.label !== propertyName);
    }

    return {
      fullQuery,
      currentQueryObject,
      queryNodes,
      deleteProperty,
      updateCurrentObject,
      saveChanges,
      addProperty,
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
