<template>
  <div class="sorting-creator space-y-6">
    <h3 class="text-lg font-medium text-gray-900">Configuration Tri</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type de tri
        </label>
        <select v-model="data.sortType" class="input-field">
          <option value="alphabetical">Alphabétique</option>
          <option value="numerical">Numérique</option>
          <option value="chronological">Chronologique</option>
          <option value="logical">Logique</option>
          <option value="custom">Ordre personnalisé</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Instructions pour l'utilisateur
        </label>
        <textarea
          v-model="data.instructions"
          rows="3"
          placeholder="Expliquez comment trier les éléments..."
          class="input-field"
        ></textarea>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-md font-medium text-gray-900">Éléments à trier</h4>
        <button
          @click="addItem"
          type="button"
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter
        </button>
      </div>

      <div v-if="data.items.length === 0" class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        <p class="mt-2">Aucun élément à trier. Cliquez sur "Ajouter" pour commencer.</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(item, index) in data.items"
          :key="item.id"
          class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
        >
          <svg class="w-5 h-5 text-gray-400 cursor-move" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          
          <div class="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
            {{ index + 1 }}
          </div>
          
          <div class="flex-1">
            <input
              v-model="item.content"
              type="text"
              placeholder="Contenu de l'élément..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
          </div>
          
          <div class="flex-shrink-0">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Position correcte
            </label>
            <input
              v-model.number="item.correctOrder"
              type="number"
              :min="1"
              :max="data.items.length"
              class="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
            >
          </div>
          
          <button
            @click="removeItem(index)"
            type="button"
            class="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="data.items.length > 0" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start space-x-2">
          <svg class="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <h5 class="text-sm font-medium text-blue-800">Conseils pour la configuration</h5>
            <ul class="mt-1 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Assurez-vous que chaque élément a une position correcte unique</li>
              <li>Les positions doivent être numérotées de 1 à {{ data.items.length }}</li>
              <li>Un contenu clair aide les utilisateurs à comprendre l'ordre attendu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface SortingItem {
  id: string;
  content: string;
  correctOrder: number;
}

interface SortingData {
  sortType: string;
  instructions: string;
  items: SortingItem[];
}

interface Props {
  modelValue: SortingData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    sortType: 'alphabetical',
    instructions: '',
    items: [],
  }),
});

const emit = defineEmits<{
  'update:modelValue': [value: SortingData];
}>();

const data = ref<SortingData>({ 
  sortType: props.modelValue?.sortType || 'alphabetical',
  instructions: props.modelValue?.instructions || '',
  items: props.modelValue?.items || [],
  itemCount: props.modelValue?.itemCount || 4,
  showFeedback: props.modelValue?.showFeedback ?? true,
  allowRetry: props.modelValue?.allowRetry ?? true,
});

// Methods
const addItem = () => {
  const newItem: SortingItem = {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content: '',
    correctOrder: data.value.items.length + 1,
  };
  data.value.items.push(newItem);
};

const removeItem = (index: number) => {
  data.value.items.splice(index, 1);
  // Reorder the remaining items
  data.value.items.forEach((item, i) => {
    if (item.correctOrder > index + 1) {
      item.correctOrder--;
    }
  });
};

// Watchers
watch(data, (newData) => {
  emit('update:modelValue', newData);
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  data.value = { ...newValue };
}, { deep: true });
</script>
