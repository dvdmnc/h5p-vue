<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Workflow des Questions</h1>
        <p class="mt-2 text-gray-600">
          Gestion du cycle de vie des questions : création, révision, validation, publication
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="showStatsModal = true"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Statistiques
        </button>
      </div>
    </div>

    <!-- Tableau de bord des statuts -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Brouillons</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.draft }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">En révision</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.review }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Validées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.validated }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Publiées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.published }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h8a2 2 0 002-2V8m-9 4h4m-4 4h4m-4-8h4m-4 4h4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Archivées</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.archived }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white p-6 rounded-lg shadow border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Titre, instruction, catégorie..."
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="review">En révision</option>
            <option value="validated">Validée</option>
            <option value="published">Publiée</option>
            <option value="archived">Archivée</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select v-model="filters.category" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Toutes les catégories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Base de données</option>
            <option value="DevOps">DevOps</option>
            <option value="Security">Sécurité</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
          <select v-model="filters.difficulty" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Toutes difficultés</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Onglets de workflow -->
    <div class="bg-white rounded-lg shadow border">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.count > 0"
              :class="[
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900',
                'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Questions en révision -->
        <div v-if="activeTab === 'review'">
          <div v-if="pendingReviewQuestions.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Aucune question en attente de révision</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="question in pendingReviewQuestions"
              :key="question.id"
              class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ question.title }}</h3>
                  <p class="mt-2 text-gray-600">{{ question.instruction }}</p>
                  <div class="mt-4 flex items-center space-x-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ question.type }}
                    </span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {{ question.category }}
                    </span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {{ question.difficulty }}
                    </span>
                    <span class="text-sm text-gray-500">{{ question.points }} points</span>
                  </div>
                  
                  <!-- Historique des reviews -->
                  <div v-if="question.reviews?.length" class="mt-4">
                    <h4 class="text-sm font-medium text-gray-700">Historique des révisions :</h4>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="review in question.reviews"
                        :key="review.id"
                        class="bg-gray-50 p-3 rounded text-sm"
                      >
                        <div class="flex justify-between items-center">
                          <span class="font-medium">{{ review.reviewerName }}</span>
                          <span class="text-gray-500">{{ formatDate(review.reviewDate) }}</span>
                        </div>
                        <p class="mt-1 text-gray-600">{{ review.comments }}</p>
                        <div v-if="review.suggestions.length" class="mt-2">
                          <span class="text-xs font-medium text-gray-500">Suggestions :</span>
                          <ul class="mt-1 text-xs text-gray-600">
                            <li v-for="suggestion in review.suggestions" :key="suggestion">• {{ suggestion }}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="ml-6 flex flex-col gap-2">
                  <button
                    @click="reviewQuestion(question)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Réviser
                  </button>
                  <button
                    @click="viewQuestionHistory(question.id)"
                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Historique
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions validées -->
        <div v-else-if="activeTab === 'validated'">
          <div class="space-y-4">
            <div
              v-for="question in validatedQuestions"
              :key="question.id"
              class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ question.title }}</h3>
                  <p class="mt-2 text-gray-600">{{ question.instruction }}</p>
                  <div class="mt-4 flex items-center space-x-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Validée
                    </span>
                    <span class="text-sm text-gray-500">Version {{ question.status?.version }}</span>
                    <span v-if="question.status?.reviewedBy" class="text-sm text-gray-500">
                      Validée par {{ question.status.reviewedBy }}
                    </span>
                  </div>
                </div>
                
                <div class="ml-6 flex flex-col gap-2">
                  <button
                    @click="publishQuestion(question)"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Publier
                  </button>
                  <button
                    @click="archiveQuestion(question)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Archiver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Questions publiées -->
        <div v-else-if="activeTab === 'published'">
          <div class="space-y-4">
            <div
              v-for="question in publishedQuestions"
              :key="question.id"
              class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ question.title }}</h3>
                  <p class="mt-2 text-gray-600">{{ question.instruction }}</p>
                  <div class="mt-4 flex items-center space-x-4">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Publiée
                    </span>
                    <span class="text-sm text-gray-500">
                      Publiée le {{ formatDate(question.status?.publishedDate || '') }}
                    </span>
                  </div>
                </div>
                
                <div class="ml-6 flex flex-col gap-2">
                  <button
                    @click="viewQuestionStats(question)"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Statistiques
                  </button>
                  <button
                    @click="archiveQuestion(question)"
                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Archiver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Toutes les questions (recherche) -->
        <div v-else>
          <div class="space-y-4">
            <div
              v-for="question in filteredQuestions"
              :key="question.id"
              class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ question.title }}</h3>
                  <p class="mt-2 text-gray-600">{{ question.instruction }}</p>
                  <div class="mt-4 flex items-center space-x-4">
                    <span :class="getStatusClass((question as any).status?.status || 'draft')" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusLabel((question as any).status?.status || 'draft') }}
                    </span>
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {{ question.category }}
                    </span>
                  </div>
                </div>
                
                <div class="ml-6">
                  <button
                    @click="viewQuestionDetail(question)"
                    class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Détails
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de révision -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Révision de Question</h3>
        
        <div v-if="reviewingQuestion" class="space-y-4">
          <div class="bg-gray-50 p-4 rounded">
            <h4 class="font-medium">{{ reviewingQuestion.title }}</h4>
            <p class="text-gray-600 mt-1">{{ reviewingQuestion.instruction }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Note (1-5)</label>
            <select v-model.number="reviewForm.rating" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="1">1 - Très insuffisant</option>
              <option value="2">2 - Insuffisant</option>
              <option value="3">3 - Correct</option>
              <option value="4">4 - Bien</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
            <textarea
              v-model="reviewForm.comments"
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Commentaires sur la question..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Suggestions d'amélioration</label>
            <textarea
              v-model="reviewForm.suggestionsText"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Une suggestion par ligne..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Décision</label>
            <select v-model="reviewForm.approvalStatus" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="approved">Approuver</option>
              <option value="needs-changes">Demander des modifications</option>
              <option value="rejected">Rejeter</option>
            </select>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="closeReviewModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              @click="submitReview"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Soumettre la révision
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuestionWorkflowStore } from '@/stores/questionWorkflow'
import type { Question } from '@/types/assessment'

const workflowStore = useQuestionWorkflowStore()

// État local
const activeTab = ref('all')
const searchQuery = ref('')
const showReviewModal = ref(false)
const showStatsModal = ref(false)
const reviewingQuestion = ref<Question | null>(null)

const filters = ref({
  status: '',
  category: '',
  difficulty: ''
})

const reviewForm = ref({
  rating: 3,
  comments: '',
  suggestionsText: '',
  approvalStatus: 'approved'
})

// Données du store
const { 
  isLoading, 
  workflowStats: stats, 
  pendingReviewQuestions,
  publishedQuestions,
  questionsByStatus 
} = workflowStore

// Onglets
const tabs = computed(() => [
  { id: 'all', label: 'Toutes', count: 0 },
  { id: 'review', label: 'En révision', count: stats.review },
  { id: 'validated', label: 'Validées', count: stats.validated },
  { id: 'published', label: 'Publiées', count: stats.published }
])

const validatedQuestions = computed(() => questionsByStatus.validated || [])

const filteredQuestions = computed(() => {
  const searchFilters = {
    status: filters.value.status ? [filters.value.status] : undefined,
    category: filters.value.category ? [filters.value.category] : undefined,
    difficulty: filters.value.difficulty ? [filters.value.difficulty] : undefined
  }
  
  return workflowStore.searchQuestions(searchQuery.value, searchFilters)
})

// Méthodes
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusClass(status: string) {
  const classes = {
    draft: 'bg-gray-100 text-gray-800',
    review: 'bg-yellow-100 text-yellow-800',
    validated: 'bg-blue-100 text-blue-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels = {
    draft: 'Brouillon',
    review: 'En révision',
    validated: 'Validée',
    published: 'Publiée',
    archived: 'Archivée'
  }
  return labels[status as keyof typeof labels] || status
}

function reviewQuestion(question: any) {
  reviewingQuestion.value = question
  reviewForm.value = {
    rating: 3,
    comments: '',
    suggestionsText: '',
    approvalStatus: 'approved'
  }
  showReviewModal.value = true
}

async function submitReview() {
  if (!reviewingQuestion.value) return
  
  try {
    const suggestions = reviewForm.value.suggestionsText
      .split('\n')
      .filter(s => s.trim())
      .map(s => s.trim())

    await workflowStore.reviewQuestion(reviewingQuestion.value.id, {
      reviewerId: 'admin1', // À récupérer depuis le store auth
      reviewerName: 'Administrateur', // À récupérer depuis le store auth
      rating: reviewForm.value.rating,
      comments: reviewForm.value.comments,
      suggestions,
      approvalStatus: reviewForm.value.approvalStatus as any
    })
    
    closeReviewModal()
  } catch (error) {
    console.error('Erreur lors de la révision:', error)
  }
}

function closeReviewModal() {
  showReviewModal.value = false
  reviewingQuestion.value = null
}

async function publishQuestion(question: any) {
  if (confirm('Êtes-vous sûr de vouloir publier cette question ?')) {
    try {
      await workflowStore.publishQuestion(question.id, 'admin1')
    } catch (error) {
      console.error('Erreur lors de la publication:', error)
    }
  }
}

async function archiveQuestion(question: any) {
  const reason = prompt('Raison de l\'archivage (optionnel):')
  if (reason !== null) { // null si annulé, chaîne vide si OK sans texte
    try {
      await workflowStore.archiveQuestion(question.id, reason || undefined)
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error)
    }
  }
}

function viewQuestionHistory(questionId: string) {
  // Implémenter la vue de l'historique
  console.log('Voir historique de la question:', questionId)
}

function viewQuestionStats(question: any) {
  // Implémenter les statistiques de la question
  console.log('Voir statistiques de la question:', question.id)
}

function viewQuestionDetail(question: any) {
  // Implémenter la vue détaillée
  console.log('Voir détails de la question:', question.id)
}

// Initialisation
onMounted(() => {
  workflowStore.initialize()
})
</script>
