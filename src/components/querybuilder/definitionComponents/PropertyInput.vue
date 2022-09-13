<template>
  <div class="formgrid grid">
    <Dropdown
      class="field col-3"
      v-model="propertyName"
      :options="classProperties"
      optionLabel="name"
      placeholder="Select property to add"
      @change="onSelect"
    />
    <div v-if="isTextInput" class="field col-8">
      <InputText type="text" v-model="property.value" />
    </div>
    <div v-else-if="isListOfTTIriRefs" class="field col-8">
      <EntityAutocomplete :property="property" :parentType="parentType" />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Services, Helpers } from "im-library";
const { ClassService } = Services;
import { Field, GenericType } from "im-library/dist/types/interfaces/Interfaces";
const { DataTypeCheckers } = Helpers;
const { isObjectHasKeys } = DataTypeCheckers;

import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import EntityAutocomplete from "./EntityAutocomplete.vue";

export default defineComponent({
  name: "PropertyInput",
  components: { EntityAutocomplete },
  props: {
    property: { type: Object as PropType<QueryObject>, required: true },
    parentType: { type: String || (Object as PropType<GenericType>), required: true }
  },
  setup(props, _ctx) {
    const propertyName = ref<string>(props.property.label);
    const classProperties = ref<Field[]>([]);
    const classService = new ClassService(axios);

    const isTextInput = computed(() => {
      return props.property.type === "java.lang.String";
    });

    const isListOfTTIriRefs = computed(() => {
      return (
        isObjectHasKeys(props.property.type, ["rawType"]) &&
        (props.property.type as GenericType).rawType === "java.util.List" &&
        (props.property.type as GenericType).actualTypeArguments.includes("org.endeavourhealth.imapi.model.tripletree.TTIriRef")
      );
    });

    onMounted(async () => {
      if (typeof props.parentType === "string") classProperties.value = await classService.getClassProperties(props.parentType);
    });

    function onSelect(event: any) {
      const field = event.value as Field;
      props.property.label = field.name;
      props.property.type = field.genericType;
    }

    return {
      propertyName,
      classProperties,
      isTextInput,
      isListOfTTIriRefs,
      onSelect
    };
  }
});
</script>

<style scoped></style>
