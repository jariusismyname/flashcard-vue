<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p>{{ error }}</p>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const error = ref("");
    const router = useRouter();

    const register = async () => {
      error.value = "";
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        router.push("/flashcard-home");
      } catch (err) {
        error.value = err.message;
      }
    };

    return { email, password, register, error };
  },
};
</script>
