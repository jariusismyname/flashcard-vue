<template>
  <div>
    <h2>Add Flashcard</h2>
    <form @submit.prevent="saveFlashcard">
      <input v-model="subject" type="text" placeholder="Subject" required /><br />
      <textarea v-model="question" placeholder="Enter your question" required></textarea><br />
      <textarea v-model="answer" placeholder="Enter the answer" required></textarea><br />
      <button type="submit">Save</button>
    </form>
    <p v-if="success">{{ success }}</p>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const subject = ref('');
const question = ref('');
const answer = ref('');
const success = ref('');
const error = ref('');

const saveFlashcard = async () => {
  success.value = '';
  error.value = '';

  try {
    await addDoc(collection(db, 'flashcards'), {
      subject: subject.value,
      question: question.value,
      answer: answer.value,
      createdAt: new Date()
    });
    success.value = 'Flashcard saved successfully!';
    subject.value = '';
    question.value = '';
    answer.value = '';
  } catch (err) {
    error.value = 'Error saving flashcard: ' + err.message;
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
