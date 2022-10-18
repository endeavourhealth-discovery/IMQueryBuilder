<template>
  <EntityAutocomplete :property="property" @change="handlePropertyChange" />
  <MultiSelect v-if="property.children" v-model="propertyIncluded" :options="includeOptions" placeholder="Select inclusions" @change="handlePropertyChange" />
  =>
  <EntityAutocomplete :property="is" @change="handleIsChange" />
  <MultiSelect v-if="is.children" v-model="isIncluded" :options="includeOptions" placeholder="Select inclusions" @change="handleIsChange" />
</template>

<script setup lang="ts">
import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import { onMounted, PropType, ref, Ref } from "vue";
import EntityAutocomplete from "./EntityAutocomplete.vue";
import { Services, Helpers } from "im-library";
import axios from "axios";
const { isObjectHasKeys, isArrayHasLength } = Helpers.DataTypeCheckers;
const { ClassService } = Services;
const props = defineProps({
  parentProperty: { type: Object as PropType<QueryObject>, required: true },
  includeProperties: { type: Array<String>, required: false }
});
const classService = new ClassService(axios);
const propertyIncluded: Ref<string[]> = ref([]);
const isIncluded: Ref<string[]> = ref([]);
const includeOptions: Ref<string[]> = ref([]);
const property = { key: Math.floor(Math.random() * 9999999999999999), selectable: false } as QueryObject;
const is = { key: Math.floor(Math.random() * 9999999999999999), selectable: false } as QueryObject;

onMounted(async () => {
  includeOptions.value = await getInclusionProps();
  setDisplayOptions(property, propertyIncluded.value);
  setDisplayOptions(is, isIncluded.value);
});

async function getInclusionProps() {
  const classProperties = await getClassProperties("org.endeavourhealth.imapi.model.tripletree.TTAlias");
  return classProperties.filter(prop => prop.firstType === "boolean").map(field => field.name);
}

async function setDisplayOptions(queryObject: QueryObject, included: string[]) {
  if (isArrayHasLength(queryObject.children)) {
    for (const from of queryObject.children!) {
      if (isObjectHasKeys(from.value)) {
        for (const fromProp in from.value) {
          if (includeOptions.value.includes(fromProp)) {
            included.push(fromProp);
          }
        }
      }
    }
  }
}

function handleChange(queryObject: QueryObject, included: string[]) {
  resetIncludeOptions(queryObject, included);
  if (isArrayHasLength(queryObject.children)) {
    for (const from of queryObject.children!) {
      if (isObjectHasKeys(from.value)) {
        for (const includeOption of included) {
          from.value[includeOption] = true;
        }
      }
    }
  }
}

function resetIncludeOptions(queryObject: QueryObject, included: string[]) {
  if (isArrayHasLength(queryObject.children)) {
    for (const from of queryObject.children!) {
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

function handlePropertyChange() {
  handleChange(property, propertyIncluded.value);
  addToParentProperty(property);
}

function handleIsChange() {
  handleChange(is, isIncluded.value);
  addToParentProperty(is);
}

function addToParentProperty(queryObject: QueryObject) {
  if (isArrayHasLength(props.parentProperty.children)) {
    props.parentProperty.children = props.parentProperty.children?.filter(child => child.key !== queryObject.key);
  } else {
    props.parentProperty.children = [];
  }
  props.parentProperty.children?.push(queryObject);
}
</script>

<style scoped></style>
