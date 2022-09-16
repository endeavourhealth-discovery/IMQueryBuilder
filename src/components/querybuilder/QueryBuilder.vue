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
                  :options="options"
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
import { defineComponent, onMounted, ref } from "vue";
import QueryTree from "./QueryTree.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { Helpers, Vocabulary, Services } from "im-library";
import { QueryObject, SearchRequest, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import PropertyInput from "./definitionComponents/PropertyInput.vue";
import axios from "axios";
const { isObjectHasKeys, isArrayHasLength, isObject } = Helpers.DataTypeCheckers;
const { IM, RDFS } = Vocabulary;
const { EntityService } = Services;
export default defineComponent({
  name: "QueryBuilder",
  components: { QueryTree, VueJsonPretty, PropertyInput },
  setup(_props, _ctx) {
    const entityService = new EntityService(axios);
    const abortController = ref(new AbortController());
    const options = ref({ status: [] as TTIriRef[], scheme: [] as TTIriRef[], type: [] as TTIriRef[] });
    onMounted(async () => {
      options.value.status = await searchByIsA([IM.STATUS]);
      options.value.scheme = await searchByIsA(["http://endhealth.info/im#Graph"]);
      options.value.type = await searchByIsA([RDFS.CLASS]);
    });

    async function searchByIsA(isA: string[]) {
      const searchRequest = {} as SearchRequest;
      searchRequest.isA = isA;
      if (!isObject(abortController.value)) {
        abortController.value.abort();
      }

      abortController.value = new AbortController();
      const results = await entityService.advancedSearch(searchRequest, abortController.value);
      return results.map(summary => {
        return { "@id": summary.iri, name: summary.name };
      });
    }

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
      currentQueryObject.value.children!.push({ key: Math.floor(Math.random() * 9999999999999999), selectable: false } as QueryObject);
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
      options,
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
