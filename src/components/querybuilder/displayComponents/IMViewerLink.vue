<template>
  <a v-tooltip.right="'See in viewer app'" class="clickable" @click="navigate">{{ label || iri }}</a>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Services } from "im-library";
import axios from "axios";
const { DirectService, Env } = Services;

export default defineComponent({
  name: "IMViewerLink",
  props: { iri: { type: String, required: true }, label: { type: String, required: false } },
  setup(props, _ctx) {
    const directService = new DirectService(axios);

    function navigate() {
      directService.directTo(Env.VIEWER_URL, props.iri, "concept");
    }

    return {
      navigate
    };
  }
});
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
