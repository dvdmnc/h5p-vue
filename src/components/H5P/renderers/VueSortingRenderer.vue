<template>
  <div class="vue-sorting-renderer">
    <!-- Instructions -->
    <div class="instructions mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
      <p class="text-blue-700">Glissez et déposez les éléments pour les organiser dans le bon ordre.</p>
    </div>

    <!-- Sortable items container -->
    <div class="sorting-container">
      <div class="sortable-list space-y-3">
        <div
          v-for="(item, index) in sortableItems"
          :key="item.id"
          :draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragend="handleDragEnd"
          @dragover="handleDragOver($event, index)"
          @dragenter="handleDragEnter($event, index)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, index)"
          :class="[
            'sortable-item',
            'relative p-4 border-2 rounded-lg cursor-move transition-all duration-200 bg-white',
            draggedIndex === index ? 'opacity-50 transform scale-95' : '',
            dropTargetIndex === index ? 'border-primary-500 bg-primary-50' : 'border-gray-200',
            showFeedback && isCompleted ? getItemStatusClass(item, index) : '',
            'hover:border-primary-300 hover:shadow-md'
          ]"
        >
          <!-- Drag handle -->
          <div class="drag-handle absolute left-2 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>

          <!-- Item content -->
          <div class="item-content ml-8 flex items-center justify-between">
            <div class="item-text">
              <span class="text-gray-800 font-medium">{{ item.content }}</span>
              <div v-if="item.description" class="text-sm text-gray-600 mt-1">
                {{ item.description }}
              </div>
            </div>
            
            <!-- Position indicator -->
            <div class="position-indicator flex items-center space-x-2">
              <span class="text-sm text-gray-500">Position {{ index + 1 }}</span>
              <div v-if="showFeedback && isCompleted" class="status-icon">
                <svg 
                  v-if="isItemInCorrectPosition(item, index)"
                  class="w-5 h-5 text-green-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg 
                  v-else
                  class="w-5 h-5 text-red-600" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Drop zone indicator -->
          <div 
            v-if="dropTargetIndex === index && draggedIndex !== index"
            class="drop-indicator absolute inset-0 border-2 border-primary-500 border-dashed rounded-lg bg-primary-50 opacity-75"
          ></div>
        </div>
      </div>
    </div>

    <!-- Feedback section -->
    <div class="feedback-section mt-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-gray-800">Statut de l'organisation</h4>
        <button
          @click="resetOrder"
          class="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          Remettre dans l'ordre initial
        </button>
      </div>
      
      <!-- Progress indicator -->
      <div class="progress-section mb-4">
        <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Éléments bien placés</span>
          <span>{{ correctPositionsCount }} / {{ sortableItems.length }}</span>
        </div>
        <div class="progress-bar w-full bg-gray-200 rounded-full h-2">
          <div 
            class="progress-fill h-2 bg-primary-600 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
      </div>

      <!-- Completion feedback -->
      <div v-if="showFeedback && isCompleted" class="completion-feedback">
        <div v-if="isAllCorrect" class="text-green-800 bg-green-100 p-3 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium">Parfait !</span>
            <span class="ml-2">Tous les éléments sont dans le bon ordre.</span>
          </div>
        </div>
        <div v-else class="text-amber-800 bg-amber-100 p-3 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium">Presque !</span>
            <span class="ml-2">Certains éléments ne sont pas dans le bon ordre.</span>
          </div>
        </div>
      </div>

      <!-- Hint section -->
      <div v-if="showHints && !isAllCorrect" class="hints-section mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <h5 class="font-medium text-blue-800 mb-2">Indice</h5>
        <p class="text-blue-700 text-sm">
          Essayez de réorganiser les éléments selon {{ getSortingHint() }}.
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-section mt-4 flex items-center justify-between">
      <div class="control-buttons space-x-3">
        <button
          @click="shuffleItems"
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Mélanger
        </button>
        <button
          v-if="showCorrectOrder"
          @click="showCorrectOrderPreview = !showCorrectOrderPreview"
          class="px-4 py-2 bg-blue-100 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-200 transition-colors"
        >
          {{ showCorrectOrderPreview ? 'Masquer' : 'Voir' }} l'ordre correct
        </button>
      </div>
      
      <div class="scoring-info text-sm text-gray-600">
        Score: {{ correctPositionsCount }}/{{ sortableItems.length }}
      </div>
    </div>

    <!-- Correct order preview -->
    <div 
      v-if="showCorrectOrderPreview" 
      class="correct-order-preview mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
    >
      <h5 class="font-medium text-green-800 mb-3">Ordre correct :</h5>
      <div class="space-y-2">
        <div
          v-for="(item, index) in correctOrderItems"
          :key="`correct-${item.id}`"
          class="flex items-center p-2 bg-white border border-green-200 rounded"
        >
          <span class="w-6 h-6 bg-green-600 text-white text-sm rounded-full flex items-center justify-center mr-3">
            {{ index + 1 }}
          </span>
          <span class="text-gray-800">{{ item.content }}</span>
        </div>
      </div>
    </div>
    
    <!-- Retry button -->
    <div v-if="showFeedback && isCompleted" class="mt-6 text-center">
      <button
        @click="retryQuestion"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        Réessayer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';

interface SortableItem {
  id: string;
  content: string;
  description?: string;
  correctPosition?: number;
}

interface Props {
  items: SortableItem[];
  correctOrder?: string[];
  showFeedback?: boolean;
  showHints?: boolean;
  showCorrectOrder?: boolean;
  sortingCriteria?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: true,
  showHints: true,
  showCorrectOrder: false,
  sortingCriteria: 'l\'ordre logique'
});

const emit = defineEmits<{
  orderChanged: [currentOrder: string[]];
  completed: [isCorrect: boolean];
  scoreChanged: [score: number, total: number];
}>();

// State
const draggedIndex = ref<number | null>(null);
const dropTargetIndex = ref<number | null>(null);
const showCorrectOrderPreview = ref(false);

// Reactive data
const sortableItems = reactive([...props.items]);
const originalOrder = [...props.items];

// Computed
const correctPositionsCount = computed(() => {
  return sortableItems.filter((item, index) => isItemInCorrectPosition(item, index)).length;
});

const progressPercentage = computed(() => 
  sortableItems.length > 0 ? (correctPositionsCount.value / sortableItems.length) * 100 : 0
);

const isCompleted = computed(() => sortableItems.length > 0);

const isAllCorrect = computed(() => {
  return correctPositionsCount.value === sortableItems.length;
});

const correctOrderItems = computed(() => {
  if (!props.correctOrder) return [];
  
  return props.correctOrder.map(id => 
    props.items.find(item => item.id === id)
  ).filter(Boolean) as SortableItem[];
});

// Watchers
watch(sortableItems, () => {
  const currentOrder = sortableItems.map(item => item.id);
  emit('orderChanged', currentOrder);
  emit('scoreChanged', correctPositionsCount.value, sortableItems.length);
  
  if (isCompleted.value) {
    emit('completed', isAllCorrect.value);
  }
}, { deep: true });

// Methods
const handleDragStart = (event: DragEvent, index: number) => {
  draggedIndex.value = index;
  
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', index.toString());
    event.dataTransfer.effectAllowed = 'move';
  }
};

const handleDragEnd = () => {
  draggedIndex.value = null;
  dropTargetIndex.value = null;
};

const handleDragOver = (event: DragEvent, _index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const handleDragEnter = (event: DragEvent, index: number) => {
  event.preventDefault();
  dropTargetIndex.value = index;
};

const handleDragLeave = () => {
  // Small delay to prevent flicker when moving between child elements
  setTimeout(() => {
    if (draggedIndex.value === null) {
      dropTargetIndex.value = null;
    }
  }, 50);
};

const handleDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();
  
  const dragIndex = parseInt(event.dataTransfer?.getData('text/plain') || '');
  if (isNaN(dragIndex) || dragIndex === dropIndex) return;
  
  // Move item from dragIndex to dropIndex
  const draggedItem = sortableItems[dragIndex];
  sortableItems.splice(dragIndex, 1);
  sortableItems.splice(dropIndex, 0, draggedItem);
  
  dropTargetIndex.value = null;
};

const isItemInCorrectPosition = (item: SortableItem, currentIndex: number): boolean => {
  if (!props.correctOrder) return false;
  
  const correctIndex = props.correctOrder.indexOf(item.id);
  return correctIndex === currentIndex;
};

const getItemStatusClass = (item: SortableItem, index: number): string => {
  if (!props.showFeedback) return '';
  
  return isItemInCorrectPosition(item, index) 
    ? 'border-green-300 bg-green-50' 
    : 'border-red-300 bg-red-50';
};

const resetOrder = () => {
  sortableItems.length = 0;
  sortableItems.push(...originalOrder);
  showCorrectOrderPreview.value = false;
};

const retryQuestion = () => {
  // Reset to original order
  resetOrder();
  
  // Shuffle items for a new attempt
  shuffleItems();
  
  // Emit reset events
  emit('orderChanged', sortableItems.map(item => item.id));
  emit('completed', false);
  emit('scoreChanged', 0, sortableItems.length);
};

const shuffleItems = () => {
  for (let i = sortableItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sortableItems[i], sortableItems[j]] = [sortableItems[j], sortableItems[i]];
  }
};

const getSortingHint = (): string => {
  return props.sortingCriteria || 'l\'ordre logique';
};
</script>

<style scoped>
.vue-sorting-renderer {
  max-width: 600px;
  margin: 0 auto;
}

.sortable-item {
  user-select: none;
  touch-action: none;
}

.sortable-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.drag-handle {
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.drop-indicator {
  animation: pulse 1s infinite;
}

.progress-fill {
  transition: width 0.3s ease-in-out;
}

.completion-feedback {
  animation: fadeIn 0.3s ease-in-out;
}

.correct-order-preview {
  animation: slideDown 0.3s ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .item-content {
    margin-left: 2rem;
  }
  
  .position-indicator {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .controls-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-buttons {
    justify-content: center;
  }
}
</style>
