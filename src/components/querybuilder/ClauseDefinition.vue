<template>
  <div v-if="hasSelectedObject">
    <SingleInputTextDefinition :clauseDefinitionData="clauseDefinitionData" />
  </div>
  <div v-else-if="hasSelectedArray">
    <ClauseDefinition v-for="(object, index) in clauseDefinitionData" :key="index" :clauseDefinitionData="object" />
  </div>
</template>

<script lang="ts">
import { Helpers } from "im-library";
import { computed, defineComponent } from "vue";
import SingleInputTextDefinition from "./definitionComponents/SingleInputTextDefinition.vue";
import MultipleInputTextDefinition from "./definitionComponents/MultipleInputTextDefinition.vue";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;

export default defineComponent({
  name: "ClauseDefinition",
  components: { SingleInputTextDefinition, MultipleInputTextDefinition },
  props: ["clauseDefinitionData"],
  setup(props, _ctx) {
    const hasSelectedObject = computed(() => {
      return isObjectHasKeys(props.clauseDefinitionData);
    });

    const hasSelectedArray = computed(() => {
      return isArrayHasLength(props.clauseDefinitionData);
    });

    return {
      hasSelectedObject,
      hasSelectedArray
    };
  }
});
</script>

<style scoped></style>
