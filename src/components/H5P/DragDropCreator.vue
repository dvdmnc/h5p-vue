<template>
  <div class="drag-drop-creator space-y-6">
    <h3 class="text-lg font-medium text-gray-900">Configuration Glisser-Déposer</h3>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image de fond (URL optionnelle)
        </label>
        <input
          v-model="data.backgroundImage"
          type="url"
          placeholder="https://exemple.com/image.jpg"
          class="input-field"
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre d'éléments à glisser
          </label>
          <input
            v-model.number="data.itemCount"
            type="number"
            min="1"
            max="10"
            class="input-field"
            @change="updateItemsCount"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de zones de dépôt
          </label>
          <input
            v-model.number="data.dropZoneCount"
            type="number"
            min="1"
            max="10"
            class="input-field"
            @change="updateDropZonesCount"
          >
        </div>
      </div>

      <!-- Draggable Items Configuration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Éléments à glisser
        </label>
        <div class="space-y-3">
          <div
            v-for="(item, index) in data.draggableItems"
            :key="item.id"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <input
                v-model="item.text"
                type="text"
                :placeholder="`Élément ${index + 1}`"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
            </div>
            <div class="flex-shrink-0">
              <select
                v-model="item.correctZone"
                class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Zone correcte</option>
                <option
                  v-for="(zone, zoneIndex) in data.dropZones"
                  :key="zone.id"
                  :value="zone.id"
                >
                  Zone {{ zoneIndex + 1 }}: {{ zone.label || `Zone ${zoneIndex + 1}` }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Drop Zones Configuration -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Zones de dépôt
        </label>
        <div class="space-y-3">
          <div
            v-for="(zone, index) in data.dropZones"
            :key="zone.id"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-medium text-green-600">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <input
                v-model="zone.label"
                type="text"
                :placeholder="`Zone ${index + 1}`"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Options -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center space-x-2">
          <input
            id="snap-to-grid"
            v-model="data.snapToGrid"
            type="checkbox"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="snap-to-grid" class="text-sm text-gray-700">
            Alignement sur grille
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
              <li v-if="data.draggableItems.some(item => !item.text.trim())">Tous les éléments doivent avoir un texte</li>
              <li v-if="data.dropZones.some(zone => !zone.label.trim())">Toutes les zones doivent avoir un libellé</li>
              <li v-if="data.draggableItems.some(item => !item.correctZone)">Chaque élément doit avoir une zone correcte assignée</li>
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

interface DragDropItem {
  id: string;
  text: string;
  correctZone: string;
}

interface DropZone {
  id: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface DragDropData {
  backgroundImage: string;
  itemCount: number;
  dropZoneCount: number;
  draggableItems: DragDropItem[];
  dropZones: DropZone[];
  snapToGrid: boolean;
  showFeedback: boolean;
}

interface Props {
  modelValue: DragDropData;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    backgroundImage: '',
    itemCount: 4,
    dropZoneCount: 4,
    draggableItems: [],
    dropZones: [],
    snapToGrid: true,
    showFeedback: true,
  })
});

const emit = defineEmits<{
  'update:modelValue': [value: DragDropData]
}>();

const data = ref<DragDropData>({ ...props.modelValue });

// Initialize with default items if empty
if (data.value.draggableItems.length === 0) {
  for (let i = 0; i < data.value.itemCount; i++) {
    data.value.draggableItems.push({
      id: generateId(),
      text: '',
      correctZone: ''
    });
  }
}

if (data.value.dropZones.length === 0) {
  for (let i = 0; i < data.value.dropZoneCount; i++) {
    data.value.dropZones.push({
      id: generateId(),
      label: ''
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

const updateItemsCount = () => {
  const currentCount = data.value.draggableItems.length;
  const targetCount = data.value.itemCount;

  if (targetCount > currentCount) {
    // Add new items
    for (let i = currentCount; i < targetCount; i++) {
      data.value.draggableItems.push({
        id: generateId(),
        text: '',
        correctZone: ''
      });
    }
  } else if (targetCount < currentCount) {
    // Remove excess items
    data.value.draggableItems.splice(targetCount);
  }
};

const updateDropZonesCount = () => {
  const currentCount = data.value.dropZones.length;
  const targetCount = data.value.dropZoneCount;

  if (targetCount > currentCount) {
    // Add new zones
    for (let i = currentCount; i < targetCount; i++) {
      data.value.dropZones.push({
        id: generateId(),
        label: ''
      });
    }
  } else if (targetCount < currentCount) {
    // Remove excess zones and clear references
    const removedZoneIds = data.value.dropZones.slice(targetCount).map(zone => zone.id);
    data.value.dropZones.splice(targetCount);
    
    // Clear correctZone references for removed zones
    data.value.draggableItems.forEach(item => {
      if (removedZoneIds.includes(item.correctZone)) {
        item.correctZone = '';
      }
    });
  }
};

const isValid = computed(() => {
  return data.value.draggableItems.every(item => item.text.trim() !== '' && item.correctZone !== '') &&
         data.value.dropZones.every(zone => zone.label.trim() !== '');
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
