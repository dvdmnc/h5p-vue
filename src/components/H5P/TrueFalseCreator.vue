<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Énoncé de la question vrai/faux
      </label>
      <textarea
        v-model="localData.statement"
        placeholder="Énoncé de la question vrai/faux..."
        class="w-full p-3 border border-gray-300 rounded-lg resize-none"
        rows="3"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Réponse correcte
      </label>
      <div class="space-y-2">
        <label class="flex items-center">
          <input
            type="radio"
            :value="true"
            v-model="localData.correctAnswer"
            class="mr-2"
          />
          <span>Vrai</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            :value="false"
            v-model="localData.correctAnswer"
            class="mr-2"
          />
          <span>Faux</span>
        </label>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Explication (optionnelle)
      </label>
      <textarea
        v-model="localData.explanation"
        placeholder="Explication de la bonne réponse..."
        class="w-full p-3 border border-gray-300 rounded-lg resize-none"
        rows="2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

const props = withDefaults(defineProps<{
  modelValue?: TrueFalseData;
}>(), {
  modelValue: () => ({
    statement: '',
    correctAnswer: true,
    explanation: ''
  })
});

const emit = defineEmits<{
  'update:modelValue': [value: TrueFalseData];
}>();

const localData = ref<TrueFalseData>({ ...props.modelValue });

watch(localData, (newData) => {
  emit('update:modelValue', newData);
}, { deep: true });

watch(() => props.modelValue, (newValue) => {
  localData.value = { ...newValue };
}, { deep: true });
</script>
