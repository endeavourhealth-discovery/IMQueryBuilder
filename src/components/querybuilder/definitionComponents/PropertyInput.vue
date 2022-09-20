<template>
  <div class="property-value-container">
    <Dropdown
      v-if="!isPropertySet"
      v-model="propertyName"
      :options="classProperties"
      placeholder="Select property to add"
      optionLabel="name"
      @change="onSelect"
    />
    <div v-else>
      <Chip :label="property.label" class="mb-2" removable @remove="removeProperty" />
    </div>
    <Inplace :closable="true">
      <template #display>
        <span v-if="isPropertySet">{{ property.value || property.children?.map(child => child.label) || "Click to edit" }}</span>
      </template>
      <template #content>
        <Dropdown v-if="isStatus" v-model="property.value" :options="options?.status" optionLabel="name" placeholder="Select status" />
        <Dropdown v-else-if="isScheme" v-model="property.value" :options="options?.scheme" optionLabel="name" placeholder="Select scheme" />
        <MultiSelect v-else-if="isType" v-model="property.value" :options="options?.type" optionLabel="name" placeholder="Select type" />
        <Chips v-else-if="isListOfTextInput" type="text" v-model="property.value" />
        <InputText v-else-if="isTextInput" type="text" v-model="property.value" />
        <Checkbox v-else-if="isBoolean" inputId="binary" v-model="property.value" :binary="true" />
        <EntityAutocomplete v-else-if="isListOfIriRefs || isIriRef" :property="property" :parentType="parentType" />
        <Button v-else-if="!property.value && property.label" icon="pi pi-pencil" label="Edit value" @click="addValue" />
      </template>
    </Inplace>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Services, Helpers } from "im-library";
const { ClassService } = Services;
import { Field, GenericType, FieldUI, SimplifiedType } from "im-library/dist/types/interfaces/Interfaces";
const { isObjectHasKeys } = Helpers.DataTypeCheckers;

import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { QueryObject, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import EntityAutocomplete from "./EntityAutocomplete.vue";

export default defineComponent({
  name: "PropertyInput",
  components: { EntityAutocomplete },
  props: {
    property: { type: Object as PropType<QueryObject>, required: true },
    parentType: { type: Object as PropType<SimplifiedType>, required: true },
    options: { type: Object as PropType<{ status: TTIriRef[]; scheme: TTIriRef[]; type: TTIriRef[] }> }
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
      isListOfTextInput,
      isStatus,
      isScheme,
      isType,
      isBoolean,
      addValue,
      removeProperty,
      onSelect
    };
  }
});
</script>

<style scoped>
.property-value-container {
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: center;
}
</style>
