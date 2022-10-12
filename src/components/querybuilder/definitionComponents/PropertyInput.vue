<template>
  <div class="property-value-wrapper">
    <div class="property-name-container">
      <Button icon="pi pi-times" @remove="removeProperty" />
      <Dropdown v-model="propertyName" :options="classProperties" placeholder="Select property to add" optionLabel="name" @change="onSelect" />
    </div>
    <div v-if="props.property.type" class="property-value-container">
      <Dropdown v-if="isStatus" v-model="property.value" :options="options?.status" optionLabel="name" placeholder="Select status" />
      <Dropdown v-else-if="isScheme" v-model="property.value" :options="options?.scheme" optionLabel="name" placeholder="Select scheme" />
      <MultiSelect v-else-if="isType" v-model="property.value" :options="options?.type" optionLabel="name" placeholder="Select type" />
      <Chips v-else-if="isListOfTextInput" type="text" v-model="property.value" />
      <InputText v-else-if="isTextInput" type="text" v-model="property.value" />
      <Dropdown v-else-if="isBoolean" v-model="property.value" optionLabel="name" :options="options?.boolean" />
      <EntityAutocomplete v-else-if="isListOfIriRefs || isIriRef" :property="property" :parentType="parentType" />
      <Button v-else-if="!property.value && property.label" icon="pi pi-pencil" label="Edit value" @click="addValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { Services, Helpers } from "im-library";
import { SimplifiedType } from "im-library/dist/types/interfaces/Interfaces";
import { computed, onMounted, PropType, ref } from "vue";
import { QueryObject, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import EntityAutocomplete from "./EntityAutocomplete.vue";
import { FieldDto } from "im-library/dist/types/interfaces/modules/QueryBuilder";
const { isObjectHasKeys } = Helpers.DataTypeCheckers;
const { ClassService } = Services;
const props = defineProps({
  isSetQuery: { type: Boolean, required: true },
  property: { type: Object as PropType<QueryObject>, required: true },
  parentType: { type: Object as PropType<SimplifiedType>, required: true },
  options: { type: Object as PropType<{ status: TTIriRef[]; scheme: TTIriRef[]; type: TTIriRef[]; boolean: { name: string; value: boolean }[] }> }
});
const emit = defineEmits({
  changeCurrentObject: (_payload: QueryObject) => true,
  removeProperty: (_payload: string) => true
});

const propertyName = ref<string>();
const classProperties = ref<FieldDto[]>([]);
const classService = new ClassService(axios);

const isTextInput = computed(() => {
  return isOfClassType(props.property, "java.lang.String");
});

const isListOfTextInput = computed(() => {
  return isOfClassType(props.property, "java.lang.String", "java.util.List");
});

const isBoolean = computed(() => {
  return isOfClassType(props.property, "boolean");
});

const isComplexType = computed(() => {
  const simpleTypes = ["java.lang.String", "boolean", "org.endeavourhealth.imapi.model.tripletree.TTIriRef"];
  const isSimple = isOfClassTypes(props.property, simpleTypes);
  return !isSimple || !!props.property.type.secondType;
});

const isIriRef = computed(() => {
  return isOfClassType(props.property, "org.endeavourhealth.imapi.model.tripletree.TTIriRef");
});

const isListOfIriRefs = computed(() => {
  return isOfClassType(props.property, "org.endeavourhealth.imapi.model.tripletree.TTIriRef", "java.util.List");
});

const isStatus = computed(() => {
  return props.property.label === "status" && isIriRef;
});

const isScheme = computed(() => {
  return props.property.label === "scheme" && isIriRef;
});

const isType = computed(() => {
  return props.property.label === "type" && isIriRef;
});

function isOfClassType(queryOjbect: QueryObject, firstType: string, secondType?: string) {
  const firstTypeMatch = queryOjbect.type.firstType === firstType;
  if (secondType) return firstTypeMatch && queryOjbect.type.secondType === secondType;
  return firstTypeMatch;
}

function isOfClassTypes(queryOjbect: QueryObject, firstTypes: string[]) {
  let isOfClassTypes = false;
  let i = 0;
  while (!isOfClassTypes && i < firstTypes.length) {
    if (isOfClassType(queryOjbect, firstTypes[i])) {
      isOfClassTypes = true;
    }
    i++;
  }

  return isOfClassTypes;
}

onMounted(async () => {
  classProperties.value = await getClassProperties(props.parentType.firstType);
});

async function getClassProperties(type: string) {
  return await classService.getClassFields(type);
}

function onSelect(event: any) {
  const field = event.value as FieldDto;
  props.property.label = field.name;
  props.property.type = field;
  if (isComplexType.value && !isListOfIriRefs.value) props.property.selectable = true;
}

function addValue() {
  emit("changeCurrentObject", props.property);
}

function removeProperty() {
  if (props.property.label) emit("removeProperty", props.property.label);
}
</script>

<style scoped>
.property-value-container {
  padding-left: 1rem;
  padding-right: 1rem;
}
.property-value-wrapper {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline !important;
  justify-content: center;
}
</style>
