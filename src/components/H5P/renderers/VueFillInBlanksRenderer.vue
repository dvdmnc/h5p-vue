<template>
  <div class="vue-fill-in-blanks-renderer">
    <div class="fill-blanks-content prose prose-lg max-w-none">
      <div v-html="renderedText" class="fill-blanks-text"></div>
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
}

const props = withDefaults(defineProps<Props>(), {
  showProgress: true,
  validateOnInput: true,
  caseSensitive: false,
});

const emit = defineEmits<{
  answerChanged: [answers: Record<string, string>];
  completed: [isCompleted: boolean];
  blankValidated: [blankId: string, isCorrect: boolean];
}>();

// State
const answers = ref<Record<string, string>>({});
const validationResults = ref<Record<string, boolean>>({});

// Computed
const renderedText = computed(() => {
  let result = props.text;
  
  // Replace {{1}}, {{2}}, etc. with input fields
  props.blanks.forEach(blank => {
    const placeholder = `{{${blank.position}}}`;
    const inputHtml = createInputHtml(blank);
    result = result.replace(placeholder, inputHtml);
  });
  
  return result;
});

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

// Methods
const createInputHtml = (blank: Blank): string => {
  const value = answers.value[blank.id] || '';
  const isValid = validationResults.value[blank.id];
  const validationClass = props.validateOnInput && value ? 
    (isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 
    'border-blue-300 bg-white';
    
  return `
    <input 
      type="text" 
      id="blank-${blank.id}"
      value="${value}"
      placeholder="..."
      class="inline-block px-2 py-1 mx-1 rounded border-2 text-center font-medium min-w-16 transition-colors duration-200 ${validationClass}"
      onchange="window.updateBlankAnswer('${blank.id}', this.value)"
      oninput="window.updateBlankAnswer('${blank.id}', this.value)"
    />
  `;
};

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

const updateAnswer = (blankId: string, value: string) => {
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

// Global function for input onChange
const setupGlobalHandler = () => {
  (window as any).updateBlankAnswer = (blankId: string, value: string) => {
    updateAnswer(blankId, value);
  };
};

// Watchers
watch(() => props.text, () => {
  answers.value = {};
  validationResults.value = {};
}, { deep: true });

watch(() => props.blanks, () => {
  answers.value = {};
  validationResults.value = {};
}, { deep: true });

// Lifecycle
onMounted(() => {
  setupGlobalHandler();
});
</script>

<style scoped>
.vue-fill-in-blanks-renderer {
  @apply space-y-4;
}

.fill-blanks-content {
  @apply text-gray-800 leading-relaxed;
}

/* Custom styles for dynamically created inputs */
.fill-blanks-text :deep(input) {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.fill-blanks-text :deep(input:focus) {
  @apply outline-none ring-2 ring-blue-500 ring-opacity-50;
}

.fill-blanks-text :deep(input.border-green-500) {
  @apply shadow-sm;
}

.fill-blanks-text :deep(input.border-red-500) {
  @apply shadow-sm;
}
</style>
