<template>
  <div>
    <h1>Welcome to Flashcard Home</h1>
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

    return { logout };
  },
};
</script>
