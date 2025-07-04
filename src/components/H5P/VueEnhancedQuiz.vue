<template>
  <div class="vue-enhanced-quiz">
    <!-- Question type indicator -->
    <div class="question-type-indicator mb-4 text-sm text-gray-600">
      <span class="font-medium">Type de question:</span>
      <span class="ml-2 px-2 py-1 bg-primary-100 text-primary-800 rounded">
        {{ getQuestionTypeLabel(questionType) }}
      </span>
    </div>

    <!-- Multiple Choice Questions -->
    <VueMultipleChoiceRenderer
      v-if="questionType === 'multiple-choice'"
      :question="sampleQuestions['multiple-choice'].question"
      :options="sampleQuestions['multiple-choice'].choices"
      :correct-answer="sampleQuestions['multiple-choice'].correctAnswer"
      :show-feedback="showFeedback"
      @answer-selected="onAnswerSelected"
      @answer-submitted="onAnswerSubmitted"
      @completed="onQuestionCompleted"
    />

    <!-- Fill in Blanks -->
    <VueFillInBlanksRenderer
      v-else-if="questionType === 'fill-in-blanks'"
      :text="sampleQuestions['fill-in-blanks'].text"
      :blanks="sampleQuestions['fill-in-blanks'].blanks"
      :show-progress="true"
      @answer-changed="onFillBlanksAnswerChanged"
      @completed="onQuestionCompleted"
    />

    <!-- Drag and Drop -->
    <VueDragDropRenderer
      v-else-if="questionType === 'drag-drop'"
      :draggable-items="sampleQuestions['drag-drop'].draggableItems"
      :drop-zones="sampleQuestions['drag-drop'].dropZones"
      :show-feedback="showFeedback"
      @drop="onDragDropAction"
      @answer-changed="onDragDropAnswerChanged"
      @completed="onQuestionCompleted"
    />

    <!-- Matching -->
    <VueMatchingRenderer
      v-else-if="questionType === 'matching'"
      :left-items="sampleQuestions['matching'].leftItems"
      :right-items="sampleQuestions['matching'].rightItems"
      :show-feedback="showFeedback"
      @match-created="onMatchCreated"
      @match-removed="onMatchRemoved"
      @completed="onQuestionCompleted"
    />

    <!-- Sorting -->
    <VueSortingRenderer
      v-else-if="questionType === 'sorting'"
      :items="sampleQuestions['sorting'].items"
      :correct-order="sampleQuestions['sorting'].correctOrder"
      :show-feedback="showFeedback"
      @order-changed="onSortingOrderChanged"
      @completed="onQuestionCompleted"
    />

    <!-- Fallback for unsupported question types -->
    <div v-else class="unsupported-question-type p-6 bg-amber-50 border border-amber-200 rounded-lg">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="font-medium text-amber-800">Type de question non pris en charge</span>
      </div>
      <p class="mt-2 text-sm text-amber-700">
        Le type de question "{{ questionType }}" n'est pas encore implémenté dans le mode Vue.js Enhanced.
      </p>
    </div>

    <!-- Submit button for certain question types -->
    <div v-if="needsSubmitButton && !showFeedback" class="submit-section mt-6 text-center">
      <button
        @click="submitAnswer"
        :disabled="!canSubmit"
        :class="[
          'px-8 py-3 rounded-lg font-medium transition-all duration-200',
          canSubmit
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
import { ref, computed, watch } from 'vue';
import VueMultipleChoiceRenderer from './renderers/VueMultipleChoiceRenderer.vue';
import VueFillInBlanksRenderer from './renderers/VueFillInBlanksRenderer.vue';
import VueDragDropRenderer from './renderers/VueDragDropRenderer.vue';
import VueMatchingRenderer from './renderers/VueMatchingRenderer.vue';
import VueSortingRenderer from './renderers/VueSortingRenderer.vue';

interface Props {
  questionType: string;
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: false,
});

const emit = defineEmits<{
  answer: [data: any];
  completed: [result: any];
  progress: [data: any];
}>();

// State
const currentAnswer = ref<any>(null);
const isCompleted = ref(false);
const showFeedback = ref(props.showFeedback);

// Sample questions data
const sampleQuestions = {
  'multiple-choice': {
    question: "Quel est le framework JavaScript le plus populaire pour créer des interfaces utilisateur réactives ?",
    choices: [
      { id: 'a', text: 'jQuery' },
      { id: 'b', text: 'React' },
      { id: 'c', text: 'Vue.js' },
      { id: 'd', text: 'Angular' }
    ],
    correctAnswer: 'c'
  },
  'fill-in-blanks': {
    text: "Vue.js est un framework JavaScript {blank1} qui permet de créer des interfaces utilisateur {blank2}. Il utilise un système de {blank3} pour mettre à jour automatiquement le DOM.",
    blanks: [
      { id: 'blank1', correctAnswers: ['progressif'], position: 0, caseSensitive: false },
      { id: 'blank2', correctAnswers: ['interactives'], position: 1, caseSensitive: false },
      { id: 'blank3', correctAnswers: ['réactivité'], position: 2, caseSensitive: false }
    ]
  },
  'drag-drop': {
    draggableItems: [
      { id: 'vue', content: 'Vue.js', type: 'framework' },
      { id: 'react', content: 'React', type: 'framework' },
      { id: 'css', content: 'CSS', type: 'styling' },
      { id: 'tailwind', content: 'Tailwind', type: 'styling' }
    ],
    dropZones: [
      { id: 'frameworks', label: 'Frameworks JS', acceptsTypes: ['framework'], correctItems: ['vue', 'react'] },
      { id: 'styling', label: 'Technologies de style', acceptsTypes: ['styling'], correctItems: ['css', 'tailwind'] }
    ]
  },
  'matching': {
    leftItems: [
      { id: 'component', content: 'Composant', correctMatch: 'component-def' },
      { id: 'reactivity', content: 'Réactivité', correctMatch: 'reactivity-def' },
      { id: 'directive', content: 'Directive', correctMatch: 'directive-def' }
    ],
    rightItems: [
      { id: 'component-def', content: 'Élément réutilisable encapsulant logique et présentation' },
      { id: 'reactivity-def', content: 'Système de mise à jour automatique des données' },
      { id: 'directive-def', content: 'Instruction spéciale pour manipuler le DOM' }
    ]
  },
  'sorting': {
    items: [
      { id: 'created', content: 'Created - Composant créé' },
      { id: 'mounted', content: 'Mounted - Composant monté dans le DOM' },
      { id: 'updated', content: 'Updated - Composant mis à jour' },
      { id: 'unmounted', content: 'Unmounted - Composant démonté' }
    ],
    correctOrder: ['created', 'mounted', 'updated', 'unmounted']
  }
};

// Computed
const needsSubmitButton = computed(() => {
  return ['drag-drop', 'matching', 'sorting'].includes(props.questionType);
});

const canSubmit = computed(() => {
  return currentAnswer.value !== null && !isCompleted.value;
});

// Methods
const getQuestionTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'multiple-choice': 'QCM',
    'fill-in-blanks': 'Texte à trous',
    'drag-drop': 'Glisser-déposer',
    'matching': 'Associations',
    'sorting': 'Tri'
  };
  return labels[type] || type;
};

const onAnswerSelected = (answer: any) => {
  currentAnswer.value = answer;
  emit('answer', { type: props.questionType, answer });
};

const onAnswerSubmitted = (answer: any, isCorrect: boolean) => {
  currentAnswer.value = answer;
  showFeedback.value = true;
  emit('answer', { type: props.questionType, answer, isCorrect });
};

const onQuestionCompleted = (result: any) => {
  isCompleted.value = true;
  showFeedback.value = true;
  emit('completed', { 
    type: props.questionType, 
    result, 
    answer: currentAnswer.value,
    isCorrect: result === true || result.isCorrect === true
  });
};

const onFillBlanksAnswerChanged = (answers: Record<string, string>) => {
  currentAnswer.value = answers;
  emit('answer', { type: props.questionType, answers });
};

const onDragDropAction = (zoneId: string, item: any) => {
  console.log('Drag drop action:', zoneId, item);
};

const onDragDropAnswerChanged = (answer: Record<string, string[]>) => {
  currentAnswer.value = answer;
  emit('answer', { type: props.questionType, answer });
};

const onMatchCreated = (match: any) => {
  console.log('Match created:', match);
};

const onMatchRemoved = (match: any) => {
  console.log('Match removed:', match);
};

const onSortingOrderChanged = (order: string[]) => {
  currentAnswer.value = order;
  emit('answer', { type: props.questionType, order });
};

const submitAnswer = () => {
  if (!canSubmit.value) return;
  
  showFeedback.value = true;
  emit('completed', { 
    type: props.questionType, 
    answer: currentAnswer.value,
    isCorrect: true // This would be determined by the specific question logic
  });
};

// Watch for question type changes
watch(() => props.questionType, () => {
  currentAnswer.value = null;
  isCompleted.value = false;
  showFeedback.value = props.showFeedback;
});
</script>

<style scoped>
.vue-enhanced-quiz {
  max-width: 4xl;
  margin: 0 auto;
}

.question-type-indicator {
  text-align: center;
}

.submit-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.unsupported-question-type {
  text-align: center;
}
</style>