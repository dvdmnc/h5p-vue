<template>
  <div class="h5p-integration-example">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        Exemple d'Intégration H5P
      </h2>
      <p class="text-gray-600 mb-4">
        Cette démonstration montre comment intégrer H5P avec Vue.js et personnaliser l'apparence selon la charte graphique.
      </p>
    </div>

    <!-- H5P Content Container -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div 
        ref="h5pContainer" 
        class="h5p-wrapper"
        :class="{ 
          'opacity-50': isLoading,
          'border-red-200 bg-red-50': !!error 
        }"
      >
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p class="text-gray-600">Chargement du contenu interactif...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="text-center py-8">
          <div class="text-red-600 mb-4">
            <svg class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p class="font-medium">Erreur de chargement</p>
            <p class="text-sm text-gray-600 mt-1">{{ error }}</p>
          </div>
          <button 
            @click="retryLoad"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer
          </button>
        </div>

        <!-- H5P Content will be inserted here -->
        <div 
          v-show="!isLoading && !error"
          id="h5p-content-container"
          class="h5p-content-area"
        ></div>
      </div>
    </div>

    <!-- Results Display -->
    <div v-if="showResults && results" class="mt-6 bg-gray-50 rounded-lg p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-3">Résultats</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ results.score }}</div>
          <div class="text-sm text-gray-500">Points obtenus</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-900">{{ results.maxScore }}</div>
          <div class="text-sm text-gray-500">Points maximum</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">
            {{ Math.round((results.score / results.maxScore) * 100) }}%
          </div>
          <div class="text-sm text-gray-500">Pourcentage</div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-6 flex flex-wrap gap-3">
      <button 
        @click="loadSampleContent"
        :disabled="isLoading"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Charger Exemple QCM
      </button>
      
      <button 
        @click="toggleResults"
        :disabled="!results"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {{ showResults ? 'Masquer' : 'Afficher' }} Résultats
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// State management
const h5pContainer = ref<HTMLElement>()
const isLoading = ref(false)
const error = ref<string | null>(null)
const h5pInstance = ref<any>(null)
const results = ref<any>(null)
const showResults = ref(false)

// H5P Integration
const loadSampleContent = async () => {
  if (!h5pContainer.value) return

  isLoading.value = true
  error.value = null

  try {
    // For demonstration, we'll simulate H5P loading
    // In a real implementation, you would:
    // 1. Load H5P Standalone library
    // 2. Configure the content
    // 3. Initialize the H5P instance

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Create a mock H5P-like interface for demonstration
    const contentContainer = document.getElementById('h5p-content-container')
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="h5p-demo-content bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4 text-gray-900">
            Question de Démonstration
          </h3>
          <p class="text-gray-700 mb-4">
            Quelle est la capitale de la France ?
          </p>
          <div class="space-y-2">
            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <input type="radio" name="demo-question" value="paris" class="mr-3">
              <span>Paris</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <input type="radio" name="demo-question" value="lyon" class="mr-3">
              <span>Lyon</span>
            </label>
            <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors">
              <input type="radio" name="demo-question" value="marseille" class="mr-3">
              <span>Marseille</span>
            </label>
          </div>
          <div class="mt-4 flex gap-2">
            <button id="check-answer-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Vérifier
            </button>
            <button id="retry-btn" class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" style="display: none;">
              Réessayer
            </button>
          </div>
          <div id="feedback" class="mt-4" style="display: none;"></div>
        </div>
      `

      // Add demo functionality
      setupDemoInteractions()
    }

    // Mock results for demonstration
    results.value = {
      score: 0,
      maxScore: 1,
      answered: false
    }

    isLoading.value = false

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement'
    isLoading.value = false
    console.error('Error loading H5P content:', err)
  }
}

const setupDemoInteractions = () => {
  const checkBtn = document.getElementById('check-answer-btn')
  const retryBtn = document.getElementById('retry-btn')
  const feedback = document.getElementById('feedback')

  if (checkBtn && retryBtn && feedback) {
    checkBtn.addEventListener('click', () => {
      const selectedAnswer = document.querySelector('input[name="demo-question"]:checked') as HTMLInputElement
      
      if (!selectedAnswer) {
        feedback.innerHTML = '<div class="p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">Veuillez sélectionner une réponse.</div>'
        feedback.style.display = 'block'
        return
      }

      const isCorrect = selectedAnswer.value === 'paris'
      
      if (isCorrect) {
        feedback.innerHTML = '<div class="p-3 bg-green-100 border border-green-400 rounded-lg text-green-800">Correct ! Paris est bien la capitale de la France.</div>'
        results.value = { score: 1, maxScore: 1, answered: true }
      } else {
        feedback.innerHTML = '<div class="p-3 bg-red-100 border border-red-400 rounded-lg text-red-800">Incorrect. La bonne réponse est Paris.</div>'
        results.value = { score: 0, maxScore: 1, answered: true }
      }
      
      feedback.style.display = 'block'
      checkBtn.style.display = 'none'
      retryBtn.style.display = 'inline-block'
      
      // Disable all inputs
      document.querySelectorAll('input[name="demo-question"]').forEach((input: any) => {
        input.disabled = true
      })
    })

    retryBtn.addEventListener('click', () => {
      // Reset demo
      document.querySelectorAll('input[name="demo-question"]').forEach((input: any) => {
        input.disabled = false
        input.checked = false
      })
      
      feedback.style.display = 'none'
      checkBtn.style.display = 'inline-block'
      retryBtn.style.display = 'none'
      
      results.value = { score: 0, maxScore: 1, answered: false }
    })
  }
}

const retryLoad = () => {
  loadSampleContent()
}

const toggleResults = () => {
  showResults.value = !showResults.value
}

// Lifecycle
onMounted(() => {
  console.log('H5P Integration Example mounted')
})

onUnmounted(() => {
  // Cleanup if needed
  if (h5pInstance.value) {
    // Clean up H5P instance
    console.log('Cleaning up H5P instance')
  }
})
</script>

<style scoped>
.h5p-wrapper {
  min-height: 200px;
  transition: all 0.3s ease;
}

.h5p-content-area {
  min-height: 150px;
}

/* Custom styling for the demo content */
:deep(.h5p-demo-content) {
  font-family: inherit;
}

:deep(.h5p-demo-content input[type="radio"]) {
  accent-color: #3B82F6;
}

/* Animation for loading state */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.opacity-50 {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
