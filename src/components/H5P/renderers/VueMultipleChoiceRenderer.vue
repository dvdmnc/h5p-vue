<template>
  <div class="vue-multiple-choice-renderer">
    <!-- Question -->
    <div class="question-section mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ question }}</h3>
    </div>

    <!-- Options -->
    <div class="options-section space-y-3">
      <div
        v-for="option in options"
        :key="option.id"
        @click="selectOption(option.id)"
        :class="[
          'option-item',
          'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
          selectedAnswer === option.id
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25',
          showFeedback && getOptionFeedbackClass(option.id)
        ]"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0 w-6 h-6 mr-3">
            <div :class="[
              'w-6 h-6 rounded-full border-2 transition-all duration-200',
              selectedAnswer === option.id
                ? 'border-primary-500 bg-primary-500'
                : 'border-gray-300'
            ]">
              <div v-if="selectedAnswer === option.id" class="w-2 h-2 bg-white rounded-full m-1"></div>
            </div>
          </div>
          <div class="flex-grow">
            <span class="text-gray-800 font-medium">{{ option.text }}</span>
          </div>
          <!-- Feedback icon -->
          <div v-if="showFeedback" class="flex-shrink-0 ml-3">
            <svg v-if="option.id === correctAnswer" class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="selectedAnswer === option.id && option.id !== correctAnswer" class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback section -->
    <div v-if="showFeedback && selectedAnswer" class="feedback-section mt-6 p-4 rounded-lg">
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

    <!-- Submit button -->
    <div v-if="!showFeedback" class="submit-section mt-6">
      <button
        @click="submitAnswer"
        :disabled="!selectedAnswer"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-all duration-200',
          selectedAnswer
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

interface Option {
  id: string;
  text: string;
}

interface Props {
  question: string;
  options: Option[];
  correctAnswer: string;
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
  answerSelected: [answerId: string];
  answerSubmitted: [answerId: string, isCorrect: boolean];
  completed: [isCorrect: boolean];
}>();

// State
const selectedAnswer = ref<string | null>(null);
const hasSubmitted = ref(false);

// Computed
const isCorrect = computed(() => selectedAnswer.value === props.correctAnswer);

// Methods
const selectOption = (optionId: string) => {
  if (hasSubmitted.value && !props.allowMultipleAttempts) return;
  
  selectedAnswer.value = optionId;
  emit('answerSelected', optionId);
};

const submitAnswer = () => {
  if (!selectedAnswer.value) return;
  
  hasSubmitted.value = true;
  const correct = isCorrect.value;
  
  emit('answerSubmitted', selectedAnswer.value, correct);
  emit('completed', correct);
};

const getOptionFeedbackClass = (optionId: string): string => {
  if (!hasSubmitted.value) return '';
  
  if (optionId === props.correctAnswer) {
    return 'border-green-300 bg-green-50';
  } else if (optionId === selectedAnswer.value && optionId !== props.correctAnswer) {
    return 'border-red-300 bg-red-50';
  }
  
  return '';
};

const retryQuestion = () => {
  // Reset the question state
  selectedAnswer.value = null;
  hasSubmitted.value = false;
  
  // Emit reset events
  emit('completed', false);
};
</script>

<style scoped>
.vue-multiple-choice-renderer {
  max-width: 32rem;
  margin: 0 auto;
}

.option-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.option-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

/* Mobile optimizations */
@media (max-width: 768px) {
  .option-item {
    padding: 0.75rem;
  }
}
</style>
