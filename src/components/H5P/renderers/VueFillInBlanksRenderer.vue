<template>
  <div class="vue-fill-in-blanks-renderer">
    <!-- Question prompt -->
    <div class="question-prompt mb-4">
      <p class="text-gray-700 leading-relaxed">
        Complétez le texte suivant en remplissant les espaces vides :
      </p>
    </div>

    <!-- Text with blanks -->
    <div class="text-content mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="text-lg leading-relaxed">
        <span v-for="(segment, index) in textSegments" :key="index">
          <span v-if="segment.type === 'text'" v-html="segment.content"></span>
          <input 
            v-else-if="segment.type === 'blank' && segment.blankId"
            type="text"
            :class="[
              'inline-input px-2 py-1 mx-1 border rounded-md text-center',
              getInputClass(segment.blankId)
            ]"
            :style="{ width: Math.max(segment.width || 80, 80) + 'px' }"
            :value="answers[segment.blankId] || ''"
            placeholder="..."
            @input="onInputChange(segment.blankId, $event)"
          />
        </span>
      </div>
    </div>
    
    <!-- Progress indicator -->
    <div v-if="showProgress" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between text-sm">
        <span class="text-blue-800">Progression: {{ filledBlanks }}/{{ totalBlanks }} champs complétés</span>
        <div class="w-32 bg-blue-200 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <div v-if="!hasSubmitted" class="submit-section mt-6 text-center">
      <button
        @click="submitAnswers"
        :disabled="!canSubmit"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-200',
          canSubmit
            ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Valider mes réponses
      </button>
    </div>

    <!-- Feedback section -->
    <div v-if="hasSubmitted" class="feedback-section mt-6 p-4 rounded-lg">
      <div v-if="allCorrect" class="text-green-800 bg-green-100 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Parfait !</span>
        </div>
        <p class="mt-2 text-sm">Toutes vos réponses sont correctes !</p>
      </div>
      <div v-else class="text-amber-800 bg-amber-100 border border-amber-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Presque !</span>
        </div>
        <p class="mt-2 text-sm">{{ correctCount }}/{{ totalBlanks }} réponses correctes. Vérifiez les champs en rouge.</p>
        
        <!-- Show corrections for incorrect answers -->
        <div v-if="incorrectAnswers.length > 0" class="mt-4 p-3 bg-white rounded-lg border border-amber-200">
          <h4 class="font-medium text-amber-800 mb-2">Corrections :</h4>
          <div class="space-y-2">
            <div v-for="correction in incorrectAnswers" :key="correction.blankId" class="flex items-center justify-between text-sm">
              <span class="text-gray-700">
                Votre réponse: <span class="font-medium text-red-600">{{ correction.userAnswer }}</span>
              </span>
              <span class="text-gray-700">
                Réponse correcte: <span class="font-medium text-green-600">{{ correction.correctAnswer }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Retry button -->
      <div class="mt-4 text-center">
        <button
          @click="retryQuestion"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        >
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import type { Blank } from '@/types/assessment';

interface Props {
  text: string;
  blanks: Blank[];
  showProgress?: boolean;
  validateOnInput?: boolean;
  caseSensitive?: boolean;
  showHints?: boolean;
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  validateOnInput: true,
  caseSensitive: false,
  showHints: false,
  showFeedback: false,
});

const emit = defineEmits<{
  answerChanged: [answers: Record<string, string>];
  completed: [isCompleted: boolean];
  blankValidated: [blankId: string, isCorrect: boolean];
}>();

// State
const answers = ref<Record<string, string>>({});
const validationResults = ref<Record<string, boolean>>({});
const hasSubmitted = ref(false);

// Computed
const filledBlanks = computed(() => {
  return Object.keys(answers.value).filter(key => answers.value[key]?.trim()).length;
});

const totalBlanks = computed(() => props.blanks.length);

const progressPercentage = computed(() => {
  return totalBlanks.value > 0 ? (filledBlanks.value / totalBlanks.value) * 100 : 0;
});

const isCompleted = computed(() => {
  return filledBlanks.value === totalBlanks.value;
});

const canSubmit = computed(() => {
  return filledBlanks.value > 0 && !hasSubmitted.value;
});

const correctCount = computed(() => {
  return Object.keys(validationResults.value).filter(key => validationResults.value[key]).length;
});

const allCorrect = computed(() => {
  return correctCount.value === totalBlanks.value;
});

// Parse text into segments (text parts and blank inputs)
const textSegments = computed(() => {
  const segments: Array<{
    type: 'text' | 'blank';
    content?: string;
    blankId?: string;
    width?: number;
  }> = [];
  
  let text = props.text;
  let lastIndex = 0;
  
  // Find all blank placeholders and replace them
  props.blanks.forEach(blank => {
    const placeholder = `{${blank.id}}`;
    const index = text.indexOf(placeholder, lastIndex);
    
    if (index !== -1) {
      // Add text before the blank
      if (index > lastIndex) {
        segments.push({
          type: 'text',
          content: text.substring(lastIndex, index)
        });
      }
      
      // Add the blank input
      segments.push({
        type: 'blank',
        blankId: blank.id,
        width: Math.max(blank.correctAnswers[0]?.length * 10 + 20, 80)
      });
      
      lastIndex = index + placeholder.length;
    }
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  return segments;
});

// Get incorrect answers for correction display
const incorrectAnswers = computed(() => {
  if (!hasSubmitted.value) return [];
  
  const corrections: Array<{
    blankId: string;
    userAnswer: string;
    correctAnswer: string;
  }> = [];
  
  props.blanks.forEach(blank => {
    const userAnswer = answers.value[blank.id] || '';
    const isCorrect = validationResults.value[blank.id];
    
    if (!isCorrect && userAnswer.trim()) {
      corrections.push({
        blankId: blank.id,
        userAnswer: userAnswer,
        correctAnswer: blank.correctAnswers[0] // Show first correct answer
      });
    }
  });
  
  return corrections;
});

// Methods
const validateAnswer = (blankId: string, answer: string): boolean => {
  const blank = props.blanks.find(b => b.id === blankId);
  if (!blank) return false;
  
  const userAnswer = props.caseSensitive ? answer : answer.toLowerCase();
  const isCorrect = blank.correctAnswers.some(correct => {
    const correctAnswer = props.caseSensitive ? correct : correct.toLowerCase();
    return correctAnswer === userAnswer;
  });
  
  return isCorrect;
};

const getInputClass = (blankId: string): string => {
  const baseClass = 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200';
  
  if (!props.validateOnInput || !answers.value[blankId]?.trim()) {
    return baseClass;
  }
  
  const isValid = validationResults.value[blankId];
  if (hasSubmitted.value || props.validateOnInput) {
    return isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
  }
  
  return baseClass;
};

const onInputChange = (blankId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  
  answers.value[blankId] = value;
  
  if (props.validateOnInput && value.trim()) {
    validationResults.value[blankId] = validateAnswer(blankId, value);
    emit('blankValidated', blankId, validationResults.value[blankId]);
  }
  
  emit('answerChanged', { ...answers.value });
  
  if (isCompleted.value) {
    emit('completed', true);
  }
};

const submitAnswers = () => {
  if (!canSubmit.value) return;
  
  hasSubmitted.value = true;
  
  // Validate all answers
  props.blanks.forEach(blank => {
    const answer = answers.value[blank.id] || '';
    validationResults.value[blank.id] = validateAnswer(blank.id, answer);
  });
  
  emit('completed', allCorrect.value);
};

const retryQuestion = () => {
  // Reset all answers and validation results
  answers.value = {};
  validationResults.value = {};
  hasSubmitted.value = false;
  
  // Initialize empty answers
  props.blanks.forEach(blank => {
    answers.value[blank.id] = '';
  });
  
  // Emit reset event
  emit('answerChanged', { ...answers.value });
  emit('completed', false);
};

// Watchers
watch(() => props.blanks, () => {
  answers.value = {};
  validationResults.value = {};
  hasSubmitted.value = false;
}, { deep: true });

// Initialize answers
onMounted(() => {
  props.blanks.forEach(blank => {
    answers.value[blank.id] = '';
  });
});
</script>

<style scoped>
.vue-fill-in-blanks-renderer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fill-blanks-content {
  color: #374151;
  line-height: 1.625;
}

.fill-blanks-text :deep(input:focus) {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.fill-blanks-text :deep(input.border-green-500) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.fill-blanks-text :deep(input.border-red-500) {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Animation for feedback */
.feedback-section {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
