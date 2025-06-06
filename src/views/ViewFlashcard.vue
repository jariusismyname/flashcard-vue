<template>
  <div>
    <h2>My Flashcards</h2>

    <label for="subject-select">Select Subject:</label>
    <select id="subject-select" name="subject" v-model="selectedSubject">
      <option disabled value="">-- Select Subject --</option>
      <option v-for="subj in subjects" :key="subj">{{ subj }}</option>
    </select>

    <button @click="editFlashcardsForSubject">Edit</button>
    <!-- <button @click="practiceFlashcardsForSubject" style="margin-left: 10px;">Practice</button> -->

    <div v-if="filteredFlashcards.length">
      <h3>Flashcards for "{{ selectedSubject }}"</h3>
      <div class="card">
        <strong>{{ showAnswer ? 'A:' : 'Q:' }}</strong>
        {{ showAnswer ? currentCard.answer : currentCard.question }}
      </div>

      <button @click="toggleShowAnswer" style="margin-top: 10px;">
        {{ showAnswer ? 'Show Question' : 'Show Answer' }}
      </button>
      <button @click="nextCard" style="margin-left: 10px; margin-top: 10px;">
        Next
      </button>

      <p style="margin-top: 10px;">
        Card {{ currentIndex + 1 }} of {{ filteredFlashcards.length }}
      </p>
    </div>

    <p v-else-if="selectedSubject">No flashcards found for this subject.</p>
  </div>
</template>

<script setup>
import { ref,computed, onMounted, watch } from 'vue';
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
  currentIndex.value = 0;  // reset index on subject change
  showAnswer.value = false; // reset to question side on subject change
});

const currentCard = computed(() => filteredFlashcards.value[currentIndex.value] || { question: '', answer: '' });

function toggleShowAnswer() {
  showAnswer.value = !showAnswer.value;
}

function nextCard() {
  if (filteredFlashcards.value.length === 0) return;

  currentIndex.value = (currentIndex.value + 1) % filteredFlashcards.value.length;
  showAnswer.value = false; // always show question when moving to next card
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

const practiceFlashcardsForSubject = () => {
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
    path: '/practice-flashcard',
    query: {
      subject: selectedSubject.value,
      flashcards: flashcardsJson
    }
  });
};
</script>

<style scoped>
select {
  margin-bottom: 1rem;
  padding: 5px;
}

.card {
  margin: 10px 0;
  padding: 15px;
  border: 2px solid #333;
  width: 400px;
  border-radius: 8px;
  background-color: #f0f0f0;
  font-size: 1.2rem;
  min-height: 100px;
  display: flex;
  align-items: center;
}
</style>
