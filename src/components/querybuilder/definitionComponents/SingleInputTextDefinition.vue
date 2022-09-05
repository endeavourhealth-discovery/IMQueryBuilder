<template>
  <Card>
    <template #content>
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
    <template #footer>
      <Button icon="pi pi-times" label="Cancel" class="p-button-secondary" />
      <Button icon="pi pi-check" label="Save" @click="saveChanges" />
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "SingleInputTextDefinition",
  props: ["clauseDefinitionData"],
  setup(props, ctx) {
    const propertyValue = ref({ property: "", value: "" });

    watch(
      () => props.clauseDefinitionData,
      (newVal, oldVal) => {
        const key = Object.keys(props.clauseDefinitionData)[0];
        propertyValue.value.property = key;
        propertyValue.value.value = props.clauseDefinitionData[key];
      }
    );

    function saveChanges() {
      const key = Object.keys(props.clauseDefinitionData)[0];
      delete props.clauseDefinitionData[key];
      props.clauseDefinitionData[propertyValue.value.property] = propertyValue.value.value;
    }

    return {
      propertyValue,
      saveChanges
    };
  }
});
</script>

<style scoped>
.p-card {
  box-shadow: none;
}
</style>
