<template>
  <div class="creator-view bg-gray-50 min-h-screen py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-heading font-bold text-gray-900">
              Créateur de Questions
            </h1>
            <p class="mt-2 text-gray-600">
              Créez des questions interactives avec H5P et personnalisez l'expérience d'évaluation
            </p>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              v-if="hasUnsavedChanges"
              @click="showSaveDialog = true"
              class="btn-secondary"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Sauvegarder
            </button>
            
            <router-link to="/" class="btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l'accueil
            </router-link>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-8">
        <!-- Create Question Tab -->
        <div v-if="activeTab === 'create'">
          <QuestionCreator
            :initial-data="editingQuestion || undefined"
            @save="handleSaveQuestion"
            @save-draft="handleSaveDraft"
            @cancel="handleCancel"
          />
        </div>

        <!-- H5P Integration Tab -->
        <div v-else-if="activeTab === 'h5p-demo'">
          <H5PIntegrationExample />
        </div>

        <!-- Question Library Tab -->
        <div v-else-if="activeTab === 'library' && canViewLibrary">
          <div class="bg-white rounded-xl shadow-custom-lg">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900">
                  Bibliothèque de Questions
                </h2>
                <div class="flex items-center space-x-4">
                  <!-- Search -->
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Rechercher..."
                      class="input-field w-64 pl-10"
                    >
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Filter -->
                  <select v-model="filterCategory" class="input-field">
                    <option value="">Toutes les catégories</option>
                    <option value="francais">Français</option>
                    <option value="mathematiques">Mathématiques</option>
                    <option value="informatique">Informatique</option>
                    <option value="competences-transversales">Compétences transversales</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="p-6">
              <div v-if="filteredQuestions.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a9 9 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 21H9.154a3.374 3.374 0 00-2.039-.693l-.548-.547z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune question</h3>
                <p class="mt-1 text-sm text-gray-500">Commencez par créer votre première question.</p>
                <div class="mt-6">
                  <button
                    v-if="canCreateQuestions"
                    @click="activeTab = 'create'"
                    class="btn-primary"
                  >
                    Créer une question
                  </button>
                </div>
              </div>

              <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                  v-for="question in filteredQuestions"
                  :key="question.id"
                  class="border border-gray-200 rounded-lg p-6 hover:shadow-custom transition-shadow"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {{ getQuestionTypeLabel(question.type) }}
                        </span>
                        <span class="text-xs text-gray-500 capitalize">{{ question.difficulty }}</span>
                        <span class="text-xs text-gray-500">{{ question.points }} pts</span>
                      </div>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">
                        {{ question.title }}
                      </h3>
                      <p class="text-sm text-gray-600 line-clamp-2">
                        {{ question.instruction }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500 capitalize">
                      {{ question.category }}
                    </div>
                    <div class="flex items-center space-x-2">
                      <button
                        v-if="canEditQuestions"
                        @click="editQuestion(question)"
                        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        @click="duplicateQuestion(question)"
                        class="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Dupliquer
                      </button>
                      <button
                        v-if="canDeleteQuestions"
                        @click="deleteQuestion(question.id)"
                        class="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- H5P Showcase Tab -->
        <div v-else-if="activeTab === 'showcase'">
          <div class="bg-white rounded-xl shadow-custom-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              Exemples H5P
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Example 1: Multiple Choice -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Question à Choix Multiple</h3>
                <div class="bg-white border rounded-lg shadow p-6">
                  <h4 class="font-medium mb-4">Quelle est la capitale de la France?</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <input type="radio" id="paris" name="capital" class="h-4 w-4 text-primary-600">
                      <label for="paris" class="ml-3 text-sm text-gray-700">Paris</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="lyon" name="capital" class="h-4 w-4 text-primary-600">
                      <label for="lyon" class="ml-3 text-sm text-gray-700">Lyon</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="marseille" name="capital" class="h-4 w-4 text-primary-600">
                      <label for="marseille" class="ml-3 text-sm text-gray-700">Marseille</label>
                    </div>
                  </div>
                  <button class="mt-4 px-4 py-2 bg-primary-600 text-white rounded">Vérifier</button>
                </div>
              </div>

              <!-- Example 2: Fill in the Blanks -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Texte à Trous</h3>
                <div class="bg-white border rounded-lg shadow p-6">
                  <h4 class="font-medium mb-4">Complétez les phrases suivantes :</h4>
                  <p class="mb-4">
                    Paris est la capitale de la <input type="text" class="border-b-2 border-primary-300 focus:outline-none w-24 px-1" placeholder="___________">.
                  </p>
                  <p class="mb-4">
                    La <input type="text" class="border-b-2 border-primary-300 focus:outline-none w-24 px-1" placeholder="___________"> est le plus grand océan du monde.
                  </p>
                  <button class="mt-4 px-4 py-2 bg-primary-600 text-white rounded">Vérifier</button>
                </div>
              </div>

              <!-- Example 3: Drag and Drop -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Glisser-Déposer</h3>
                <div class="bg-white border rounded-lg shadow p-6">
                  <h4 class="font-medium mb-4">Associez les pays à leurs capitales :</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <div class="bg-blue-50 p-2 rounded border border-blue-200">France</div>
                      <div class="bg-blue-50 p-2 rounded border border-blue-200">Allemagne</div>
                      <div class="bg-blue-50 p-2 rounded border border-blue-200">Italie</div>
                    </div>
                    <div class="space-y-2">
                      <div class="bg-green-50 p-2 rounded border border-green-200">Paris</div>
                      <div class="bg-green-50 p-2 rounded border border-green-200">Berlin</div>
                      <div class="bg-green-50 p-2 rounded border border-green-200">Rome</div>
                    </div>
                  </div>
                  <button class="mt-4 px-4 py-2 bg-primary-600 text-white rounded">Vérifier</button>
                </div>
              </div>

              <!-- Example 4: Sorting -->
              <div class="space-y-4">
                <h3 class="text-lg font-medium text-gray-900">Tri</h3>
                <div class="bg-white border rounded-lg shadow p-6">
                  <h4 class="font-medium mb-4">Placez ces événements dans l'ordre chronologique :</h4>
                  <div class="space-y-2">
                    <div class="bg-purple-50 p-2 rounded border border-purple-200">Première Guerre mondiale</div>
                    <div class="bg-purple-50 p-2 rounded border border-purple-200">Révolution française</div>
                    <div class="bg-purple-50 p-2 rounded border border-purple-200">Chute du mur de Berlin</div>
                    <div class="bg-purple-50 p-2 rounded border border-purple-200">Découverte de l'Amérique</div>
                  </div>
                  <button class="mt-4 px-4 py-2 bg-primary-600 text-white rounded">Vérifier</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Dialog -->
    <div v-if="showSaveDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Sauvegarder les modifications</h3>
        <p class="text-gray-600 mb-6">Vous avez des modifications non sauvegardées. Que souhaitez-vous faire ?</p>
        <div class="flex space-x-3">
          <button @click="showSaveDialog = false" class="btn-secondary flex-1">Annuler</button>
          <button @click="discardChanges" class="btn-secondary flex-1">Ne pas sauvegarder</button>
          <button @click="saveChanges" class="btn-primary flex-1">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import QuestionCreator from '@/components/H5P/QuestionCreator.vue';
import H5PIntegrationExample from '@/components/H5P/H5PIntegrationExample.vue';
import type { Question, QuestionType } from '@/types/assessment';
import { useAuthStore } from '@/stores/auth';

// State
const activeTab = ref('create');
const hasUnsavedChanges = ref(false);
const showSaveDialog = ref(false);
const searchQuery = ref('');
const filterCategory = ref('');
const editingQuestion = ref<Partial<Question> | null>(null);

// Auth store for role checking
const authStore = useAuthStore();

// Role-based permissions - FIXED TO MATCH PERSONA REQUIREMENTS
const canCreateQuestions = computed(() => authStore.canCreateAssessments); // Use new computed property
const canViewLibrary = computed(() => authStore.isCreator || authStore.isAdmin);
const canEditQuestions = computed(() => authStore.canManageContent); // Use new computed property
const canDeleteQuestions = computed(() => authStore.canManageContent); // Use new computed property

// Mock questions data
const questions = ref<Question[]>([]);

// Tabs configuration
const tabs = [
  { id: 'create', name: 'Créer une question' },
  { id: 'library', name: 'Bibliothèque' },
  { id: 'h5p-demo', name: 'Démo H5P' },
  { id: 'showcase', name: 'Exemples H5P' },
];

// Computed
const filteredQuestions = computed(() => {
  let filtered = questions.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(q => 
      q.title.toLowerCase().includes(query) ||
      q.instruction.toLowerCase().includes(query) ||
      q.category.toLowerCase().includes(query)
    );
  }
  
  if (filterCategory.value) {
    filtered = filtered.filter(q => q.category === filterCategory.value);
  }
  
  return filtered;
});

// Methods
const handleSaveQuestion = (question: Question) => {
  if (editingQuestion.value?.id) {
    // Update existing question
    const index = questions.value.findIndex(q => q.id === editingQuestion.value?.id);
    if (index !== -1) {
      questions.value[index] = question;
    }
  } else {
    // Add new question
    questions.value.push(question);
  }
  
  hasUnsavedChanges.value = false;
  editingQuestion.value = null;
  activeTab.value = 'library';
  
  // Show success message (in a real app, you would call an API here)
  console.log('Question saved successfully');
};

const handleSaveDraft = (draft: Partial<Question>) => {
  // Save draft logic
  localStorage.setItem('question_draft', JSON.stringify(draft));
  hasUnsavedChanges.value = true;
  console.log('Draft saved:', draft);
};

const handleCancel = () => {
  if (hasUnsavedChanges.value) {
    showSaveDialog.value = true;
  } else {
    editingQuestion.value = null;
    activeTab.value = 'library';
  }
};

const editQuestion = (question: Question) => {
  editingQuestion.value = { ...question };
  activeTab.value = 'create';
};

const duplicateQuestion = (question: Question) => {
  const duplicate = {
    ...question,
    id: generateId(),
    title: `${question.title} (copie)`,
  };
  questions.value.push(duplicate);
};

const deleteQuestion = (questionId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    const index = questions.value.findIndex(q => q.id === questionId);
    if (index !== -1) {
      questions.value.splice(index, 1);
    }
  }
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

const saveChanges = () => {
  // Save current changes
  hasUnsavedChanges.value = false;
  showSaveDialog.value = false;
};

const discardChanges = () => {
  hasUnsavedChanges.value = false;
  showSaveDialog.value = false;
  editingQuestion.value = null;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Lifecycle
onBeforeUnmount(() => {
  if (hasUnsavedChanges.value) {
    // Save draft before leaving
    handleSaveDraft(editingQuestion.value || {});
  }
});
</script>

<style scoped>
/* Tab animations */
.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Line clamp utility */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* Hover effects */
.hover\:shadow-custom:hover {
  transition: box-shadow 0.2s ease;
}

/* Modal backdrop */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}
</style>
