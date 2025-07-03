<template>
  <div class="matching-creator space-y-6">
    <h3 class="text-lg font-medium text-gray-900">Configuration Association</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nombre de paires à associer
        </label>
        <input
          v-model.number="data.pairCount"
          type="number"
          min="2"
          max="8"
          class="input-field"
          @change="updatePairsCount"
        >
      </div>

      <!-- Left Items Configuration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Colonne A (Éléments à associer)
        </label>
        <div class="space-y-3">
          <div
            v-for="(item, index) in data.leftItems"
            :key="item.id"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <input
                v-model="item.content"
                type="text"
                :placeholder="`Élément ${index + 1}`"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Right Items Configuration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Colonne B (Éléments de correspondance)
        </label>
        <div class="space-y-3">
          <div
            v-for="(item, index) in data.rightItems"
            :key="item.id"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
              {{ String.fromCharCode(65 + index) }}
            </div>
            <div class="flex-1">
              <input
                v-model="item.content"
                type="text"
                :placeholder="`Réponse ${String.fromCharCode(65 + index)}`"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Correct Pairs Configuration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Associations correctes
        </label>
        <div class="space-y-3">
          <div
            v-for="(pair, index) in data.correctPairs"
            :key="pair.id"
            class="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <div class="flex-1">
              <select
                v-model="pair.leftId"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner un élément (Colonne A)</option>
                <option
                  v-for="(item, itemIndex) in data.leftItems"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ itemIndex + 1 }}. {{ item.content || `Élément ${itemIndex + 1}` }}
                </option>
              </select>
            </div>
            
            <div class="flex-shrink-0 text-gray-400">↔</div>
            
            <div class="flex-1">
              <select
                v-model="pair.rightId"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Sélectionner une réponse (Colonne B)</option>
                <option
                  v-for="(item, itemIndex) in data.rightItems"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ String.fromCharCode(65 + itemIndex) }}. {{ item.content || `Réponse ${String.fromCharCode(65 + itemIndex)}` }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center space-x-2">
          <input
            id="randomize-items"
            v-model="data.randomizeItems"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="randomize-items" class="text-sm text-gray-700">
            Mélanger l'ordre des éléments
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
              <li v-if="data.leftItems.some(item => !item.content.trim())">Tous les éléments de la colonne A doivent avoir un contenu</li>
              <li v-if="data.rightItems.some(item => !item.content.trim())">Tous les éléments de la colonne B doivent avoir un contenu</li>
              <li v-if="data.correctPairs.some(pair => !pair.leftId || !pair.rightId)">Toutes les associations doivent être définies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

// Helper function to generate IDs
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

interface MatchingItem {
  id: string;
  content: string;
}

interface CorrectPair {
  id: string;
  leftId: string;
  rightId: string;
}

interface MatchingData {
  pairCount: number;
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
  correctPairs: CorrectPair[];
  randomizeItems: boolean;
  showFeedback: boolean;
}

interface Props {
  modelValue: MatchingData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    pairCount: 4,
    leftItems: [],
    rightItems: [],
    correctPairs: [],
    randomizeItems: false,
    showFeedback: true,
  })
});

const emit = defineEmits<{
  'update:modelValue': [value: MatchingData]
}>();

const data = ref<MatchingData>({ 
  pairCount: props.modelValue?.pairCount || 3,
  leftItems: props.modelValue?.leftItems || [],
  rightItems: props.modelValue?.rightItems || [],
  correctPairs: props.modelValue?.correctPairs || [],
  allowRetry: props.modelValue?.allowRetry ?? true,
  showFeedback: props.modelValue?.showFeedback ?? true,
});

// Initialize with default items if empty
if (data.value.leftItems.length === 0) {
  for (let i = 0; i < data.value.pairCount; i++) {
    data.value.leftItems.push({
      id: generateId(),
      content: ''
    });
  }
}

if (data.value.rightItems.length === 0) {
  for (let i = 0; i < data.value.pairCount; i++) {
    data.value.rightItems.push({
      id: generateId(),
      content: ''
    });
  }
}

if (data.value.correctPairs.length === 0) {
  for (let i = 0; i < data.value.pairCount; i++) {
    data.value.correctPairs.push({
      id: generateId(),
      leftId: '',
      rightId: ''
    });
  }
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  data.value = { ...newValue };
}, { deep: true });

// Emit changes
watch(data, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

const updatePairsCount = () => {
  const currentCount = data.value.leftItems.length;
  const targetCount = data.value.pairCount;

  if (targetCount > currentCount) {
    // Add new items and pairs
    for (let i = currentCount; i < targetCount; i++) {
      data.value.leftItems.push({
        id: generateId(),
        content: ''
      });
      data.value.rightItems.push({
        id: generateId(),
        content: ''
      });
      data.value.correctPairs.push({
        id: generateId(),
        leftId: '',
        rightId: ''
      });
    }
  } else if (targetCount < currentCount) {
    // Remove excess items and pairs
    data.value.leftItems.splice(targetCount);
    data.value.rightItems.splice(targetCount);
    data.value.correctPairs.splice(targetCount);
  }
};

const isValid = computed(() => {
  return data.value.leftItems.every(item => item.content.trim() !== '') &&
         data.value.rightItems.every(item => item.content.trim() !== '') &&
         data.value.correctPairs.every(pair => pair.leftId !== '' && pair.rightId !== '');
});
</script>

<style scoped>
.input-field {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
}

.input-field:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  border-color: transparent;
}

/* Focus states */
input:focus,
select:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

/* Custom checkbox styling */
input[type="checkbox"]:checked {
  background-color: #6366f1;
  border-color: #6366f1;
}
</style>
