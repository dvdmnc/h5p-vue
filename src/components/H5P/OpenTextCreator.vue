<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Question ou consigne
      </label>
      <textarea
        v-model="localData.prompt"
        placeholder="Posez votre question ouverte..."
        class="w-full p-3 border border-gray-300 rounded-lg resize-none"
        rows="3"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Critères d'évaluation
      </label>
      <textarea
        v-model="localData.evaluationCriteria"
        placeholder="Décrivez les critères d'évaluation pour cette réponse..."
        class="w-full p-3 border border-gray-300 rounded-lg resize-none"
        rows="4"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nombre minimum de mots
      </label>
      <input
        type="number"
        v-model.number="localData.minWords"
        min="0"
        max="1000"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nombre maximum de mots
      </label>
      <input
        type="number"
        v-model.number="localData.maxWords"
        min="0"
        max="1000"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface OpenTextData {
  prompt: string;
  evaluationCriteria: string;
  minWords: number;
  maxWords: number;
}

const props = withDefaults(defineProps<{
  modelValue?: OpenTextData;
}>(), {
  modelValue: () => ({
    prompt: '',
    evaluationCriteria: '',
    minWords: 0,
    maxWords: 500
  })
});

const emit = defineEmits<{
  'update:modelValue': [value: OpenTextData];
}>();

const localData = ref<OpenTextData>({ ...props.modelValue });

watch(localData, (newData) => {
  emit('update:modelValue', newData);
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  localData.value = { ...newValue };
}, { deep: true });
</script>
