<template>
  <Splitter class="mb-5">
    <SplitterPanel class="flex justify-content-center">
      <Tree :value="queryDisplay" class="tree-container">
        <template #default="{ node }">
          <Panel :header="node.label" :toggleable="false" :collapsed="true">
            <template #header> {{ node.label }} </template>
          </Panel>
        </template>

        <template #simpleWhere="{ node }">
          <Panel toggleable collapsed>
            <template #header> where </template>
            {{ node.value.property.name }} -> {{ node.value.is.name }}
          </Panel>
        </template>

        <template #string="{ node }">
          <Panel collapsed>
            <template #header> {{ node.value }} </template>
          </Panel>
        </template>

        <template #iri="{ node }">
          <Panel collapsed>
            <template #header> {{ node.label }} <IMViewerLink :iri="node.value" /> </template>
          </Panel>
        </template>

        <template #boolean="{ node }">
          <Panel collapsed>
            <template #header> {{ node.label }} </template>
          </Panel>
        </template>

        <template #from="{ node }">
          <Panel :collapsed="true">
            <template #header>
              <IMViewerLink :iri="node.value['@id']" :label="node.value.includeSubtypes ? node.label + ' including subtypes' : node.label" />
            </template>
          </Panel>
        </template>

        <template #simpleOr="{ node }">
          <Panel toggleable :collapsed="true">
            <template #header>
              {{ node.label }}
            </template>
            <div v-for="(from, index) in node.value" :key="index">
              <IMViewerLink :iri="from['@id']" :label="from.includeSubtypes ? from.label + ' including subtypes' : from.label" />
            </div>
          </Panel>
        </template>
      </Tree>
    </SplitterPanel>
    <SplitterPanel class="flex align-items-center justify-content-center"> <VueJsonPretty class="json" :path="'res'" :data="queryDisplay" /> </SplitterPanel>
  </Splitter>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import { Ref, ref, watch } from "vue";
import { buildQueryToQueryDisplay } from "../../builders/QueryDisplayBuilder";
import VueJsonPretty from "vue-json-pretty";
import { QueryDisplay } from "im-library/dist/types/interfaces/Interfaces";
import IMViewerLink from "./displayComponents/IMViewerLink.vue";

export default defineComponent({
  name: "QueryDisplay",
  components: { VueJsonPretty, IMViewerLink },
  props: {
    query: { type: Object as PropType<any>, required: true }
  },
  setup(props, _ctx) {
    const queryDisplay = ref<QueryDisplay[]>();

    onMounted(() => {
      queryDisplay.value = buildQueryToQueryDisplay(props.query).children;
    });

    watch(
      () => props.query,
      newValue => {
        queryDisplay.value = buildQueryToQueryDisplay(newValue).children;
      }
    );

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
