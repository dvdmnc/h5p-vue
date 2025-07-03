<template>
  <div class="vue-drag-drop-renderer">
    <!-- Zone de glissement -->
    <div class="draggable-items-section mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Éléments à glisser :</h3>
      <div class="draggable-items-container flex flex-wrap gap-3">
        <div
          v-for="item in availableItems"
          :key="item.id"
          :draggable="!item.placed"
          @dragstart="handleDragStart($event, item)"
          @dragend="handleDragEnd"
          :class="[
            'draggable-item',
            'px-4 py-2 bg-white border-2 rounded-lg shadow-sm cursor-move transition-all duration-200',
            item.placed 
              ? 'opacity-50 cursor-not-allowed border-gray-200' 
              : 'border-primary-300 hover:border-primary-500 hover:shadow-md hover:transform hover:scale-105',
            isDragging && currentDragItem?.id === item.id ? 'opacity-50 transform scale-95' : ''
          ]"
        >
          <span class="text-gray-800 font-medium select-none">{{ item.content }}</span>
        </div>
      </div>
    </div>

    <!-- Zones de dépôt -->
    <div class="drop-zones-section">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Zones de dépôt :</h3>
      <div class="drop-zones-container space-y-4">
        <div
          v-for="zone in dropZones"
          :key="zone.id"
          @dragover="handleDragOver"
          @dragenter="handleDragEnter($event, zone)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, zone)"
          :class="[
            'drop-zone',
            'relative min-h-16 p-4 border-2 border-dashed rounded-lg transition-all duration-200',
            zone.acceptsTypes ? `accepts-${zone.acceptsTypes.join('-')}` : '',
            isValidDropTarget(zone) 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50',
            dragOverZone?.id === zone.id ? 'border-primary-500 bg-primary-50' : ''
          ]"
        >
          <div class="drop-zone-label text-sm font-medium text-gray-600 mb-2">
            {{ zone.label }}
          </div>
          
          <!-- Éléments déposés -->
          <div v-if="zone.droppedItems?.length" class="dropped-items space-y-2">
            <div
              v-for="item in zone.droppedItems"
              :key="item.id"
              class="dropped-item flex items-center justify-between p-2 bg-white border border-gray-200 rounded shadow-sm"
            >
              <span class="text-gray-800">{{ item.content }}</span>
              <button
                @click="removeItem(zone.id, item.id)"
                class="text-red-500 hover:text-red-700 p-1"
                title="Retirer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Placeholder -->
          <div v-else class="drop-placeholder text-gray-400 text-center py-4">
            Glissez et déposez les éléments ici
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback et progression -->
    <div class="feedback-section mt-6 p-4 bg-white rounded-lg border">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-gray-800">Progression</h4>
        <span class="text-sm text-gray-600">
          {{ placedItemsCount }} / {{ totalItems }} éléments placés
        </span>
      </div>
      
      <div class="progress-bar w-full bg-gray-200 rounded-full h-2">
        <div 
          class="progress-fill h-2 bg-primary-600 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <div v-if="showFeedback" class="feedback-message mt-3 p-3 rounded-md">
        <div v-if="isCompleted && isCorrect" class="text-green-800 bg-green-100">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Excellent ! Tous les éléments sont correctement placés.
          </div>
        </div>
        <div v-else-if="isCompleted && !isCorrect" class="text-amber-800 bg-amber-100">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Certains éléments ne sont pas dans la bonne zone. Vérifiez vos réponses.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

interface DraggableItem {
  id: string;
  content: string;
  type?: string;
  placed?: boolean;
}

interface DropZone {
  id: string;
  label: string;
  acceptsTypes?: string[];
  correctItems?: string[];
  droppedItems?: DraggableItem[];
}

interface Props {
  draggableItems: DraggableItem[];
  dropZones: DropZone[];
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: true
});

const emit = defineEmits<{
  drop: [zoneId: string, item: DraggableItem];
  dragStart: [item: DraggableItem];
  answerChanged: [answer: Record<string, string[]>];
  completed: [isCorrect: boolean];
}>();

// State
const isDragging = ref(false);
const currentDragItem = ref<DraggableItem | null>(null);
const dragOverZone = ref<DropZone | null>(null);

// Reactive data
const availableItems = reactive(
  props.draggableItems.map(item => ({ ...item, placed: false }))
);

const zones = reactive(
  props.dropZones.map(zone => ({ ...zone, droppedItems: [] as DraggableItem[] }))
);

// Computed
const placedItemsCount = computed(() => 
  availableItems.filter(item => item.placed).length
);

const totalItems = computed(() => availableItems.length);

const progressPercentage = computed(() => 
  totalItems.value > 0 ? (placedItemsCount.value / totalItems.value) * 100 : 0
);

const isCompleted = computed(() => placedItemsCount.value === totalItems.value);

const isCorrect = computed(() => {
  if (!isCompleted.value) return false;
  
  return zones.every(zone => {
    if (!zone.correctItems) return true;
    const droppedIds = zone.droppedItems?.map(item => item.id) || [];
    return zone.correctItems.every(id => droppedIds.includes(id)) &&
           droppedIds.every(id => zone.correctItems!.includes(id));
  });
});

// Methods
const handleDragStart = (event: DragEvent, item: DraggableItem) => {
  if (item.placed) {
    event.preventDefault();
    return;
  }
  
  isDragging.value = true;
  currentDragItem.value = item;
  
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', item.id);
    event.dataTransfer.effectAllowed = 'move';
  }
  
  emit('dragStart', item);
};

const handleDragEnd = () => {
  isDragging.value = false;
  currentDragItem.value = null;
  dragOverZone.value = null;
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};

const handleDragEnter = (event: DragEvent, zone: DropZone) => {
  event.preventDefault();
  dragOverZone.value = zone;
};

const handleDragLeave = (event: DragEvent) => {
  // Only clear if leaving the drop zone entirely
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    dragOverZone.value = null;
  }
};

const handleDrop = (event: DragEvent, zone: DropZone) => {
  event.preventDefault();
  
  const itemId = event.dataTransfer?.getData('text/plain');
  if (!itemId) return;
  
  const item = availableItems.find(i => i.id === itemId);
  if (!item || item.placed) return;
  
  // Check if zone accepts this item type
  if (zone.acceptsTypes && item.type && !zone.acceptsTypes.includes(item.type)) {
    return;
  }
  
  // Add item to zone
  if (!zone.droppedItems) {
    zone.droppedItems = [];
  }
  zone.droppedItems.push({ ...item });
  
  // Mark item as placed
  item.placed = true;
  
  dragOverZone.value = null;
  
  emit('drop', zone.id, item);
  emitAnswerChanged();
  
  if (isCompleted.value) {
    emit('completed', isCorrect.value);
  }
};

const isValidDropTarget = (zone: DropZone): boolean => {
  if (!currentDragItem.value) return false;
  
  if (zone.acceptsTypes && currentDragItem.value.type) {
    return zone.acceptsTypes.includes(currentDragItem.value.type);
  }
  
  return true;
};

const removeItem = (zoneId: string, itemId: string) => {
  const zone = zones.find(z => z.id === zoneId);
  if (!zone?.droppedItems) return;
  
  const itemIndex = zone.droppedItems.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return;
  
  zone.droppedItems.splice(itemIndex, 1);
  
  // Mark item as available again
  const item = availableItems.find(i => i.id === itemId);
  if (item) {
    item.placed = false;
  }
  
  emitAnswerChanged();
};

const emitAnswerChanged = () => {
  const answer: Record<string, string[]> = {};
  zones.forEach(zone => {
    answer[zone.id] = zone.droppedItems?.map(item => item.id) || [];
  });
  emit('answerChanged', answer);
};
</script>

<style scoped>
.vue-drag-drop-renderer {
  @apply max-w-4xl mx-auto;
}

.draggable-item {
  user-select: none;
  touch-action: none;
}

.draggable-item:hover {
  @apply shadow-lg;
}

.drop-zone {
  min-height: 80px;
}

.drop-zone.drag-over {
  @apply border-primary-500 bg-primary-50;
}

.progress-fill {
  transition: width 0.3s ease-in-out;
}

.feedback-message {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .draggable-items-container {
    @apply grid grid-cols-2 gap-2;
  }
  
  .draggable-item {
    @apply text-sm px-3 py-2;
  }
  
  .drop-zone {
    @apply min-h-20 p-3;
  }
}
</style>
