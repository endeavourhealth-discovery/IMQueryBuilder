<template>
  <div class="query-display-container">
    <Tree :value="queryDisplay" class="tree-container">
      <template #default="{ node }">{{ node.label }}</template>
      <template #propertyIs="{ node }">
        <IMViewerLink :iri="node.value.property['@id']" :label="node.value.property.name" /> =
        <IMViewerLink :iri="node.value.is['@id']" :label="node.value.is.name" />
      </template>
      <template #string="{ node }">{{ node.value }}</template>
      <template #iri="{ node }"> {{ node.label }} <IMViewerLink :iri="node.value" /></template>
      <template #boolean="{ node }">{{ node.label }}</template>
      <template #from="{ node }">
        <IMViewerLink v-if="node.value.includeSubtypes" :iri="node.value['@id']" :label="node.label + ' including subtypes'" />
        <IMViewerLink v-else :iri="node.value['@id']" :label="node.label" />
      </template>

      <template #simpleOr="{ node }">
        <div v-for="(from, index) in node.value" :key="index">
          <IMViewerLink v-if="from.includeSubtypes" :iri="from['@id']" :label="from.label + ' including subtypes'" />
          <IMViewerLink v-else :iri="node.value['@id']" :label="from.label" />
        </div>
      </template>
    </Tree>
    <Tree :value="queryObject" class="tree-container">
      <template #default="{ node }">
        <div v-if="node.value">{{ node.label }} - {{ node.value }}</div>
        <div v-else>{{ node.label }}</div>
      </template>
    </Tree>
    <VueJsonPretty class="json" :path="'res'" :data="queryDisplay" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import { Ref, ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import { QueryDisplay, QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import IMViewerLink from "./displayComponents/IMViewerLink.vue";
import { Enums, Services } from "im-library";
import axios from "axios";
const { QueryDisplayType } = Enums;
const { QueryService } = Services;

export default defineComponent({
  name: "QueryDisplay",
  components: { VueJsonPretty, IMViewerLink },
  props: {
    query: { type: Object as PropType<any>, required: true }
  },
  setup(props, _ctx) {
    const queryService = new QueryService(axios);
    const queryDisplay = ref<QueryDisplay[]>();
    const queryObject = ref<QueryObject[]>();

    onMounted(async () => {
      await getQueryDisplay(props.query);
      await getQueryObject(props.query);
    });

    watch(
      () => props.query,
      async newValue => {
        await getQueryDisplay(newValue);
      }
    );

    async function getQueryObject(query: any) {
      queryObject.value = (await queryService.getQueryObject(query)).children;
    }

    async function getQueryDisplay(query: any) {
      queryDisplay.value = (await queryService.getSetQueryDisplay(query)).children;
    }

    return { queryDisplay, queryObject };
  }
});
</script>

<style scoped>
.tree-container,
.json {
  height: calc(100vh - 10.8rem);
  overflow: auto;
  width: 33%;
}

.query-display-container {
  display: flex;
}
</style>
