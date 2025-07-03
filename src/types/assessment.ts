// Types pour les questions et évaluations
export interface QuestionBase {
  id: string;
  type: QuestionType;
  title: string;
  instruction: string;
  difficulty: DifficultyLevel;
  points: number;
  category: string;
  estimatedTime: number; // en secondes
  accessibility?: AccessibilityOptions;
}

export type QuestionType = 
  | 'multiple-choice'
  | 'drag-drop'
  | 'fill-in-blanks'
  | 'matching'
  | 'sorting'
  | 'true-false'
  | 'open-text';

export type DifficultyLevel = 'facile' | 'moyen' | 'difficile';

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  choices: Choice[];
  allowMultiple: boolean;
}

export interface DragDropQuestion extends QuestionBase {
  type: 'drag-drop';
  dropZones: DropZone[];
  draggableItems: DraggableItem[];
}

export interface FillInBlanksQuestion extends QuestionBase {
  type: 'fill-in-blanks';
  text: string; // Texte avec des placeholders comme {{1}}, {{2}}
  blanks: Blank[];
}

export interface MatchingQuestion extends QuestionBase {
  type: 'matching';
  leftItems: MatchItem[];
  rightItems: MatchItem[];
  correctPairs: MatchPair[];
}

export interface SortingQuestion extends QuestionBase {
  type: 'sorting';
  items: SortableItem[];
  correctOrder: string[]; // IDs dans le bon ordre
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'true-false';
  correctAnswer: boolean;
  explanation?: string;
}

export interface OpenTextQuestion extends QuestionBase {
  type: 'open-text';
  expectedAnswer?: string;
  maxWords?: number;
  evaluationCriteria?: string[];
}

export type Question = 
  | MultipleChoiceQuestion 
  | DragDropQuestion 
  | FillInBlanksQuestion
  | MatchingQuestion
  | SortingQuestion
  | TrueFalseQuestion
  | OpenTextQuestion;

// Types pour les choix et éléments
export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
}

export interface DropZone {
  id: string;
  label: string;
  acceptedItems: string[]; // IDs des items acceptés
  position: Position;
}

export interface DraggableItem {
  id: string;
  content: string;
  correctZone: string;
  position?: Position;
}

export interface Blank {
  id: string;
  position: number; // Position dans le texte
  correctAnswers: string[];
  caseSensitive: boolean;
}

export interface MatchItem {
  id: string;
  content: string;
  type: 'text' | 'image' | 'audio';
}

export interface MatchPair {
  leftId: string;
  rightId: string;
}

export interface SortableItem {
  id: string;
  content: string;
  order: number;
}

export interface Position {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// Types pour les réponses et résultats
export interface UserAnswer {
  questionId: string;
  answer: any; // Type dépend du type de question
  timeSpent: number; // en secondes
  timestamp: Date;
  attempts: number;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  score: number; // Points obtenus
  maxScore: number; // Points maximum possible
  feedback: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  questionnaire: string;
  questions: QuestionResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeTotal: number; // temps total en secondes
  completedAt: Date;
  adaptiveLevel: DifficultyLevel;
  // Additional properties used in views
  participantName?: string;
  participantEmail?: string;
  assessmentTitle?: string;
  assessmentId?: string;
  category?: string;
  score?: number; // Alternative naming for percentage
  duration?: number; // Alternative naming for timeTotal
  status?: 'completed' | 'in-progress' | 'abandoned';
}

// Types pour l'accessibilité
export interface AccessibilityOptions {
  textToSpeech: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  keyboardNavigation: boolean;
  screenReader: boolean;
}

// Types pour l'adaptive learning
export interface AdaptiveState {
  currentLevel: DifficultyLevel;
  consecutiveErrors: number;
  consecutiveCorrect: number;
  skillLevels: Record<string, number>; // catégorie -> niveau (0-1)
}

// Types pour H5P
export interface H5PContent {
  library: string;
  params: any;
  metadata: H5PMetadata;
  path?: string; // Path to H5P content package
}

export interface H5PMetadata {
  title: string;
  authors: H5PAuthor[];
  license: string;
  licenseVersion: string;
  yearFrom: number;
  yearTo: number;
  source: string;
  contentType: string;
  defaultLanguage: string;
}

export interface H5PAuthor {
  name: string;
  role: string;
}

export interface H5PInstance {
  id: string;
  contentId: string;
  on: (event: string, callback: Function) => void;
  off: (event: string, callback: Function) => void;
  trigger: (event: string, data?: any) => void;
  getScore: () => number;
  getMaxScore: () => number;
  getAnswerGiven: () => boolean;
  getCurrentState: () => any;
  resize?: () => void;
}

// Types pour la gestion des sessions présentielles
export interface SessionSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  location: string
  equipmentRequired: string[]
  status: 'available' | 'full' | 'cancelled'
}

export interface SessionReservation {
  id: string
  sessionSlotId: string
  participantId: string
  participantName: string
  participantEmail: string
  reservationDate: string
  status: 'confirmed' | 'cancelled' | 'no-show' | 'completed'
  confirmationCode: string
  reminderSent: boolean
}

export interface WorkStation {
  id: string
  name: string
  location: string
  equipment: string[]
  isAvailable: boolean
  maintenanceNotes?: string
}

// Types pour le workflow des questions
export interface QuestionStatus {
  id: string
  questionId: string
  status: 'draft' | 'review' | 'validated' | 'published' | 'archived'
  createdBy: string
  reviewedBy?: string
  reviewDate?: string
  reviewNotes?: string
  publishedDate?: string
  version: number
}

export interface QuestionReview {
  id: string
  questionId: string
  reviewerId: string
  reviewerName: string
  rating: number // 1-5
  comments: string
  suggestions: string[]
  approvalStatus: 'approved' | 'rejected' | 'needs-changes'
  reviewDate: string
}

// Types pour les analytics avancées
export interface AdvancedFilter {
  dateRange: {
    start: string
    end: string
  }
  provenance: string[]
  clientReferrer: string[]
  timeOfDay: {
    start: string
    end: string
  }
  deviceType: string[]
  sessionType: 'online' | 'presential' | 'both'
}

export interface CorrelationAnalysis {
  pauseScoreCorrelation: {
    correlation: number
    significance: number
    pauseCount: number[]
    scores: number[]
  }
  timePerformanceCorrelation: {
    hourlyPerformance: { hour: number; avgScore: number; participantCount: number }[]
    optimalTimeSlots: string[]
  }
  provenanceAnalysis: {
    provenance: string
    avgScore: number
    completionRate: number
    participantCount: number
    topSkills: string[]
    weakAreas: string[]
  }[]
}

export interface KPIMetrics {
  totalParticipants: number
  completionRate: number
  avgScore: number
  noShowRate: number
  sessionUtilization: number
  popularTimeSlots: { time: string; bookings: number }[]
  topProvenances: { name: string; count: number; avgScore: number }[]
  equipmentUsage: { equipment: string; usageRate: number }[]
}

// Extension de AssessmentResult pour les analytics
export interface EnhancedAssessmentResult extends AssessmentResult {
  sessionType: 'online' | 'presential'
  provenance: string
  clientReferrer: string
  deviceInfo: {
    type: 'desktop' | 'tablet' | 'mobile'
    browser: string
    os: string
  }
  pauseEvents: {
    timestamp: string
    duration: number
    reason?: string
  }[]
  timeSpentPerQuestion: { questionId: string; timeSpent: number }[]
  clickTracker: {
    questionId: string
    clicks: number
    hesitations: number
  }[]
}
