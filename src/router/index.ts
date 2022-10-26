import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import QueryBuilder from "../views/QueryBuilder.vue";
import SetBuilder from "../views/SetBuilder.vue";
import SimpleQueryBuilder from "../views/SimpleQueryBuilder.vue";
import { AccessDenied, PageNotFound, SnomedLicense, Services, EntityNotFound, Helpers } from "im-library";
import store from "@/store/index";
import { nextTick } from "vue";

const { Env } = Services;

const APP_TITLE = "IM Query Builder";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/builder/query",
    name: "QueryBuilder",
    component: QueryBuilder
  },
  {
    path: "/builder/simplequery",
    name: "SimpleQueryBuilder",
    component: SimpleQueryBuilder
  },
  {
    path: "/builder/set",
    name: "SetBuilder",
    component: SetBuilder
  },
  {
    path: "/snomedLicense",
    name: "License",
    component: SnomedLicense
  },
  {
    path: "/401",
    name: "AccessDenied",
    component: AccessDenied
  },
  {
    path: "/404",
    name: "EntityNotFound",
    component: EntityNotFound
  },
  {
    path: "/:pathMatch(.*)*",
    name: "PageNotFound",
    component: PageNotFound
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(async (to, _from) => {
  const currentUrl = Env.DIRECTORY_URL + to.path.slice(1);
  if (to.path !== "/snomedLicense") {
    store.commit("updateSnomedReturnUrl", currentUrl);
    store.commit("updateAuthReturnUrl", currentUrl);
  }

  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const res = await store.dispatch("authenticateCurrentUser");
    console.log("auth guard user authenticated: " + res.authenticated);
    if (!res.authenticated) {
      console.log("redirecting to login");
      window.location.href = Env.AUTH_URL + "login?returnUrl=" + currentUrl;
    }
  }

  if (to.matched.some((record: any) => record.meta.requiresLicense)) {
    console.log("snomed license accepted:" + store.state.snomedLicenseAccepted);
    if (store.state.snomedLicenseAccepted !== "true") {
      return {
        path: "/snomedLicense"
      };
    }
  }
});

router.afterEach(to => {
  nextTick(() => {
    document.title = (to.meta.title as string) || APP_TITLE;
  });
});

export default router;
