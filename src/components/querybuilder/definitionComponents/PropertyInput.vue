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
    <div class="field col-8">
      <Inplace :closable="true">
        <template #display>
          {{ property.value || property.children?.map(child => child.label) || "Click to edit" }}
        </template>
        <template #content>
          <InputText v-if="isTextInput" type="text" v-model="property.value" />
          <EntityAutocomplete v-else-if="isListOfIriRefs || isIriRef" :property="property" :parentType="parentType" />
          <Button v-else-if="!property.value && property.label" icon="pi pi-pencil" label="Edit value" @click="addValue" />
        </template>
      </Inplace>

      <!-- <div v-if="isTextInput" class="field col-8">
            <InputText type="text" v-model="property.value" />
          </div>
          <div v-else-if="isListOfIriRefs || isIriRef" class="field col-8">
            <EntityAutocomplete :property="property" :parentType="parentType" />
          </div>
          <div v-else-if="!property.value && property.label" class="field col-8">
            <Button icon="pi pi-pencil" label="Edit value" @click="addValue" />
          </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Services, Helpers } from "im-library";
const { ClassService } = Services;
import { Field, GenericType, FieldUI, SimplifiedType } from "im-library/dist/types/interfaces/Interfaces";
const { isObjectHasKeys } = Helpers.DataTypeCheckers;

import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { QueryObject } from "im-library/dist/types/interfaces/Interfaces";
import EntityAutocomplete from "./EntityAutocomplete.vue";

export default defineComponent({
  name: "PropertyInput",
  components: { EntityAutocomplete },
  props: {
    property: { type: Object as PropType<QueryObject>, required: true },
    parentType: { type: Object as PropType<SimplifiedType>, required: true }
  },
  emits: {
    changeCurrentObject: (_payload: QueryObject) => true,
    removeProperty: (_payload: string) => true
  },
  setup(props, ctx) {
    const propertyName = ref<string>();
    const classProperties = ref<FieldUI[]>([]);
    const classService = new ClassService(axios);
    const isPropertySet = computed(() => {
      return isObjectHasKeys(props.property, ["label"]);
    });

    const isList = computed(() => {
      return isOfClassType(props.property, "java.util.List");
    });

    const isTextInput = computed(() => {
      return isOfClassType(props.property, "java.lang.String");
    });

    const isComplexType = computed(() => {
      return !!props.property.type.secondType;
    });

    const isIriRef = computed(() => {
      return isOfClassType(props.property, "org.endeavourhealth.imapi.model.tripletree.TTIriRef");
    });

    const isListOfIriRefs = computed(() => {
      return isOfClassType(props.property, "org.endeavourhealth.imapi.model.tripletree.TTIriRef", "java.util.List");
    });

    function isOfClassType(queryOjbect: QueryObject, firstType: string, secondType?: string) {
      const firstTypeMatch = queryOjbect.type.firstType === firstType;
      if (secondType) return firstTypeMatch && queryOjbect.type.secondType === secondType;
      return firstTypeMatch;
    }

    onMounted(async () => {
      const result = (await classService.getClassProperties(props.parentType.firstType)).map((field: Field) => {
        const simplifiedType = {} as SimplifiedType;
        if (isObjectHasKeys(field.genericType)) {
          simplifiedType.firstType = (field.genericType as GenericType).actualTypeArguments[0];
          simplifiedType.secondType = field.type;
        } else {
          simplifiedType.firstType = field.type;
        }
        return { name: field.name, simplifiedType: simplifiedType };
      });

      classProperties.value = result;
    });

    function onSelect(event: any) {
      const field = event.value as FieldUI;
      props.property.label = field.name;
      props.property.type = field.simplifiedType;
      props.property.selectable = false;
      if (isComplexType.value && !isListOfIriRefs.value) props.property.selectable = true;
    }

    function addValue() {
      ctx.emit("changeCurrentObject", props.property);
    }

    function removeProperty() {
      if (props.property.label) ctx.emit("removeProperty", props.property.label);
    }

    return {
      isPropertySet,
      propertyName,
      classProperties,
      isTextInput,
      isListOfIriRefs,
      isIriRef,
      isList,
      addValue,
      removeProperty,
      onSelect
    };
  }
});
</script>

<style scoped></style>
