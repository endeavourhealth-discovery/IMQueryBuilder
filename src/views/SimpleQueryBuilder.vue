<template>
  <div class="query-builder-main-wrapper">
    <div class="query-builder-main-container">
      <TabView ref="tabview">
        <TabPanel header="Edit">
          <div class="tab-content-container">
            <SelectProperties :selectProperties="selectProperties" />

            <div class="property-container">
              <SetDefinitionForm :clauses="clauses" />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="IM query">
          <div class="tab-panel"><vue-json-pretty class="json" :path="'res'" :show-length="true" :data="imquery" /></div>
        </TabPanel>
      </TabView>

      <Dialog
        :header="queryLoading ? 'Results' : 'Results: ' + testQueryResults.length"
        v-model:visible="showDialog"
        maximizable
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        :style="{ width: '80vw' }"
      >
        <div v-if="queryLoading" class="flex flex-row justify-contents-center align-items-center loading-container">
          <ProgressSpinner />
        </div>
        <div v-else-if="!queryLoading && isArrayHasLength(testQueryResults)">
          <DataTable :value="testQueryResults">
            <Column v-for="key of Object.keys(testQueryResults[0])" :field="key" :header="key">
              <template #body="{ data }">
                <IMViewerLink v-if="key === '@id'" :iri="data[key]" />
                <div v-else>{{ data[key] }}</div>
              </template>
            </Column>
          </DataTable>
        </div>
        <div v-else>No concepts found</div>
        <template #footer>
          <Button label="OK" icon="pi pi-check" @click="showDialog = false" autofocus />
        </template>
      </Dialog>
    </div>
    <div class="footer-buttons">
      <Button icon="pi pi-times" label="Cancel" class="p-button-secondary one-rem-margin" />
      <Button icon="pi pi-bolt" label="Test" class="p-button-help one-rem-margin" @click="testQuery" />
      <Button icon="pi pi-check" label="Save" class="one-rem-margin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, Ref } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import SetDefinitionForm from "../components/querybuilder/SetDefinitionForm.vue";
import SelectProperties from "../components/querybuilder/definitionComponents/SelectProperties.vue";
import { Helpers, Vocabulary, Services } from "im-library";
import { QueryObject, QueryRequest, Refinement, SearchRequest, SetQueryObject, TTAlias, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import axios from "axios";
import _ from "lodash";
import { Query } from "im-library/dist/types/models/modules/AutoGen";
import { useToast } from "primevue/usetoast";
import { buildIMQuery } from "@/builders/SimpleIMQueryBuilder";
const { isObjectHasKeys, isArrayHasLength, isObject } = Helpers.DataTypeCheckers;
const { IM, RDFS, SHACL } = Vocabulary;
const { EntityService, QueryService, LoggerService } = Services;
const toast = useToast();

const entityService = new EntityService(axios);
const queryService = new QueryService(axios);
const testQueryResults: Ref<any[]> = ref([]);
const showDialog: Ref<boolean> = ref(false);
const imquery: Ref<Query> = ref({} as Query);
const defaultTTAlias = { includeSubtypes: true } as TTAlias;
const clauses: Ref<SetQueryObject[]> = ref([]);
const queryLoading: Ref<boolean> = ref(false);
const selectProperties: Ref<TTIriRef[]> = ref([] as TTIriRef[]);

watch(
  () => _.cloneDeep(clauses.value),
  () => {
    imquery.value = buildIMQuery(selectProperties.value, clauses.value);
  }
);

watch(
  () => _.cloneDeep(selectProperties.value),
  () => {
    imquery.value = buildIMQuery(selectProperties.value, clauses.value);
  }
);

onMounted(() => {
  addConcept();
});

function addConcept() {
  const newObject = {
    include: true,
    concept: { ...defaultTTAlias },
    refinements: [] as Refinement[]
  } as SetQueryObject;
  clauses.value.push(newObject);
}

async function testQuery() {
  queryLoading.value = true;
  showDialog.value = true;
  testQueryResults.value = (await queryService.queryIM(imquery.value as unknown as QueryRequest)).entities;
  queryLoading.value = false;
}
</script>

<style scoped>
.query-builder-main-container {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
}

.query-builder-main-wrapper {
  display: flex;
  flex-flow: column nowrap;
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
  height: calc(100vh - 11.2rem);
}

.tab-content-container {
  padding: 1rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: calc(100vh - 11.2rem);
  overflow: scroll;
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
  background-color: #ffffff;
}

.p-tabview {
  flex: 1 0;
  height: 100%;
}

.one-rem-margin {
  margin-right: 0.1rem;
}

.p-tree {
  height: 100%;
}
</style>
