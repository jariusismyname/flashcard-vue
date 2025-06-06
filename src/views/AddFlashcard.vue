<template>
  <div>
    <h2>Add Flashcard</h2>
    <form @submit.prevent="saveFlashcard">
      <label for="subject">Subject:</label>
      <input
        id="subject"
        name="subject"
        v-model="subject"
        type="text"
        placeholder="Subject"
        required
      /><br />

      <div v-for="(item, index) in flashcards" :key="index">
        <label :for="`question-${index}`">Question #{{ index + 1 }}</label><br />
        <textarea
          :id="`question-${index}`"
          :name="`question-${index}`"
          v-model="item.question"
          :placeholder="`Enter question #${index + 1}`"
          required
        ></textarea><br />

        <label :for="`answer-${index}`">Answer #{{ index + 1 }}</label><br />
        <textarea
          :id="`answer-${index}`"
          :name="`answer-${index}`"
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
          // Update existing flashcard
          const cardRef = doc(db, 'flashcards', card.id);
          await updateDoc(cardRef, {
            subject: subject.value,
            question: card.question,
            answer: card.answer,
          });
        } else {
          // Add new flashcard
          await addDoc(flashcardsRef, {
            userId: user.uid,
            subject: subject.value,
            question: card.question,
            answer: card.answer,
          });
        }
      }

      success.value = 'Flashcard(s) saved successfully!';

      // Optionally reset form after save:
      subject.value = '';
      flashcards.value = [{ question: '', answer: '', id: null }];
    } catch (err) {
      error.value = 'Error saving flashcard(s): ' + err.message;
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
