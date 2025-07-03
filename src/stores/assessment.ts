import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  Question, 
  UserAnswer, 
  QuestionResult, 
  AssessmentResult,
  AdaptiveState,
  DifficultyLevel 
} from '@/types/assessment';

export const useAssessmentStore = defineStore('assessment', () => {
  // State
  const currentQuestions = ref<Question[]>([]);
  const currentQuestionIndex = ref(0);
  const userAnswers = ref<UserAnswer[]>([]);
  const isAssessmentActive = ref(false);
  const assessmentStartTime = ref<Date | null>(null);
  const adaptiveState = ref<AdaptiveState>({
    currentLevel: 'moyen',
    consecutiveErrors: 0,
    consecutiveCorrect: 0,
    skillLevels: {},
  });
  const results = ref<AssessmentResult[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const currentQuestion = computed(() => 
    currentQuestions.value[currentQuestionIndex.value] || null
  );

  const totalQuestions = computed(() => currentQuestions.value.length);

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0;
    return Math.round(((currentQuestionIndex.value + 1) / totalQuestions.value) * 100);
  });

  const isLastQuestion = computed(() => 
    currentQuestionIndex.value >= currentQuestions.value.length - 1
  );

  const elapsedTime = computed(() => {
    if (!assessmentStartTime.value) return 0;
    return Math.floor((Date.now() - assessmentStartTime.value.getTime()) / 1000);
  });

  const currentSkillLevel = computed(() => {
    if (!currentQuestion.value) return 0.5;
    return adaptiveState.value.skillLevels[currentQuestion.value.category] || 0.5;
  });

  // Actions
  const startAssessment = async (questions: Question[], adaptive = true) => {
    try {
      currentQuestions.value = adaptive ? 
        selectAdaptiveQuestions(questions) : 
        questions;
      
      currentQuestionIndex.value = 0;
      userAnswers.value = [];
      assessmentStartTime.value = new Date();
      isAssessmentActive.value = true;
      error.value = null;

      // Réinitialiser l'état adaptatif
      if (adaptive) {
        adaptiveState.value = {
          currentLevel: 'moyen',
          consecutiveErrors: 0,
          consecutiveCorrect: 0,
          skillLevels: {},
        };
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors du démarrage';
      throw err;
    }
  };

  const submitAnswer = async (answer: any, timeSpent = 0) => {
    if (!currentQuestion.value) return;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.value.id,
      answer,
      timeSpent,
      timestamp: new Date(),
      attempts: 1, // Pourrait être incrémenté en cas de tentatives multiples
    };

    userAnswers.value.push(userAnswer);

    // Évaluer la réponse et mettre à jour l'état adaptatif
    const isCorrect = evaluateAnswer(currentQuestion.value, answer);
    updateAdaptiveState(currentQuestion.value.category, isCorrect);

    // Passer à la question suivante ou adapter le niveau
    await nextQuestion();
  };

  const nextQuestion = async () => {
    if (isLastQuestion.value) {
      await completeAssessment();
      return;
    }

    // Si mode adaptatif, ajuster les questions suivantes
    if (adaptiveState.value.consecutiveErrors >= 2) {
      // Réduire la difficulté
      adjustDifficulty('down');
    } else if (adaptiveState.value.consecutiveCorrect >= 3) {
      // Augmenter la difficulté
      adjustDifficulty('up');
    }

    currentQuestionIndex.value++;
  };

  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
      // Supprimer la dernière réponse si on revient en arrière
      userAnswers.value.pop();
    }
  };

  const completeAssessment = async () => {
    if (!assessmentStartTime.value) return;

    isLoading.value = true;
    try {
      // Calculer les résultats
      const questionResults = calculateResults();
      const totalScore = questionResults.reduce((sum, result) => sum + result.score, 0);
      const maxScore = questionResults.reduce((sum, result) => sum + result.maxScore, 0);
      
      const assessmentResult: AssessmentResult = {
        id: generateId(),
        userId: 'current_user', // À récupérer du store auth
        questionnaire: 'assessment_' + Date.now(),
        questions: questionResults,
        totalScore,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        timeTotal: elapsedTime.value,
        completedAt: new Date(),
        adaptiveLevel: adaptiveState.value.currentLevel,
      };

      results.value.push(assessmentResult);
      
      // Réinitialiser l'état
      isAssessmentActive.value = false;
      currentQuestionIndex.value = 0;
      assessmentStartTime.value = null;

      return assessmentResult;

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la finalisation';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const pauseAssessment = () => {
    // Sauvegarder l'état actuel
    const state = {
      questions: currentQuestions.value,
      index: currentQuestionIndex.value,
      answers: userAnswers.value,
      startTime: assessmentStartTime.value,
      adaptive: adaptiveState.value,
    };
    localStorage.setItem('paused_assessment', JSON.stringify(state));
    isAssessmentActive.value = false;
  };

  const resumeAssessment = () => {
    const savedState = localStorage.getItem('paused_assessment');
    if (savedState) {
      const state = JSON.parse(savedState);
      currentQuestions.value = state.questions;
      currentQuestionIndex.value = state.index;
      userAnswers.value = state.answers;
      assessmentStartTime.value = new Date(state.startTime);
      adaptiveState.value = state.adaptive;
      isAssessmentActive.value = true;
      localStorage.removeItem('paused_assessment');
    }
  };

  // Fonctions utilitaires
  const evaluateAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        if (question.allowMultiple) {
          const correctIds = question.choices.filter(c => c.isCorrect).map(c => c.id);
          return Array.isArray(answer) && 
                 answer.length === correctIds.length &&
                 answer.every(id => correctIds.includes(id));
        } else {
          const correctChoice = question.choices.find(c => c.isCorrect);
          return correctChoice?.id === answer;
        }
      
      case 'fill-in-blanks':
        return question.blanks.every(blank => {
          const userAnswer = answer[blank.id];
          return blank.correctAnswers.some(correct => 
            blank.caseSensitive ? 
              correct === userAnswer : 
              correct.toLowerCase() === userAnswer?.toLowerCase()
          );
        });
      
      case 'drag-drop':
        return question.draggableItems.every(item => {
          return answer[item.id] === item.correctZone;
        });
      
      case 'matching':
        return question.correctPairs.every(pair => {
          return answer[pair.leftId] === pair.rightId;
        });
      
      case 'sorting':
        return JSON.stringify(answer) === JSON.stringify(question.correctOrder);
      
      default:
        return false;
    }
  };

  const updateAdaptiveState = (category: string, isCorrect: boolean) => {
    if (isCorrect) {
      adaptiveState.value.consecutiveCorrect++;
      adaptiveState.value.consecutiveErrors = 0;
      
      // Améliorer le niveau de compétence
      const currentLevel = adaptiveState.value.skillLevels[category] || 0.5;
      adaptiveState.value.skillLevels[category] = Math.min(1, currentLevel + 0.1);
    } else {
      adaptiveState.value.consecutiveErrors++;
      adaptiveState.value.consecutiveCorrect = 0;
      
      // Réduire le niveau de compétence
      const currentLevel = adaptiveState.value.skillLevels[category] || 0.5;
      adaptiveState.value.skillLevels[category] = Math.max(0, currentLevel - 0.1);
    }
  };

  const adjustDifficulty = (direction: 'up' | 'down') => {
    const levels: DifficultyLevel[] = ['facile', 'moyen', 'difficile'];
    const currentIndex = levels.indexOf(adaptiveState.value.currentLevel);
    
    if (direction === 'up' && currentIndex < levels.length - 1) {
      adaptiveState.value.currentLevel = levels[currentIndex + 1];
    } else if (direction === 'down' && currentIndex > 0) {
      adaptiveState.value.currentLevel = levels[currentIndex - 1];
    }

    // Réinitialiser les compteurs
    adaptiveState.value.consecutiveCorrect = 0;
    adaptiveState.value.consecutiveErrors = 0;
  };

  const selectAdaptiveQuestions = (allQuestions: Question[]): Question[] => {
    // For adaptive mode, include questions from all difficulty levels
    // but prioritize current level and adjacent levels
    const targetLevel = adaptiveState.value.currentLevel;
    
    // Group questions by difficulty
    const easyQuestions = allQuestions.filter(q => q.difficulty === 'facile');
    const mediumQuestions = allQuestions.filter(q => q.difficulty === 'moyen');
    const hardQuestions = allQuestions.filter(q => q.difficulty === 'difficile');
    
    let selectedQuestions: Question[] = [];
    
    // Select a mix based on target level
    if (targetLevel === 'facile') {
      selectedQuestions = [
        ...shuffleArray(easyQuestions).slice(0, 6),
        ...shuffleArray(mediumQuestions).slice(0, 4),
        ...shuffleArray(hardQuestions).slice(0, 2)
      ];
    } else if (targetLevel === 'moyen') {
      selectedQuestions = [
        ...shuffleArray(easyQuestions).slice(0, 3),
        ...shuffleArray(mediumQuestions).slice(0, 6),
        ...shuffleArray(hardQuestions).slice(0, 3)
      ];
    } else {
      selectedQuestions = [
        ...shuffleArray(easyQuestions).slice(0, 2),
        ...shuffleArray(mediumQuestions).slice(0, 4),
        ...shuffleArray(hardQuestions).slice(0, 6)
      ];
    }
    
    // If we don't have enough questions, return all available
    return selectedQuestions.length > 0 ? shuffleArray(selectedQuestions) : allQuestions;
  };

  const calculateResults = (): QuestionResult[] => {
    return userAnswers.value.map(userAnswer => {
      const question = currentQuestions.value.find(q => q.id === userAnswer.questionId)!;
      const isCorrect = evaluateAnswer(question, userAnswer.answer);
      
      return {
        questionId: question.id,
        userAnswer,
        isCorrect,
        score: isCorrect ? question.points : 0,
        maxScore: question.points,
        feedback: generateFeedback(question, isCorrect),
      };
    });
  };

  const generateFeedback = (question: Question, isCorrect: boolean): string => {
    if (isCorrect) {
      return 'Excellente réponse ! Vous maîtrisez bien cette compétence.';
    } else {
      return `Cette réponse n'est pas correcte. La compétence "${question.category}" nécessite plus de pratique.`;
    }
  };

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return {
    // State
    currentQuestions,
    currentQuestionIndex,
    userAnswers,
    isAssessmentActive,
    assessmentStartTime,
    adaptiveState,
    results,
    isLoading,
    error,
    // Computed
    currentQuestion,
    totalQuestions,
    progress,
    isLastQuestion,
    elapsedTime,
    currentSkillLevel,
    // Actions
    startAssessment,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeAssessment,
    pauseAssessment,
    resumeAssessment,
  };
});
