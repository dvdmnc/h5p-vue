<template>
  <div class="question-preview">    
    <div class="space-y-6">
      <!-- Question header -->
      <div class="border-b border-gray-200 pb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {{ getQuestionTypeLabel(type) }}
          </span>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span class="capitalize">{{ question.difficulty }}</span>
            <span>•</span>
            <span>{{ question.points }} pts</span>
            <span>•</span>
            <span class="capitalize">{{ question.category }}</span>
          </div>
        </div>
        
        <h3 v-if="question.title" class="text-xl font-semibold text-gray-900">
          {{ question.title }}
        </h3>
        <h3 v-else class="text-xl font-medium text-gray-400 italic">
          Titre de la question...
        </h3>
        
        <p v-if="question.instruction" class="mt-2 text-gray-600">
          {{ question.instruction }}
        </p>
        <p v-else class="mt-2 text-gray-400 italic">
          Instructions pour l'utilisateur...
        </p>
      </div>

      <!-- Question content based on type -->
      <div class="question-content">
        <!-- Multiple Choice Preview -->
        <div v-if="type === 'multiple-choice'" class="space-y-3">
          <div v-if="getValidChoices.length > 0">
            <div
              v-for="(choice, index) in getValidChoices"
              :key="choice.id || index"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                :type="(question.typeSpecificData?.allowMultiple || question.allowMultiple) ? 'checkbox' : 'radio'"
                :name="`preview-${type}`"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                disabled
              >
              <div class="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                {{ String.fromCharCode(65 + index) }}
              </div>
              <span class="flex-1 text-gray-900">{{ choice.text || `Choix ${index + 1}` }}</span>
              <div v-if="choice.isCorrect" class="flex-shrink-0">
                <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div v-else class="space-y-3">
            <div class="text-center py-4 text-gray-400 italic">
              Ajoutez des choix de réponse pour voir la prévisualisation
            </div>
            <!-- Show placeholder choices -->
            <div
              v-for="index in 2"
              :key="`placeholder-${index}`"
              class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50 opacity-60"
            >
              <input
                type="radio"
                class="h-4 w-4 text-gray-400 border-gray-300"
                disabled
              >
              <div class="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-400">
                {{ String.fromCharCode(65 + index - 1) }}
              </div>
              <span class="flex-1 text-gray-400 italic">Choix {{ index }}</span>
            </div>
          </div>
        </div>

        <!-- Fill in Blanks Preview -->
        <div v-else-if="type === 'fill-in-blanks'" class="space-y-4">
          <div v-if="hasValidText" class="prose prose-lg max-w-none">
            <div v-html="renderBlankText(question.typeSpecificData?.text)"></div>
          </div>
          <div v-else class="prose prose-lg max-w-none">
            <div class="text-gray-400 italic py-4 text-center">
              Ajoutez du texte avec des blancs pour voir la prévisualisation
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300">
              <p class="text-gray-500">
                Exemple: La capitale de la France est 
                <span class="inline-block bg-blue-100 border-b-2 border-blue-300 px-2 py-1 mx-1 rounded text-blue-800 font-medium">____</span>
                .
              </p>
              <p class="text-sm text-gray-400 mt-2">
                Utilisez *mot* pour créer des blancs dans votre texte
              </p>
            </div>
          </div>
        </div>

        <!-- Drag and Drop Preview -->
        <div v-else-if="type === 'drag-drop'" class="space-y-4">
          <div v-if="question.typeSpecificData?.backgroundImage" class="mb-4">
            <img 
              :src="question.typeSpecificData.backgroundImage" 
              alt="Background" 
              class="w-full h-48 object-cover rounded-lg border border-gray-300"
            >
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Draggable Items -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Éléments à glisser</h4>
              <div v-if="hasValidDraggableItems" class="space-y-2">
                <div
                  v-for="(item, index) in getValidDraggableItems"
                  :key="item.id || index"
                  class="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move"
                >
                  <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  <span class="flex-1">{{ item.text || `Élément ${index + 1}` }}</span>
                </div>
              </div>
              
              <div v-else class="space-y-2">
                <div class="text-center py-4 text-gray-400 italic">
                  Ajoutez des éléments à glisser
                </div>
                <!-- Placeholder draggable items -->
                <div
                  v-for="index in 2"
                  :key="`drag-placeholder-${index}`"
                  class="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                >
                  <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                  <span class="flex-1 text-gray-400 italic">Élément {{ index }}</span>
                </div>
              </div>
            </div>
            
            <!-- Drop Zones -->
            <div>
              <h4 class="font-medium text-gray-900 mb-3">Zones de dépôt</h4>
              <div v-if="hasValidDropZones" class="space-y-2">
                <div
                  v-for="(zone, index) in getValidDropZones"
                  :key="zone.id || index"
                  class="p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center min-h-16 flex items-center justify-center"
                >
                  <span class="text-gray-600">{{ zone.label || `Zone ${index + 1}` }}</span>
                </div>
              </div>
              
              <div v-else class="space-y-2">
                <div class="text-center py-4 text-gray-400 italic">
                  Ajoutez des zones de dépôt
                </div>
                <!-- Placeholder drop zones -->
                <div
                  v-for="index in 2"
                  :key="`drop-placeholder-${index}`"
                  class="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center min-h-16 flex items-center justify-center opacity-60"
                >
                  <span class="text-gray-400 italic">Zone {{ index }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Matching Preview -->
        <div v-else-if="type === 'matching'" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <h4 class="font-medium text-gray-900">Colonne A</h4>
              <div v-if="hasValidLeftItems">
                <div
                  v-for="(item, index) in getValidLeftItems"
                  :key="item.id || index"
                  class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center cursor-pointer hover:bg-blue-100"
                >
                  {{ item.content || `Élément ${index + 1}` }}
                </div>
              </div>
              
              <div v-else class="text-center py-4 text-gray-500">
                Aucun élément configuré
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="font-medium text-gray-900">Colonne B</h4>
              <div v-if="hasValidRightItems">
                <div
                  v-for="(item, index) in getValidRightItems"
                  :key="item.id || index"
                  class="p-3 bg-green-50 border border-green-200 rounded-lg text-center cursor-pointer hover:bg-green-100"
                >
                  {{ item.content || `Réponse ${String.fromCharCode(65 + index)}` }}
                </div>
              </div>
              
              <div v-else class="text-center py-4 text-gray-500">
                Aucune réponse configurée
              </div>
            </div>
          </div>
        </div>

        <!-- Sorting Preview -->
        <div v-else-if="type === 'sorting'" class="space-y-4">
          <div v-if="question.typeSpecificData?.instructions" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-800">{{ question.typeSpecificData.instructions }}</p>
          </div>
          
          <div v-if="hasValidSortingItems">
            <p class="text-sm text-gray-600 mb-3">Glissez les éléments pour les trier dans le bon ordre :</p>
            <div class="space-y-2">
              <div
                v-for="(item, index) in getValidSortingItems"
                :key="item.id || `sort-${index}`"
                class="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50"
              >
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
                <span class="flex-1">{{ item.content || `Élément ${index + 1}` }}</span>
                <div class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  Position correcte: {{ item.correctOrder }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <p class="mt-2">Aucun élément à trier configuré</p>
          </div>
        </div>

        <!-- Default/Unknown type -->
        <div v-else class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2">Type de question non reconnu</p>
        </div>
      </div>

      <!-- Question footer -->
      <div class="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
        <div class="flex items-center space-x-4">
          <span>Temps estimé: ~1 min</span>
          <span>•</span>
          <span>Mode: Prévisualisation</span>
        </div>
        <div class="text-xs bg-gray-100 px-2 py-1 rounded">
          Prévisualisation
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuestionType } from '@/types/assessment';

interface Props {
  question: any;
  type: QuestionType;
}

const props = defineProps<Props>();

// Computed properties for reactive validation
const hasValidText = computed(() => {
  const text = props.question.typeSpecificData?.text;
  return text && text.trim() !== '';
});

const hasValidDraggableItems = computed(() => {
  const items = props.question.typeSpecificData?.draggableItems || [];
  return items.length > 0 && items.some((item: any) => item.text && item.text.trim() !== '');
});

const hasValidDropZones = computed(() => {
  const zones = props.question.typeSpecificData?.dropZones || [];
  return zones.length > 0 && zones.some((zone: any) => zone.label && zone.label.trim() !== '');
});

const hasValidLeftItems = computed(() => {
  const items = props.question.typeSpecificData?.leftItems || [];
  return items.length > 0 && items.some((item: any) => item.content && item.content.trim() !== '');
});

const hasValidRightItems = computed(() => {
  const items = props.question.typeSpecificData?.rightItems || [];
  return items.length > 0 && items.some((item: any) => item.content && item.content.trim() !== '');
});

const hasValidSortingItems = computed(() => {
  const items = props.question.typeSpecificData?.items || [];
  return items.length > 0 && items.some((item: any) => item.content && item.content.trim() !== '');
});

// Get functions for template use
const getValidChoices = computed(() => {
  const choices = props.question.typeSpecificData?.choices || props.question.choices || [];
  return choices.filter((choice: any) => choice.text && choice.text.trim() !== '');
});

const getValidDraggableItems = computed(() => {
  const items = props.question.typeSpecificData?.draggableItems || [];
  return items.filter((item: any) => item.text && item.text.trim() !== '');
});

const getValidDropZones = computed(() => {
  const zones = props.question.typeSpecificData?.dropZones || [];
  return zones.filter((zone: any) => zone.label && zone.label.trim() !== '');
});

const getValidLeftItems = computed(() => {
  const items = props.question.typeSpecificData?.leftItems || [];
  return items.filter((item: any) => item.content && item.content.trim() !== '');
});

const getValidRightItems = computed(() => {
  const items = props.question.typeSpecificData?.rightItems || [];
  return items.filter((item: any) => item.content && item.content.trim() !== '');
});

const getValidSortingItems = computed(() => {
  const items = props.question.typeSpecificData?.items || [];
  const validItems = items.filter((item: any) => item.content && item.content.trim() !== '');
  // Shuffle for preview
  return [...validItems].sort(() => Math.random() - 0.5);
});

// Methods
const getQuestionTypeLabel = (type: QuestionType): string => {
  const labels = {
    'multiple-choice': 'QCM',
    'drag-drop': 'Glisser-Déposer',
    'fill-in-blanks': 'Texte à Trous',
    'matching': 'Association',
    'sorting': 'Tri',
    'true-false': 'Vrai/Faux',
    'open-text': 'Texte Libre',
  };
  return labels[type] || type;
};

const renderBlankText = (text: string): string => {
  if (!text) return '';
  
  // Replace *word* with input fields for preview
  return text.replace(/\*([^*]+)\*/g, '<span class="inline-block bg-blue-100 border-b-2 border-blue-300 px-2 py-1 mx-1 rounded text-blue-800 font-medium">____</span>');
};
</script>

<style scoped>
.question-preview {
  min-height: 24rem;
}

/* Custom styles for preview elements */
.prose :deep(span.blank) {
  display: inline-block;
  background-color: #dbeafe;
  border-bottom: 2px solid #93c5fd;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem;
  border-radius: 0.25rem;
  color: #1e40af;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

/* Hover effects for interactive elements */
.choice-item:hover {
  background-color: #f9fafb;
}

/* Drag handle styling */
.cursor-move:hover {
  background-color: #f9fafb;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>