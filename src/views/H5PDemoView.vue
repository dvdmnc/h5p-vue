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
              Local Libraries
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="renderMode"
                value="original-cdn"
                class="mr-2"
              />
              Original CDN
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

      <!-- Demo question area -->
      <div class="demo-area p-6 bg-white rounded-lg shadow-sm border">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ getCurrentQuestionType().label }} - 
            <span class="text-primary-600">{{ getRenderModeTitle() }}</span>
          </h2>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span>Customisation style:</span>
            <span :class="getCustomizationLevel().class">
              {{ getCustomizationLevel().text }}
            </span>
          </div>
        </div>

        <!-- Question content -->
        <div class="question-content">
          <h3 class="text-lg font-medium text-gray-800 mb-4">
            {{ getCurrentQuestion().question }}
          </h3>

          <!-- H5P Working Demo Component -->
          <H5PWorkingDemo 
            :question-type="selectedQuestionType"
            :render-mode="renderMode"
            :key="`working-demo-${selectedQuestionType}-${renderMode}`" 
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

      <!-- Documentation section -->
      <div class="documentation mt-8 p-6 bg-white rounded-lg shadow-sm border">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Documentation technique</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="tech-stack">
            <h3 class="font-semibold text-gray-700 mb-3">Stack technique</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• <strong>Vue.js 3</strong> - Framework réactif avec Composition API</li>
              <li>• <strong>TypeScript</strong> - Typage statique pour la robustesse</li>
              <li>• <strong>H5P Standalone</strong> - Moteur H5P intégré</li>
              <li>• <strong>Tailwind CSS</strong> - Système de design utilitaire</li>
              <li>• <strong>Vite</strong> - Build tool moderne et rapide</li>
            </ul>
          </div>
          
          <div class="components-list">
            <h3 class="font-semibold text-gray-700 mb-3">Composants disponibles</h3>
            <ul class="space-y-2 text-sm text-gray-600">
              <li>• <code>H5PPlayer.vue</code> - Player H5P encapsulé</li>
              <li>• <code>VueFillInBlanksRenderer.vue</code> - Texte à trous</li>
              <li>• <code>VueDragDropRenderer.vue</code> - Glisser-déposer</li>
              <li>• <code>VueMatchingRenderer.vue</code> - Associations</li>
              <li>• <code>VueSortingRenderer.vue</code> - Tri et organisation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import H5PWorkingDemo from '../components/H5P/H5PWorkingDemo.vue';

// State
const renderMode = ref<'local' | 'original-cdn' | 'vue'>('original-cdn');
const selectedQuestionType = ref('multiple-choice');
const selectedAnswer = ref<string | null>(null);
const score = ref(0);
const maxScore = ref(1);
const showResults = ref(false);

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
    question: "Quel est le framework JavaScript le plus populaire pour créer des interfaces utilisateur réactives ?",
    choices: [
      { id: 'a', text: 'jQuery' },
      { id: 'b', text: 'React' },
      { id: 'c', text: 'Vue.js' },
      { id: 'd', text: 'Angular' }
    ],
    correctAnswer: 'c',
    h5pContent: '/h5p/multiple-choice-demo.json'
  },
  'fill-in-blanks': {
    question: "Complétez le texte suivant :",
    text: "Vue.js est un framework JavaScript {{progressif}} qui permet de créer des interfaces utilisateur {{interactives}}. Il utilise un système de {{réactivité}} pour mettre à jour automatiquement le DOM.",
    blanks: [
      { id: 'blank1', correctAnswers: ['progressif'], position: 0 },
      { id: 'blank2', correctAnswers: ['interactives'], position: 1 },
      { id: 'blank3', correctAnswers: ['réactivité'], position: 2 }
    ],
    h5pContent: '/h5p/fill-blanks-demo.json'
  },
  'drag-drop': {
    question: "Glissez les technologies dans leurs catégories appropriées :",
    draggableItems: [
      { id: 'vue', content: 'Vue.js', type: 'framework' },
      { id: 'react', content: 'React', type: 'framework' },
      { id: 'css', content: 'CSS', type: 'styling' },
      { id: 'tailwind', content: 'Tailwind', type: 'styling' }
    ],
    dropZones: [
      { id: 'frameworks', label: 'Frameworks JS', acceptsTypes: ['framework'], correctItems: ['vue', 'react'] },
      { id: 'styling', label: 'Technologies de style', acceptsTypes: ['styling'], correctItems: ['css', 'tailwind'] }
    ],
    h5pContent: '/h5p/drag-drop-demo.json'
  },
  'matching': {
    question: "Associez chaque concept à sa définition :",
    leftItems: [
      { id: 'component', content: 'Composant', correctMatch: 'component-def' },
      { id: 'reactivity', content: 'Réactivité', correctMatch: 'reactivity-def' },
      { id: 'directive', content: 'Directive', correctMatch: 'directive-def' }
    ],
    rightItems: [
      { id: 'component-def', content: 'Élément réutilisable encapsulant logique et présentation' },
      { id: 'reactivity-def', content: 'Système de mise à jour automatique des données' },
      { id: 'directive-def', content: 'Instruction spéciale pour manipuler le DOM' }
    ],
    h5pContent: '/h5p/matching-demo.json'
  },
  'sorting': {
    question: "Organisez ces étapes du cycle de vie d'un composant Vue dans le bon ordre :",
    items: [
      { id: 'created', content: 'Created - Composant créé' },
      { id: 'mounted', content: 'Mounted - Composant monté dans le DOM' },
      { id: 'updated', content: 'Updated - Composant mis à jour' },
      { id: 'unmounted', content: 'Unmounted - Composant démonté' }
    ],
    correctOrder: ['created', 'mounted', 'updated', 'unmounted'],
    h5pContent: '/h5p/sorting-demo.json'
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
    case 'local': return 'Local Libraries'
    case 'original-cdn': return 'Original CDN'
    case 'vue': return 'Vue.js Enhanced'
    default: return 'Unknown'
  }
}

const getCustomizationLevel = () => {
  switch (renderMode.value) {
    case 'local': 
      return { text: 'Maximum (si fonctionnel)', class: 'text-blue-600 font-medium' }
    case 'original-cdn': 
      return { text: 'Basique', class: 'text-gray-600 font-medium' }
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
