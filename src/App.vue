<template>
  <div class="layout-wrapper layout-static">
    <Toast />
    <ConfirmDialog />
    <ReleaseNotes />
    <div id="main-container">
      <TopBar>
        <template #content>
          <div id="topbar-content-container">
            <span class="title"><strong>IM Query Builder</strong></span>
            <Button
              v-if="isLoggedIn && currentUser && currentUser.roles.includes('IMAdmin')"
              icon="pi pi-cog"
              class="p-button-rounded p-button-text p-button-plain p-button-lg p-button-icon-only topbar-end-button ml-auto"
              @click="openAdminMenu"
            />
            <Menu ref="adminMenu" :model="getAdminItems()" :popup="true" />
          </div>
        </template>
      </TopBar>
      <div id="app-content-container">
        <div v-if="loading" class="flex flex-row justify-content-center align-items-center loading-container">
          <ProgressSpinner />
        </div>
        <router-view v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import ReleaseNotes from "@/components/releaseNotes/ReleaseNotes.vue";
import { Services } from "im-library";
import { useStore } from "vuex";
import { useToast } from "primevue/usetoast";
import axios from "axios";
const { FilerService } = Services;
const filerService = new FilerService(axios);

export default defineComponent({
  name: "App",
  components: { ReleaseNotes },
  setup(_props, _ctx) {
    const toast = useToast();
    const store = useStore();
    const currentUser = computed(() => store.state.currentUser);
    const isLoggedIn = computed(() => store.state.isLoggedIn);

    const loading = ref(true);
    const adminMenu = ref(null);

    onMounted(async () => {
      loading.value = true;
      await store.dispatch("authenticateCurrentUser");
      loading.value = false;
    });

    function openAdminMenu(event: any): void {
      (adminMenu as any).value.toggle(event);
    }

    function getAdminItems(): any[] {
      return [
        {
          label: "Download changes",
          icon: "fa-solid fa-fw fa-cloud-arrow-down",
          command: () => downloadChanges()
        }
      ];
    }

    async function downloadChanges() {
      toast.add({ severity: "info", summary: "Preparing download", detail: "Zipping delta files for download...", life: 3000 });
      let blob = await filerService.downloadDeltas();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "deltas.zip";
      link.click();
    }

    return {
      currentUser,
      isLoggedIn,
      loading,
      adminMenu,
      openAdminMenu,
      getAdminItems,
      downloadChanges
    };
  }
  // computed: mapState(["currentUser", "isLoggedIn"]),
  // async mounted() {
  //   // check for user and log them in if found or logout if not
  //   this.loading = true;
  //   await this.$store.dispatch("authenticateCurrentUser");
  //   this.loading = false;
  // },
  // data() {
  //   return {
  //     loading: true
  //   };
  // },
  // methods: {
  // openAdminMenu(event: any): void {
  //   (this.$refs.adminMenu as any).toggle(event);
  // },
  // getAdminItems(): any[] {
  //   return [
  //     {
  //       label: "Download changes",
  //       icon: "fa-solid fa-fw fa-cloud-arrow-down",
  //       command: () => this.downloadChanges()
  //     }
  //   ];
  // },
  // async downloadChanges() {
  //   this.$toast.add({ severity: "info", summary: "Preparing download", detail: "Zipping delta files for download...", life: 3000 });
  //   let blob = await this.$filerService.downloadDeltas();
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "deltas.zip";
  //   link.click();
  // }
  // }
});
</script>

<style>
#main-container {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  overflow: auto;
}

#topbar-content-container {
  height: 100%;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
}

.ecl-search-button {
  height: fit-content;
}

body {
  overflow: hidden;
}

.loading-container {
  width: 100%;
  height: 100%;
}

#app-content-container {
  height: calc(100% - 3.5rem);
}

#topbar-container {
  height: 4rem;
  width: 100vw;
}

.p-toast-message-text {
  width: calc(100% - 4rem);
}

.p-toast-message-content {
  width: 100%;
}

.p-toast-detail {
  width: 100%;
  word-wrap: break-word;
}
</style>
