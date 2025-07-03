<template>
  <div class="fill-blanks-creator space-y-6">
    <h3 class="text-lg font-medium text-gray-900">Configuration Texte à Trous</h3>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Texte avec des blancs
      </label>
      <div class="mb-2 text-sm text-gray-600">
        Utilisez *mot* pour créer un blanc. Exemple: "La capitale de la France est *Paris*."
      </div>
      <textarea
        v-model="data.text"
        rows="6"
        placeholder="Entrez votre texte avec des blancs marqués par *mot*"
        class="input-field"
      ></textarea>
    </div>

    <div v-if="detectedBlanks.length > 0">
      <h4 class="text-md font-medium text-gray-900 mb-3">Blancs détectés</h4>
      <div class="space-y-3">
        <div
          v-for="(blank, index) in detectedBlanks"
          :key="index"
          class="p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Réponse(s) acceptée(s) pour "{{ blank.detected }}"
              </label>
              <input
                v-model="blank.answers"
                type="text"
                placeholder="Réponse principale, réponse alternative"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
              <div class="mt-1 text-xs text-gray-500">
                Séparez plusieurs réponses par des virgules
              </div>
            </div>
            <div class="flex-shrink-0">
              <label class="flex items-center space-x-2">
                <input
                  v-model="blank.caseSensitive"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                >
                <span class="text-sm text-gray-700">Sensible à la casse</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="data.text.trim()">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">Information</h3>
            <div class="mt-2 text-sm text-blue-700">
              Aucun blanc détecté. Utilisez la syntaxe *mot* pour créer des blancs dans votre texte.
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface BlankItem {
  detected: string;
  answers: string;
  caseSensitive: boolean;
}

interface FillBlanksData {
  text: string;
  blanks: BlankItem[];
}

interface Props {
  modelValue: FillBlanksData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    text: '',
    blanks: [],
  }),
});

const emit = defineEmits<{
  'update:modelValue': [value: FillBlanksData];
}>();

const data = ref<FillBlanksData>({ 
  text: props.modelValue?.text || '',
  blanks: props.modelValue?.blanks || []
});

// Computed
const detectedBlanks = computed(() => {
  const blanksRegex = /\*([^*]+)\*/g;
  const matches = [];
  let match;

  while ((match = blanksRegex.exec(data.value.text)) !== null) {
    const detected = match[1];
    const existing = data.value.blanks.find(b => b.detected === detected);
    
    matches.push({
      detected,
      answers: existing?.answers || detected,
      caseSensitive: existing?.caseSensitive || false,
    });
  }

  // Update the blanks array
  data.value.blanks = matches;
  
  return matches;
});

// Watchers
watch(data, (newData) => {
  emit('update:modelValue', newData);
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  data.value = { ...newValue };
}, { deep: true });
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

/* Custom styling for preview blanks */
:deep(.blank-preview) {
  display: inline-block;
  background-color: #dbeafe;
  border-bottom: 2px solid #93c5fd;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem;
  color: #1e40af;
  font-weight: 500;
}
</style>
