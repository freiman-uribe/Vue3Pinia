import { createRouter, createWebHistory } from "vue-router";
import List from "../src/components/List.vue";
import Detail from "../src/components/Detail.vue";

const routes = [
  { path: "/", component: List },
  { path: "/detail/:id", component: Detail },
];

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router;