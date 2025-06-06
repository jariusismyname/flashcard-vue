<template>
  <div>
    <h2>My Flashcards</h2>

    <label for="subject-select">Select Subject:</label>
    <select id="subject-select" name="subject" v-model="selectedSubject">
      <option disabled value="">-- Select Subject --</option>
      <option v-for="subj in subjects" :key="subj">{{ subj }}</option>
    </select>

    <button @click="editFlashcardsForSubject">Edit</button>
    <button @click="practiceFlashcardsForSubject" style="margin-left: 10px;">Practice</button>

    <div v-if="filteredFlashcards.length">
      <h3>Flashcards for "{{ selectedSubject }}"</h3>
      <div
        v-for="(card, index) in filteredFlashcards"
        :key="index"
        class="card"
      >
        <strong>Q:</strong> {{ card.question }}<br />
        <strong>A:</strong> {{ card.answer }}
      </div>
    </div>

    <p v-else-if="selectedSubject">No flashcards found for this subject.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Get props
const props = defineProps({
  subject: String,
  flashcards: String,
});

// Parse incoming flashcards if provided through props
const parsedFlashcards = ref([]);
try {
  parsedFlashcards.value = props.flashcards ? JSON.parse(decodeURIComponent(props.flashcards)) : [];
} catch (error) {
  console.error('Failed to parse flashcards from props:', error);
}

const auth = getAuth();
const router = useRouter();
const selectedSubject = ref(props.subject || '');
const subjects = ref([]);
const allFlashcards = ref([]);
const filteredFlashcards = ref([]);

// Load flashcards from Firestore
onMounted(async () => {
  // If props contain flashcards, use them immediately
  if (parsedFlashcards.value.length > 0) {
    allFlashcards.value = parsedFlashcards.value;
    const uniqueSubjectsFromProps = [...new Set(parsedFlashcards.value.map(f => f.subject).filter(Boolean))];
    subjects.value = uniqueSubjectsFromProps;
    return; // Skip Firestore entirely
  }

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


// Watch subject and update flashcards shown
watch(selectedSubject, (subject) => {
  filteredFlashcards.value = allFlashcards.value.filter(
    card => card.subject === subject
  );
}, { immediate: true });

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

  console.log("Selected subject:", subject);
console.log("All flashcard subjects:", allFlashcards.value.map(f => f.subject));

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

console.log("props.flashcards", props.flashcards);
console.log("parsedFlashcards", parsedFlashcards.value);
console.log("filteredFlashcards", filteredFlashcards.value);

</script>

<style scoped>
select {
  margin-bottom: 1rem;
  padding: 5px;
}

.card {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  width: 400px;
  border-radius: 8px;
  background-color: #f8f8f8;
}
</style>
