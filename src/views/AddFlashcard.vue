<template>
  <div class="container">
    <h2 class="title">Add Flashcard</h2>
    <form @submit.prevent="saveFlashcard" class="form">

      <label for="subject">Subject:</label>
      <input
        id="subject"
        name="subject"
        v-model="subject"
        type="text"
        placeholder="Enter subject"
        required
      />

      <div
        v-for="(item, index) in flashcards"
        :key="index"
        class="card-block"
      >
        <label :for="`question-${index}`">Question #{{ index + 1 }}</label>
        <textarea
          :id="`question-${index}`"
          v-model="item.question"
          :placeholder="`Enter question #${index + 1}`"
          required
        ></textarea>

        <label :for="`answer-${index}`">Answer #{{ index + 1 }}</label>
        <textarea
          :id="`answer-${index}`"
          v-model="item.answer"
          :placeholder="`Enter answer #${index + 1}`"
          required
        ></textarea>
      </div>

      <button type="button" @click="addFlashcard" class="btn secondary">+ Add another Q&A</button>
      <button type="submit" class="btn primary">Save</button>
    </form>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const route = useRoute();
const router = useRouter();

const subject = ref('');
const flashcards = ref([{ question: '', answer: '', id: null }]);
const success = ref('');
const error = ref('');

onMounted(() => {
  subject.value = route.query.subject || '';

  if (route.query.flashcards) {
    try {
      const cards = JSON.parse(decodeURIComponent(route.query.flashcards));
      flashcards.value = cards.map(card => ({
        id: card.id || null,
        question: card.question || '',
        answer: card.answer || '',
      }));
    } catch (e) {
      console.error('Failed to parse flashcards JSON:', e);
    }
  }
});

const addFlashcard = () => {
  flashcards.value.push({ question: '', answer: '', id: null });
};

const saveFlashcard = async () => {
  const user = auth.currentUser;
  if (!user) {
    error.value = 'You must be logged in.';
    return;
  }

  try {
    const flashcardsRef = collection(db, 'flashcards');

    for (const card of flashcards.value) {
      if (card.id) {
        const cardRef = doc(db, 'flashcards', card.id);
        await updateDoc(cardRef, {
          subject: subject.value,
          question: card.question,
          answer: card.answer,
        });
      } else {
        await addDoc(flashcardsRef, {
          userId: user.uid,
          subject: subject.value,
          question: card.question,
          answer: card.answer,
        });
      }
    }

    success.value = 'Flashcard(s) saved successfully!';
    subject.value = '';
    flashcards.value = [{ question: '', answer: '', id: null }];
  } catch (err) {
    error.value = 'Error saving flashcard(s): ' + err.message;
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 30px auto;
  padding: 30px;
  background-color: #f0f8ff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
  font-family: 'Segoe UI', sans-serif;
}

.title {
  text-align: center;
  color: #007bff;
  margin-bottom: 20px;
}

label {
  font-weight: 600;
  color: #003366;
  margin-top: 10px;
  display: block;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin: 6px 0 16px;
  border: 1px solid #aad4ff;
  border-radius: 8px;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.btn.primary {
  background-color: #007bff;
  color: white;
  margin-left: 10px;
}

.btn.secondary {
  background-color: #e0efff;
  color: #007bff;
}

.btn:hover {
  opacity: 0.9;
}

.card-block {
  margin-bottom: 25px;
  padding: 15px;
  background-color: #eaf4ff;
  border-left: 4px solid #007bff;
  border-radius: 8px;
}

.success {
  color: green;
  text-align: center;
  margin-top: 10px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
