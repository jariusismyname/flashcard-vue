import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import FlashcardHome from "../views/FlashcardHome.vue";
import AddFlashcard from "../views/AddFlashcard.vue";
import ViewFlashcard from '../views/ViewFlashcard.vue';
import PracticeFlashcard from '../views/PracticeFlashcard.vue'; // adjust the path as needed



const routes = [
  { path: '/practice-flashcard',
    name: 'PracticeFlashcard',
    component: PracticeFlashcard,
    props: route => ({
      subject: route.query.subject,
      flashcards: route.query.flashcards
    })},
   {path: '/view-flashcards',    name: 'ViewFlashcard',    component: ViewFlashcard},
    { path: "/add-flashcard", component: AddFlashcard },
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
