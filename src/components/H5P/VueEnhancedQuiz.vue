<template>
  <div class="vue-enhanced-quiz">
    <div class="quiz-header mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        Vue Enhanced Quiz ({{ questionType }})
      </h3>
      <p class="text-sm text-gray-600">
        This is a Vue.js native implementation of the H5P question type
      </p>
    </div>

    <!-- Multiple Choice -->
    <div v-if="questionType === 'multiple-choice'" class="multiple-choice-quiz">
      <div class="question mb-4">
        <h4 class="text-base font-medium text-gray-800 mb-3">
          What is the capital of France?
        </h4>
        <div class="options space-y-2">
          <label v-for="(option, index) in multipleChoiceOptions" :key="index" class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              :value="option.value"
              v-model="selectedAnswer"
              class="mr-3"
              @change="onAnswerChange"
            />
            <span>{{ option.text }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Fill in Blanks -->
    <div v-if="questionType === 'fill-in-blanks'" class="fill-blanks-quiz">
      <div class="question mb-4">
        <h4 class="text-base font-medium text-gray-800 mb-3">
          Complete the sentence:
        </h4>
        <p class="text-gray-700">
          The <input
            type="text"
            v-model="blankAnswer"
            @input="onAnswerChange"
            placeholder="capital"
            class="inline-block mx-1 px-2 py-1 border-b-2 border-blue-400 focus:outline-none focus:border-blue-600 bg-transparent"
          /> of France is Paris.
        </p>
      </div>
    </div>

    <!-- True/False -->
    <div v-if="questionType === 'true-false'" class="true-false-quiz">
      <div class="question mb-4">
        <h4 class="text-base font-medium text-gray-800 mb-3">
          Paris is the capital of France.
        </h4>
        <div class="options flex space-x-4">
          <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              value="true"
              v-model="selectedAnswer"
              class="mr-3"
              @change="onAnswerChange"
            />
            <span class="text-green-600 font-medium">True</span>
          </label>
          <label class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              value="false"
              v-model="selectedAnswer"
              class="mr-3"
              @change="onAnswerChange"
            />
            <span class="text-red-600 font-medium">False</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Default fallback -->
    <div v-if="!isKnownQuestionType" class="default-quiz">
      <div class="p-4 bg-gray-100 rounded-lg">
        <p class="text-gray-600">
          Vue Enhanced Quiz for question type "{{ questionType }}" is not implemented yet.
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Available types: multiple-choice, fill-in-blanks, true-false
        </p>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="quiz-actions mt-6">
      <button
        @click="submitAnswer"
        :disabled="!hasAnswer"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Answer
      </button>
    </div>

    <!-- Results -->
    <div v-if="showResults" class="quiz-results mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Results</h4>
      <div class="text-sm text-gray-600">
        <p><strong>Your Answer:</strong> {{ displayAnswer }}</p>
        <p><strong>Correct:</strong> {{ isCorrect ? 'Yes' : 'No' }}</p>
        <p><strong>Score:</strong> {{ score }}/{{ maxScore }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props
interface Props {
  questionType: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  answer: [data: any]
}>()

// State
const selectedAnswer = ref('')
const blankAnswer = ref('')
const showResults = ref(false)
const score = ref(0)
const maxScore = ref(1)

// Sample data
const multipleChoiceOptions = [
  { value: 'london', text: 'London' },
  { value: 'paris', text: 'Paris' },
  { value: 'berlin', text: 'Berlin' },
  { value: 'madrid', text: 'Madrid' }
]

// Computed
const isKnownQuestionType = computed(() => {
  return ['multiple-choice', 'fill-in-blanks', 'true-false'].includes(props.questionType)
})

const hasAnswer = computed(() => {
  if (props.questionType === 'fill-in-blanks') {
    return blankAnswer.value.trim() !== ''
  }
  return selectedAnswer.value !== ''
})

const displayAnswer = computed(() => {
  if (props.questionType === 'fill-in-blanks') {
    return blankAnswer.value
  }
  return selectedAnswer.value
})

const isCorrect = computed(() => {
  switch (props.questionType) {
    case 'multiple-choice':
      return selectedAnswer.value === 'paris'
    case 'fill-in-blanks':
      return blankAnswer.value.toLowerCase().includes('capital')
    case 'true-false':
      return selectedAnswer.value === 'true'
    default:
      return false
  }
})

// Methods
const onAnswerChange = () => {
  emit('answer', {
    type: props.questionType,
    answer: props.questionType === 'fill-in-blanks' ? blankAnswer.value : selectedAnswer.value,
    completed: false
  })
}

const submitAnswer = () => {
  showResults.value = true
  score.value = isCorrect.value ? 1 : 0
  
  emit('answer', {
    type: props.questionType,
    answer: props.questionType === 'fill-in-blanks' ? blankAnswer.value : selectedAnswer.value,
    completed: true,
    correct: isCorrect.value,
    score: score.value,
    maxScore: maxScore.value
  })
}

// Watch for question type changes
watch(() => props.questionType, () => {
  selectedAnswer.value = ''
  blankAnswer.value = ''
  showResults.value = false
  score.value = 0
})
</script>

<style scoped>
.vue-enhanced-quiz {
  max-width: 600px;
  margin: 0 auto;
}

.options input[type="radio"] {
  width: 18px;
  height: 18px;
}

.quiz-actions button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.quiz-actions button:disabled:hover {
  background-color: #9ca3af;
}
</style>
