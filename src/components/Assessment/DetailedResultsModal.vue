<template>
  <div class="detailed-results-modal bg-white rounded-xl p-6 max-w-2xl mx-auto">
    <div class="flex justify-between items-start">
      <h3 class="text-xl font-semibold text-gray-900">Rapport détaillé de l'évaluation</h3>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-600 focus:outline-none">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="mt-4 border-t border-gray-200 pt-4">
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Participant</p>
            <p class="font-medium">{{ result.participantName }}</p>
            <p class="text-sm text-gray-500">{{ result.participantEmail }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Évaluation</p>
            <p class="font-medium">{{ result.assessmentTitle }}</p>
            <p class="text-sm text-gray-500">{{ result.category }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Date</p>
            <p class="font-medium">{{ formatDate(result.completedAt) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Durée</p>
            <p class="font-medium">{{ formatDuration(result.duration || 0) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Statut</p>
            <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClasses(result.status || 'unknown')">
              {{ getStatusText(result.status || 'unknown') }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-500">Niveau adaptatif</p>
            <p class="font-medium capitalize">{{ result.adaptiveLevel }}</p>
          </div>
        </div>
      </div>
      
      <!-- Score summary -->
      <div class="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h4 class="text-lg font-medium mb-4">Résultat global</h4>
        <div class="flex items-center">
          <div class="w-32 h-32 relative">
            <svg class="w-full h-full" viewBox="0 0 36 36">
              <path
                class="stroke-current text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke-width="3"
                stroke-dasharray="100, 100"
              />
              <path
                :class="getScorePathColor(result.percentage)"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke-width="3"
                :stroke-dasharray="`${result.percentage}, 100`"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center flex-col">
              <span class="text-2xl font-bold">{{ result.percentage }}%</span>
              <span class="text-sm text-gray-500">Score</span>
            </div>
          </div>
          <div class="ml-6">
            <div class="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <p class="text-sm text-gray-500">Points obtenus</p>
                <p class="font-medium">{{ result.totalScore }} / {{ result.maxScore }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Niveau</p>
                <p class="font-medium">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getScoreClasses(result.percentage)">
                    {{ getScoreGrade(result.percentage) }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Temps moyen / question</p>
                <p class="font-medium">{{ formatDuration(Math.round((result.duration || 0) / (result.questions.length || 1))) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Taux de réussite</p>
                <p class="font-medium">
                  {{ getSuccessRate(result.questions) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Skill breakdown (simulated for demo) -->
      <h4 class="text-lg font-medium mb-4">Répartition par compétence</h4>
      <div class="space-y-4 mb-6">
        <div v-for="(skill, index) in getSkillBreakdown()" :key="index" class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium">{{ skill.name }}</p>
            <p class="font-medium text-sm">{{ skill.score }}%</p>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="h-2 rounded-full" 
              :class="getScoreBarColor(skill.score)"
              :style="{ width: `${skill.score}%` }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Questions list -->
      <h4 class="text-lg font-medium mb-4">Détail des réponses</h4>
      <div v-if="result.questions.length > 0" class="space-y-4">
        <div 
          v-for="(question, index) in result.questions" 
          :key="index"
          class="bg-white border border-gray-200 rounded-lg p-4"
          :class="{'border-green-200 bg-green-50': question.isCorrect, 'border-red-200 bg-red-50': !question.isCorrect}"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium">Question {{ index + 1 }}</p>
              <p class="text-sm text-gray-600 mt-1">Temps: {{ formatDuration(question.userAnswer.timeSpent) }}</p>
            </div>
            <span 
              class="inline-flex px-2 py-1 text-xs font-medium rounded-full"
              :class="question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ question.isCorrect ? 'Correct' : 'Incorrect' }}
            </span>
          </div>
          <p class="text-sm mt-2 text-gray-700">{{ question.feedback }}</p>
        </div>
      </div>
      <div v-else class="text-center py-6 bg-gray-50 rounded-lg">
        <p class="text-gray-500">Les détails des questions ne sont pas disponibles pour cette évaluation.</p>
      </div>
      
      <div class="mt-6 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Fermer
        </button>
        <button @click="exportPDF" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Exporter en PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssessmentResult, QuestionResult } from '@/types/assessment';

const props = defineProps<{
  result: AssessmentResult;
}>();

// Ensure props is considered "used" by TypeScript
const { result } = props;

const emit = defineEmits(['close']);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'abandoned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in-progress':
      return 'En cours';
    case 'abandoned':
      return 'Abandonné';
    default:
      return 'Inconnu';
  }
};

const getScoreClasses = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getScoreGrade = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const getScorePathColor = (score: number) => {
  if (score >= 90) return 'stroke-current text-green-500';
  if (score >= 70) return 'stroke-current text-yellow-500';
  return 'stroke-current text-red-500';
};

const getScoreBarColor = (score: number) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getSuccessRate = (questions: QuestionResult[]) => {
  if (!questions || questions.length === 0) return 0;
  const correctCount = questions.filter(q => q.isCorrect).length;
  return Math.round((correctCount / questions.length) * 100);
};

// Simulated skill breakdown for demo purposes
const getSkillBreakdown = () => {
  // In a real app, this would be calculated from the assessment results
  return [
    { name: 'Compréhension des concepts', score: Math.round(Math.random() * 40) + 60 },
    { name: 'Utilisation des outils', score: Math.round(Math.random() * 40) + 60 },
    { name: 'Résolution de problèmes', score: Math.round(Math.random() * 40) + 60 },
    { name: 'Application pratique', score: Math.round(Math.random() * 40) + 60 }
  ];
};

const exportPDF = () => {
  alert('Export PDF en cours de développement');
  // In a real app, this would generate a PDF of the detailed results
};
</script>
