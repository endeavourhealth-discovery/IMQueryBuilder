<template>
  <div class="query-builder-main-container">
    <QueryTree :queryNodes="queryNodes" @selected="onSelect" />
    <TabView class="tab-view-container" ref="tabview1">
      <TabPanel header="Edit">
        <div class="tab-content-container">
          <div class="property-container">
            <div
              class="property-component"
              v-if="currentQueryObject.children?.length"
              v-for="(property, index) in currentQueryObject.children"
              :key="property.key"
            >
              <PropertyInput
                :isSetQuery="true"
                :property="property"
                :parentType="currentQueryObject.type"
                :options="options"
                @changeCurrentObject="updateCurrentObject"
                @removeProperty="deleteProperty"
              />
            </div>
            <div class="property-component">
              <Button icon="pi pi-plus" label="Add" class="p-button-success one-rem-margin" @click="addProperty" />
            </div>
          </div>
          <div class="footer-buttons">
            <Button icon="pi pi-times" label="Cancel" class="p-button-secondary one-rem-margin" @click="cancelChanges" />
            <Button icon="pi pi-check" label="Save" class="one-rem-margin" @click="saveChanges" />
          </div>
        </div>
      </TabPanel>
      <TabPanel class="tab-panel" header="Full query"><VueJsonPretty class="json" :path="'res'" :data="fullQuery" /></TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import QueryTree from "../components/querybuilder/QueryTree.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { Helpers, Vocabulary, Services } from "im-library";
import { QueryObject, SearchRequest, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import PropertyInput from "../components/querybuilder/definitionComponents/PropertyInput.vue";
import axios from "axios";
import {
  AsthmaSubTypesCore,
  PainInLowerLimbORChestPainMinus,
  Aged70to74,
  simpleListSetQuery,
  simpleListWithExclusionsSetQuery,
  refinedConceptsSetQuery
} from "../tests/testData/ExampleQueries";
const { isObjectHasKeys, isArrayHasLength, isObject } = Helpers.DataTypeCheckers;
const { IM, RDFS, SHACL } = Vocabulary;
const { EntityService } = Services;

const entityService = new EntityService(axios);
const abortController = ref(new AbortController());
const options = ref({
  status: [] as TTIriRef[],
  scheme: [] as TTIriRef[],
  type: [] as TTIriRef[],
  boolean: [
    { name: "True", value: true },
    { name: "False", value: false }
  ]
});
const example = refinedConceptsSetQuery;

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
  type: {
    firstType: "org.endeavourhealth.imapi.model.iml.Query"
  },
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

function deleteProperty(propertyKey: number) {
  currentQueryObject.value.children = currentQueryObject.value.children?.filter(property => property.key !== propertyKey);
}
</script>

<style scoped>
.query-builder-main-container {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
}

.tab-content-container {
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: calc(100vh - 8.7rem);
}

.property-component {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline !important;
  justify-content: center;
  padding: 0.5rem;
}

.footer-buttons {
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
}

.tab-view-container {
  flex: 1 0;
  height: 100%;
}

.one-rem-margin {
  margin-right: 0.1rem;
}

.p-tree {
  height: 100%;
}

.p-card {
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: none;
}

.tab-panel {
  height: 100%;
}

.json {
  overflow-y: auto;
  height: calc(100vh - 8.7rem);
}
</style>
