<template>
  <div class="settings-modal-placeholder bg-white rounded-xl p-6 max-w-md mx-auto">
    <h3 class="text-lg font-semibold mb-4">Paramètres (En développement)</h3>
    <p class="text-gray-600 mb-6">Cette fonctionnalité sera disponible prochainement.</p>
    <div class="flex justify-end space-x-3">
      <button @click="$emit('close')" class="btn-secondary">Fermer</button>
      <button @click="$emit('save', {})" class="btn-primary">Sauvegarder</button>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface AssessmentSettings {
  mode?: 'standard' | 'adaptive' | 'training';
  timeLimit?: number;
  showFeedback?: boolean;
  allowRetry?: boolean;
  randomizeQuestions?: boolean;
}

defineEmits<{
  close: [];
  save: [settings: AssessmentSettings];
}>();
</script>
