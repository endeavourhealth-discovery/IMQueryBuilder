<template>
  <EntityAutocomplete :property="property" @change="handlePropertyChange" />
  <MultiSelect v-if="property.children" v-model="included" :options="includeOptions" placeholder="Select inclusions" @change="handlePropertyChange" />
  =>
  <EntityAutocomplete :property="is" @change="handleIsChange" />
  <MultiSelect v-if="is.children" v-model="included" :options="includeOptions" placeholder="Select inclusions" @change="handleIsChange" />
</template>

<script setup lang="ts">
import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import { ref, Ref } from "vue";
import EntityAutocomplete from "./EntityAutocomplete.vue";
const included: Ref<string[]> = ref([]);
const includeOptions: Ref<string[]> = ref([]);
const property = { key: Math.floor(Math.random() * 9999999999999999), selectable: false } as QueryObject;
const is = { key: Math.floor(Math.random() * 9999999999999999), selectable: false } as QueryObject;

function handlePropertyChange() {
  console.log(property);
}

function handleIsChange() {
  console.log(is);
}
</script>

<style scoped></style>
