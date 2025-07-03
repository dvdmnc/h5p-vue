<template>
  <div class="multiple-choice-creator space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-gray-900">Configuration QCM</h3>
      <div class="flex items-center space-x-2">
        <input
          id="allow-multiple"
          v-model="data.allowMultiple"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="allow-multiple" class="text-sm text-gray-700">
          Autoriser plusieurs réponses
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Choix de réponses
      </label>
      
      <div class="space-y-3">
        <div
          v-for="(choice, index) in data.choices"
          :key="choice.id"
          class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
        >
          <!-- Correct answer indicator -->
          <div class="flex-shrink-0">
            <input
              v-if="data.allowMultiple"
              :checked="choice.isCorrect"
              @change="toggleCorrect(index)"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <input
              v-else
              :checked="choice.isCorrect"
              @change="toggleCorrect(index)"
              type="radio"
              :name="`correct-${index}`"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            >
          </div>

          <!-- Choice text -->
          <div class="flex-1">
            <input
              v-model="choice.text"
              type="text"
              :placeholder="`Choix ${index + 1}`"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
          </div>

          <!-- Remove button -->
          <button
            v-if="data.choices.length > 2"
            @click="removeChoice(index)"
            type="button"
            class="flex-shrink-0 p-1 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
          >
            <TrashIcon class="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        @click="addChoice"
        type="button"
        class="mt-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Ajouter un choix
      </button>
    </div>

    <!-- Feedback section -->
    <div v-if="data.showFeedback" class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">
        Commentaires individuels (optionnel)
      </label>
      <div
        v-for="(choice, index) in data.choices"
        :key="`feedback-${choice.id}`"
        class="space-y-2"
      >
        <div class="text-sm text-gray-500">Commentaire pour : "{{ choice.text || `Choix ${index + 1}` }}"</div>
        <textarea
          v-model="choice.feedback"
          :placeholder="`Commentaire affiché après sélection du choix ${index + 1}`"
          rows="2"
          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        ></textarea>
      </div>
    </div>

    <!-- Additional options -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex items-center space-x-2">
        <input
          id="randomize-choices"
          v-model="data.randomizeChoices"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="randomize-choices" class="text-sm text-gray-700">
          Mélanger l'ordre des choix
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="show-feedback"
          v-model="data.showFeedback"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="show-feedback" class="text-sm text-gray-700">
          Afficher les commentaires
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="allow-retry"
          v-model="data.allowRetry"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="allow-retry" class="text-sm text-gray-700">
          Autoriser les nouvelles tentatives
        </label>
      </div>

      <div class="flex items-center space-x-2">
        <input
          id="show-solution"
          v-model="data.showSolution"
          type="checkbox"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        >
        <label for="show-solution" class="text-sm text-gray-700">
          Afficher la solution
        </label>
      </div>
    </div>

    <!-- Validation status -->
    <div v-if="!isValid" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Configuration incomplète</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <ul class="list-disc pl-5 space-y-1">
              <li v-if="data.choices.length < 2">Au moins 2 choix sont requis</li>
              <li v-if="correctChoicesCount === 0">Au moins un choix correct doit être défini</li>
              <li v-if="data.choices.some(choice => choice.text.trim() === '')">Tous les choix doivent avoir un texte</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'

// Helper function to generate IDs - outside component
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export default {
  components: {
    TrashIcon,
    PlusIcon
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        choices: [
          { id: generateId(), text: '', isCorrect: false, feedback: '' },
          { id: generateId(), text: '', isCorrect: false, feedback: '' },
        ],
        allowMultiple: false,
        randomizeChoices: false,
        showFeedback: true,
        allowRetry: true,
        showSolution: true,
      })
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const data = ref({ ...props.modelValue });

    // Watch for external changes
    watch(() => props.modelValue, (newValue) => {
      data.value = { ...newValue };
    }, { deep: true });

    // Emit changes
    watch(data, (newValue) => {
      emit('update:modelValue', newValue);
    }, { deep: true });

    const addChoice = () => {
      data.value.choices.push({
        id: generateId(),
        text: '',
        isCorrect: false,
        feedback: ''
      });
    };

    const removeChoice = (index) => {
      if (data.value.choices.length > 2) {
        data.value.choices.splice(index, 1);
      }
    };

    const toggleCorrect = (index) => {
      if (!data.value.allowMultiple) {
        // Single choice mode: uncheck all others
        data.value.choices.forEach((choice, i) => {
          if (i !== index) {
            choice.isCorrect = false;
          }
        });
      }
      data.value.choices[index].isCorrect = !data.value.choices[index].isCorrect;
    };

    const correctChoicesCount = computed(() => {
      return data.value.choices.filter(choice => choice.isCorrect).length;
    });

    const isValid = computed(() => {
      return data.value.choices.length >= 2 && 
             correctChoicesCount.value > 0 && 
             data.value.choices.every(choice => choice.text.trim() !== '');
    });

    // Initialize data if empty
    if (!props.modelValue.choices || props.modelValue.choices.length === 0) {
      data.value.choices = [
        { id: generateId(), text: '', isCorrect: false, feedback: '' },
        { id: generateId(), text: '', isCorrect: false, feedback: '' },
      ];
    }

    return {
      data,
      addChoice,
      removeChoice,
      toggleCorrect,
      correctChoicesCount,
      isValid
    };
  }
}
</script>

<style scoped>
/* Custom radio button styling for single choice mode */
input[type="radio"] {
  @apply rounded-full;
}

/* Focus states */
input:focus {
  @apply ring-2 ring-primary-500 ring-opacity-50;
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  @apply bg-primary-600 border-primary-600;
}
</style>
