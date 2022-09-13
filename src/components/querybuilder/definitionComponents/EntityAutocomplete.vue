<template>
  <AutoComplete
    :multiple="true"
    v-model="selectedIriRefs"
    :suggestions="suggestions"
    @complete="searchEntity($event)"
    @item-select="onSelect"
    @item-unselect="onUnselect"
  >
    <template #item="slotProps"> {{ slotProps.item.name }} - {{ slotProps.item["@id"] }} </template>
    <template #chip="slotProps"> {{ slotProps.value.name }} - {{ slotProps.value["@id"] }} </template>
  </AutoComplete>
</template>

<script lang="ts">
import { EntityReferenceNode, GenericType, Namespace, QueryObject, SearchRequest, TTIriRef } from "im-library/dist/types/interfaces/Interfaces";
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import { Services, Enums, Helpers, Config } from "im-library";
import axios from "axios";
const { EntityService } = Services;
const { DataTypeCheckers } = Helpers;
const { isObject, isArrayHasLength } = DataTypeCheckers;

export default defineComponent({
  name: "EntityAutocomplete",
  props: {
    property: { type: Object as PropType<QueryObject>, required: true },
    parentType: { type: String || (Object as PropType<GenericType>), required: true }
  },
  setup(props, _ctx) {
    const suggestions = ref();
    const entityService = new EntityService(axios);
    const abortController = ref(new AbortController());
    const selectedIriRefs = ref([]);

    function onSelect(selected: { value: TTIriRef }) {
      if (!isArrayHasLength(props.property.children)) {
        props.property.children = [] as QueryObject[];
      }
      const iriRef = {
        key: Math.floor(Math.random() * 9999999999999999),
        label: selected.value.name,
        type: "org.endeavourhealth.imapi.model.tripletree.TTIriRef",
        value: { "@id": selected.value["@id"], name: selected.value.name }
      };
      props.property.children?.push(iriRef);
    }

    function onUnselect(unselected: { value: TTIriRef }) {
      props.property.children = props.property.children?.filter(iriRef => iriRef.value["@id"] !== unselected.value["@id"]);
    }

    async function searchEntity(searchTerm: any): Promise<void> {
      if (searchTerm.query.length > 0) {
        const searchRequest = {} as SearchRequest;
        searchRequest.termFilter = searchTerm.query;
        searchRequest.sortBy = Enums.SortBy.Usage;
        searchRequest.page = 1;
        searchRequest.size = 100;
        searchRequest.sortDirection = Enums.SortDirection.DESC;
        searchRequest.sortField = "weighting";
        searchRequest.schemeFilter = Config.FilterDefaults.schemeOptions;
        searchRequest.typeFilter = Config.FilterDefaults.typeOptions;
        searchRequest.statusFilter = Config.FilterDefaults.statusOptions;
        if (!isObject(abortController.value)) {
          abortController.value.abort();
        }

        abortController.value = new AbortController();
        const results = await entityService.advancedSearch(searchRequest, abortController.value);
        suggestions.value = results.map(result => {
          return { name: result.name, "@id": result.iri };
        });
      }
    }

    return {
      suggestions,
      selectedIriRefs,
      onSelect,
      onUnselect,
      searchEntity
    };
  }
});
</script>

<style scoped></style>
