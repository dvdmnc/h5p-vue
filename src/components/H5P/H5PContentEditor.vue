<template>
  <div class="h5p-content-editor">
    <div class="editor-header">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Éditeur de contenu H5P - {{ questionTypeTitle }}
      </h3>
      <div class="mb-4">
        <button
          @click="saveContent"
          :disabled="saving"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-2"
        >
          {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
        </button>
        <button
          @click="resetContent"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <div class="editor-content">
      <!-- Multiple Choice Editor -->
      <div v-if="questionType === 'multiple-choice'" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <textarea
            v-model="editableContent.question"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Entrez votre question ici..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Réponses
          </label>
          <div class="space-y-3">
            <div
              v-for="(answer, index) in editableContent.answers"
              :key="index"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center mb-2">
                <input
                  :id="`correct-${index}`"
                  type="radio"
                  :name="'correct-answer'"
                  :value="index"
                  :checked="answer.correct"
                  @change="setCorrectAnswer(index)"
                  class="mr-2"
                >
                <label :for="`correct-${index}`" class="text-sm font-medium text-gray-700">
                  Réponse correcte
                </label>
                <button
                  v-if="editableContent.answers.length > 2"
                  @click="removeAnswer(index)"
                  class="ml-auto text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
              <input
                v-model="answer.text"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                :placeholder="`Réponse ${index + 1}`"
              >
              <input
                v-model="answer.tipsAndFeedback.chosenFeedback"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Feedback pour cette réponse"
              >
            </div>
          </div>
          <button
            @click="addAnswer"
            class="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Ajouter une réponse
          </button>
        </div>
      </div>

      <!-- Fill in Blanks Editor -->
      <div v-if="questionType === 'fill-in-blanks'" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Texte avec blancs
          </label>
          <div class="mb-2 text-sm text-gray-600">
            Utilisez des astérisques (*) pour marquer les mots à compléter. 
            Exemple: "Vue.js est un framework *progressif*"
          </div>
          <textarea
            v-model="editableContent.text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Entrez votre texte avec des *mots* à compléter..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Réponses attendues
          </label>
          <div class="text-sm text-gray-600 mb-2">
            Les mots entre astérisques seront automatiquement détectés
          </div>
          <div class="space-y-2">
            <div
              v-for="(question, index) in extractedQuestions"
              :key="index"
              class="flex items-center space-x-2"
            >
              <span class="text-sm font-medium text-gray-700 w-16">{{ index + 1 }}.</span>
              <input
                :value="question"
                @input="updateQuestion(index, $event.target.value)"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Réponse attendue"
              >
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="editableContent.behaviour.caseSensitive"
                type="checkbox"
                class="mr-2"
              >
              Sensible à la casse
            </label>
            <label class="flex items-center">
              <input
                v-model="editableContent.behaviour.acceptSpellingErrors"
                type="checkbox"
                class="mr-2"
              >
              Accepter les erreurs d'orthographe
            </label>
            <label class="flex items-center">
              <input
                v-model="editableContent.behaviour.separateLines"
                type="checkbox"
                class="mr-2"
              >
              Afficher chaque blanc sur une ligne séparée
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div class="mt-8 border-t pt-6">
      <h4 class="text-md font-semibold text-gray-800 mb-4">Aperçu</h4>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <pre class="text-sm text-gray-600 whitespace-pre-wrap">{{ JSON.stringify(editableContent, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  questionType: string
  initialContent?: any
}

const props = withDefaults(defineProps<Props>(), {
  questionType: 'multiple-choice',
  initialContent: () => ({})
})

const emit = defineEmits<{
  save: [content: any]
  contentChanged: [content: any]
}>()

// State
const editableContent = ref<any>({})
const saving = ref(false)

// Computed
const questionTypeTitle = computed(() => {
  const titles = {
    'multiple-choice': 'Choix Multiple',
    'fill-in-blanks': 'Texte à Trous'
  }
  return titles[props.questionType as keyof typeof titles] || props.questionType
})

const extractedQuestions = computed(() => {
  if (props.questionType !== 'fill-in-blanks') return []
  
  const text = editableContent.value.text || ''
  const matches = text.match(/\*([^*]+)\*/g)
  return matches ? matches.map(match => match.replace(/\*/g, '')) : []
})

// Methods
const initializeContent = () => {
  if (props.questionType === 'multiple-choice') {
    editableContent.value = {
      question: '<p>Votre question ici</p>',
      answers: [
        {
          correct: true,
          text: '<div>Réponse correcte</div>',
          tipsAndFeedback: {
            tip: '',
            chosenFeedback: 'Correct !',
            notChosenFeedback: ''
          }
        },
        {
          correct: false,
          text: '<div>Réponse incorrecte</div>',
          tipsAndFeedback: {
            tip: '',
            chosenFeedback: 'Incorrect.',
            notChosenFeedback: ''
          }
        }
      ],
      overallFeedback: [
        {
          from: 0,
          to: 100,
          feedback: 'Merci d\'avoir répondu à cette question !'
        }
      ],
      UI: {
        checkAnswerButton: 'Vérifier',
        submitAnswerButton: 'Valider',
        showSolutionButton: 'Voir la solution',
        tryAgainButton: 'Réessayer'
      },
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        enableCheckButton: true,
        type: 'auto',
        singlePoint: false,
        randomAnswers: false,
        passPercentage: 50,
        showScorePoints: true
      }
    }
  } else if (props.questionType === 'fill-in-blanks') {
    editableContent.value = {
      text: 'Vue.js est un framework JavaScript *progressif* qui permet de développer des applications *interactives* facilement.',
      questions: ['progressif', 'interactives'],
      overallFeedback: [
        {
          from: 0,
          to: 100,
          feedback: 'Bien joué !'
        }
      ],
      UI: {
        checkAnswerButton: 'Vérifier',
        submitAnswerButton: 'Valider',
        showSolutionButton: 'Voir la solution',
        tryAgainButton: 'Réessayer'
      },
      behaviour: {
        enableRetry: true,
        enableSolutionsButton: true,
        autoCheck: false,
        caseSensitive: false,
        showSolutionsRequiresInput: true,
        separateLines: false,
        confirmCheckDialog: false,
        acceptSpellingErrors: false
      }
    }
  }

  // Override with initial content if provided
  if (props.initialContent && Object.keys(props.initialContent).length > 0) {
    editableContent.value = { ...editableContent.value, ...props.initialContent }
  }
}

const setCorrectAnswer = (index: number) => {
  editableContent.value.answers.forEach((answer: any, i: number) => {
    answer.correct = i === index
  })
}

const addAnswer = () => {
  editableContent.value.answers.push({
    correct: false,
    text: '<div>Nouvelle réponse</div>',
    tipsAndFeedback: {
      tip: '',
      chosenFeedback: 'Feedback pour cette réponse',
      notChosenFeedback: ''
    }
  })
}

const removeAnswer = (index: number) => {
  if (editableContent.value.answers.length > 2) {
    editableContent.value.answers.splice(index, 1)
  }
}

const updateQuestion = (index: number, value: string) => {
  if (!editableContent.value.questions) {
    editableContent.value.questions = []
  }
  editableContent.value.questions[index] = value
}

const saveContent = async () => {
  saving.value = true
  
  try {
    // For fill-in-blanks, sync questions with extracted text
    if (props.questionType === 'fill-in-blanks') {
      editableContent.value.questions = extractedQuestions.value
    }
    
    emit('save', editableContent.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Error saving content:', error)
  } finally {
    saving.value = false
  }
}

const resetContent = () => {
  initializeContent()
}

// Watchers
watch(() => props.questionType, () => {
  initializeContent()
}, { immediate: true })

watch(() => props.initialContent, () => {
  if (props.initialContent && Object.keys(props.initialContent).length > 0) {
    editableContent.value = { ...editableContent.value, ...props.initialContent }
  }
}, { deep: true })

watch(editableContent, () => {
  emit('contentChanged', editableContent.value)
}, { deep: true })

// Initialize on mount
initializeContent()
</script>

<style scoped>
.h5p-content-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.editor-content {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

input[type="text"], 
input[type="radio"], 
input[type="checkbox"] {
  transition: all 0.2s ease;
}

input[type="text"]:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>
