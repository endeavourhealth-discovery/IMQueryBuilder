<template>
  <div class="formgrid grid">
    <Dropdown
      v-if="!isPropertySet"
      class="field col-3"
      v-model="propertyName"
      :options="classProperties"
      placeholder="Select property to add"
      optionLabel="name"
      @change="onSelect"
    />
    <div v-else>
      <Chip :label="property.label" class="mb-2" removable @remove="removeProperty" />
    </div>
    <div v-if="isTextInput" class="field col-8">
      <InputText type="text" v-model="property.value" />
    </div>
    <div v-else-if="isListOfTTIriRefs" class="field col-8">
      <EntityAutocomplete :property="property" :parentType="parentType" />
    </div>
    <div v-else-if="!property.value && property.label" class="field col-8">
      <Button icon="pi pi-pencil" label="Add value" @click="addValue" />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Services, Helpers } from "im-library";
const { ClassService } = Services;
import { Field, GenericType } from "im-library/dist/types/interfaces/Interfaces";
const { isObjectHasKeys } = Helpers.DataTypeCheckers;

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
  emits: {
    changeCurrentObject: (_payload: QueryObject) => true,
    removeProperty: (_payload: string) => true
  },
  setup(props, ctx) {
    const propertyName = ref<string>();
    const classProperties = ref<Field[]>([]);
    const classService = new ClassService(axios);
    const isPropertySet = computed(() => {
      return isObjectHasKeys(props.property, ["label"]);
    });

    const isTextInput = computed(() => {
      return props.property.type === "java.lang.String";
    });

    const isListOfTTIriRefs = computed(() => {
      return (
        isList &&
        isObjectHasKeys(props.property.type, ["actualTypeArguments"]) &&
        (props.property.type as GenericType).actualTypeArguments.includes("org.endeavourhealth.imapi.model.tripletree.TTIriRef")
      );
    });

    onMounted(async () => {
      const type = isObjectHasKeys(props.parentType, ["actualTypeArguments"])
        ? (props.parentType as unknown as GenericType).actualTypeArguments[0]
        : props.parentType;
      classProperties.value = await classService.getClassProperties(type);
    });

    function onSelect(event: any) {
      const field = event.value as Field;
      props.property.label = field.name;
      props.property.type = field.genericType;
      if (isTextInput) props.property.selectable = false;
    }

    function addValue() {
      ctx.emit("changeCurrentObject", props.property);
    }

    const isList = computed(() => {
      return isObjectHasKeys(props.property.type, ["rawType"]) && (props.property.type as GenericType).rawType === "java.util.List";
    });

    function removeProperty() {
      if (props.property.label) ctx.emit("removeProperty", props.property.label);
    }

    return {
      isPropertySet,
      propertyName,
      classProperties,
      isTextInput,
      isListOfTTIriRefs,
      isList,
      addValue,
      removeProperty,
      onSelect
    };
  }
});
</script>

<style scoped></style>
