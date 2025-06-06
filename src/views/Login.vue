<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>{{ error }}</p>
<p>Don't have an account? <router-link to="/register">Register</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    const login = async () => {
      error.value = "";
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push("/flashcard-home");
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, login, error };
  },
};
</script>
