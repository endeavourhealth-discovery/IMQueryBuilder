<template>
  <QueryBuilder class="query-builder-component" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import QueryBuilder from "@/components/querybuilder/QueryBuilder.vue";
export default defineComponent({
  name: "Home",
  components: { QueryBuilder }
});
</script>

<style scoped>
.query-builder-component {
  height: 100%;
}
</style>
