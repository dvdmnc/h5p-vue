<template>
  <div class="h5p-player-wrapper">
    <!-- Loading State -->
    <div v-if="isLoading" class="h5p-loading">
      <div class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Chargement du contenu H5P...</span>
      </div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="h5p-error">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erreur H5P</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
            <button 
              @click="retry"
              class="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- H5P Content Container -->
    <div v-else :id="containerId" class="h5p-content-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import type { H5PContent } from '@/types/assessment';

interface Props {
  content?: H5PContent | string;
  contentId?: string; // ID of pre-created content in /h5p/content/
  questionType?: string;
  questionData?: any;
  customTheme?: boolean;
  allowFullscreen?: boolean;
  showCopyright?: boolean;
  showDownload?: boolean;
  showEmbed?: boolean;
  onInteraction?: (event: string, data: any) => void;
  onCompleted?: (result: any) => void;
  onScoreChanged?: (score: number, maxScore: number) => void;
}

const props = withDefaults(defineProps<Props>(), {
  customTheme: true,
  allowFullscreen: false,
  showCopyright: false,
  showDownload: false,
  showEmbed: false,
});

const emit = defineEmits<{
  ready: [instance: any];
  interaction: [event: string, data: any];
  completed: [result: any];
  scoreChanged: [score: number, maxScore: number];
  error: [error: string];
}>();

// State
const h5pContainer = ref<HTMLElement>();
const isLoading = ref(true);
const error = ref<string | null>(null);
const h5pInstance = ref<any>(null);

// Computed
const elementId = computed(() => `h5p-container-${Math.random().toString(36).substr(2, 9)}`);

const containerClasses = computed(() => ({
  'h5p-custom-theme': props.customTheme,
  'h5p-loading': isLoading.value,
  'h5p-error': !!error.value,
}));

// Get content path based on props
const getContentPath = () => {
  if (props.contentId) {
    return `/h5p/content/${props.contentId}`;
  }
  
  // Map question types to pre-created content with actual H5P libraries
  const contentMap: Record<string, string> = {
    'multiple-choice': 'demo-multichoice',     // H5P.MultiChoice
    'fill-in-blanks': 'demo-blanks',           // H5P.Blanks  
    'drag-drop': 'demo-dragquestion',          // H5P.DragQuestion
    'matching': 'demo-hotspots',               // H5P.ImageHotspots
    'linking': 'demo-hotspots',                // H5P.ImageHotspots
    'sorting': 'demo-dragtext',                // H5P.DragText
    'true-false': 'demo-multichoice'           // H5P.TrueFalse (fallback to multichoice)
  };
  
  const contentId = contentMap[props.questionType || 'multiple-choice'] || 'demo-multichoice';
  return `/h5p/content/${contentId}`;
};

// Watchers
watch(() => [props.contentId, props.questionType], async () => {
  if (h5pContainer.value) {
    await loadH5PContent();
  }
}, { deep: true });

// Lifecycle
onMounted(async () => {
  await loadH5PContent();
});

onUnmounted(() => {
  cleanup();
});

// Main method to load H5P content using H5P Standalone
const loadH5PContent = async () => {
  if (!h5pContainer.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    console.log('🚀 Loading H5P content with H5P Standalone...');
    
    // Get target element
    const targetElement = document.getElementById(elementId.value);
    if (!targetElement) {
      throw new Error('Target element not found: ' + elementId.value);
    }

    // Clear any existing content
    targetElement.innerHTML = '';
    
    // Get content path
    const contentPath = getContentPath();
    console.log('📁 Loading content from:', contentPath);

    // Load H5P using the npm package with proper async handling
    const { H5P } = await import('h5p-standalone');
    
    // Configure H5P Standalone options following the official documentation
    const options = {
      h5pJsonPath: contentPath,
      frameJs: '/h5p/frame.js',
      frameCss: '/h5p/frame.css',
      librariesPath: '/h5p/libraries',
      frame: props.allowFullscreen,
      copyright: props.showCopyright,
      icon: props.showCopyright,
      fullscreen: props.allowFullscreen,
      export: props.showDownload,
      embed: props.showEmbed
    };

    console.log('🔧 H5P options:', options);

    // Create H5P instance using a promise-based approach
    const h5pPlayerInstance = await new Promise<any>((resolve, reject) => {
      try {
        const player = new H5P(targetElement, options);
        
        // Check if H5P instance has promise-like behavior
        if (player && typeof (player as any).then === 'function') {
          (player as any).then(resolve).catch(reject);
        } else {
          // If not a promise, resolve immediately
          resolve(player);
        }
      } catch (error) {
        reject(error);
      }
    });
    
    // Store instance reference
    h5pInstance.value = h5pPlayerInstance;

    // Setup event listeners
    setupH5PEventListeners();
    
    console.log('✅ H5P content loaded successfully');
    isLoading.value = false;
    
    emit('ready', { 
      type: 'h5p-standalone', 
      contentPath,
      instance: h5pPlayerInstance 
    });
    
  } catch (err) {
    console.error('❌ H5P loading error:', err);
    
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors du chargement H5P';
    error.value = errorMessage;
    isLoading.value = false;
    
    emit('error', errorMessage);
  }
};

// Setup H5P event listeners using the external dispatcher
const setupH5PEventListeners = () => {
  try {
    // Wait for H5P to be available and setup listeners
    const setupListeners = () => {
      if (typeof window !== 'undefined' && (window as any).H5P?.externalDispatcher) {
        console.log('🔧 Setting up H5P event listeners...');
        
        const dispatcher = (window as any).H5P.externalDispatcher;
        
        // Listen for xAPI events (score, completion, etc.)
        dispatcher.on('xAPI', (event: any) => {
          console.log('📊 H5P xAPI event:', event);
          
          const verb = event.getVerb();
          const data = event.data;
          
          emit('interaction', verb, data);
          
          if (props.onInteraction) {
            props.onInteraction(verb, data);
          }
          
          // Handle specific events
          switch (verb) {
            case 'answered':
              if (data.statement?.result?.score) {
                const score = data.statement.result.score.raw || 0;
                const maxScore = data.statement.result.score.max || 1;
                emit('scoreChanged', score, maxScore);
                
                if (props.onScoreChanged) {
                  props.onScoreChanged(score, maxScore);
                }
              }
              break;
              
            case 'completed':
              const result = {
                score: data.statement?.result?.score?.raw || 0,
                maxScore: data.statement?.result?.score?.max || 1,
                success: data.statement?.result?.success || false
              };
              
              emit('completed', result);
              
              if (props.onCompleted) {
                props.onCompleted(result);
              }
              break;
          }
        });
        
        // Listen for resize events
        dispatcher.on('resize', () => {
          console.log('📐 H5P content resized');
        });
        
        console.log('✅ H5P event listeners setup complete');
        
      } else {
        // H5P not ready yet, try again
        setTimeout(setupListeners, 100);
      }
    };
    
    setupListeners();
    
  } catch (err) {
    console.warn('⚠️ Could not setup H5P event listeners:', err);
  }
};

// Retry loading
const retry = async () => {
  error.value = null;
  cleanup();
  await loadH5PContent();
};

// Cleanup
const cleanup = () => {
  if (h5pInstance.value) {
    try {
      // H5P Standalone doesn't require explicit cleanup
      // Just clear the container
      const container = document.getElementById(elementId.value);
      if (container) {
        container.innerHTML = '';
      }
    } catch (err) {
      console.warn('⚠️ Error during cleanup:', err);
    }
    h5pInstance.value = null;
  }
};
</script>

<style scoped>
.h5p-container {
  width: 100%;
  min-height: 24rem;
  position: relative;
}

.h5p-content {
  width: 100%;
  height: 100%;
}

.h5p-custom-theme {
  --h5p-primary-color: #3b82f6;
  --h5p-secondary-color: #6b7280;
  --h5p-accent-color: #10b981;
  --h5p-text-color: #374151;
  --h5p-background-color: #ffffff;
  --h5p-border-color: #e5e7eb;
  --h5p-border-radius: 0.5rem;
  --h5p-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.h5p-custom-theme :deep(.h5p-content) {
  font-family: var(--h5p-font-family);
  border-radius: var(--h5p-border-radius);
  border: 1px solid var(--h5p-border-color);
}

.h5p-custom-theme :deep(.h5p-button) {
  background-color: var(--h5p-primary-color);
  border-radius: var(--h5p-border-radius);
  font-weight: 500;
  transition: all 0.2s ease;
}

.h5p-custom-theme :deep(.h5p-button:hover) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.h5p-loading {
  background-color: #f9fafb;
}

.h5p-error {
  background-color: #f9fafb;
}

/* Force H5P content visibility */
.h5p-content,
.h5p-content *,
.h5p-container,
.h5p-container * {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Force visibility on H5P elements */
:deep(.h5p-multichoice),
:deep(.h5p-question),
:deep(.h5p-content-type),
:deep([class*="h5p"]),
:deep([id*="h5p"]) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: auto !important;
}

/* Iframe content */
:deep(.h5p-iframe-wrapper),
:deep(.h5p-iframe-wrapper iframe) {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  min-height: 400px !important;
  width: 100% !important;
}

@media (max-width: 768px) {
  .h5p-container {
    min-height: 20rem;
  }
}
</style>
