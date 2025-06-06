<template>
  <div>
    <h1>Welcome to Flashcard Home</h1>
    <button @click="goToMyFlashcard">My Flashcard</button>
    <button @click="goToViewFlashcards">View Flashcards</button> <!-- New button -->
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const logout = async () => {
      await signOut(auth);
      router.push("/login");
    };

    const goToMyFlashcard = () => {
      router.push("/add-flashcard"); // Route to SaveFlashcard.vue
    };

    const goToViewFlashcards = () => {
      router.push("/view-flashcards"); // Route to ViewFlashcards.vue (make sure it's defined in your router)
    };

    return {
      logout,
      goToMyFlashcard,
      goToViewFlashcards
    };
  },
};
</script>
