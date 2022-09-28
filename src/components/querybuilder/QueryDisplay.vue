<template>
  <Tree :value="queryDisplay" selectionMode="single">
    <template #default="slotProps">
      <!-- <Panel :header="slotProps.node.label" :toggleable="false" :collapsed="true"></Panel> -->
      <div v-if="slotProps.node.value">{{ slotProps.node.label }} - {{ slotProps.node.value }}</div>
      <div v-else>
        {{ slotProps.node.label }}
      </div>
    </template>

    <!-- <template #complex="slotProps">
      <Panel :toggleable="true" :collapsed="true">
        <template #header> {{ slotProps.node.label }} </template>
        {{ slotProps.node }}
      </Panel>
    </template> -->
  </Tree>
  <!-- <VueJsonPretty class="json" :path="'res'" :data="queryDisplay" /> -->
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import { Ref, ref, watch } from "vue";
import { convertQueryToQueryDisplay } from "../../builders/QueryDisplayBuilder";
import VueJsonPretty from "vue-json-pretty";
import { QueryDisplay } from "im-library/dist/types/interfaces/Interfaces";

export default defineComponent({
  name: "QueryDisplay",
  components: { VueJsonPretty },
  props: {
    query: { type: Object as PropType<any>, required: true }
  },
  setup(props, _ctx) {
    const queryDisplay = ref<QueryDisplay[]>();

    onMounted(() => {
      queryDisplay.value = convertQueryToQueryDisplay(props.query).children;
    });

    watch(
      () => props.query,
      newValue => {
        queryDisplay.value = convertQueryToQueryDisplay(newValue).children;
      }
    );

    return { queryDisplay };
  }
});
</script>

<style scoped></style>
