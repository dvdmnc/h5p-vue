<template>
  <div class="assessment-results">
    <div class="bg-white rounded-xl shadow-custom-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 class="text-3xl font-heading font-bold text-gray-900 mb-2">
          Évaluation terminée !
        </h2>
        
        <p class="text-gray-600 max-w-2xl mx-auto">
          Félicitations ! Vous avez terminé votre évaluation de compétences. 
          Voici un résumé de vos résultats.
        </p>
      </div>

      <!-- Score overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Overall score -->
        <div class="text-center p-6 bg-primary-50 rounded-xl border border-primary-100">
          <div class="text-4xl font-bold text-primary-600 mb-2">
            {{ result.percentage }}%
          </div>
          <div class="text-sm font-medium text-primary-800 mb-1">Score global</div>
          <div class="text-xs text-primary-600">
            {{ result.totalScore }} / {{ result.maxScore }} points
          </div>
        </div>

        <!-- Time spent -->
        <div class="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
          <div class="text-4xl font-bold text-blue-600 mb-2">
            {{ formatTime(result.timeTotal) }}
          </div>
          <div class="text-sm font-medium text-blue-800 mb-1">Temps total</div>
          <div class="text-xs text-blue-600">
            {{ Math.round(result.timeTotal / result.questions.length) }}s / question
          </div>
        </div>

        <!-- Questions answered -->
        <div class="text-center p-6 bg-green-50 rounded-xl border border-green-100">
          <div class="text-4xl font-bold text-green-600 mb-2">
            {{ correctAnswers }}
          </div>
          <div class="text-sm font-medium text-green-800 mb-1">Bonnes réponses</div>
          <div class="text-xs text-green-600">
            sur {{ result.questions.length }} questions
          </div>
        </div>
      </div>

      <!-- Performance by category -->
      <div class="mb-8">
        <h3 class="text-xl font-heading font-semibold text-gray-900 mb-4">
          Performance par compétence
        </h3>
        
        <div class="space-y-4">
          <div 
            v-for="category in categoriesPerformance" 
            :key="category.name"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full" :class="getCategoryColor(category.percentage)"></div>
                <h4 class="font-medium text-gray-900 capitalize">{{ category.name }}</h4>
              </div>
              <div class="text-sm font-medium text-gray-600">
                {{ category.percentage }}% ({{ category.correct }}/{{ category.total }})
              </div>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="h-2 rounded-full transition-all duration-500 ease-out"
                :class="getCategoryColor(category.percentage, 'bg')"
                :style="{ width: category.percentage + '%' }"
              ></div>
            </div>
            
            <div class="mt-2 text-sm text-gray-600">
              {{ getCategoryFeedback(category.name, category.percentage) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed breakdown -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-heading font-semibold text-gray-900">
            Détail des réponses
          </h3>
          <button
            @click="showDetails = !showDetails"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {{ showDetails ? 'Masquer' : 'Afficher' }} le détail
          </button>
        </div>

        <div v-if="showDetails" class="space-y-3">
          <div 
            v-for="(question, index) in result.questions" 
            :key="question.questionId"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <span class="text-sm font-medium text-gray-500">Q{{ index + 1 }}</span>
                  <div class="flex items-center space-x-2">
                    <div 
                      class="w-2 h-2 rounded-full"
                      :class="question.isCorrect ? 'bg-green-500' : 'bg-red-500'"
                    ></div>
                    <span 
                      class="text-sm font-medium"
                      :class="question.isCorrect ? 'text-green-700' : 'text-red-700'"
                    >
                      {{ question.isCorrect ? 'Correct' : 'Incorrect' }}
                    </span>
                  </div>
                  <span class="text-sm text-gray-500">
                    {{ question.score }}/{{ question.maxScore }} pts
                  </span>
                </div>
                
                <div class="text-sm text-gray-600 mb-1">
                  {{ getQuestionTitle(question.questionId) }}
                </div>
                
                <div class="text-xs text-gray-500">
                  Temps: {{ formatTime(question.userAnswer.timeSpent) }}
                </div>
              </div>
              
              <div class="flex-shrink-0 ml-4">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  :class="question.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ question.isCorrect ? '✓' : '✗' }}
                </div>
              </div>
            </div>
            
            <div v-if="question.feedback" class="mt-3 p-3 bg-blue-50 rounded-lg">
              <div class="text-sm text-blue-800">
                <strong>Feedback:</strong> {{ question.feedback }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="mb-8">
        <h3 class="text-xl font-heading font-semibold text-gray-900 mb-4">
          Recommandations
        </h3>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="space-y-3">
            <div v-for="recommendation in recommendations" :key="recommendation.type" class="flex items-start space-x-3">
              <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-blue-900">{{ recommendation.title }}</div>
                <div class="text-sm text-blue-700">{{ recommendation.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          @click="$emit('viewDetails')"
          class="btn-secondary"
        >
          Voir le rapport détaillé
        </button>
        
        <button
          @click="downloadResults"
          class="btn-secondary"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-4-4m4 4l4-4m-6 8h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Télécharger PDF
        </button>
        
        <button
          @click="$emit('restart')"
          class="btn-primary"
        >
          Refaire l'évaluation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AssessmentResult } from '@/types/assessment';

interface Props {
  result: AssessmentResult;
}

const props = defineProps<Props>();

// State
const showDetails = ref(false);

// Computed
const correctAnswers = computed(() => 
  props.result.questions.filter(q => q.isCorrect).length
);

const categoriesPerformance = computed(() => {
  const categories = new Map();
  
  props.result.questions.forEach(question => {
    const category = getQuestionCategory(question.questionId);
    if (!categories.has(category)) {
      categories.set(category, { total: 0, correct: 0 });
    }
    
    const stats = categories.get(category);
    stats.total++;
    if (question.isCorrect) {
      stats.correct++;
    }
  });
  
  return Array.from(categories.entries()).map(([name, stats]) => ({
    name,
    total: stats.total,
    correct: stats.correct,
    percentage: Math.round((stats.correct / stats.total) * 100),
  }));
});

const recommendations = computed(() => {
  const recs = [];
  
  categoriesPerformance.value.forEach(category => {
    if (category.percentage < 50) {
      recs.push({
        type: 'improvement',
        title: `Améliorer ses compétences en ${category.name}`,
        description: `Votre score de ${category.percentage}% indique qu'il serait bénéfique de renforcer cette compétence.`,
      });
    } else if (category.percentage >= 80) {
      recs.push({
        type: 'strength',
        title: `Point fort: ${category.name}`,
        description: `Excellent travail ! Votre score de ${category.percentage}% montre une bonne maîtrise.`,
      });
    }
  });
  
  // General recommendations based on overall score
  if (props.result.percentage >= 80) {
    recs.push({
      type: 'excellent',
      title: 'Profil compétent',
      description: 'Vos résultats montrent un bon niveau global. Vous pourriez envisager des formations spécialisées.',
    });
  } else if (props.result.percentage >= 60) {
    recs.push({
      type: 'good',
      title: 'Bon potentiel',
      description: 'Vous avez de bonnes bases. Quelques formations ciblées pourraient renforcer vos points faibles.',
    });
  } else {
    recs.push({
      type: 'needs_improvement',
      title: 'Formation recommandée',
      description: 'Il serait bénéfique de suivre une formation pour renforcer vos compétences de base.',
    });
  }
  
  return recs;
});

// Methods
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}min ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

const getCategoryColor = (percentage: number, type: 'text' | 'bg' = 'bg'): string => {
  if (percentage >= 80) {
    return type === 'bg' ? 'bg-green-500' : 'bg-green-500';
  } else if (percentage >= 60) {
    return type === 'bg' ? 'bg-yellow-500' : 'bg-yellow-500';
  } else {
    return type === 'bg' ? 'bg-red-500' : 'bg-red-500';
  }
};

const getCategoryFeedback = (category: string, percentage: number): string => {
  if (percentage >= 80) {
    return `Excellente maîtrise des compétences en ${category}.`;
  } else if (percentage >= 60) {
    return `Bonne base en ${category}, quelques améliorations possibles.`;
  } else {
    return `Les compétences en ${category} nécessitent du renforcement.`;
  }
};

const getQuestionTitle = (questionId: string): string => {
  // In a real app, you'd fetch this from a service or store
  const titles = {
    '1': 'Quelle est la capitale de la France ?',
    '2': 'Compléter la phrase',
  };
  return titles[questionId as keyof typeof titles] || `Question ${questionId}`;
};

const getQuestionCategory = (questionId: string): string => {
  // In a real app, you'd fetch this from a service or store
  const categories = {
    '1': 'culture-generale',
    '2': 'francais',
  };
  return categories[questionId as keyof typeof categories] || 'general';
};

const downloadResults = () => {
  // Create a simple text report for download
  const reportContent = generateTextReport();
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `evaluation-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateTextReport = (): string => {
  const report = [
    'RAPPORT D\'ÉVALUATION DES COMPÉTENCES',
    '=====================================',
    '',
    `Date: ${new Date(props.result.completedAt).toLocaleDateString('fr-FR')}`,
    `Score global: ${props.result.percentage}% (${props.result.totalScore}/${props.result.maxScore} points)`,
    `Temps total: ${formatTime(props.result.timeTotal)}`,
    `Questions: ${correctAnswers.value}/${props.result.questions.length} correctes`,
    '',
    'PERFORMANCE PAR COMPÉTENCE:',
    '===========================',
  ];
  
  categoriesPerformance.value.forEach(category => {
    report.push(`${category.name}: ${category.percentage}% (${category.correct}/${category.total})`);
  });
  
  report.push('');
  report.push('RECOMMANDATIONS:');
  report.push('================');
  
  recommendations.value.forEach(rec => {
    report.push(`• ${rec.title}: ${rec.description}`);
  });
  
  return report.join('\n');
};
</script>

<style scoped>
/* Custom animations */
.assessment-results {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Progress bars animation */
.h-2 {
  transition: width 0.8s ease-out;
}

/* Hover effects */
.hover\:bg-gray-50:hover {
  transition: background-color 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-3 {
    gap: 1rem;
  }
}
</style>
