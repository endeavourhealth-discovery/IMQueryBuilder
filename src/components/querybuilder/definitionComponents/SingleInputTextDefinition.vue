<template>
  <div class="p-fluid grid">
    <div class="field col-12">
      <span class="p-float-label">
        <InputText id="property" type="text" v-model="propertyValue.property" />
        <label for="property">Property</label>
      </span>
    </div>
    <div class="field col-12">
      <span class="p-float-label">
        <InputText id="value" type="text" v-model="propertyValue.value" />
        <label for="value">Value</label>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { Helpers } from "im-library";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;

export default defineComponent({
  name: "SingleInputTextDefinition",
  props: ["clauseDefinitionData"],
  setup(props, ctx) {
    const propertyValue = ref({ property: "", value: "" });

    onMounted(() => {
      setPropertyValue();
    });

    function setPropertyValue() {
      const key = Object.keys(props.clauseDefinitionData)[0];
      if (key !== "key") {
        propertyValue.value.property = key;
        propertyValue.value.value = props.clauseDefinitionData[key];
      } else {
        console.log(props.clauseDefinitionData);
      }
    }

    watch(
      () => props.clauseDefinitionData,
      (newVal, oldVal) => {
        setPropertyValue();
      }
    );

    function updateProp(newVal: any, oldVal: any) {
      const key = Object.keys(props.clauseDefinitionData)[0];
      delete props.clauseDefinitionData[key];
      props.clauseDefinitionData[propertyValue.value.property] = propertyValue.value.value;
    }

    watch(
      () => propertyValue.value.property,
      (newVal, oldVal) => {
        updateProp(newVal, oldVal);
      }
    );

    watch(
      () => propertyValue.value.value,
      (newVal, oldVal) => {
        updateProp(newVal, oldVal);
      }
    );

    return {
      propertyValue
    };
  }
});
</script>

<style scoped>
.p-card {
  box-shadow: none;
}
</style>
