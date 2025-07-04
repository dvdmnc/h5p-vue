<template>
  <div class="h5p-working-demo">
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
            Mode Local - H5P Standard
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
        class="h5p-content"
        :data-content-id="getContentConfig(selectedQuestionType).contentId.replace('cid-', '')"
        style="min-height: 400px; border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; background: white;"
      >
        H5P content will appear here...
      </div>
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
import { ref, watch, computed } from 'vue'
// @ts-ignore
import VueEnhancedQuiz from './VueEnhancedQuiz.vue'

import { getContentPath, getCdnUrl } from '@/utils/h5p'

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

// H5P Standard Helper Functions (from H5PStandardDemo)
const getContentConfig = (questionType: string) => {
  // Map question types to H5P content configurations (matching H5PStandardDemo IDs)
  const contentConfigs = {
    'multiple-choice': {
      contentId: 'cid-demo-multichoice',
      library: 'H5P.MultiChoice 1.16',
      title: 'Demo Multiple Choice',
      path: 'demo-multichoice'
    },
    'fill-in-blanks': {
      contentId: 'cid-demo-blanks',
      library: 'H5P.Blanks 1.14',
      title: 'Demo Fill in Blanks',
      path: 'demo-blanks'
    },
    'drag-drop': {
      contentId: 'cid-demo-dragquestion',
      library: 'H5P.DragQuestion 1.14',
      title: 'Demo Drag and Drop',
      path: 'demo-dragquestion'
    },
    'matching': {
      contentId: 'cid-demo-hotspots',
      library: 'H5P.ImageHotspots 1.10',
      title: 'Demo Image Hotspots',
      path: 'demo-hotspots'
    },
    'sorting': {
      contentId: 'cid-demo-dragtext',
      library: 'H5P.DragText 1.10',
      title: 'Demo Drag Text',
      path: 'demo-dragtext'
    }
  }
  
  return contentConfigs[questionType as keyof typeof contentConfigs] || contentConfigs['multiple-choice']
}

const setupH5PIntegration = (questionType: string) => {
  const contentConfig = getContentConfig(questionType)
  
  // Set up H5PIntegration for standard H5P (following H5PStandardDemo pattern exactly)
  const integration = {
    baseUrl: window.location.origin,
    url: '/h5p',
    urlLibraries: '/h5p/libraries',
    postUserStatistics: false,
    saveFreq: false,
    ajax: {},
    l10n: {
      H5P: {
        fullscreen: 'Plein écran',
        disableFullscreen: 'Désactiver le plein écran',
        download: 'Télécharger',
        copyrights: 'Droits d\'utilisation',
        embed: 'Intégrer',
        size: 'Taille',
        showAdvanced: 'Afficher les options avancées',
        hideAdvanced: 'Masquer les options avancées',
        close: 'Fermer',
        title: 'Titre',
        author: 'Auteur',
        year: 'Année',
        source: 'Source',
        license: 'Licence'
      }
    },
    // Add global theme configuration that H5P.Question might expect
    theme: {
      name: 'default'
    },
    core: {
      styles: ['/h5p/h5p-standalone/styles/h5p.css'],
      scripts: ['/h5p/h5p-standalone/dist/frame.bundle.js']
    },
    contents: {
      [contentConfig.contentId]: {
        library: contentConfig.library,
        title: contentConfig.title,
        url: `/h5p/content/${contentConfig.path}`,
        contentUrl: `/h5p/content/${contentConfig.path}/content`,
        jsonContent: '{}', // Will be loaded later
        styles: [
          '/h5p/h5p-standalone/styles/h5p.css',
          '/h5p/libraries/FontAwesome-4.5/h5p-font-awesome.min.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-help-dialog.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-message-dialog.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progress-circle.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-simple-rounded-button.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-speech-bubble.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-throbber.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-tip.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-slider.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-score-bar.css',
          '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progressbar.css',
          '/h5p/libraries/H5P.Question-1.5/styles/question.css',
          '/h5p/libraries/H5P.Question-1.5/styles/explainer.css',
          '/h5p/libraries/H5P.MultiChoice-1.16/css/multichoice.css'
        ],
        scripts: [], // Will be populated by JS loading
        fullScreen: false,
        exportUrl: '',
        embedCode: '',
        resizeCode: '',
        displayOptions: {
          frame: true,
          export: false,
          embed: false,
          copyright: false,
          icon: false
        },
        metadata: {
          title: contentConfig.title,
          license: 'U'
        }
      }
    }
  }
  
  ;(window as any).H5PIntegration = integration
  console.log(`✅ H5PIntegration configured for ${questionType}:`, contentConfig)
}

const loadCSS = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if CSS already exists
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) {
      resolve()
      return
    }
    
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
    document.head.appendChild(link)
  })
}

const loadH5PCSS = async (questionType: string) => {
  try {
    console.log(`🎨 Loading H5P CSS files for ${questionType}...`)
    
    // Base CSS files that are always needed
    const baseCssFiles = [
      '/h5p/h5p-standalone/styles/h5p.css',
      '/h5p/libraries/FontAwesome-4.5/h5p-font-awesome.min.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-help-dialog.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-message-dialog.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progress-circle.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-simple-rounded-button.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-speech-bubble.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-tip.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-slider.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-score-bar.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progressbar.css',
      '/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-ui.css',
      '/h5p/libraries/H5P.Question-1.5/styles/question.css'
    ]
    
    // Question-type specific CSS files
    const typeCssFiles = {
      'multiple-choice': ['/h5p/libraries/H5P.MultiChoice-1.16/multichoice.css'],
      'fill-in-blanks': ['/h5p/libraries/H5P.Blanks-1.14/css/blanks.css'],
      'drag-drop': ['/h5p/libraries/H5P.DragQuestion-1.14/css/dragquestion.css'],
      'matching': ['/h5p/libraries/H5P.ImageHotspots-1.10/styles/image-hotspots.css'],
      'sorting': ['/h5p/libraries/H5P.DragText-1.10/src/styles/drag-text.css']
    }
    
    // Combine base CSS with type-specific CSS
    const cssFiles = [
      ...baseCssFiles, 
      ...(typeCssFiles[questionType as keyof typeof typeCssFiles] || typeCssFiles['multiple-choice'])
    ]
    
    // Load CSS files in parallel (order doesn't matter for CSS)
    await Promise.all(cssFiles.map(loadCSS))
    
    console.log(`✅ All H5P CSS files loaded for ${questionType}`)
  } catch (error) {
    console.log(`❌ Error loading CSS: ${error}`)
    throw error
  }
}

const loadH5PLibraries = async (questionType: string) => {
  try {
    console.log(`🔧 Loading H5P libraries for ${questionType}...`)
    
    // Base library scripts that are always needed
    const baseLibraryScripts = [
      // Core dependencies first
      '/h5p/libraries/H5P.Components-1.0/js/components.js',
      
      // JoubelUI components (multiple files)
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-help-dialog.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-message-dialog.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progress-circle.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-simple-rounded-button.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-speech-bubble.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-throbber.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-tip.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-slider.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-score-bar.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progressbar.js',
      '/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-ui.js',
      
      // Question library (multiple files)
      '/h5p/libraries/H5P.Question-1.5/scripts/question.js',
      '/h5p/libraries/H5P.Question-1.5/scripts/explainer.js',
      '/h5p/libraries/H5P.Question-1.5/scripts/score-points.js',
      
      // Transition library
      '/h5p/libraries/H5P.Transition-1.0/transition.js'
    ]
    
    // Question-type specific library scripts (only include working, compiled libraries)
    const typeLibraryScripts = {
      'multiple-choice': ['/h5p/libraries/H5P.MultiChoice-1.16/multichoice.js'],
      'fill-in-blanks': [
        // Load blanks.js first (main library), then cloze.js (dependency)
        '/h5p/libraries/H5P.Blanks-1.14/js/blanks.js',
        '/h5p/libraries/H5P.Blanks-1.14/js/cloze.js'
      ],
      'drag-drop': [
        // Skip - these are ES6 modules that need compilation
        // Will show message that it's not available
      ],
      'matching': [
        // Skip problematic libraries for now
        // Will show message that it's not available  
      ],
      'sorting': [
        // Skip - these are ES6 modules that need compilation
        // Will show message that it's not available
      ]
    }
    
    // Combine base libraries with type-specific libraries
    const libraryScripts = [
      ...baseLibraryScripts,
      ...(typeLibraryScripts[questionType as keyof typeof typeLibraryScripts] || [])
    ]
    
    // Check if we have specific libraries for this question type
    if ((typeLibraryScripts[questionType as keyof typeof typeLibraryScripts] || []).length === 0) {
      console.warn(`⚠️ No compiled libraries available for question type: ${questionType}`)
      console.warn('💡 This question type requires ES6 module compilation or has dependency issues.')
    }
    
    // Load scripts sequentially (order matters for JS dependencies)
    for (const script of libraryScripts) {
      await loadScript(script)
    }
    
    console.log(`✅ Loaded: ${libraryScripts.map(s => s.split('/').pop()).join(', ')}`)
    console.log(`✅ All H5P libraries loaded for ${questionType}`)
  } catch (error) {
    console.log(`❌ Error loading libraries: ${error}`)
    throw error
  }
}

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

const loadH5PContent = async (questionType: string) => {
  try {
    console.log(`📄 Loading H5P content for ${questionType}...`)
    const contentConfig = getContentConfig(questionType)
    console.log(`📄 Content config:`, contentConfig)
    
    // Load both content.json and h5p.json to get complete content structure
    const [contentResponse, h5pResponse] = await Promise.all([
      fetch(`/h5p/content/${contentConfig.path}/content.json`),
      fetch(`/h5p/content/${contentConfig.path}/h5p.json`)
    ])
    
    if (!contentResponse.ok || !h5pResponse.ok) {
      throw new Error(`Failed to fetch content files: ${contentResponse.status}/${h5pResponse.status}`)
    }
    
    const content = await contentResponse.json()
    const h5pInfo = await h5pResponse.json()
    
    console.log(`📄 Loaded content for ${questionType}:`, content)
    console.log(`📄 Loaded H5P info:`, h5pInfo)
    
    // Update H5PIntegration with actual content (exactly like H5PStandardDemo)
    const integration = (window as any).H5PIntegration
    if (!integration || !integration.contents[contentConfig.contentId]) {
      throw new Error(`Content configuration not found for ${contentConfig.contentId}`)
    }
    
    // Update the integration entry with proper metadata from h5p.json
    integration.contents[contentConfig.contentId].jsonContent = JSON.stringify(content)
    integration.contents[contentConfig.contentId].title = h5pInfo.title || contentConfig.title
    integration.contents[contentConfig.contentId].metadata = {
      title: h5pInfo.title || contentConfig.title,
      license: h5pInfo.license || 'U',
      authors: h5pInfo.authors || [],
      changes: h5pInfo.changes || [],
      defaultLanguage: h5pInfo.defaultLanguage || 'en'
    }
    
    console.log(`✅ H5P content loaded for ${questionType}`)
    console.log('📄 Content data:', content)
    console.log('� H5P metadata:', h5pInfo)
    console.log('�🔗 Integration entry updated:', integration.contents[contentConfig.contentId])
    
    return { content, h5pInfo }
  } catch (error) {
    console.log(`❌ Error loading content: ${error}`)
    throw error
  }
}

// Methods
const onIframeLoad = () => {
  console.log('✅ CDN iframe loaded successfully')
  emit('ready', { mode: 'cdn' })
}

const onIframeError = () => {
  console.error('❌ CDN iframe failed to load')
  emit('error', 'CDN iframe failed to load')
}

const getCurrentContentPath = () => {
  return getContentPath(selectedQuestionType.value)
}

const initLocalH5P = async () => {
  localLoading.value = true
  localError.value = ''
  localStatus.value = 'Initialisation...'

  try {
    console.log('🚀 Initializing local H5P with H5PStandardDemo approach...')
    console.log('📝 Question Type:', selectedQuestionType.value)
    
    // Clear previous H5P content from container
    if (h5pLocalContainer.value) {
      h5pLocalContainer.value.innerHTML = 'H5P content will appear here...'
      // Update the container's data-content-id
      const contentConfig = getContentConfig(selectedQuestionType.value)
      h5pLocalContainer.value.setAttribute('data-content-id', contentConfig.contentId.replace('cid-', ''))
    }
    
    // Check if H5P is available (from frame.bundle.js)
    if (typeof (window as any).H5P === 'undefined') {
      throw new Error('H5P not found - frame.bundle.js may not be loaded')
    }

    localStatus.value = 'Configuration H5PIntegration...'
    
    // Set up H5PIntegration FIRST (following H5PStandardDemo exactly)
    setupH5PIntegration(selectedQuestionType.value)
    
    localStatus.value = 'Chargement des CSS H5P...'
    
    // Load CSS files
    await loadH5PCSS(selectedQuestionType.value)
    
    localStatus.value = 'Chargement des bibliothèques H5P...'
    
    // Load required H5P libraries in correct order
    await loadH5PLibraries(selectedQuestionType.value)
    
    localStatus.value = 'Chargement du contenu H5P...'
    
    // Load content (this updates jsonContent in H5PIntegration)
    await loadH5PContent(selectedQuestionType.value)
    
    localStatus.value = 'Initialisation H5P...'
    
    // Wait a bit to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Debug check before initialization (following H5PStandardDemo)
    const contentConfig = getContentConfig(selectedQuestionType.value)
    const integration = (window as any).H5PIntegration
    const contentData = integration.contents[contentConfig.contentId]
    
    console.log('🔍 Final content check before H5P.init():')
    console.log('- Content ID:', contentConfig.contentId)
    console.log('- Content exists:', !!contentData)
    console.log('- JSON content set:', !!contentData?.jsonContent)
    console.log('- Library:', contentData?.library)
    
    // Initialize H5P (exactly like H5PStandardDemo)
    if ((window as any).H5P.init) {
      console.log('🔧 Calling H5P.init()...')
      ;(window as any).H5P.init()
      console.log('✅ H5P.init() completed')
    } else {
      throw new Error('H5P.init not available')
    }

    console.log('✅ H5P initialized successfully!')
    localStatus.value = 'H5P initialisé avec succès!'
    
    // Set up xAPI event listeners
    if ((window as any).H5P?.externalDispatcher) {
      (window as any).H5P.externalDispatcher.on('xAPI', (event: any) => {
        console.log('H5P xAPI Event:', event)
        
        if (event && event.data && event.data.statement) {
          const statement = event.data.statement
          
          // Process xAPI events
          if (statement.verb?.display?.['en-US']) {
            const verb = statement.verb.display['en-US']
            
            switch (verb) {
              case 'completed':
                console.log('✅ H5P Question completed!')
                const result = statement.result
                if (result) {
                  emit('completed', {
                    score: result.score?.scaled || 0,
                    maxScore: result.score?.max || 1,
                    rawScore: result.score?.raw || 0,
                    success: result.success || false,
                    completion: result.completion || false,
                    response: result.response || '',
                    duration: result.duration || null
                  })
                }
                break
              case 'answered':
                console.log('📝 H5P Question answered')
                const response = statement.result?.response
                if (response) {
                  emit('progress', { 
                    action: 'answered', 
                    response: response,
                    timestamp: new Date().toISOString()
                  })
                }
                break
              case 'interacted':
                console.log('🖱️ H5P Interaction detected')
                emit('progress', { 
                  action: 'interacted', 
                  timestamp: new Date().toISOString()
                })
                break
            }
          }
        }
      })
    }
    
    emit('ready', { mode: 'local' })
    
  } catch (error) {
    console.error('❌ Local H5P initialization failed:', error)
    localError.value = error instanceof Error ? error.message : 'Erreur inconnue'
    emit('error', `Local H5P initialization failed: ${error}`)
  } finally {
    localLoading.value = false
  }
}

// Vue Enhanced Quiz handler
const onVueAnswer = (answer: any) => {
  console.log('Vue Enhanced Quiz Answer:', answer)
  emit('progress', { action: 'vue_answer', answer, timestamp: new Date().toISOString() })
}

// Watchers
watch(() => props.questionType, (newQuestionType) => {
  selectedQuestionType.value = newQuestionType
})

watch(selectedQuestionType, () => {
  if (props.renderMode === 'local') {
    initLocalH5P()
  }
})

watch(() => props.renderMode, () => {
  if (props.renderMode === 'local') {
    initLocalH5P()
  }
})

// Lifecycle
const initComponent = () => {
  if (props.renderMode === 'local') {
    initLocalH5P()
  }
}

// Initialize on mount
setTimeout(initComponent, 1000)
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
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
