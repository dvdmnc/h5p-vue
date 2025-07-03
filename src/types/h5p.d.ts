/**
 * Type definitions for H5P Core
 */

// H5P Content Types
export type H5PContentType = 
  | 'multiple-choice'
  | 'fill-in-blanks'
  | 'drag-drop'
  | 'matching'
  | 'sorting'
  | 'true-false'
  | 'open-text';

// H5P Render Modes
export type H5PRenderMode = 'cdn' | 'local' | 'vue';

// H5P xAPI Statement
export interface H5PxAPIStatement {
  actor?: {
    name?: string;
    mbox?: string;
  };
  verb?: {
    id?: string;
    display?: {
      [key: string]: string;
    };
  };
  object?: {
    id?: string;
    definition?: {
      type?: string;
      name?: {
        [key: string]: string;
      };
      description?: {
        [key: string]: string;
      };
    };
  };
  result?: {
    score?: {
      raw?: number;
      min?: number;
      max?: number;
      scaled?: number;
    };
    completion?: boolean;
    success?: boolean;
    duration?: string;
    response?: string;
  };
  context?: any;
  timestamp?: string;
}

// H5P Event Data
export interface H5PEventData {
  type?: string;
  score?: number;
  maxScore?: number;
  completed?: boolean;
  success?: boolean;
  data?: any;
}

// H5P Question Configuration
export interface H5PQuestionConfig {
  title?: string;
  description?: string;
  question?: string;
  choices?: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer?: string;
  correctAnswers?: {
    [key: string]: string;
  };
  h5pContent?: string;
}

// H5P Multiple Choice Question
export interface H5PMultipleChoiceQuestion extends H5PQuestionConfig {
  choices: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: string;
}

// H5P Fill in Blanks Question
export interface H5PFillInBlanksQuestion extends H5PQuestionConfig {
  text: string;
  blanks: Array<{
    id: string;
    correctAnswers: string[];
    position: number;
  }>;
}

// H5P Drag and Drop Question
export interface H5PDragDropQuestion extends H5PQuestionConfig {
  draggableItems: Array<{
    id: string;
    content: string;
    type: string;
  }>;
  dropZones: Array<{
    id: string;
    label: string;
    acceptsTypes: string[];
    correctItems: string[];
  }>;
}

// H5P Matching Question
export interface H5PMatchingQuestion extends H5PQuestionConfig {
  leftItems: Array<{
    id: string;
    content: string;
    correctMatch: string;
  }>;
  rightItems: Array<{
    id: string;
    content: string;
  }>;
}

// H5P Sorting Question
export interface H5PSortingQuestion extends H5PQuestionConfig {
  items: Array<{
    id: string;
    content: string;
  }>;
  correctOrder: string[];
}
