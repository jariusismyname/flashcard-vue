<template>
  <div class="flashcards-container">
    <div class="flashcards-card">
      <h2>My Flashcards</h2>

      <label for="subject-select">Select Subject:</label>
      <select id="subject-select" name="subject" v-model="selectedSubject">
        <option disabled value="">-- Select Subject --</option>
        <option v-for="subj in subjects" :key="subj">{{ subj }}</option>
      </select>

      <div class="actions">
        <button @click="editFlashcardsForSubject">Edit</button>
        <!-- <button @click="practiceFlashcardsForSubject">Practice</button> -->
      </div>

      <div v-if="filteredFlashcards.length">
        <h3>Flashcards for "{{ selectedSubject }}"</h3>
        <div class="card">
          <strong>{{ showAnswer ? 'A:' : 'Q:' }}</strong>
          {{ showAnswer ? currentCard.answer : currentCard.question }}
        </div>

        <div class="card-actions">
          <button @click="toggleShowAnswer">
            {{ showAnswer ? 'Show Question' : 'Show Answer' }}
          </button>
          <button @click="nextCard">
            Next
          </button>
        </div>

        <p class="counter">
          Card {{ currentIndex + 1 }} of {{ filteredFlashcards.length }}
        </p>
      </div>

      <p v-else-if="selectedSubject">No flashcards found for this subject.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const router = useRouter();

const selectedSubject = ref('');
const subjects = ref([]);
const allFlashcards = ref([]);
const filteredFlashcards = ref([]);

const currentIndex = ref(0);
const showAnswer = ref(false);

onMounted(async () => {
  const user = auth.currentUser;
  if (!user) return;

  const flashcardsRef = collection(db, 'flashcards');
  const q = query(flashcardsRef, where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);

  const flashcards = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  allFlashcards.value = flashcards;

  const uniqueSubjects = [...new Set(flashcards.map(f => f.subject).filter(Boolean))];
  subjects.value = uniqueSubjects;
});

watch(selectedSubject, (subject) => {
  filteredFlashcards.value = allFlashcards.value.filter(
    card => card.subject === subject
  );
  currentIndex.value = 0;
  showAnswer.value = false;
});

const currentCard = computed(() => filteredFlashcards.value[currentIndex.value] || { question: '', answer: '' });

function toggleShowAnswer() {
  showAnswer.value = !showAnswer.value;
}

function nextCard() {
  if (filteredFlashcards.value.length === 0) return;

  currentIndex.value = (currentIndex.value + 1) % filteredFlashcards.value.length;
  showAnswer.value = false;
}

const editFlashcardsForSubject = () => {
  if (!selectedSubject.value) {
    alert('Please select a subject first.');
    return;
  }
  if (filteredFlashcards.value.length === 0) {
    alert('No flashcards found for the selected subject.');
    return;
  }

  const flashcardsJson = encodeURIComponent(JSON.stringify(filteredFlashcards.value));

  router.push({
    path: '/add-flashcard',
    query: {
      subject: selectedSubject.value,
      flashcards: flashcardsJson
    }
  });
};
</script>

<style scoped>
.flashcards-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1e3c72, #2a5298);
  font-family: 'Segoe UI', sans-serif;
  padding: 2rem;
}

.flashcards-card {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.flashcards-card h2 {
  color: #1e3c72;
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

select {
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.actions {
  margin-bottom: 1.5rem;
}

button {
  padding: 10px 20px;
  background-color: #1e3c72;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin: 0.3rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2a5298;
}

.card {
  padding: 20px;
  border: 2px solid #1e3c72;
  border-radius: 10px;
  background-color: #f5faff;
  font-size: 1.2rem;
  min-height: 100px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-actions {
  margin-top: 1rem;
}

.counter {
  margin-top: 1rem;
  font-weight: bold;
  color: #333;
}
</style>
