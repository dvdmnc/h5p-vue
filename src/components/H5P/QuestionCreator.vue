<template>
  <div class="question-creator bg-white rounded-xl shadow-custom-lg border border-gray-100 p-8">
    <div class="mb-6">
      <h2 class="text-2xl font-heading font-semibold text-gray-900 mb-2">
        Créer une nouvelle question
      </h2>
      <p class="text-gray-600">
        Choisissez le type de question et configurez le contenu interactif
      </p>
    </div>

    <!-- Sélection du type de question -->
    <div class="mb-8">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        Type de question
      </label>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="type in questionTypes"
          :key="type.id"
          @click="selectedType = type.id"
          :class="[
            'relative p-4 border rounded-lg text-left transition-all duration-200',
            selectedType === type.id
              ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div 
              :class="[
                'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                selectedType === type.id ? 'bg-primary-100' : 'bg-gray-100'
              ]"
            >
              <component :is="type.icon" class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ type.name }}</h3>
              <p class="text-sm text-gray-500">{{ type.description }}</p>
            </div>
          </div>
          <div 
            v-if="selectedType === type.id"
            class="absolute top-2 right-2"
          >
            <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Configuration générale -->
    <div class="mb-8 space-y-6">
      <div>
        <label for="question-title" class="block text-sm font-medium text-gray-700 mb-2">
          Titre de la question
        </label>
        <input
          id="question-title"
          v-model="questionData.title"
          type="text"
          class="input-field"
          placeholder="Entrez le titre de votre question"
        >
      </div>

      <div>
        <label for="question-instruction" class="block text-sm font-medium text-gray-700 mb-2">
          Instructions
        </label>
        <textarea
          id="question-instruction"
          v-model="questionData.instruction"
          rows="3"
          class="input-field"
          placeholder="Expliquez clairement ce que l'utilisateur doit faire"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
            Difficulté
          </label>
          <select id="difficulty" v-model="questionData.difficulty" class="input-field">
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </div>

        <div>
          <label for="points" class="block text-sm font-medium text-gray-700 mb-2">
            Points
          </label>
          <input
            id="points"
            v-model.number="questionData.points"
            type="number"
            min="1"
            max="100"
            class="input-field"
          >
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select id="category" v-model="questionData.category" class="input-field">
            <option value="francais">Français</option>
            <option value="mathematiques">Mathématiques</option>
            <option value="informatique">Informatique</option>
            <option value="competences-transversales">Compétences transversales</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Configuration spécifique au type et Prévisualisation côte à côte -->
    <div v-if="selectedType" class="mb-8">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <!-- Configuration à gauche -->
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">
            Configuration {{ getQuestionTypeLabel(selectedType) }}
          </h3>
          <component 
            :is="currentTypeComponent" 
            v-model="currentTypeData"
            :question-type="selectedType"
          />
        </div>
        
        <!-- Prévisualisation -->
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900">
            Prévisualisation en temps réel
            <span class="text-sm font-normal text-gray-500 block">
              Met à jour automatiquement pendant que vous tapez
            </span>
          </h3>
          
          <div class="border border-gray-200 rounded-lg p-6 bg-gray-50 min-h-[400px] xl:min-h-[500px] xl:sticky xl:top-4">
            <QuestionPreview 
              :question="questionData"
              :type="selectedType"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <button
        @click="resetForm"
        class="btn-secondary"
      >
        Réinitialiser
      </button>
      
      <div class="space-x-3">
        <button
          @click="saveDraft"
          class="btn-secondary"
          :disabled="!isValid"
        >
          Sauvegarder brouillon
        </button>
        
        <button
          @click="saveQuestion"
          class="btn-primary"
          :disabled="!isValid"
        >
          Créer la question
        </button>
      </div>
    </div>

    <!-- H5P Content generation -->
    <div v-if="generatedH5P" class="mt-8">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Contenu H5P généré</h3>
      <div class="bg-gray-900 rounded-lg p-4">
        <pre class="text-green-400 text-sm overflow-x-auto">{{ JSON.stringify(generatedH5P, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';
import type { Question, QuestionType, DifficultyLevel, H5PContent } from '@/types/assessment';

// Import icons (you'll need to install @heroicons/vue or similar)
import { 
  CheckCircleIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  LinkIcon,
  ListBulletIcon,
} from '@heroicons/vue/24/outline';

// Import type-specific components
// @ts-ignore - Vue component import
import MultipleChoiceCreator from './MultipleChoiceCreator.vue';
import DragDropCreator from './DragDropCreator.vue';
import FillInBlanksCreator from './FillInBlanksCreator.vue';
import MatchingCreator from './MatchingCreator.vue';
import SortingCreator from './SortingCreator.vue';
import TrueFalseCreator from './TrueFalseCreator.vue';
import OpenTextCreator from './OpenTextCreator.vue';
import QuestionPreview from './QuestionPreview.vue';

interface Props {
  initialData?: Partial<Question>;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  save: [question: Question];
  saveDraft: [question: Partial<Question>];
  cancel: [];
}>();

// Helper functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to check if data structure is valid for a question type
const isValidDataForType = (data: any, type: QuestionType): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  switch (type) {
    case 'multiple-choice':
      return Array.isArray(data.choices);
    case 'drag-drop':
      return Array.isArray(data.draggableItems) || Array.isArray(data.dropZones);
    case 'fill-in-blanks':
      return typeof data.text === 'string';
    case 'matching':
      return Array.isArray(data.leftItems) || Array.isArray(data.rightItems);
    case 'sorting':
      return Array.isArray(data.items);
    default:
      return true;
  }
};

// Helper function for default data
const getDefaultTypeData = (type: QuestionType) => {
  switch (type) {
    case 'multiple-choice':
      return {
        choices: [
          { id: generateId(), text: '', isCorrect: false, feedback: '' },
          { id: generateId(), text: '', isCorrect: false, feedback: '' },
        ],
        allowMultiple: false,
        randomizeChoices: false,
        showFeedback: true,
        allowRetry: true,
        showSolution: true,
      };
    
    case 'drag-drop':
      return {
        draggableItems: [],
        dropZones: [],
        backgroundImage: '',
        instructions: ''
      };
    
    case 'fill-in-blanks':
      return {
        text: '',
        blanks: []
      };
    
    case 'matching':
      return {
        leftItems: [],
        rightItems: [],
        correctPairs: []
      };
    
    case 'sorting':
      return {
        sortType: 'alphabetical',
        instructions: '',
        items: []
      };
    
    default:
      return {};
  }
};

// State - Store data for each question type separately
const selectedType = ref<QuestionType>('multiple-choice');
const questionDataByType = ref<Record<QuestionType, any>>({
  'multiple-choice': getDefaultTypeData('multiple-choice'),
  'drag-drop': getDefaultTypeData('drag-drop'),
  'fill-in-blanks': getDefaultTypeData('fill-in-blanks'),
  'matching': getDefaultTypeData('matching'),
  'sorting': getDefaultTypeData('sorting'),
  'true-false': {},
  'open-text': {},
});

const questionData = ref({
  title: '',
  instruction: '',
  difficulty: 'moyen' as DifficultyLevel,
  points: 10,
  category: 'francais',
  typeSpecificData: questionDataByType.value['multiple-choice'],
});

const generatedH5P = ref<H5PContent | null>(null);

// Question types configuration
const questionTypes = [
  {
    id: 'multiple-choice' as QuestionType,
    name: 'QCM',
    description: 'Questions à choix multiples',
    icon: markRaw(CheckCircleIcon),
  },
  {
    id: 'drag-drop' as QuestionType,
    name: 'Glisser-déposer',
    description: 'Déplacer des éléments',
    icon: markRaw(CursorArrowRaysIcon),
  },
  {
    id: 'fill-in-blanks' as QuestionType,
    name: 'Texte à trous',
    description: 'Compléter des phrases',
    icon: markRaw(DocumentTextIcon),
  },
  {
    id: 'matching' as QuestionType,
    name: 'Association',
    description: 'Relier des éléments',
    icon: markRaw(LinkIcon),
  },
  {
    id: 'sorting' as QuestionType,
    name: 'Tri',
    description: 'Ordonner des éléments',
    icon: markRaw(ListBulletIcon),
  },
];

// Computed
const currentTypeComponent = computed(() => {
  const components = {
    'multiple-choice': MultipleChoiceCreator,
    'drag-drop': DragDropCreator,
    'fill-in-blanks': FillInBlanksCreator,
    'matching': MatchingCreator,
    'sorting': SortingCreator,
    'true-false': TrueFalseCreator,
    'open-text': OpenTextCreator,
  };
  return components[selectedType.value];
});

// Computed for reactive v-model
const currentTypeData = computed({
  get: () => questionData.value.typeSpecificData,
  set: (newValue) => {
    questionData.value.typeSpecificData = newValue;
  }
});

const isValid = computed(() => {
  return questionData.value.title.trim() !== '' && 
         questionData.value.instruction.trim() !== '' &&
         questionData.value.points > 0;
});

// Watchers
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(questionData.value, newData);
    if (newData.type) {
      selectedType.value = newData.type;
    }
  }
}, { immediate: true, deep: true });

watch(selectedType, (newType, oldType) => {
  // Save current data to the old type before switching
  if (oldType) {
    questionDataByType.value[oldType] = { ...questionData.value.typeSpecificData };
  }
  
  // Load data for the new type
  questionData.value.typeSpecificData = { ...questionDataByType.value[newType] };
});

// Remove the problematic watch that interferes with real-time updates
// Data persistence is handled only when switching types (above)

watch(questionData, () => {
  // Generate H5P content when data changes
  generateH5PContent();
}, { deep: true });

// Methods
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

const generateH5PContent = () => {
  try {
    const h5pContent = convertToH5P(selectedType.value, questionData.value);
    generatedH5P.value = h5pContent;
  } catch (error) {
    console.error('Erreur lors de la génération H5P:', error);
    generatedH5P.value = null;
  }
};

const convertToH5P = (type: QuestionType, data: any): H5PContent => {
  // Create type-specific parameters
  let params: any = {
    question: data.title,
    description: data.instruction,
  };

  // Add type-specific parameters
  switch (type) {
    case 'multiple-choice':
      params.answers = data.typeSpecificData.choices || [];
      params.behaviour = {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        type: data.typeSpecificData.allowMultiple ? 'auto' : 'single',
      };
      break;

    case 'drag-drop':
      params.task = {
        elements: data.typeSpecificData.draggableItems || [],
        dropZones: data.typeSpecificData.dropZones || [],
      };
      params.behaviour = {
        enableRetry: true,
        enableCheckButton: true,
      };
      break;

    case 'fill-in-blanks':
      params.text = data.typeSpecificData.text || '';
      params.blanks = data.typeSpecificData.blanks || [];
      params.behaviour = {
        enableRetry: true,
        enableCheckButton: true,
        caseSensitive: false,
      };
      break;

    case 'matching':
      params.leftItems = data.typeSpecificData.leftItems || [];
      params.rightItems = data.typeSpecificData.rightItems || [];
      params.correctPairs = data.typeSpecificData.correctPairs || [];
      params.behaviour = {
        enableRetry: true,
        enableCheckButton: true,
      };
      break;

    case 'sorting':
      params.textField = data.typeSpecificData.instructions || '';
      params.elements = data.typeSpecificData.items || [];
      params.behaviour = {
        enableRetry: true,
        enableCheckButton: true,
      };
      break;

    // Add other types...
  }

  const baseContent = {
    library: getH5PLibrary(type),
    params,
    metadata: {
      title: data.title,
      authors: [{ name: 'Check Compétences', role: 'Author' }],
      license: 'Unlicense',
      licenseVersion: '1.0',
      yearFrom: new Date().getFullYear(),
      yearTo: new Date().getFullYear(),
      source: '',
      contentType: 'Question',
      defaultLanguage: 'fr',
    },
  };

  return baseContent as H5PContent;
};

const getH5PLibrary = (type: QuestionType): string => {
  const libraries = {
    'multiple-choice': 'H5P.MultiChoice 1.16',
    'drag-drop': 'H5P.DragQuestion 1.14',
    'fill-in-blanks': 'H5P.Blanks 1.14',
    'matching': 'H5P.MemoryGame 1.3',
    'sorting': 'H5P.DragText 1.10',
    'true-false': 'H5P.TrueFalse 1.8',
    'open-text': 'H5P.Essay 1.5',
  };
  return libraries[type] || 'H5P.MultiChoice 1.16';
};

const saveQuestion = () => {
  if (!isValid.value) return;

  const baseQuestion = {
    id: generateId(),
    type: selectedType.value,
    title: questionData.value.title,
    instruction: questionData.value.instruction,
    difficulty: questionData.value.difficulty,
    points: questionData.value.points,
    category: questionData.value.category,
    estimatedTime: 60, // Default estimated time
  };

  // Add type-specific data based on question type
  let question: Question;
  switch (selectedType.value) {
    case 'multiple-choice':
      question = {
        ...baseQuestion,
        choices: questionData.value.typeSpecificData.choices || [],
        allowMultiple: questionData.value.typeSpecificData.allowMultiple || false,
      } as Question;
      break;
    case 'drag-drop':
      question = {
        ...baseQuestion,
        draggableItems: questionData.value.typeSpecificData.draggableItems || [],
        dropZones: questionData.value.typeSpecificData.dropZones || [],
      } as Question;
      break;
    case 'fill-in-blanks':
      question = {
        ...baseQuestion,
        text: questionData.value.typeSpecificData.text || '',
        blanks: questionData.value.typeSpecificData.blanks || [],
      } as Question;
      break;
    case 'matching':
      question = {
        ...baseQuestion,
        leftItems: questionData.value.typeSpecificData.leftItems || [],
        rightItems: questionData.value.typeSpecificData.rightItems || [],
        correctPairs: questionData.value.typeSpecificData.correctPairs || [],
      } as Question;
      break;
    case 'sorting':
      question = {
        ...baseQuestion,
        items: questionData.value.typeSpecificData.items || [],
        correctOrder: questionData.value.typeSpecificData.correctOrder || [],
      } as Question;
      break;
    default:
      question = baseQuestion as Question;
  }

  emit('save', question);
};

const saveDraft = () => {
  const draft: Partial<Question> = {
    type: selectedType.value as any, // Allow all question types
    title: questionData.value.title,
    instruction: questionData.value.instruction,
    difficulty: questionData.value.difficulty,
    points: questionData.value.points,
    category: questionData.value.category,
  };
  // Add type-specific data as any to bypass type checking
  (draft as any).typeSpecificData = questionData.value.typeSpecificData;
  emit('saveDraft', draft);
};

const resetForm = () => {
  // Reset general question data
  questionData.value.title = '';
  questionData.value.instruction = '';
  questionData.value.difficulty = 'moyen';
  questionData.value.points = 10;
  questionData.value.category = 'francais';
  
  // Reset all type-specific data
  Object.keys(questionDataByType.value).forEach(type => {
    questionDataByType.value[type as QuestionType] = getDefaultTypeData(type as QuestionType);
  });
  
  // Reset to multiple choice and load its default data
  selectedType.value = 'multiple-choice';
  questionData.value.typeSpecificData = { ...questionDataByType.value['multiple-choice'] };
  generatedH5P.value = null;
};
</script>

<style scoped>
.question-creator {
  max-width: 4xl;
}

/* Custom styling for form elements */
.input-field:focus {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
  border-color: transparent;
}

/* Icon styles */
.question-type-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: rgb(156 163 175);
}

/* Disabled state */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Code block styling */
pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
