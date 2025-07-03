<template>
  <div class="assessment-view">
    <div v-if="canTakeAssessment">
      <AssessmentInterface />
    </div>
    <div v-else class="unauthorized-message bg-white rounded-xl shadow-custom-lg p-8 text-center max-w-2xl mx-auto mt-12">
      <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Accès non autorisé</h3>
      <p class="mt-1 text-sm text-gray-500">
        Seuls les bénéficiaires peuvent passer des évaluations. 
        Les {{ authStore.userRole === 'administrateur' ? 'administrateurs gèrent le système' : authStore.userRole === 'createur' ? 'créateurs conçoivent les évaluations' : authStore.userRole === 'conseiller' ? 'conseillers accompagnent les bénéficiaires' : 'clients consultent les rapports' }}.
      </p>
      <div class="mt-6">
        <router-link to="/dashboard" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Retour au tableau de bord
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AssessmentInterface from '@/components/Assessment/AssessmentInterface.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const canTakeAssessment = computed(() => authStore.canTakeAssessment);
</script>

<style scoped>
.assessment-view {
  min-height: 100vh;
}

.unauthorized-message {
  max-width: 600px;
  margin: 100px auto;
  padding: 2rem;
}
</style>
