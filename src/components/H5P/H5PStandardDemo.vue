<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">H5P Standard Demo</h1>
    
    <div class="mb-4">
      <button @click="initializeH5P" class="px-4 py-2 bg-blue-500 text-white rounded mr-2">
        Initialize H5P
      </button>
      <button @click="checkStatus" class="px-4 py-2 bg-green-500 text-white rounded">
        Check Status
      </button>
    </div>
    
    <div class="bg-gray-100 p-4 rounded mb-4">
      <h3 class="font-bold mb-2">Status:</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ statusOutput }}</pre>
    </div>
    
    <div class="h5p-content-container">
      <div ref="h5pContainer" class="h5p-content" data-content-id="demo-multichoice" style="min-height: 400px; border: 1px solid #ccc; padding: 20px;">
        H5P content will appear here...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const statusOutput = ref('')
const h5pContainer = ref<HTMLDivElement>()

const log = (message: string) => {
  statusOutput.value += message + '\n'
  console.log(message)
}

const checkStatus = () => {
  statusOutput.value = ''
  
  log('🔍 Checking H5P Status...')
  log(`window.H5P: ${typeof (window as any).H5P}`)
  log(`window.H5PIntegration: ${typeof (window as any).H5PIntegration}`)
  
  if ((window as any).H5P) {
    log('✅ H5P found')
    log(`H5P.init: ${typeof (window as any).H5P.init}`)
    log(`H5P.newRunnable: ${typeof (window as any).H5P.newRunnable}`)
    
    const methods = Object.keys((window as any).H5P).filter(key => typeof (window as any).H5P[key] === 'function')
    log(`Available H5P methods: ${methods.join(', ')}`)
  }
  
  if ((window as any).H5PIntegration) {
    log('✅ H5PIntegration found')
    log(`Contents: ${Object.keys((window as any).H5PIntegration.contents || {})}`)
  }
}

const setupH5PIntegration = () => {
  // Set up H5PIntegration object that H5P expects
  (window as any).H5PIntegration = {
    baseUrl: window.location.origin,
    url: '/h5p',
    urlLibraries: '/h5p/libraries',
    postUserStatistics: false,
    saveFreq: false,
    ajax: {},
    l10n: {
      H5P: {
        fullscreen: 'Fullscreen',
        disableFullscreen: 'Disable fullscreen',
        download: 'Download',
        copyrights: 'Rights of use',
        embed: 'Embed',
        size: 'Size',
        showAdvanced: 'Show advanced',
        hideAdvanced: 'Hide advanced',
        close: 'Close',
        title: 'Title',
        author: 'Author',
        year: 'Year',
        source: 'Source',
        license: 'License',
      }
    },
    core: {
      styles: ['/h5p/h5p-standalone/dist/styles/h5p.css'],
      scripts: ['/h5p/h5p-standalone/dist/frame.bundle.js']
    },
    contents: {
      'cid-demo-multichoice': {
        library: 'H5P.MultiChoice 1.16',
        title: 'Demo Multiple Choice',
        url: '/h5p/content/demo-multichoice',
        contentUrl: '/h5p/content/demo-multichoice/content',
        jsonContent: '{}', // Will be loaded
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
        scripts: [
          // Scripts will be loaded dynamically in the correct order
          // This list is for reference but actual loading is done by loadH5PLibraries()
        ],
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
          title: 'Demo Multiple Choice',
          license: 'U'
        }
      }
    }
  }
  
  log('✅ H5PIntegration configured')
}

const loadH5PCSS = async () => {
  try {
    log('🎨 Loading H5P CSS files...')
    
    // List of required CSS files
    const cssFiles = [
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
    ]
    
    // Load CSS files in parallel (order doesn't matter for CSS)
    await Promise.all(cssFiles.map(loadCSS))
    
    log('✅ All H5P CSS files loaded')
  } catch (error) {
    log(`❌ Error loading CSS: ${error}`)
    throw error
  }
}

const loadH5PLibraries = async () => {
  try {
    log('🔧 Loading H5P libraries...')
    
    // List of required library scripts in dependency order
    const libraryScripts = [
      // Core dependencies first
      '/h5p/libraries/H5P.EventDispatcher-1.0/h5p-event-dispatcher.js',
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
      
      // Finally, MultiChoice
      '/h5p/libraries/H5P.MultiChoice-1.16/js/multichoice.js'
    ]
    
    // Load scripts sequentially
    for (const scriptPath of libraryScripts) {
      await loadScript(scriptPath)
      log(`✅ Loaded: ${scriptPath}`)
    }
    
    log('✅ All H5P libraries loaded')
  } catch (error) {
    log(`❌ Error loading libraries: ${error}`)
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

const loadH5PContent = async () => {
  try {
    // Load the actual content
    const response = await fetch('/h5p/content/demo-multichoice/content.json')
    const content = await response.json()
    
    // Update H5PIntegration with actual content
    const integration = (window as any).H5PIntegration
    integration.contents['cid-demo-multichoice'].jsonContent = JSON.stringify(content)
    
    log('✅ H5P content loaded')
    return content
  } catch (error) {
    log(`❌ Error loading content: ${error}`)
    throw error
  }
}

const initializeH5P = async () => {
  try {
    statusOutput.value = ''
    log('🚀 Starting H5P initialization...')
    
    // Check if H5P is available
    if (typeof (window as any).H5P === 'undefined') {
      log('❌ H5P not found')
      return
    }
    
    // Set up H5PIntegration first
    setupH5PIntegration()
    
    // Load CSS files first
    await loadH5PCSS()
    
    // Load required H5P libraries
    await loadH5PLibraries()
    
    // Load content
    await loadH5PContent()
    
    // Wait a bit to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Initialize H5P
    if ((window as any).H5P.init) {
      log('🔧 Calling H5P.init()...')
      ;(window as any).H5P.init()
      log('✅ H5P.init() completed')
    } else {
      log('❌ H5P.init not available')
    }
    
  } catch (error) {
    log(`❌ Error during initialization: ${error}`)
  }
}

onMounted(() => {
  // Auto-check status when component mounts
  setTimeout(checkStatus, 500)
})
</script>

<style scoped>
.h5p-content-container {
  margin-top: 20px;
}
</style>
