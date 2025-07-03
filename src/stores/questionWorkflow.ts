import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  Question, 
  QuestionStatus, 
  QuestionReview 
} from '@/types/assessment'

export const useQuestionWorkflowStore = defineStore('questionWorkflow', () => {
  // État
  const questionStatuses = ref<QuestionStatus[]>([])
  const questionReviews = ref<QuestionReview[]>([])
  const questions = ref<Question[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters calculés
  const questionsByStatus = computed(() => {
    return questionStatuses.value.reduce((acc, status) => {
      const statusKey = status.status
      if (!acc[statusKey]) acc[statusKey] = []
      
      const question = questions.value.find(q => q.id === status.questionId)
      if (question) {
        acc[statusKey].push({
          ...question,
          status: status,
          reviews: questionReviews.value.filter(r => r.questionId === question.id)
        })
      }
      return acc
    }, {} as Record<string, any[]>)
  })

  const pendingReviewQuestions = computed(() => 
    questionsByStatus.value.review || []
  )

  const publishedQuestions = computed(() => 
    questionsByStatus.value.published || []
  )

  const draftQuestions = computed(() => 
    questionsByStatus.value.draft || []
  )

  const workflowStats = computed(() => {
    const stats = {
      draft: 0,
      review: 0,
      validated: 0,
      published: 0,
      archived: 0
    }

    questionStatuses.value.forEach(status => {
      stats[status.status]++
    })

    return stats
  })

  const recentReviews = computed(() => 
    questionReviews.value
      .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())
      .slice(0, 10)
  )

  // Actions
  async function fetchQuestionStatuses() {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      questionStatuses.value = [
        {
          id: 'qs1',
          questionId: 'q1',
          status: 'draft',
          createdBy: 'creator1',
          version: 1
        },
        {
          id: 'qs2',
          questionId: 'q2',
          status: 'review',
          createdBy: 'creator2',
          version: 1
        },
        {
          id: 'qs3',
          questionId: 'q3',
          status: 'published',
          createdBy: 'creator1',
          reviewedBy: 'admin1',
          reviewDate: '2024-01-10T14:30:00Z',
          publishedDate: '2024-01-11T09:00:00Z',
          version: 2
        }
      ]
    } catch (err) {
      error.value = 'Erreur lors du chargement des statuts de questions'
      console.error('Erreur fetchQuestionStatuses:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchQuestionReviews() {
    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      questionReviews.value = [
        {
          id: 'qr1',
          questionId: 'q2',
          reviewerId: 'admin1',
          reviewerName: 'Admin Principal',
          rating: 4,
          comments: 'Bonne question, mais clarifier l\'énoncé',
          suggestions: ['Reformuler la consigne', 'Ajouter un exemple'],
          approvalStatus: 'needs-changes',
          reviewDate: '2024-01-12T10:15:00Z'
        },
        {
          id: 'qr2',
          questionId: 'q3',
          reviewerId: 'admin1',
          reviewerName: 'Admin Principal',
          rating: 5,
          comments: 'Excellente question, bien construite',
          suggestions: [],
          approvalStatus: 'approved',
          reviewDate: '2024-01-10T14:30:00Z'
        }
      ]
    } catch (err) {
      error.value = 'Erreur lors du chargement des reviews'
      console.error('Erreur fetchQuestionReviews:', err)
    }
  }

  async function fetchQuestions() {
    try {
      // Simulation API - récupérer les questions depuis le store assessment
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Cette fonction devrait idéalement utiliser le store assessment
      // Pour la démo, on crée quelques questions fictives
      questions.value = [
        {
          id: 'q1',
          type: 'multiple-choice',
          title: 'Question sur Vue.js',
          instruction: 'Quel est le hook de cycle de vie approprié ?',
          difficulty: 'moyen',
          points: 10,
          category: 'Frontend',
          estimatedTime: 120,
          choices: [],
          allowMultiple: false
        },
        {
          id: 'q2',
          type: 'drag-drop',
          title: 'Organisation des composants',
          instruction: 'Placez les éléments dans le bon ordre',
          difficulty: 'difficile',
          points: 15,
          category: 'Architecture',
          estimatedTime: 180,
          dropZones: [],
          draggableItems: []
        },
        {
          id: 'q3',
          type: 'fill-in-blanks',
          title: 'Syntaxe TypeScript',
          instruction: 'Complétez le code TypeScript',
          difficulty: 'facile',
          points: 8,
          category: 'TypeScript',
          estimatedTime: 90,
          text: '',
          blanks: []
        }
      ] as Question[]
    } catch (err) {
      error.value = 'Erreur lors du chargement des questions'
      console.error('Erreur fetchQuestions:', err)
    }
  }

  async function submitQuestionForReview(questionId: string) {
    try {
      const statusIndex = questionStatuses.value.findIndex(s => s.questionId === questionId)
      if (statusIndex === -1) throw new Error('Question non trouvée')

      const status = questionStatuses.value[statusIndex]
      if (status.status !== 'draft') {
        throw new Error('Seules les questions en brouillon peuvent être soumises pour révision')
      }

      status.status = 'review'
      status.version++

      return status
    } catch (err) {
      error.value = 'Erreur lors de la soumission pour révision'
      throw err
    }
  }

  async function reviewQuestion(
    questionId: string, 
    reviewData: {
      reviewerId: string
      reviewerName: string
      rating: number
      comments: string
      suggestions: string[]
      approvalStatus: 'approved' | 'rejected' | 'needs-changes'
    }
  ) {
    try {
      const review: QuestionReview = {
        id: `qr_${Date.now()}`,
        questionId,
        ...reviewData,
        reviewDate: new Date().toISOString()
      }

      questionReviews.value.push(review)

      // Mettre à jour le statut de la question
      const statusIndex = questionStatuses.value.findIndex(s => s.questionId === questionId)
      if (statusIndex !== -1) {
        const status = questionStatuses.value[statusIndex]
        status.reviewedBy = reviewData.reviewerId
        status.reviewDate = review.reviewDate
        status.reviewNotes = reviewData.comments

        if (reviewData.approvalStatus === 'approved') {
          status.status = 'validated'
        } else if (reviewData.approvalStatus === 'rejected') {
          status.status = 'archived'
        }
        // Si 'needs-changes', le statut reste 'review'
      }

      return review
    } catch (err) {
      error.value = 'Erreur lors de la révision de la question'
      throw err
    }
  }

  async function publishQuestion(questionId: string, publisherId: string) {
    try {
      const statusIndex = questionStatuses.value.findIndex(s => s.questionId === questionId)
      if (statusIndex === -1) throw new Error('Question non trouvée')

      const status = questionStatuses.value[statusIndex]
      if (status.status !== 'validated') {
        throw new Error('Seules les questions validées peuvent être publiées')
      }

      status.status = 'published'
      status.publishedDate = new Date().toISOString()
      status.version++
      
      // Enregistrer qui a publié la question
      console.log(`Question ${questionId} publiée par ${publisherId}`)

      return status
    } catch (err) {
      error.value = 'Erreur lors de la publication de la question'
      throw err
    }
  }

  async function archiveQuestion(questionId: string, reason?: string) {
    try {
      const statusIndex = questionStatuses.value.findIndex(s => s.questionId === questionId)
      if (statusIndex === -1) throw new Error('Question non trouvée')

      const status = questionStatuses.value[statusIndex]
      status.status = 'archived'
      if (reason) {
        status.reviewNotes = reason
      }

      return status
    } catch (err) {
      error.value = 'Erreur lors de l\'archivage de la question'
      throw err
    }
  }

  async function revertToVersion(questionId: string, targetVersion: number) {
    try {
      // Cette fonction nécessiterait un système de versioning plus complexe
      // Pour la démo, on simule juste un changement de version
      const statusIndex = questionStatuses.value.findIndex(s => s.questionId === questionId)
      if (statusIndex === -1) throw new Error('Question non trouvée')

      const status = questionStatuses.value[statusIndex]
      status.version = targetVersion
      status.status = 'draft' // Retour en brouillon après restauration

      return status
    } catch (err) {
      error.value = 'Erreur lors de la restauration de version'
      throw err
    }
  }

  async function getQuestionHistory(questionId: string) {
    try {
      // Retourner l'historique des modifications d'une question
      const relatedReviews = questionReviews.value.filter(r => r.questionId === questionId)
      const status = questionStatuses.value.find(s => s.questionId === questionId)

      return {
        status,
        reviews: relatedReviews.sort((a, b) => 
          new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime()
        ),
        versions: [] // À implémenter avec un vrai système de versioning
      }
    } catch (err) {
      error.value = 'Erreur lors de la récupération de l\'historique'
      throw err
    }
  }

  // Fonctions de filtrage et recherche
  function searchQuestions(query: string, filters?: {
    status?: string[]
    category?: string[]
    difficulty?: string[]
    createdBy?: string[]
  }) {
    let filtered = questions.value

    // Filtrage par texte
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(lowerQuery) ||
        q.instruction.toLowerCase().includes(lowerQuery) ||
        q.category.toLowerCase().includes(lowerQuery)
      )
    }

    // Filtrage par critères
    if (filters) {
      if (filters.category?.length) {
        filtered = filtered.filter(q => filters.category!.includes(q.category))
      }
      if (filters.difficulty?.length) {
        filtered = filtered.filter(q => filters.difficulty!.includes(q.difficulty))
      }
      if (filters.status?.length) {
        const questionIds = questionStatuses.value
          .filter(s => filters.status!.includes(s.status))
          .map(s => s.questionId)
        filtered = filtered.filter(q => questionIds.includes(q.id))
      }
    }

    return filtered
  }

  // Initialisation
  function initialize() {
    fetchQuestions()
    fetchQuestionStatuses()
    fetchQuestionReviews()
  }

  return {
    // État
    questionStatuses,
    questionReviews,
    questions,
    isLoading,
    error,
    
    // Getters
    questionsByStatus,
    pendingReviewQuestions,
    publishedQuestions,
    draftQuestions,
    workflowStats,
    recentReviews,
    
    // Actions
    initialize,
    fetchQuestionStatuses,
    fetchQuestionReviews,
    fetchQuestions,
    submitQuestionForReview,
    reviewQuestion,
    publishQuestion,
    archiveQuestion,
    revertToVersion,
    getQuestionHistory,
    searchQuestions
  }
})
