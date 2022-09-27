<template>
  <Tree :value="queryDisplay" selectionMode="single">
    <template #default="slotProps">
      <div v-if="slotProps.node.value">{{ slotProps.node.label }} - {{ slotProps.node.value }}</div>
      <div v-else>
        {{ slotProps.node.label }}
      </div>
    </template>
  </Tree>
  <!-- <VueJsonPretty class="json" :path="'res'" :data="queryDisplay" /> -->
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from "vue";
import { Ref, ref, watch } from "vue";
import { Interfaces } from "im-library";
import { convertQueryToQueryObject } from "../../builders/Builder";
import VueJsonPretty from "vue-json-pretty";

export default defineComponent({
  name: "QueryDisplay",
  components: { VueJsonPretty },
  props: {
    query: { type: Object as PropType<Interfaces.QueryObject>, required: true }
  },
  setup(props, _ctx) {
    const queryDisplay = ref();

    onMounted(() => {
      queryDisplay.value = convertQueryToQueryObject(props.query).children;
    });

    watch(
      () => props.query,
      newValue => {
        queryDisplay.value = convertQueryToQueryObject(newValue).children;
      }
    );

    return { queryDisplay };
  }
});
</script>

<style scoped></style>
