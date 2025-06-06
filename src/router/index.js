import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import FlashcardHome from "../views/FlashcardHome.vue";







const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/flashcard-home", component: FlashcardHome },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.path === "/flashcard-home";

  if (requiresAuth && !currentUser) {
    next("/login");
  } else {
    next();
  }
});
