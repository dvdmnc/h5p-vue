<template>
  <div class="h5p-working-demo">
    <!-- Debug Info -->
    <div class="debug-info mb-4 p-4 bg-gray-50 border rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Mode actuel: <span class="text-blue-600">{{ props.renderMode }}</span></h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div v-if="props.renderMode === 'cdn'"><strong>CDN URL:</strong> <a :href="cdnUrl" target="_blank" class="text-blue-500 hover:underline">{{ cdnUrl }}</a></div>
        <div v-if="props.renderMode === 'local'">
          <strong>Status Local:</strong> <span :class="{'text-green-600': localStatus === 'H5P initialisé avec succès!', 'text-red-600': localStatus.includes('Erreur'), 'text-blue-600': !localStatus.includes('Erreur') && localStatus !== 'H5P initialisé avec succès!'}">{{ localStatus }}</span>
          <div><strong>Content Path:</strong> {{ getCurrentContentPath() }}</div>
        </div>
        <div><strong>H5P Standalone disponible:</strong> <span :class="h5pStandaloneAvailable ? 'text-green-600' : 'text-red-600'">{{ h5pStandaloneAvailable ? 'Oui' : 'Non' }}</span></div>
        <div><strong>Question Type:</strong> <span class="text-blue-600">{{ selectedQuestionType }}</span></div>
      </div>
    </div>

    <!-- CDN Mode -->
    <div v-if="props.renderMode === 'cdn'" class="cdn-demo">
      <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-green-800 text-sm font-medium">
            Mode CDN - H5P depuis H5P.org
          </span>
        </div>
      </div>
      
      <div class="h5p-iframe-container" style="border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; background: white;">
        <iframe
          :src="cdnUrl"
          width="100%"
          height="400"
          style="border: none; border-radius: 8px;"
          @load="onIframeLoad"
          @error="onIframeError"
        ></iframe>
      </div>
    </div>

    <!-- Local Mode -->
    <div v-if="props.renderMode === 'local'" class="local-demo">
      <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <span class="text-blue-800 text-sm font-medium">
            Mode Local - H5P Standalone
          </span>
        </div>
      </div>

      <div v-if="localLoading" class="loading p-8 text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">Chargement H5P local...</p>
      </div>

      <div v-if="localError" class="error p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 class="text-red-800 font-semibold mb-2">Erreur H5P Local</h4>
        <p class="text-red-600">{{ localError }}</p>
        <button @click="initLocalH5P" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Réessayer
        </button>
      </div>

      <div 
        ref="h5pLocalContainer" 
        id="h5p-local-demo"
        class="h5p-local-container"
        style="min-height: 400px; border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; background: white;"
      ></div>
    </div>

    <!-- Vue Enhanced Mode -->
    <div v-if="props.renderMode === 'vue'" class="vue-enhanced-demo">
      <div class="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          <span class="text-purple-800 text-sm font-medium">
            Mode Vue.js Enhanced - Composants natifs
          </span>
        </div>
      </div>
      
      <VueEnhancedQuiz :question-type="selectedQuestionType" @answer="onVueAnswer" />
    </div>

    <!-- Debug Info -->
    <div class="debug-info mt-6 p-4 bg-gray-50 border rounded-lg">
      <h4 class="font-semibold text-gray-800 mb-2">Debug Info</h4>
      <div class="text-sm text-gray-600 space-y-1">
        <div><strong>Mode actuel:</strong> <span class="text-blue-600">{{ props.renderMode }}</span></div>
        <div v-if="props.renderMode === 'cdn'"><strong>CDN URL:</strong> <a :href="cdnUrl" target="_blank" class="text-blue-500 hover:underline">{{ cdnUrl }}</a></div>
        <div v-if="props.renderMode === 'local'">
          <strong>Status Local:</strong> <span :class="{'text-green-600': localStatus === 'H5P initialisé avec succès!', 'text-red-600': localStatus.includes('Erreur'), 'text-blue-600': !localStatus.includes('Erreur') && localStatus !== 'H5P initialisé avec succès!'}">{{ localStatus }}</span>
          <div><strong>Content Path:</strong> {{ getCurrentContentPath() }}</div>
        </div>
        <div><strong>H5P Standalone disponible:</strong> <span :class="h5pStandaloneAvailable ? 'text-green-600' : 'text-red-600'">{{ h5pStandaloneAvailable ? 'Oui' : 'Non' }}</span></div>
        <div><strong>Question Type:</strong> <span class="text-blue-600">{{ selectedQuestionType }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import VueEnhancedQuiz from './VueEnhancedQuiz.vue'
import { getContentPath, getCdnUrl, getAbsoluteH5PConfig } from '@/utils/h5p'

// Declare global H5P types
declare global {
  interface Window {
    H5P: any;
    H5PStandalone: any;
  }
}

// Props
interface Props {
  questionType?: string;
  renderMode?: 'cdn' | 'local' | 'vue';
}

const props = withDefaults(defineProps<Props>(), {
  questionType: 'multiple-choice',
  renderMode: 'cdn'
})

// Emits
const emit = defineEmits<{
  ready: [instance: any]
  error: [error: string]
  progress: [data: any]
  completed: [result: any]
}>()

// State
const selectedQuestionType = ref(props.questionType)
const localLoading = ref(false)
const localError = ref('')
const localStatus = ref('Non initialisé')
const h5pStandaloneAvailable = ref(false)
const h5pLocalContainer = ref<HTMLDivElement>()

// CDN configuration
const cdnUrl = computed(() => getCdnUrl(selectedQuestionType.value))

// Methods
const onIframeLoad = () => {
  console.log('✅ CDN iframe loaded successfully')
  emit('ready', { mode: 'cdn' })
}

const onIframeError = () => {
  console.error('❌ CDN iframe failed to load')
  emit('error', 'CDN iframe failed to load')
}

const checkH5PStandalone = async () => {
  try {
    // Check if H5P is available via global window object
    if (typeof window !== 'undefined') {
      console.log('Checking H5P availability:', {
        'window.H5P': typeof window.H5P,
        'window.H5PStandalone': typeof window.H5PStandalone,
        'H5P keys': Object.keys(window).filter(k => k.includes('H5P'))
      });
      
      if (window.H5P && typeof window.H5P === 'function') {
        h5pStandaloneAvailable.value = true
        console.log('✅ H5P is available via window.H5P')
        return window.H5P
      } else if (window.H5PStandalone && typeof window.H5PStandalone === 'function') {
        h5pStandaloneAvailable.value = true
        console.log('✅ H5P is available via window.H5PStandalone')
        return window.H5PStandalone
      } else {
        // Maybe it's a different property - let's try to find it
        const h5pKeys = Object.keys(window).filter(k => k.toLowerCase().includes('h5p'));
        for (const key of h5pKeys) {
          if (typeof (window as any)[key] === 'function') {
            h5pStandaloneAvailable.value = true
            console.log(`✅ H5P is available via window.${key}`)
            return (window as any)[key]
          }
        }
        throw new Error('H5P not found on window object')
      }
    } else {
      throw new Error('Window object not available')
    }
  } catch (error) {
    console.error('❌ H5P Standalone not available:', error)
    h5pStandaloneAvailable.value = false
    return null
  }
}

const getCurrentContentPath = () => {
  return getContentPath(selectedQuestionType.value)
}

const initLocalH5P = async () => {
  localLoading.value = true
  localError.value = ''
  localStatus.value = 'Initialisation...'

  try {
    console.log('🚀 Initializing local H5P...')
    
    // Check if H5P Standalone is available
    const H5PStandalone = await checkH5PStandalone()
    if (!H5PStandalone) {
      throw new Error('H5P Standalone non disponible')
    }

    await nextTick()

    if (!h5pLocalContainer.value) {
      throw new Error('Container non trouvé')
    }

    // Clear container
    h5pLocalContainer.value.innerHTML = ''

    localStatus.value = 'Création de l\'instance H5P...'

    // Create H5P instance with correct configuration
    console.log('🎯 Creating H5P instance...')
    
    // Determine content path based on question type
    const contentPath = getCurrentContentPath()
    
    console.log(`Using content path: ${contentPath}`)
    
    // Create proper configuration with absolute URLs
    const config = {
      h5pJsonPath: contentPath,
      ...getAbsoluteH5PConfig()
    }
    
    console.log('H5P Config:', config)
    
    const h5pInstance = new H5PStandalone(h5pLocalContainer.value, config)

    console.log('✅ H5P instance created:', h5pInstance)
    localStatus.value = 'H5P initialisé avec succès!'
    
    // Set up event listeners
    h5pInstance.on('xAPI', (event: any) => {
      console.log('H5P xAPI Event:', event)
      
      if (event && event.data && event.data.statement) {
        const statement = event.data.statement
        
        // Check for completion
        if (statement.result && (statement.result.completion || statement.result.success)) {
          const score = statement.result.score?.raw || 0
          const maxScore = statement.result.score?.max || 1
          
          emit('completed', {
            score,
            maxScore,
            success: statement.result.success || false,
            completion: statement.result.completion || false
          })
        }
        
        // Progress update
        emit('progress', {
          type: statement.verb?.id || 'unknown',
          score: statement.result?.score?.raw,
          maxScore: statement.result?.score?.max,
          data: statement
        })
      }
    })
    
    emit('ready', h5pInstance)

  } catch (error) {
    console.error('❌ Local H5P initialization failed:', error)
    localError.value = error instanceof Error ? error.message : 'Erreur inconnue'
    localStatus.value = 'Erreur d\'initialisation'
    emit('error', localError.value)
  } finally {
    localLoading.value = false
  }
}

const onVueAnswer = (data: any) => {
  console.log('Vue Enhanced Answer:', data)
  emit('progress', data)
  if (data.completed) {
    emit('completed', data)
  }
}

// Watch mode changes
const handleModeChange = () => {
  console.log(`🔄 Handling mode change to ${props.renderMode}`)
  
  if (props.renderMode === 'local') {
    console.log('🏗️ Initializing local H5P mode')
    nextTick(() => {
      initLocalH5P()
    })
  } else if (props.renderMode === 'cdn') {
    console.log('🌐 Switching to CDN mode')
    // For CDN mode, the component will automatically use the iframe with cdnUrl
  } else if (props.renderMode === 'vue') {
    console.log('🧩 Switching to Vue Enhanced mode')
    // For Vue mode, the VueEnhancedQuiz component will be rendered
  }
}

// Watch props changes
watch(() => props.questionType, (newType) => {
  console.log(`📝 Question type changed to: ${newType}`)
  selectedQuestionType.value = newType
  
  // If in local mode, reinitialize with new content
  if (props.renderMode === 'local') {
    console.log('🔄 Reinitializing local H5P with new content')
    nextTick(() => {
      initLocalH5P()
    })
  }
})

watch(() => props.renderMode, (newMode) => {
  console.log(`🔀 Render mode changed to: ${newMode}`)
  handleModeChange()
})

onMounted(async () => {
  console.log('🚀 H5P Working Demo mounted')
  console.log(`Initial render mode: ${props.renderMode}`)
  console.log(`Initial question type: ${props.questionType}`)
  
  // Check H5P Standalone availability
  await checkH5PStandalone()
  
  // If starting in local mode, initialize
  if (props.renderMode === 'local') {
    console.log('🏁 Initializing local H5P on mount')
    await nextTick()
    initLocalH5P()
  }
})
</script>

<style scoped>
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.h5p-working-demo {
  max-width: 800px;
  margin: 0 auto;
}

.h5p-iframe-container iframe {
  width: 100%;
  height: 400px;
}

.h5p-local-container {
  width: 100%;
  min-height: 400px;
}
</style>
