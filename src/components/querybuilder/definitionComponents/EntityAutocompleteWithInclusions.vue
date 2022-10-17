<template>
  <div class="entity-autocomplete-container"></div>
  <EntityAutocomplete :property="property" :parentType="parentType" @change="handleChange" />
  <MultiSelect v-if="props.property.children" v-model="included" :options="includeOptions" placeholder="Select inclusions" @change="handleChange" />
</template>

<script setup lang="ts">
import EntityAutocomplete from "./EntityAutocomplete.vue";
import { QueryObject, SimplifiedType, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import { onMounted, PropType, ref, Ref } from "vue";
import { Services, Helpers } from "im-library";
import axios from "axios";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;
const { ClassService } = Services;
const classService = new ClassService(axios);

const props = defineProps({
  property: { type: Object as PropType<QueryObject>, required: true },
  parentType: { type: Object as PropType<SimplifiedType>, required: true },
  includeProperties: { type: Array<String>, required: false }
});

const includeOptions: Ref<string[]> = ref([]);
const included: Ref<string[]> = ref([]);
onMounted(async () => {
  includeOptions.value = await getInclusionProps();
  setDisplayOptions();
});

async function getInclusionProps() {
  const classProperties = await getClassProperties(props.property.type.firstType);
  return classProperties.filter(prop => prop.firstType === "boolean").map(field => field.name);
}

async function setDisplayOptions() {
  if (isArrayHasLength(props.property.children)) {
    for (const from of props.property.children!) {
      if (isObjectHasKeys(from.value)) {
        for (const fromProp in from.value) {
          if (includeOptions.value.includes(fromProp)) {
            included.value.push(fromProp);
          }
        }
      }
    }
  }
}

function handleChange() {
  resetIncludeOptions();
  if (isArrayHasLength(props.property.children)) {
    for (const from of props.property.children!) {
      if (isObjectHasKeys(from.value)) {
        for (const includeOption of included.value) {
          from.value[includeOption] = true;
        }
      }
    }
  }
}

function resetIncludeOptions() {
  if (isArrayHasLength(props.property.children)) {
    for (const from of props.property.children!) {
      if (isObjectHasKeys(from.value)) {
        for (const fromProp in from.value) {
          if (includeOptions.value.includes(fromProp)) {
            delete from.value[fromProp];
          }
        }
      }
    }
  }
}

async function getClassProperties(type: string) {
  let fields = await classService.getClassFields(type);
  if (props.includeProperties) {
    fields = fields.filter(field => props.includeProperties?.includes(field.name));
  }
  return fields;
}
</script>

<style scoped>
.entity-autocomplete-container {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline !important;
  justify-content: center;
}
</style>
