<template>
  <body class="login">
    
  
  <div class="login-container">
    <!-- Left: Welcome panel -->
    <div class="welcome-panel">
      <div class="welcome-overlay">
        <h2>Welcome to FlashCard Mastery!</h2>
        <p>Learn, revise, and master your knowledge with ease.</p>
      </div>
    </div>

    <!-- Right: Login panel -->
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="register-link">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div></body>
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

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left side */
.welcome-panel {
  flex: 1;
  background-image: url('../assets/welcome-image.jpg'); /* Use correct path */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

body{
  margin: 0;
}

.welcome-overlay {
  background-color: rgba(0, 0, 0, 0.5); /* Dark overlay for text readability */
  padding: 2rem;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.welcome-overlay h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.welcome-overlay p {
  font-size: 1.1rem;
  max-width: 300px;
  margin: 0 auto;
}

/* Right side */
.login-card {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem;
}

.login-card h2 {
  color: #1e3c72;
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-card form {
  display: flex;
  flex-direction: column;
}

.login-card input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.login-card button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1e3c72;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.login-card button:hover {
  background-color: #174087;
}

.error {
  background-color: #ffe6e6;
  border: 1px solid #ffaaaa;
  color: #cc0000;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  margin-top: 1rem;
}

.register-link {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.register-link a {
  color: #1e3c72;
  text-decoration: underline;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .welcome-panel {
    display: none; /* better than visibility: hidden because it removes the space */
  }

  .login-container {
    flex-direction: column;
  }
  

  .login-card {
 background-image: url("../assets/bg.avif");
 background-repeat: no-repeat;
      background-size: cover;
  }

  .login {
    margin: 0;
  }
}

</style>
