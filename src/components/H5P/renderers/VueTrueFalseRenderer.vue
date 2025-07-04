<template>
  <div class="vue-true-false-renderer">
    <!-- Question -->
    <div class="question-section mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ question }}</h3>
      <p v-if="description" class="text-gray-600 mb-4">{{ description }}</p>
    </div>

    <!-- True/False Options -->
    <div class="options-section space-y-4">
      <div
        @click="selectOption(true)"
        :class="[
          'option-item true-option',
          'relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200',
          selectedAnswer === true
            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
            : 'border-gray-200 hover:border-green-300 hover:bg-green-25',
          showFeedback && getFeedbackClass(true)
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 w-8 h-8 mr-4">
            <div :class="[
              'w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
              selectedAnswer === true
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            ]">
              <svg v-if="selectedAnswer === true" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex-grow">
            <div class="flex items-center">
              <span class="text-xl font-bold text-green-700 mr-3">VRAI</span>
              <span class="text-gray-700">Cette affirmation est correcte</span>
            </div>
          </div>
          <!-- Feedback icon -->
          <div v-if="showFeedback" class="flex-shrink-0 ml-3">
            <svg v-if="correctAnswer === true" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="selectedAnswer === true && correctAnswer !== true" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div
        @click="selectOption(false)"
        :class="[
          'option-item false-option',
          'relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200',
          selectedAnswer === false
            ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
            : 'border-gray-200 hover:border-red-300 hover:bg-red-25',
          showFeedback && getFeedbackClass(false)
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 w-8 h-8 mr-4">
            <div :class="[
              'w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
              selectedAnswer === false
                ? 'border-red-500 bg-red-500'
                : 'border-gray-300'
            ]">
              <svg v-if="selectedAnswer === false" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="flex-grow">
            <div class="flex items-center">
              <span class="text-xl font-bold text-red-700 mr-3">FAUX</span>
              <span class="text-gray-700">Cette affirmation est incorrecte</span>
            </div>
          </div>
          <!-- Feedback icon -->
          <div v-if="showFeedback" class="flex-shrink-0 ml-3">
            <svg v-if="correctAnswer === false" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="selectedAnswer === false && correctAnswer !== false" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback section -->
    <div v-if="showFeedback && selectedAnswer !== null" class="feedback-section mt-6 p-4 rounded-lg">
      <div v-if="isCorrect" class="text-green-800 bg-green-100 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Correct !</span>
        </div>
        <p class="mt-2 text-sm">{{ correctFeedback || 'Excellente réponse !' }}</p>
      </div>
      <div v-else class="text-red-800 bg-red-100 border border-red-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Incorrect</span>
        </div>
        <p class="mt-2 text-sm">{{ incorrectFeedback || 'Réessayez, vous pouvez y arriver !' }}</p>
      </div>
    </div>

    <!-- Submit button -->
    <div v-if="!showFeedback" class="submit-section mt-6">
      <button
        @click="submitAnswer"
        :disabled="selectedAnswer === null"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-200',
          selectedAnswer !== null
            ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Valider ma réponse
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  question: string;
  description?: string;
  correctAnswer: boolean;
  correctFeedback?: string;
  incorrectFeedback?: string;
  showFeedback?: boolean;
  allowMultipleAttempts?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: false,
  allowMultipleAttempts: true,
});

const emit = defineEmits<{
  answerSelected: [answer: boolean];
  answerSubmitted: [answer: boolean, isCorrect: boolean];
  completed: [isCorrect: boolean];
}>();

// State
const selectedAnswer = ref<boolean | null>(null);
const hasSubmitted = ref(false);

// Computed
const isCorrect = computed(() => selectedAnswer.value === props.correctAnswer);

// Methods
const selectOption = (value: boolean) => {
  if (hasSubmitted.value && !props.allowMultipleAttempts) return;
  
  selectedAnswer.value = value;
  emit('answerSelected', value);
};

const submitAnswer = () => {
  if (selectedAnswer.value === null) return;
  
  hasSubmitted.value = true;
  const correct = isCorrect.value;
  
  emit('answerSubmitted', selectedAnswer.value, correct);
  emit('completed', correct);
};

const getFeedbackClass = (value: boolean): string => {
  if (!hasSubmitted.value) return '';
  
  if (value === props.correctAnswer) {
    return 'border-green-400 bg-green-100';
  } else if (value === selectedAnswer.value && value !== props.correctAnswer) {
    return 'border-red-400 bg-red-100';
  }
  
  return '';
};
</script>

<style scoped>
.vue-true-false-renderer {
  max-width: 42rem;
  margin: 0 auto;
}

.option-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.option-item:active {
  transform: translateY(0);
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

/* Custom styling for True/False options */
.true-option {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.false-option {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .option-item {
    padding: 1rem;
  }
  
  .true-option .text-xl,
  .false-option .text-xl {
    font-size: 1.125rem;
  }
}
</style>
