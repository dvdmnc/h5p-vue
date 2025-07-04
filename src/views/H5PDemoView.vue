<template>
  <div class="h5p-demo-view">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Démonstration H5P + Vue.js
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Cette page démontre l'encapsulation complète des modules H5P dans des composants Vue.js avec customisation maximale du style.
        </p>
      </div>

      <!-- Toggle between H5P and Vue rendering -->
      <div class="demo-controls mb-8 p-6 bg-white rounded-lg shadow-sm border">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Mode de rendu</h2>
            <p class="text-gray-600">Comparez les différentes approches d'intégration H5P</p>
          </div>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="renderMode"
                value="local"
                class="mr-2"
              />
              H5P Standard Local
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="renderMode"
                value="cdn"
                class="mr-2"
              />
              CDN + CSS Override
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="renderMode"
                value="vue"
                class="mr-2"
              />
              Vue.js Enhanced
            </label>
          </div>
        </div>
      </div>

      <!-- Status and Instructions -->
      <div class="mb-8 grid gap-4 md:grid-cols-2">
        <!-- Current Status -->
        <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <h4 class="text-green-800 font-medium">État Fonctionnel</h4>
              <div class="text-green-700 text-sm mt-1 space-y-1">
                <div>✅ <strong>QCM (Multiple Choice)</strong> - Fonctionne parfaitement avec style amélioré</div>
                <div>✅ <strong>Texte à trous (Fill-in-Blanks)</strong> - Interface moderne et responsive</div>
                <div>✅ <strong>Éditeur de contenu</strong> - Modification des questions et réponses</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div>
              <h4 class="text-blue-800 font-medium">Comment utiliser</h4>
              <div class="text-blue-700 text-sm mt-1 space-y-1">
                <div>1. Sélectionnez un type de question ci-dessous</div>
                <div>2. Choisissez le mode "H5P Standard Local" (recommandé)</div>
                <div>3. Testez l'onglet "Éditeur de contenu" pour modifier les questions</div>
                <div>4. Utilisez le bouton "Rafraîchir" pour voir vos modifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Question type selector -->
      <div class="question-selector mb-8 p-6 bg-white rounded-lg shadow-sm border">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Type de question</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            v-for="type in questionTypes"
            :key="type.value"
            @click="selectedQuestionType = type.value"
            :class="[
              'p-4 border-2 rounded-lg text-center transition-all duration-200',
              selectedQuestionType === type.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25'
            ]"
          >
            <div class="text-2xl mb-2">{{ type.icon }}</div>
            <div class="font-medium text-sm">{{ type.label }}</div>
          </button>
        </div>
      </div>

      <!-- Demo area with tabs -->
      <div class="demo-area p-6 bg-white rounded-lg shadow-sm border">
        <!-- Tab Navigation -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex space-x-6">
            <button
              @click="activeTab = 'demo'"
              :class="[
                'pb-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'demo'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Démonstration
            </button>
            <button
              @click="activeTab = 'editor'"
              :class="[
                'pb-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'editor'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Éditeur de contenu
            </button>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span>{{ getCurrentQuestionType().label }} - 
              <span class="text-primary-600">{{ getRenderModeTitle() }}</span>
            </span>
            <span>•</span>
            <span :class="getCustomizationLevel().class">
              {{ getCustomizationLevel().text }}
            </span>
          </div>
        </div>

        <!-- Demo Tab Content -->
        <div v-show="activeTab === 'demo'" class="demo-content">
          <!-- Refresh notice if content was updated -->
          <div v-if="contentWasUpdated" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h4 class="text-green-800 font-medium">Contenu mis à jour</h4>
                  <p class="text-green-700 text-sm">Le contenu a été modifié dans l'éditeur.</p>
                </div>
              </div>
              <button
                @click="refreshDemo"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Rafraîchir la démo
              </button>
            </div>
          </div>

          <div class="question-content">
            <h3 class="text-lg font-medium text-gray-800 mb-4">
              {{ getCurrentQuestion().question }}
            </h3>

            <!-- Show note for unsupported question types -->
            <div v-if="'note' in getCurrentQuestion()" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-start space-x-3">
                <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <h4 class="text-yellow-800 font-medium">Fonctionnalité en développement</h4>
                  <p class="text-yellow-700 text-sm mt-1">{{ (getCurrentQuestion() as any).note }}</p>
                  <p class="text-yellow-700 text-sm mt-1">Les types <strong>QCM</strong> et <strong>Texte à trous</strong> sont entièrement fonctionnels.</p>
                </div>
              </div>
            </div>

            <!-- H5P Working Demo Component -->
            <H5PWorkingDemo 
              :question-type="selectedQuestionType"
              :render-mode="renderMode"
              :key="demoKey" 
              @ready="onH5PReady"
              @error="onH5PError"
              @progress="onH5PProgress"
              @completed="onH5PCompleted"
            />
          </div>

          <!-- Enhanced features showcase (Vue mode only) -->
          <div v-if="renderMode === 'vue'" class="enhanced-features mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-semibold text-blue-800 mb-3">Fonctionnalités Enhanced Vue.js</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div class="feature-item">
                <div class="font-medium text-blue-700">🎨 Style personnalisé</div>
                <div class="text-blue-600">Design system cohérent avec Tailwind CSS</div>
              </div>
              <div class="feature-item">
                <div class="font-medium text-blue-700">⚡ Réactivité Vue</div>
                <div class="text-blue-600">État réactif et mises à jour en temps réel</div>
              </div>
              <div class="feature-item">
                <div class="font-medium text-blue-700">🔧 Contrôles avancés</div>
                <div class="text-blue-600">Validation, feedback et progression</div>
              </div>
              <div class="feature-item">
                <div class="font-medium text-blue-700">📱 Responsive design</div>
                <div class="text-blue-600">Optimisé pour tous les écrans</div>
              </div>
              <div class="feature-item">
                <div class="font-medium text-blue-700">♿ Accessibilité</div>
                <div class="text-blue-600">Conforme aux standards RGAA</div>
              </div>
              <div class="feature-item">
                <div class="font-medium text-blue-700">🔄 Animations fluides</div>
                <div class="text-blue-600">Transitions CSS et micro-interactions</div>
              </div>
            </div>
          </div>

          <!-- Results section -->
          <div v-if="showResults" class="results-section mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold text-gray-800 mb-3">Résultats</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="stat-item">
                <div class="text-gray-600">Score</div>
                <div class="font-semibold text-primary-600">{{ score }}/{{ maxScore }}</div>
              </div>
              <div class="stat-item">
                <div class="text-gray-600">Pourcentage</div>
                <div class="font-semibold text-green-600">{{ Math.round((score / maxScore) * 100) }}%</div>
              </div>
              <div class="stat-item">
                <div class="text-gray-600">Statut</div>
                <div :class="['font-semibold', score === maxScore ? 'text-green-600' : 'text-orange-600']">
                  {{ score === maxScore ? 'Réussi' : 'Partiel' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="text-gray-600">Mode</div>
                <div class="font-semibold text-primary-600">
                  {{ getRenderModeTitle() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Editor Tab Content -->
        <div v-show="activeTab === 'editor'" class="editor-content">
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 class="text-blue-800 font-medium">Éditeur de contenu H5P</h4>
                <p class="text-blue-700 text-sm mt-1">
                  Modifiez les questions et réponses. Les changements sont sauvegardés dans les fichiers de contenu locaux.
                  Basculez vers l'onglet "Démonstration" et rafraîchissez pour voir vos modifications.
                </p>
              </div>
            </div>
          </div>
          
          <H5PContentEditor 
            :question-type="selectedQuestionType"
            @content-saved="onContentSaved"
            @content-updated="onContentUpdated"
          />
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import H5PWorkingDemo from '../components/H5P/H5PWorkingDemo.vue';
import H5PContentEditor from '../components/H5P/H5PContentEditor.vue';

// State
const renderMode = ref<'local' | 'cdn' | 'vue'>('local');
const selectedQuestionType = ref('multiple-choice');
const selectedAnswer = ref<string | null>(null);
const score = ref(0);
const maxScore = ref(1);
const showResults = ref(false);
const activeTab = ref<'demo' | 'editor'>('demo');
const contentWasUpdated = ref(false);
const demoKey = ref(`demo-${Date.now()}`);

// Question types configuration
const questionTypes = [
  { value: 'multiple-choice', label: 'QCM', icon: '☑️' },
  { value: 'fill-in-blanks', label: 'Texte à trous', icon: '✍️' },
  { value: 'drag-drop', label: 'Glisser-déposer', icon: '🔄' },
  { value: 'matching', label: 'Associations', icon: '🔗' },
  { value: 'sorting', label: 'Tri', icon: '📊' }
];

// Sample questions for each type
const sampleQuestions = {
  'multiple-choice': {
    question: "Quel est le principal avantage de Vue.js ?",
    choices: [
      { id: 'a', text: 'Framework progressif et facile à apprendre' },
      { id: 'b', text: 'Complexité élevée' },
      { id: 'c', text: 'Pas de documentation' },
      { id: 'd', text: 'Seulement pour les experts' }
    ],
    correctAnswer: 'a',
    h5pContent: '/h5p/content/demo-multichoice'
  },
  'fill-in-blanks': {
    question: "Complétez le texte suivant sur Vue.js :",
    text: "Vue.js est un framework JavaScript *progressif* qui permet de développer des applications *interactives* facilement.",
    blanks: [
      { id: 'blank1', correctAnswers: ['progressif'], position: 0 },
      { id: 'blank2', correctAnswers: ['interactives'], position: 1 }
    ],
    h5pContent: '/h5p/content/demo-blanks'
  },
  'drag-drop': {
    question: "Exercice de glisser-déposer (en développement)",
    note: "Ce type de question nécessite des bibliothèques ES6 compilées qui ne sont pas encore disponibles.",
    h5pContent: '/h5p/content/demo-dragquestion'
  },
  'matching': {
    question: "Exercice d'associations par zones (en développement)", 
    note: "Ce type de question utilise des hotspots d'image qui nécessitent une configuration avancée.",
    h5pContent: '/h5p/content/demo-hotspots'
  },
  'sorting': {
    question: "Exercice de tri de texte (en développement)",
    note: "Ce type de question nécessite des bibliothèques ES6 compilées qui ne sont pas encore disponibles.", 
    h5pContent: '/h5p/content/demo-dragtext'
  }
};

// Computed
const getCurrentQuestionType = () => {
  return questionTypes.find(type => type.value === selectedQuestionType.value) || questionTypes[0];
};

const getCurrentQuestion = () => {
  return sampleQuestions[selectedQuestionType.value as keyof typeof sampleQuestions];
};

// Helper functions for render modes
const getRenderModeTitle = () => {
  switch (renderMode.value) {
    case 'local': return 'H5P Standard Local'
    case 'cdn': return 'CDN + CSS Override'
    case 'vue': return 'Vue.js Enhanced'
    default: return 'Unknown'
  }
}

const getCustomizationLevel = () => {
  switch (renderMode.value) {
    case 'local': 
      return { text: 'Maximum (H5P Standard)', class: 'text-blue-600 font-medium' }
    case 'cdn': 
      return { text: 'Élevé (recommandé)', class: 'text-green-600 font-medium' }
    case 'vue': 
      return { text: 'Maximum', class: 'text-purple-600 font-medium' }
    default: 
      return { text: 'Inconnu', class: 'text-gray-600' }
  }
}

// Watchers to reset state when question type changes
watch(selectedQuestionType, () => {
  // Reset answer state when question type changes
  selectedAnswer.value = null;
  score.value = 0;
  maxScore.value = 1;
  showResults.value = false;
});

watch(renderMode, () => {
  // Reset state when changing render mode
  selectedAnswer.value = null;
  score.value = 0;
  maxScore.value = 1;
  showResults.value = false;
});

// H5P Event Handlers
const onH5PReady = (instance: any) => {
  console.log('✅ H5P Ready:', instance);
};

const onH5PError = (error: string) => {
  console.error('❌ H5P Error:', error);
};

const onH5PProgress = (data: any) => {
  console.log('📊 H5P Progress:', data);
  if (data.score !== undefined) {
    score.value = data.score;
  }
  if (data.maxScore !== undefined) {
    maxScore.value = data.maxScore;
  }
};

const onH5PCompleted = (result: any) => {
  console.log('🎉 H5P Completed:', result);
  showResults.value = true;
};

// Content Editor Event Handlers
const onContentSaved = (content: any) => {
  console.log('💾 Content saved:', content);
  contentWasUpdated.value = true;
};

const onContentUpdated = (content: any) => {
  console.log('🔄 Content updated:', content);
  contentWasUpdated.value = true;
};

// Demo refresh function
const refreshDemo = () => {
  demoKey.value = `demo-${Date.now()}`;
  contentWasUpdated.value = false;
  // Reset state
  selectedAnswer.value = null;
  score.value = 0;
  maxScore.value = 1;
  showResults.value = false;
};
</script>

<style scoped>
.h5p-demo-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
}

.choice-option:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-item {
  padding: 0.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
}

code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

/* Animations */
.choice-option {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.demo-controls, .question-selector, .demo-area, .documentation {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
