<template>
  <div class="assessment-interface bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-gray-900">Évaluation des compétences</h1>
            <div v-if="currentQuestion" class="text-sm text-gray-500">
              Question {{ currentQuestionIndex + 1 }} sur {{ totalQuestions }}
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Timer -->
            <div v-if="isAssessmentActive" class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatTime(elapsedTime) }}</span>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <button
                v-if="isAssessmentActive"
                @click="pauseAssessment"
                class="btn-secondary text-sm"
              >
                Pause
              </button>
              
              <button
                @click="showSettings = true"
                class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div v-if="isAssessmentActive" class="pb-4">
          <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: progress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Assessment not started -->
      <div v-if="!isAssessmentActive && !showResults" class="text-center py-12">
        <div class="bg-white rounded-xl shadow-custom-lg p-8">
          <div class="mb-6">
            <div class="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-4">
            Prêt à commencer l'évaluation ?
          </h2>
          
          <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
            Cette évaluation vous permettra d'identifier vos compétences actuelles et de recevoir des recommandations personnalisées pour votre parcours professionnel.
          </p>

          <!-- Assessment info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ sampleQuestions.length }}</div>
              <div class="text-sm text-gray-500">Questions</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">~{{ Math.round(sampleQuestions.reduce((total, q) => total + q.estimatedTime, 0) / 60) }}</div>
              <div class="text-sm text-gray-500">Minutes</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600">{{ new Set(sampleQuestions.map(q => q.category)).size }}</div>
              <div class="text-sm text-gray-500">Compétences</div>
            </div>
          </div>

          <div class="space-y-4">
            <button
              @click="startAssessment(false)"
              class="btn-primary text-lg px-8 py-3"
            >
              Commencer l'évaluation
            </button>
            
            <div class="text-center">
              <button
                @click="startAssessment(true)"
                class="text-primary-600 hover:text-primary-700 text-sm underline"
              >
                Mode adaptatif (recommandé)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Active assessment -->
      <div v-else-if="isAssessmentActive && currentQuestion" class="space-y-6">
        <!-- Question card -->
        <div class="question-card">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center space-x-3">
                <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {{ getQuestionTypeLabel(currentQuestion.type) }}
                </span>
                <span class="text-sm text-gray-500 capitalize">{{ currentQuestion.difficulty }}</span>
                <span class="text-sm text-gray-500">{{ currentQuestion.points }} points</span>
              </div>
              
              <div class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {{ currentQuestion.category }}
              </div>
            </div>

            <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-3">
              {{ currentQuestion.title }}
            </h2>
            
            <p v-if="currentQuestion.instruction" class="text-gray-600">
              {{ currentQuestion.instruction }}
            </p>
          </div>

          <!-- Question Content - Direct rendering instead of H5P -->
          <div class="mb-6">
            <!-- Multiple Choice Questions -->
            <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
              <div
                v-for="(choice, index) in currentQuestion.choices || []"
                :key="choice.id"
                @click="selectChoice(choice.id)"
                :class="[
                  'flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors',
                  selectedAnswer === choice.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <input
                  :type="(currentQuestion as any).allowMultiple ? 'checkbox' : 'radio'"
                  :name="`question-${currentQuestion.id}`"
                  :checked="selectedAnswer === choice.id"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  @change="selectChoice(choice.id)"
                >
                <div class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {{ String.fromCharCode(65 + index) }}
                </div>
                <span class="flex-1 text-gray-900">{{ choice.text }}</span>
              </div>
            </div>

            <!-- Fill in Blanks Questions -->
            <div v-else-if="currentQuestion.type === 'fill-in-blanks'" class="space-y-4">
              <div class="prose prose-lg max-w-none" v-html="renderBlankText(currentQuestion.text)"></div>
            </div>

            <!-- Drag and Drop Questions -->
            <div v-else-if="currentQuestion.type === 'drag-drop'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Draggable Items -->
                <div>
                  <h4 class="font-medium text-gray-900 mb-3">Éléments à placer</h4>
                  <div class="space-y-2">
                    <div
                      v-for="item in currentQuestion.draggableItems || []"
                      :key="item.id"
                      :draggable="true"
                      @dragstart="startDrag(item)"
                      class="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                      <span>{{ item.content }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Drop Zones -->
                <div>
                  <h4 class="font-medium text-gray-900 mb-3">Zones de dépôt</h4>
                  <div class="space-y-2">
                    <div
                      v-for="zone in currentQuestion.dropZones || []"
                      :key="zone.id"
                      @drop="handleDrop(zone.id, $event)"
                      @dragover.prevent
                      @dragenter.prevent
                      :class="[
                        'p-4 border-2 border-dashed rounded-lg text-center min-h-16 flex items-center justify-center transition-colors',
                        dragDropAnswers[zone.id] 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      ]"
                    >
                      <span v-if="dragDropAnswers[zone.id]" class="text-green-700 font-medium">
                        {{ dragDropAnswers[zone.id] }}
                      </span>
                      <span v-else class="text-gray-500">{{ zone.label }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Matching Questions -->
            <div v-else-if="currentQuestion.type === 'matching'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <h4 class="font-medium text-gray-900">Colonne A</h4>
                  <div
                    v-for="leftItem in currentQuestion.leftItems || []"
                    :key="leftItem.id"
                    @click="selectMatchingItem('left', leftItem.id)"
                    :class="[
                      'p-3 border rounded-lg cursor-pointer transition-colors',
                      selectedMatching.left === leftItem.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ leftItem.content }}
                  </div>
                </div>
                <div class="space-y-2">
                  <h4 class="font-medium text-gray-900">Colonne B</h4>
                  <div
                    v-for="rightItem in currentQuestion.rightItems || []"
                    :key="rightItem.id"
                    @click="selectMatchingItem('right', rightItem.id)"
                    :class="[
                      'p-3 border rounded-lg cursor-pointer transition-colors',
                      selectedMatching.right === rightItem.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ rightItem.content }}
                  </div>
                </div>
              </div>
              
              <!-- Matching pairs display -->
              <div v-if="matchingPairs.length > 0" class="mt-6">
                <h4 class="font-medium text-gray-900 mb-3">Associations créées:</h4>
                <div class="space-y-2">
                  <div
                    v-for="(pair, index) in matchingPairs"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span>{{ pair.leftContent }} ↔ {{ pair.rightContent }}</span>
                    <button
                      @click="removePair(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sorting Questions -->
            <div v-else-if="currentQuestion.type === 'sorting'" class="space-y-4">
              <div v-if="(currentQuestion as any).instructions" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800">{{ (currentQuestion as any).instructions }}</p>
              </div>
              
              <div class="space-y-2">
                <div
                  v-for="(item, index) in sortingItems"
                  :key="item.id"
                  :draggable="true"
                  @dragstart="startSortDrag(index)"
                  @drop="handleSortDrop(index, $event)"
                  @dragover.prevent
                  @dragenter.prevent
                  class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50"
                >
                  <div class="flex items-center space-x-3">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                    <span>{{ item.content }}</span>
                  </div>
                  <div class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    Position {{ index + 1 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Fallback for unknown types -->
            <div v-else class="text-center py-8 text-gray-500">
              <p>Type de question non supporté: {{ currentQuestion.type }}</p>
            </div>
          </div>

          <!-- Navigation -->
          <div class="flex items-center justify-between">
            <div v-if="currentQuestionIndex > 0"></div>
            
            <button
              v-if="currentQuestionIndex > 0"
              @click="previousQuestion"
              class="btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>
            <div v-else></div>

            <button
              @click="nextQuestion"
              class="btn-primary"
              :disabled="!canProceed"
            >
              {{ isLastQuestion ? 'Terminer l\'évaluation' : 'Question suivante' }}
              <svg v-if="!isLastQuestion" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <svg v-else class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Adaptive info -->
        <div v-if="showAdaptiveInfo" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm text-blue-700">
              <strong>Mode adaptatif actif:</strong> La difficulté s'ajuste automatiquement selon vos réponses.
              Niveau actuel: <span class="font-medium capitalize">{{ adaptiveState.currentLevel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="showResults && currentResult" class="space-y-6">
        <AssessmentResults 
          :result="currentResult"
          @restart="restartAssessment"
          @view-details="showDetailedResults = true"
        />
      </div>

      <!-- Loading state -->
      <div v-else class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <SettingsModal
      v-if="showSettings"
      @close="showSettings = false"
      @save="handleSettingsChange"
    />

    <!-- Detailed Results Modal -->
    <DetailedResultsModal
      v-if="showDetailedResults && currentResult"
      :result="currentResult"
      @close="showDetailedResults = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAssessmentStore } from '@/stores/assessment';
import AssessmentResults from './AssessmentResults.vue';
import SettingsModal from './SettingsModal.vue';
import DetailedResultsModal from './DetailedResultsModal.vue';
import type { Question, H5PContent, QuestionType } from '@/types/assessment';

// Stores
const assessmentStore = useAssessmentStore();


// State
const showSettings = ref(false);
const showResults = ref(false);
const showDetailedResults = ref(false);
const showAdaptiveInfo = ref(true);
const canProceed = ref(false);
const currentH5PContent = ref<H5PContent | null>(null);

// Time tracking
const questionStartTime = ref<number>(0);
const assessmentStartTime = ref<number>(0);

// Question-specific state
const selectedAnswer = ref<string | null>(null);
const dragDropAnswers = ref<Record<string, string>>({});
const selectedMatching = ref({ left: null as string | null, right: null as string | null });
const matchingPairs = ref<Array<{ leftId: string; rightId: string; leftContent: string; rightContent: string }>>([]);
const sortingItems = ref<Array<{ id: string; content: string; correctOrder: number }>>([]);
const currentDragItem = ref<any>(null);
const fillBlanksAnswers = ref<Record<string, string>>({});

// Computed
const {
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  progress,
  isLastQuestion,
  isAssessmentActive,
  elapsedTime,
  adaptiveState,
  results,
} = storeToRefs(assessmentStore);

const currentResult = computed(() => results.value[results.value.length - 1] || null);

// Sample questions for demo - Various skill levels and types
const sampleQuestions = ref<Question[]>([
  // FRANÇAIS - Questions progressives
  {
    id: 'fr-1',
    type: 'multiple-choice',
    title: 'Accord du participe passé',
    instruction: 'Choisissez la forme correcte du participe passé dans cette phrase.',
    difficulty: 'facile',
    points: 10,
    category: 'francais',
    estimatedTime: 45,
    choices: [
      { id: 'a', text: 'Les livres que j\'ai lu', isCorrect: false },
      { id: 'b', text: 'Les livres que j\'ai lus', isCorrect: true },
      { id: 'c', text: 'Les livres que j\'ai lue', isCorrect: false },
      { id: 'd', text: 'Les livres que j\'ai lues', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'fr-2',
    type: 'multiple-choice',
    title: 'Conjugaison au passé composé',
    instruction: 'Quelle est la forme correcte du verbe "aller" au passé composé ?',
    difficulty: 'facile',
    points: 10,
    category: 'francais',
    estimatedTime: 30,
    choices: [
      { id: 'a', text: 'Je suis allé', isCorrect: true },
      { id: 'b', text: 'J\'ai allé', isCorrect: false },
      { id: 'c', text: 'Je suis aller', isCorrect: false },
      { id: 'd', text: 'J\'ai aller', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'fr-3',
    type: 'fill-in-blanks',
    title: 'Compléter le texte professionnel',
    instruction: 'Complétez cette lettre de motivation avec les mots appropriés.',
    difficulty: 'moyen',
    points: 15,
    category: 'francais',
    estimatedTime: 90,
    text: 'Madame, Monsieur, Je vous écris pour {{1}} au poste de vendeur dans votre magasin. Fort de mes {{2}} en relation client, je pense être le candidat {{3}} pour ce poste. Dans l\'{{4}} de votre réponse, je vous prie d\'agréer mes salutations {{5}}.',
    blanks: [
      { id: '1', position: 1, correctAnswers: ['postuler', 'candidater'], caseSensitive: false },
      { id: '2', position: 2, correctAnswers: ['expériences', 'compétences'], caseSensitive: false },
      { id: '3', position: 3, correctAnswers: ['idéal', 'parfait'], caseSensitive: false },
      { id: '4', position: 4, correctAnswers: ['attente', 'espoir'], caseSensitive: false },
      { id: '5', position: 5, correctAnswers: ['distinguées', 'respectueuses'], caseSensitive: false }
    ]
  },

  // MATHÉMATIQUES - Questions progressives
  {
    id: 'math-1',
    type: 'multiple-choice',
    title: 'Calcul de pourcentage',
    instruction: 'Un article coûte 80€. Il y a une réduction de 15%. Quel est le prix final ?',
    difficulty: 'facile',
    points: 10,
    category: 'mathematiques',
    estimatedTime: 60,
    choices: [
      { id: 'a', text: '65€', isCorrect: false },
      { id: 'b', text: '68€', isCorrect: true },
      { id: 'c', text: '70€', isCorrect: false },
      { id: 'd', text: '72€', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'math-2',
    type: 'multiple-choice',
    title: 'Calcul de proportions',
    instruction: 'Si 3 kg de pommes coûtent 6€, combien coûtent 5 kg de pommes ?',
    difficulty: 'moyen',
    points: 15,
    category: 'mathematiques',
    estimatedTime: 90,
    choices: [
      { id: 'a', text: '8€', isCorrect: false },
      { id: 'b', text: '9€', isCorrect: false },
      { id: 'c', text: '10€', isCorrect: true },
      { id: 'd', text: '12€', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'math-3',
    type: 'drag-drop',
    title: 'Classer les nombres par ordre croissant',
    instruction: 'Glissez les nombres dans l\'ordre croissant (du plus petit au plus grand).',
    difficulty: 'facile',
    points: 15,
    category: 'mathematiques',
    estimatedTime: 90,
    draggableItems: [
      { id: '1', content: '3.7', correctZone: 'zone-2' },
      { id: '2', content: '2.1', correctZone: 'zone-1' },
      { id: '3', content: '5.2', correctZone: 'zone-4' },
      { id: '4', content: '4.8', correctZone: 'zone-3' }
    ],
    dropZones: [
      { id: 'zone-1', label: '1er nombre (le plus petit)', acceptedItems: ['2'], position: { x: 0, y: 0 } },
      { id: 'zone-2', label: '2ème nombre', acceptedItems: ['1'], position: { x: 0, y: 50 } },
      { id: 'zone-3', label: '3ème nombre', acceptedItems: ['4'], position: { x: 0, y: 100 } },
      { id: 'zone-4', label: '4ème nombre (le plus grand)', acceptedItems: ['3'], position: { x: 0, y: 150 } }
    ]
  },

  // INFORMATIQUE - Questions progressives
  {
    id: 'info-1',
    type: 'multiple-choice',
    title: 'Navigation Internet',
    instruction: 'Que signifie "www" dans une adresse web ?',
    difficulty: 'facile',
    points: 10,
    category: 'informatique',
    estimatedTime: 30,
    choices: [
      { id: 'a', text: 'World Wide Web', isCorrect: true },
      { id: 'b', text: 'World Web Wide', isCorrect: false },
      { id: 'c', text: 'Wide World Web', isCorrect: false },
      { id: 'd', text: 'Web World Wide', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'info-2',
    type: 'matching',
    title: 'Associer les termes informatiques',
    instruction: 'Associez chaque terme informatique à sa définition.',
    difficulty: 'moyen',
    points: 20,
    category: 'informatique',
    estimatedTime: 120,
    leftItems: [
      { id: 'l1', content: 'URL', type: 'text' },
      { id: 'l2', content: 'Navigateur', type: 'text' },
      { id: 'l3', content: 'Email', type: 'text' },
      { id: 'l4', content: 'Cloud', type: 'text' }
    ],
    rightItems: [
      { id: 'r1', content: 'Adresse d\'un site web', type: 'text' },
      { id: 'r2', content: 'Logiciel pour surfer sur internet', type: 'text' },
      { id: 'r3', content: 'Courrier électronique', type: 'text' },
      { id: 'r4', content: 'Stockage en ligne', type: 'text' }
    ],
    correctPairs: [
      { leftId: 'l1', rightId: 'r1' },
      { leftId: 'l2', rightId: 'r2' },
      { leftId: 'l3', rightId: 'r3' },
      { leftId: 'l4', rightId: 'r4' }
    ]
  },
  {
    id: 'info-3',
    type: 'sorting',
    title: 'Étapes pour envoyer un email',
    instruction: 'Remettez dans l\'ordre chronologique les étapes pour envoyer un email.',
    difficulty: 'moyen',
    points: 15,
    category: 'informatique',
    estimatedTime: 90,
    items: [
      { id: 's1', content: 'Ouvrir sa boîte email', order: 1 },
      { id: 's2', content: 'Cliquer sur "Nouveau message"', order: 2 },
      { id: 's3', content: 'Saisir l\'adresse du destinataire', order: 3 },
      { id: 's4', content: 'Écrire l\'objet du message', order: 4 },
      { id: 's5', content: 'Rédiger le contenu', order: 5 },
      { id: 's6', content: 'Cliquer sur "Envoyer"', order: 6 }
    ],
    correctOrder: ['s1', 's2', 's3', 's4', 's5', 's6']
  },

  // COMPÉTENCES TRANSVERSALES - Questions progressives
  {
    id: 'soft-1',
    type: 'multiple-choice',
    title: 'Gestion des priorités',
    instruction: 'Vous avez plusieurs tâches urgentes. Laquelle traitez-vous en premier ?',
    difficulty: 'moyen',
    points: 15,
    category: 'competences-transversales',
    estimatedTime: 60,
    choices: [
      { id: 'a', text: 'La tâche la plus facile', isCorrect: false },
      { id: 'b', text: 'La tâche demandée par le chef', isCorrect: false },
      { id: 'c', text: 'La tâche avec la deadline la plus proche', isCorrect: true },
      { id: 'd', text: 'La tâche la plus intéressante', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'soft-2',
    type: 'multiple-choice',
    title: 'Communication en équipe',
    instruction: 'Comment réagissez-vous face à un désaccord avec un collègue ?',
    difficulty: 'moyen',
    points: 15,
    category: 'competences-transversales',
    estimatedTime: 45,
    choices: [
      { id: 'a', text: 'J\'évite le conflit et je ne dis rien', isCorrect: false },
      { id: 'b', text: 'J\'écoute son point de vue et cherche un compromis', isCorrect: true },
      { id: 'c', text: 'J\'impose ma solution car j\'ai raison', isCorrect: false },
      { id: 'd', text: 'Je vais voir le chef pour trancher', isCorrect: false },
    ],
    allowMultiple: false,
  },
  {
    id: 'soft-3',
    type: 'fill-in-blanks',
    title: 'Gestion du stress',
    instruction: 'Complétez ce texte sur la gestion du stress au travail.',
    difficulty: 'difficile',
    points: 20,
    category: 'competences-transversales',
    estimatedTime: 120,
    text: 'Pour gérer le stress au travail, il est important de {{1}} ses priorités, de prendre des {{2}} régulières et de {{3}} avec ses collègues en cas de difficultés.',
    blanks: [
      { id: '1', position: 1, correctAnswers: ['organiser', 'planifier', 'définir'], caseSensitive: false },
      { id: '2', position: 2, correctAnswers: ['pauses', 'breaks', 'repos'], caseSensitive: false },
      { id: '3', position: 3, correctAnswers: ['communiquer', 'parler', 'échanger'], caseSensitive: false }
    ]
  }
]);

// Methods

// Question interaction methods
const selectChoice = (choiceId: string) => {
  selectedAnswer.value = choiceId;
  updateCanProceed();
};

const startDrag = (item: any) => {
  currentDragItem.value = item;
};

const handleDrop = (zoneId: string, event: DragEvent) => {
  event.preventDefault();
  if (currentDragItem.value) {
    dragDropAnswers.value[zoneId] = currentDragItem.value.text;
    currentDragItem.value = null;
    checkDragDropCompletion();
  }
};

const checkDragDropCompletion = () => {
  const zones = (currentQuestion.value as any)?.dropZones || [];
  canProceed.value = zones.every((zone: any) => dragDropAnswers.value[zone.id]);
};

const selectMatchingItem = (side: 'left' | 'right', itemId: string) => {
  selectedMatching.value[side] = itemId;
  
  // If both sides are selected, create a pair
  if (selectedMatching.value.left && selectedMatching.value.right) {
    const leftItem = (currentQuestion.value as any)?.leftItems?.find((item: any) => item.id === selectedMatching.value.left);
    const rightItem = (currentQuestion.value as any)?.rightItems?.find((item: any) => item.id === selectedMatching.value.right);
    
    if (leftItem && rightItem) {
      matchingPairs.value.push({
        leftId: leftItem.id,
        rightId: rightItem.id,
        leftContent: leftItem.content,
        rightContent: rightItem.content
      });
      
      selectedMatching.value = { left: null, right: null };
      checkMatchingCompletion();
    }
  }
};

const removePair = (index: number) => {
  matchingPairs.value.splice(index, 1);
  checkMatchingCompletion();
};

const checkMatchingCompletion = () => {
  const leftItems = (currentQuestion.value as any)?.leftItems || [];
  canProceed.value = matchingPairs.value.length === leftItems.length;
};

const startSortDrag = (index: number) => {
  currentDragItem.value = { index, item: sortingItems.value[index] };
};

const handleSortDrop = (targetIndex: number, event: DragEvent) => {
  event.preventDefault();
  if (currentDragItem.value && currentDragItem.value.index !== targetIndex) {
    const items = [...sortingItems.value];
    const draggedItem = items[currentDragItem.value.index];
    
    // Remove dragged item
    items.splice(currentDragItem.value.index, 1);
    
    // Insert at new position
    items.splice(targetIndex, 0, draggedItem);
    
    sortingItems.value = items;
    updateCanProceed();
  }
  currentDragItem.value = null;
};

const renderBlankText = (text: string): string => {
  if (!text) return '';
  
  // Replace {{1}}, {{2}} etc with input fields
  return text.replace(/\{\{(\d+)\}\}/g, (_, blankNumber) => {
    const blankId = blankNumber;
    return `<input 
      type="text" 
      class="inline-block bg-white border-b-2 border-blue-300 px-2 py-1 mx-1 rounded text-blue-800 font-medium min-w-16 text-center" 
      placeholder="..."
      id="blank-${blankId}"
      onchange="window.updateBlankAnswer('${blankId}', this.value)"
    />`;
  });
};

// Make updateBlankAnswer available globally for the rendered inputs
(window as any).updateBlankAnswer = (blankId: string, value: string) => {
  fillBlanksAnswers.value[blankId] = value;
  updateCanProceed();
};

const checkFillBlanksCompletion = () => {
  const text = (currentQuestion.value as any)?.typeSpecificData?.text || '';
  const blanksCount = (text.match(/\*[^*]+\*/g) || []).length;
  const filledBlanks = Object.keys(fillBlanksAnswers.value).length;
  canProceed.value = filledBlanks >= blanksCount;
};

const updateCanProceed = () => {
  if (!currentQuestion.value) {
    canProceed.value = false;
    return;
  }

  switch (currentQuestion.value.type) {
    case 'multiple-choice':
      canProceed.value = !!selectedAnswer.value;
      break;
    case 'fill-in-blanks':
      checkFillBlanksCompletion();
      break;
    case 'drag-drop':
      checkDragDropCompletion();
      break;
    case 'matching':
      checkMatchingCompletion();
      break;
    case 'sorting':
      canProceed.value = sortingItems.value.length > 0;
      break;
    default:
      canProceed.value = true;
  }
};

const resetQuestionState = () => {
  selectedAnswer.value = null;
  dragDropAnswers.value = {};
  selectedMatching.value = { left: null, right: null };
  matchingPairs.value = [];
  fillBlanksAnswers.value = {};
  canProceed.value = false;
  
  // Initialize sorting items if it's a sorting question
  if (currentQuestion.value?.type === 'sorting') {
    const items = (currentQuestion.value as any).items || [];
    sortingItems.value = [...items].map(item => ({
      ...item,
      correctOrder: item.order || item.correctOrder
    })).sort(() => Math.random() - 0.5);
  }
  
  // Update canProceed state
  updateCanProceed();
};

const startAssessment = async (adaptive = false) => {
  try {
    assessmentStartTime.value = Date.now();
    await assessmentStore.startAssessment(sampleQuestions.value, adaptive);
    showAdaptiveInfo.value = adaptive;
    await loadCurrentQuestionContent();
  } catch (error) {
    console.error('Erreur lors du démarrage:', error);
  }
};

const loadCurrentQuestionContent = async () => {
  if (!currentQuestion.value) return;

  // Start timing this question
  questionStartTime.value = Date.now();

  // Convert question to H5P content (not used in our direct rendering but kept for compatibility)
  currentH5PContent.value = convertQuestionToH5P(currentQuestion.value);
  // Don't set canProceed to false here - let updateCanProceed handle it
};

const convertQuestionToH5P = (question: Question): H5PContent => {
  // This is a simplified conversion - in a real app, you'd have more sophisticated conversion
  let params: any = {
    question: question.title,
    description: question.instruction,
  };

  // Add question-specific parameters based on type
  if (question.type === 'multiple-choice') {
    params.answers = question.choices?.map(choice => ({
      text: choice.text,
      correct: choice.isCorrect,
      tipsAndFeedback: {
        tip: '',
        chosenFeedback: choice.feedback || '',
        notChosenFeedback: '',
      },
    })) || [];
    
    params.behaviour = {
      enableRetry: true,
      enableSolutionsButton: true,
      enableCheckButton: true,
      type: question.allowMultiple ? 'auto' : 'single',
      singleAnswer: !question.allowMultiple,
      autoCheck: false,
      passPercentage: 50,
      showScorePoints: true,
    };
  }

  const baseContent = {
    library: getH5PLibrary(question.type),
    params,
    metadata: {
      title: question.title,
      authors: [{ name: 'Check Compétences', role: 'Author' }],
      license: 'Unlicense',
      licenseVersion: '1.0',
      yearFrom: new Date().getFullYear(),
      yearTo: new Date().getFullYear(),
      source: '',
      contentType: 'Question',
      defaultLanguage: 'fr',
    },
  };

  return baseContent as H5PContent;
};

const getH5PLibrary = (type: QuestionType): string => {
  const libraries = {
    'multiple-choice': 'H5P.MultiChoice 1.16',
    'drag-drop': 'H5P.DragQuestion 1.14',
    'fill-in-blanks': 'H5P.Blanks 1.14',
    'matching': 'H5P.MemoryGame 1.3',
    'sorting': 'H5P.DragText 1.10',
    'true-false': 'H5P.TrueFalse 1.8',
    'open-text': 'H5P.Essay 1.5',
  };
  return libraries[type] || 'H5P.MultiChoice 1.16';
};

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

const nextQuestion = async () => {
  // Submit current answer before proceeding
  await submitCurrentAnswer();
  
  if (isLastQuestion.value) {
    const result = await assessmentStore.completeAssessment();
    if (result) {
      showResults.value = true;
    }
  } else {
    await assessmentStore.nextQuestion();
    resetQuestionState();
    await loadCurrentQuestionContent();
  }
};

const submitCurrentAnswer = async () => {
  if (!currentQuestion.value) return;
  
  let answer: any = null;
  // Calculate actual time spent on this question
  const currentTime = Date.now();
  const timeSpent = Math.round((currentTime - questionStartTime.value) / 1000); // in seconds
  
  switch (currentQuestion.value.type) {
    case 'multiple-choice':
      answer = selectedAnswer.value;
      break;
    case 'fill-in-blanks':
      answer = fillBlanksAnswers.value;
      break;
    case 'drag-drop':
      answer = dragDropAnswers.value;
      break;
    case 'matching':
      answer = matchingPairs.value;
      break;
    case 'sorting':
      answer = sortingItems.value.map((item, index) => ({ ...item, userOrder: index + 1 }));
      break;
  }
  
  if (answer) {
    await assessmentStore.submitAnswer(answer, timeSpent);
  }
};

const previousQuestion = async () => {
  assessmentStore.previousQuestion();
  await loadCurrentQuestionContent();
};

const pauseAssessment = () => {
  assessmentStore.pauseAssessment();
};

const restartAssessment = () => {
  showResults.value = false;
  showDetailedResults.value = false;
};

const handleSettingsChange = (settings: any) => {
  // Apply settings changes
  console.log('Settings changed:', settings);
  showSettings.value = false;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Watchers
watch(currentQuestion, () => {
  if (currentQuestion) {
    resetQuestionState();
    loadCurrentQuestionContent();
  }
});

// Watch for question state changes to update canProceed
watch([selectedAnswer, dragDropAnswers, matchingPairs, fillBlanksAnswers, sortingItems], () => {
  updateCanProceed();
}, { deep: true });

// Lifecycle
onMounted(() => {
  // Check for paused assessment
  const pausedAssessment = localStorage.getItem('paused_assessment');
  if (pausedAssessment) {
    assessmentStore.resumeAssessment();
  }
});
</script>

<style scoped>
/* Smooth transitions */
.assessment-interface {
  transition: all 0.3s ease;
}

/* Custom progress bar animation */
.progress-fill {
  transition: width 0.5s ease-out;
}

/* Question card animations */
.question-card {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button disabled state */
button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .question-card {
    @apply p-4;
  }
}
</style>
