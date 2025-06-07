<template>
  <div class="home-container">
    <div class="home-card">
      <h1>Welcome to Flashcard Home</h1>
      <button @click="goToMyFlashcard">Add Flashcard</button>
      <button @click="goToViewFlashcards">View Flashcards</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
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
      router.push("/add-flashcard");
    };

    const goToViewFlashcards = () => {
      router.push("/view-flashcards");
    };

    return {
      logout,
      goToMyFlashcard,
      goToViewFlashcards,
    };
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #1e3c72, #2a5298);
  font-family: 'Segoe UI', sans-serif;
}

.home-card {
  background-color: white;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.home-card h1 {
  color: #1e3c72;
  margin-bottom: 2rem;
}

.home-card button {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #1e3c72;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-card button:hover {
  background-color: #154078;
}

.logout-btn {
  background-color: #ff4d4d;
}

.logout-btn:hover {
  background-color: #cc0000;
}
</style>
