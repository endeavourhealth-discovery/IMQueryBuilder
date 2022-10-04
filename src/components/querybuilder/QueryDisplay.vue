<template>
  <Splitter class="mb-5">
    <SplitterPanel class="flex justify-content-center">
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
    </SplitterPanel>
    <SplitterPanel class="flex align-items-center justify-content-center"> <VueJsonPretty class="json" :path="'res'" :data="queryDisplay" /> </SplitterPanel>
  </Splitter>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import { Ref, ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import { QueryDisplay } from "im-library/dist/types/interfaces/Interfaces";
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

    onMounted(async () => {
      await getQueryDisplay(props.query);
    });

    watch(
      () => props.query,
      async newValue => {
        await getQueryDisplay(newValue);
      }
    );

    async function getQueryDisplay(query: any) {
      queryDisplay.value = (await queryService.getSetQueryDisplay(query)).children;
    }

    return { queryDisplay };
  }
});
</script>

<style scoped>
.tree-container,
.json {
  height: calc(100vh - 10.8rem);
  overflow: auto;
}
</style>
