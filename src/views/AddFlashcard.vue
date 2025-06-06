<template>
  <div>
    <h2>Add Flashcard</h2>
    <form @submit.prevent="saveFlashcard">
      <input v-model="subject" type="text" placeholder="Subject" required /><br />

      <div v-for="(item, index) in flashcards" :key="index">
        <textarea
          v-model="item.question"
          :placeholder="`Enter question #${index + 1}`"
          required
        ></textarea><br />
        <textarea
          v-model="item.answer"
          :placeholder="`Enter answer #${index + 1}`"
          required
        ></textarea><br />
      </div>

      <button type="button" @click="addFlashcard">+ Add another Q&A</button><br /><br />
      <button type="submit">Save</button>
    </form>

    <p v-if="success">{{ success }}</p>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const subject = ref('');
const flashcards = ref([
  { question: '', answer: '' }
]);

const success = ref('');
const error = ref('');

const addFlashcard = () => {
  flashcards.value.push({ question: '', answer: '' });
};

const saveFlashcard = async () => {
  success.value = '';
  error.value = '';

  try {
    for (const card of flashcards.value) {
      if (card.question && card.answer) {
        await addDoc(collection(db, 'flashcards'), {
          subject: subject.value,
          question: card.question,
          answer: card.answer,
          createdAt: new Date()
        });
      }
    }

    success.value = 'Flashcards saved successfully!';
    // Keep subject and flashcards, don’t clear input fields
  } catch (err) {
    error.value = 'Error saving flashcards: ' + err.message;
  }
};
</script>

<style scoped>
input, textarea {
  display: block;
  margin-bottom: 10px;
  width: 300px;
}
</style>
