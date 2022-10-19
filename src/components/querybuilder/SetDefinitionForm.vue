<template>
  <div v-for="(included, clauseIndex) of clauses" class="clause-wrapper">
    <div class="clause-container">
      <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="removeClause(clauseIndex)" />
      <Dropdown v-model="included.include" :options="includeOptions" option-label="name" option-value="value" placeholder="Include or exclude" />
      <EntityAutocomplete :ttAlias="included.concept" />
      <Dropdown
        v-model="included.concept.includeSubtypes"
        :options="includeSubtypesOptions"
        option-label="name"
        option-value="value"
        placeholder="Include subtypes"
      />
      <Button icon="pi pi-cog" v-tooltip="'Add refinement'" class="p-button-warning one-rem-margin" @click="addRefinement(clauseIndex)" />
      <Button
        v-if="clauseIndex === clauses.length - 1"
        icon="pi pi-plus"
        v-tooltip="'Add concept'"
        class="p-button-success one-rem-margin"
        @click="addConcept"
      />
    </div>
    <div v-for="(refinement, refinementIndex) of included.refinements" class="refinement-wrapper">
      <div class="refinement-container">
        <div class="clause-container">
          <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="removeRefinement(clauseIndex, refinementIndex)" />
          <EntityAutocomplete :ttAlias="refinement.property" />
          <Dropdown
            v-model="included.concept.includeSubtypes"
            :options="includeSubtypesOptions"
            option-label="name"
            option-value="value"
            placeholder="Include subtypes"
          />
          <i class="icon pi pi-arrow-right" />
          <EntityAutocomplete :ttAlias="refinement.is" />
          <Dropdown
            v-model="included.concept.includeSubtypes"
            :options="includeSubtypesOptions"
            option-label="name"
            option-value="value"
            placeholder="Include subtypes"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SetQueryObject, TTAlias, Refinement } from "im-library/dist/types/interfaces/Interfaces";
import { onMounted, PropType, ref, Ref } from "vue";
import EntityAutocomplete from "./definitionComponents/EntityAutocomplete.vue";
const defaultTTAlias = { includeSubtypes: true } as TTAlias;
const includeOptions = [
  { name: "include", value: true },
  { name: "exclude", value: false }
];
const includeSubtypesOptions = [
  { name: "include subtybes", value: true },
  { name: "exclude subtypes", value: false }
];

const props = defineProps({ clauses: { type: Array as PropType<SetQueryObject[]>, required: true } });

function addRefinement(index: number) {
  const refinement = { property: { ...defaultTTAlias }, is: { ...defaultTTAlias } } as Refinement;
  props.clauses[index].refinements.push(refinement);
}
function removeClause(index: number) {
  if (props.clauses.length !== 1) props.clauses.splice(index, 1);
}
function removeRefinement(clauseIndex: number, refinementIndex: number) {
  props.clauses[clauseIndex].refinements.splice(refinementIndex, 1);
}
function addConcept() {
  const newObject = {
    include: true,
    concept: { ...defaultTTAlias },
    refinements: [] as Refinement[]
  } as SetQueryObject;
  props.clauses.push(newObject);
}
</script>

<style scoped>
.clause-container {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.refinement-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
.icon {
  align-self: center;
}

.clause-wrapper {
  padding-bottom: 2rem;
}
</style>
