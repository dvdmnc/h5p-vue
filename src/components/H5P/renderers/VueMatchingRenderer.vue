<template>
  <div class="vue-matching-renderer">
    <div class="matching-container">
      <!-- Instructions -->
      <div class="instructions mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
        <p class="text-blue-700">Faites correspondre les éléments de gauche avec ceux de droite en cliquant pour créer des connexions.</p>
      </div>

      <div class="matching-area relative">
        <!-- Left items -->
        <div class="left-column">
          <h4 class="column-title">Éléments à associer</h4>
          <div class="items-list space-y-3">
            <div
              v-for="item in leftItems"
              :key="item.id"
              @click="selectLeftItem(item)"
              :class="[
                'matching-item left-item',
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                selectedLeftItem?.id === item.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25',
                isItemConnected(item.id, 'left') ? 'border-green-300 bg-green-25' : ''
              ]"
            >
              <div class="item-content">
                <span class="text-gray-800 font-medium">{{ item.content }}</span>
              </div>
              
              <!-- Connection point -->
              <div 
                class="connection-point connection-point-right"
                :class="{ 'active': selectedLeftItem?.id === item.id }"
              ></div>
              
              <!-- Connection indicator -->
              <div v-if="isItemConnected(item.id, 'left')" class="connection-indicator">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection lines (SVG overlay) -->
        <svg 
          class="connection-svg"
          :width="svgWidth"
          :height="svgHeight"
          viewBox="0 0 300 400"
        >
          <line
            v-for="connection in connections"
            :key="`${connection.leftId}-${connection.rightId}`"
            :x1="50"
            :y1="getItemPosition(connection.leftId, 'left')"
            :x2="250"
            :y2="getItemPosition(connection.rightId, 'right')"
            :stroke="connection.isCorrect ? '#10b981' : '#6b7280'"
            :stroke-width="connection.isCorrect ? '3' : '2'"
            stroke-linecap="round"
            class="connection-line"
          />
          
          <!-- Preview line when selecting -->
          <line
            v-if="selectedLeftItem && previewConnection"
            :x1="50"
            :y1="getItemPosition(selectedLeftItem.id, 'left')"
            :x2="previewConnection.x"
            :y2="previewConnection.y"
            stroke="#3b82f6"
            stroke-width="2"
            stroke-dasharray="5,5"
            stroke-linecap="round"
            class="preview-line"
          />
        </svg>

        <!-- Right items -->
        <div class="right-column">
          <h4 class="column-title">Correspondances</h4>
          <div class="items-list space-y-3">
            <div
              v-for="item in rightItems"
              :key="item.id"
              @click="selectRightItem(item)"
              @mousemove="updatePreview"
              :class="[
                'matching-item right-item',
                'relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                selectedRightItem?.id === item.id
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25',
                isItemConnected(item.id, 'right') ? 'border-green-300 bg-green-25' : ''
              ]"
            >
              <!-- Connection point -->
              <div 
                class="connection-point connection-point-left"
                :class="{ 'active': selectedRightItem?.id === item.id }"
              ></div>
              
              <div class="item-content">
                <span class="text-gray-800 font-medium">{{ item.content }}</span>
              </div>
              
              <!-- Connection indicator -->
              <div v-if="isItemConnected(item.id, 'right')" class="connection-indicator">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connections list -->
      <div class="connections-section mt-6 p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-semibold text-gray-800">Correspondances créées</h4>
          <button
            v-if="connections.length > 0"
            @click="clearAllConnections"
            class="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Tout effacer
          </button>
        </div>
        
        <div v-if="connections.length === 0" class="text-gray-500 text-center py-4">
          Aucune correspondance créée pour le moment
        </div>
        
        <div v-else class="space-y-2">
          <div
            v-for="(connection, index) in connections"
            :key="`connection-${index}`"
            class="connection-item flex items-center justify-between p-3 bg-white border rounded-lg"
          >
            <div class="connection-content flex items-center space-x-4">
              <span class="text-gray-800">{{ getItemContent(connection.leftId, 'left') }}</span>
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span class="text-gray-800">{{ getItemContent(connection.rightId, 'right') }}</span>
            </div>
            
            <div class="connection-actions flex items-center space-x-2">
              <div 
                v-if="showFeedback"
                :class="[
                  'status-indicator w-5 h-5 rounded-full',
                  connection.isCorrect ? 'bg-green-500' : 'bg-red-500'
                ]"
                :title="connection.isCorrect ? 'Correct' : 'Incorrect'"
              ></div>
              
              <button
                @click="removeConnection(connection.leftId, connection.rightId)"
                class="text-red-500 hover:text-red-700 p-1"
                title="Supprimer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress -->
        <div class="progress-section mt-4">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression</span>
            <span>{{ connections.length }} / {{ leftItems.length }} correspondances</span>
          </div>
          <div class="progress-bar w-full bg-gray-200 rounded-full h-2">
            <div 
              class="progress-fill h-2 bg-primary-600 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

interface MatchingItem {
  id: string;
  content: string;
  correctMatch?: string;
}

interface Connection {
  leftId: string;
  rightId: string;
  isCorrect?: boolean;
}

interface Props {
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
  showFeedback?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showFeedback: true
});

const emit = defineEmits<{
  pairCreated: [leftId: string, rightId: string];
  pairRemoved: [leftId: string, rightId: string];
  answerChanged: [connections: Connection[]];
  completed: [isCorrect: boolean];
}>();

// State
const selectedLeftItem = ref<MatchingItem | null>(null);
const selectedRightItem = ref<MatchingItem | null>(null);
const previewConnection = ref<{ x: number; y: number } | null>(null);
const svgWidth = ref(300);
const svgHeight = ref(400);

// Reactive data
const connections = reactive<Connection[]>([]);

// Computed
const progressPercentage = computed(() => 
  props.leftItems.length > 0 ? (connections.length / props.leftItems.length) * 100 : 0
);

const isCompleted = computed(() => connections.length === props.leftItems.length);

const isAllCorrect = computed(() => {
  if (!isCompleted.value) return false;
  return connections.every(conn => conn.isCorrect);
});

// Methods
const selectLeftItem = (item: MatchingItem) => {
  selectedLeftItem.value = selectedLeftItem.value?.id === item.id ? null : item;
  selectedRightItem.value = null;
  previewConnection.value = null;
  
  // If we have a right item selected and click a left item, create connection
  if (selectedRightItem.value && selectedLeftItem.value) {
    createConnection(selectedLeftItem.value.id, selectedRightItem.value.id);
  }
};

const selectRightItem = (item: MatchingItem) => {
  // If we have a left item selected, create connection
  if (selectedLeftItem.value) {
    createConnection(selectedLeftItem.value.id, item.id);
  } else {
    selectedRightItem.value = selectedRightItem.value?.id === item.id ? null : item;
  }
};

const createConnection = (leftId: string, rightId: string) => {
  // Check if connection already exists
  if (connections.some(conn => conn.leftId === leftId || conn.rightId === rightId)) {
    return;
  }
  
  const leftItem = props.leftItems.find(item => item.id === leftId);
  const isCorrect = leftItem?.correctMatch === rightId;
  
  const newConnection: Connection = {
    leftId,
    rightId,
    isCorrect
  };
  
  connections.push(newConnection);
  
  // Clear selections
  selectedLeftItem.value = null;
  selectedRightItem.value = null;
  previewConnection.value = null;
  
  emit('pairCreated', leftId, rightId);
  emit('answerChanged', [...connections]);
  
  if (isCompleted.value) {
    emit('completed', isAllCorrect.value);
  }
};

const removeConnection = (leftId: string, rightId: string) => {
  const index = connections.findIndex(conn => 
    conn.leftId === leftId && conn.rightId === rightId
  );
  
  if (index !== -1) {
    connections.splice(index, 1);
    emit('pairRemoved', leftId, rightId);
    emit('answerChanged', [...connections]);
  }
};

const clearAllConnections = () => {
  connections.length = 0;
  selectedLeftItem.value = null;
  selectedRightItem.value = null;
  previewConnection.value = null;
  emit('answerChanged', []);
};

const isItemConnected = (itemId: string, side: 'left' | 'right'): boolean => {
  return connections.some(conn => 
    side === 'left' ? conn.leftId === itemId : conn.rightId === itemId
  );
};

const getItemContent = (itemId: string, side: 'left' | 'right'): string => {
  const items = side === 'left' ? props.leftItems : props.rightItems;
  return items.find(item => item.id === itemId)?.content || '';
};

const getItemPosition = (itemId: string, side: 'left' | 'right'): number => {
  const items = side === 'left' ? props.leftItems : props.rightItems;
  const index = items.findIndex(item => item.id === itemId);
  return 60 + (index * 80); // Base position + index offset
};

const updatePreview = (event: MouseEvent) => {
  if (!selectedLeftItem.value) return;
  
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  previewConnection.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};
</script>

<style scoped>
.vue-matching-renderer {
  max-width: 800px;
  margin: 0 auto;
}

.matching-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: start;
}

.left-column {
  z-index: 10;
}

.right-column {
  z-index: 10;
}

.connection-svg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.column-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  text-align: center;
}

.matching-item {
  position: relative;
  user-select: none;
}

.connection-point {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease;
}

.connection-point-right {
  right: -6px;
}

.connection-point-left {
  left: -6px;
}

.connection-point.active {
  border-color: #3b82f6;
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.connection-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
}

.connection-line {
  transition: all 0.3s ease;
}

.preview-line {
  animation: dash 1s linear infinite;
}

.progress-fill {
  transition: width 0.3s ease-in-out;
}

.status-indicator {
  transition: all 0.2s ease;
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .matching-area {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .connection-svg {
    display: none;
  }
  
  .connection-point {
    display: none;
  }
}
</style>
