<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="login-link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>
    </div>
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

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #1e3c72, #2a5298);
  font-family: 'Segoe UI', sans-serif;
}

.register-card {
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.register-card h2 {
  color: #1e3c72;
  margin-bottom: 1.5rem;
}

.register-card input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.register-card button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1e3c72;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-card button:hover {
  background-color: #174087;
}

.error {
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #1e3c72;
  text-decoration: underline;
}
</style>
