<template>
  <Card>
    <template #title>Title</template>
    <template #content><QueryBuilder /></template>
  </Card>
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
.p-card {
  height: 100%;
  width: 100%;
}
</style>
