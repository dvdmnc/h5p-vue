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
    
    <!-- Status for debugging -->
    <div v-if="status" class="status bg-blue-50 border border-blue-200 rounded p-2 mb-4 text-sm">
      {{ status }}
    </div>
    
    <!-- H5P Content Container -->
    <div :id="containerId" ref="h5pContainer" class="h5p-content-container">
      <p v-if="!h5pLoaded && !isLoading && !error">
        {{ isLoading ? 'Chargement du contenu H5P...' : 'Prêt à charger le contenu H5P' }}
      </p>
    </div>
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
const isLoading = ref(false);
const h5pLoaded = ref(false);
const error = ref<string | null>(null);
const status = ref('Prêt à charger du contenu H5P');
const h5pInstance = ref<any>(null);
const h5pContainer = ref<HTMLElement | null>(null);

// Computed
const containerId = computed(() => `h5p-container-${Math.random().toString(36).substr(2, 9)}`);

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
  };
  
  const contentId = contentMap[props.questionType || 'multiple-choice'] || 'demo-multichoice';
  return `/h5p/content/${contentId}`;
};

// Watchers
watch(() => [props.contentId, props.questionType], async () => {
  await loadH5PContent();
}, { deep: true });

// Lifecycle
onMounted(async () => {
  // Select first content by default if available
  status.value = 'Composant H5P initialisé';
  console.log('H5P Player component mounted');
  
  // Load content automatically
  await loadH5PContent();
});

onUnmounted(() => {
  cleanup();
});

// Main method to load H5P content using H5P Standalone (simplified approach like projet-gilles)
const loadH5PContent = async () => {
  if (!h5pContainer.value) {
    error.value = 'Container element not found';
    return;
  }

  isLoading.value = true;
  h5pLoaded.value = false;
  error.value = null;
  status.value = 'Initialisation de H5P...';

  try {
    // Clear container
    h5pContainer.value.innerHTML = '<p>Chargement en cours...</p>';

    // Wait for next tick to ensure DOM update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get content path
    const contentPath = getContentPath();
    console.log('📁 Loading H5P content from:', contentPath);

    // Configure H5P options (simplified like the working project)
    const options = {
      h5pJsonPath: contentPath,
      frameJs: './h5p/h5p-standalone/dist/frame.bundle.js',
      frameCss: './h5p/frame.css',
      frame: props.allowFullscreen,
      copyright: props.showCopyright,
      export: props.showDownload,
      icon: props.showCopyright,
      fullScreen: props.allowFullscreen
    };

    console.log('🔧 H5P options:', options);

    // Verify H5PStandalone is available
    if (typeof (window as any).H5PStandalone === 'undefined') {
      throw new Error('H5PStandalone n\'est pas chargé');
    }

    // Create new H5P instance (same pattern as working project)
    h5pInstance.value = new (window as any).H5PStandalone.H5P(h5pContainer.value, options);
    await h5pInstance.value;

    console.log('✅ H5P initialisé avec succès !');
    h5pLoaded.value = true;
    status.value = `Contenu H5P chargé avec succès !`;

    // Setup xAPI event listeners
    setupH5PEventListeners();
    
    isLoading.value = false;
    
    emit('ready', { 
      type: 'h5p-standalone', 
      contentPath,
      instance: h5pInstance.value 
    });
    
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de H5P:', err);
    
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors du chargement H5P';
    error.value = errorMessage;
    status.value = `Erreur: ${errorMessage}`;
    h5pContainer.value!.innerHTML = `<p style="color: red;">Erreur lors du chargement: ${errorMessage}</p>`;
    
    isLoading.value = false;
    emit('error', errorMessage);
  }
};

// Setup H5P event listeners using the external dispatcher (like working project)
const setupH5PEventListeners = () => {
  try {
    // Setup listeners when H5P is available
    const setupListeners = () => {
      if (typeof window !== 'undefined' && (window as any).H5P?.externalDispatcher) {
        console.log('🔧 Configuration des écouteurs d\'événements H5P...');
        
        const dispatcher = (window as any).H5P.externalDispatcher;
        
        // Listen for xAPI events 
        dispatcher.on('xAPI', (event: any) => {
          console.log('📊 Événement xAPI H5P reçu:', event);
          
          const verb = event.getVerb ? event.getVerb() : 'unknown';
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
        
        console.log('✅ Écouteurs d\'événements H5P configurés');
        
      } else {
        // H5P not ready yet, retry
        setTimeout(setupListeners, 100);
      }
    };
    
    setupListeners();
    
  } catch (err) {
    console.warn('⚠️ Impossible de configurer les écouteurs d\'événements H5P:', err);
  }
};

// Retry loading
const retry = async () => {
  error.value = null;
  status.value = 'Nouvelle tentative...';
  cleanup();
  await loadH5PContent();
};

// Cleanup
const cleanup = () => {
  if (h5pInstance.value) {
    try {
      // Clear the container
      if (h5pContainer.value) {
        h5pContainer.value.innerHTML = '';
      }
    } catch (err) {
      console.warn('⚠️ Erreur pendant le nettoyage:', err);
    }
    h5pInstance.value = null;
  }
  h5pLoaded.value = false;
};
</script>

<style scoped>
.h5p-player-wrapper {
  width: 100%;
  position: relative;
}

.h5p-content-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  min-height: 400px;
  background-color: #fff;
}

.status {
  font-family: monospace;
  font-size: 14px;
}

.h5p-loading {
  background-color: #f9fafb;
}

.h5p-error {
  background-color: #f9fafb;
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
  .h5p-content-container {
    min-height: 20rem;
  }
}
</style>
