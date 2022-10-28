<template>
  <div class="select-wrapper">
    <div class="select-header">Select fields:</div>
    <MultiSelect v-model="selectedProperties" :options="propertyOptions" optionLabel="name" placeholder="Select properties" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import { onMounted, Ref, ref } from "vue";
import { Vocabulary, Services } from "im-library";
import axios from "axios";
const entityService = new Services.EntityService(axios);
const { IM, RDF, RDFS } = Vocabulary;
const propertyOptions: Ref<TTIriRef[]> = ref([] as TTIriRef[]);
const selectedProperties: Ref<TTIriRef[]> = ref([] as TTIriRef[]);
const props = defineProps({ selectProperties: { type: Array<TTIriRef>, required: true } });

onMounted(async () => {
  propertyOptions.value = await getPropertyOptions();
});

async function getPropertyOptions() {
  const response = await entityService.getPartialEntities([RDFS.LABEL, IM.CODE, RDF.TYPE], [RDFS.LABEL]);
  return response.map(entity => {
    return { "@id": entity["@id"], name: entity[RDFS.LABEL] };
  });
}
function handleChange() {
  props.selectProperties.length = 0;
  for (const property of selectedProperties.value) {
    props.selectProperties.push(property);
  }
}
</script>

<style scoped>
.select-wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: baseline !important;
}
.select-header {
  padding-right: 1rem;
}
</style>
