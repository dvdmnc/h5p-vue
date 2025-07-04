/**
 * User-related type definitions
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'evaluator' | 'administrateur' | 'createur' | 'conseiller' | 'beneficiaire' | 'client';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  profile?: UserProfileSimple;
  preferences: UserPreferences;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  isActive: boolean;
  user?: User;
  permissions?: any[];
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    location?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en' | 'es';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    assessmentReminders?: boolean;
    progressUpdates?: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
  };
  assessment: {
    showHints: boolean;
    autoAdvance: boolean;
    timeLimit: boolean;
    allowAdaptive?: boolean;
    preferredDuration?: number;
  };
}

export interface UserProfileSimple {
  languages: Array<{
    code: string;
    name: string;
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    isNative: boolean;
  }>;
  skills: string[];
  accessibility: {
    needsTextToSpeech: boolean;
    needsHighContrast: boolean;
    preferredFontSize: 'small' | 'medium' | 'large';
    needsKeyboardNavigation: boolean;
    needsScreenReader: boolean;
    reducedMotion: boolean;
  };
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  organization?: string;
  position?: string;
  skills: string[];
  certifications: UserCertification[];
  assessmentHistory: AssessmentSummary[];
}

export interface UserCertification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  credentialId?: string;
  verificationUrl?: string;
}

export interface AssessmentSummary {
  id: string;
  title: string;
  type: string;
  completedAt: Date;
  score: number;
  maxScore: number;
  duration: number;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: User;
  session: UserSession;
  accessToken: string;
  refreshToken: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type UserRole = User['role'];
export type UserTheme = UserPreferences['theme'];
export type UserLanguage = UserPreferences['language'];
