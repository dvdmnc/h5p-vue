import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, UserSession, UserPreferences } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  // State
  const currentUser = ref<User | null>(null);
  const session = ref<UserSession | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const isAuthenticated = computed(() => currentUser.value !== null);
  const user = computed(() => currentUser.value); // Alias for compatibility
  const userRole = computed(() => currentUser.value?.role);
  const isAdmin = computed(() => userRole.value === 'administrateur');
  const isCreator = computed(() => userRole.value === 'createur');
  const isConseiller = computed(() => userRole.value === 'conseiller');
  const isBeneficiaire = computed(() => userRole.value === 'beneficiaire');
  const isClient = computed(() => userRole.value === 'client');
  
  // WHO CAN TAKE ASSESSMENTS: Only Bénéficiaires (the main target users)
  const canTakeAssessments = computed(() => userRole.value === 'beneficiaire');
  
  // WHO CAN CREATE/MANAGE ASSESSMENTS: Only Creators (their main job) - Admins manage system, not content
  const canCreateAssessments = computed(() => userRole.value === 'createur');
  
  // WHO CAN VIEW REPORTS: Conseillers (guidance), Admins (oversight), Clients (mandating)
  const canViewReports = computed(() => ['conseiller', 'administrateur', 'client'].includes(userRole.value || ''));
  
  // WHO CAN MANAGE CONTENT: Only Creators (their specialty) - Admins manage users/system, not content
  const canManageContent = computed(() => userRole.value === 'createur');
  
  // WHO CAN MANAGE USERS: Only Admins (access and role management)
  const canManageUsers = computed(() => userRole.value === 'administrateur');
  
  // WHO CAN COUNSEL/GUIDE: Only Conseillers (their main role)
  const canCounselUsers = computed(() => userRole.value === 'conseiller');

  // Permission checking methods
  const hasPermission = (resource: string, action: string): boolean => {
    if (!session.value || !session.value.permissions) return false;
    
    const permission = session.value.permissions.find((p: any) => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  };

  const canTakeAssessment = computed(() => hasPermission('assessment', 'take'));
  const canCreateAssessment = computed(() => hasPermission('assessment', 'create'));
  const canViewResults = computed(() => hasPermission('results', 'read'));

  // Actions
  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    isLoading.value = true;
    error.value = null;

    try {
      // Simulation d'une API call
      const response = await mockLogin(credentials.email, credentials.password);
      
      currentUser.value = response.user;
      session.value = response.session;
      
      // Sauvegarder le token et le rôle dans localStorage ou sessionStorage
      const storage = credentials.remember ? localStorage : sessionStorage;
      storage.setItem('auth_token', response.session.token);
      if (response.session.refreshToken) {
        storage.setItem('refresh_token', response.session.refreshToken);
      }
      localStorage.setItem('user_role', response.user.role); // Store role for future validations
      
      return response;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    try {
      // Clear tokens from both storages
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('refresh_token');
      
      // Reset state
      currentUser.value = null;
      session.value = null;
      error.value = null;
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    try {
      // Simulation API call
      const response = await mockRefreshToken(refreshToken);
      session.value = response.session;
      localStorage.setItem('auth_token', response.session.token);
      return response.session;
    } catch (err) {
      await logout();
      throw err;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser.value) return;

    isLoading.value = true;
    try {
      // Simulation API call
      const updatedUser = await mockUpdateProfile(currentUser.value.id, updates);
      currentUser.value = { ...currentUser.value, ...updatedUser };
      return updatedUser;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de mise à jour';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!currentUser.value) return;

    try {
      const updatedPreferences = await mockUpdatePreferences(currentUser.value.id, preferences);
      currentUser.value.preferences = { ...currentUser.value.preferences, ...updatedPreferences };
      return updatedPreferences;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de mise à jour des préférences';
      throw err;
    }
  };

  const initializeAuth = async () => {
    // Check both localStorage and sessionStorage for tokens
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!token) return false;

    try {
      // Valider le token et récupérer l'utilisateur
      const response = await mockValidateToken(token);
      currentUser.value = response.user;
      session.value = response.session;
      return true;
    } catch (err) {
      await logout();
      return false;
    }
  };

  return {
    // State
    currentUser,
    user, // Alias for compatibility
    session,
    isLoading,
    error,
    // Computed
    isAuthenticated,
    userRole,
    isAdmin,
    isCreator,
    isConseiller,
    isBeneficiaire,
    isClient,
    canTakeAssessments,
    canCreateAssessments,
    canViewReports,
    canManageContent,
    canManageUsers,
    canCounselUsers,
    canTakeAssessment,
    canCreateAssessment,
    canViewResults,
    // Actions
    login,
    logout,
    refreshToken,
    updateProfile,
    updatePreferences,
    initializeAuth,
    hasPermission,
  };
});

// Fonctions mock pour simuler les appels API
const demoAccounts = {
  'admin@demo.com': {
    user: {
      id: 'admin-1',
      firstName: 'Marc',
      lastName: 'Administrateur',
      email: 'admin@demo.com',
      role: 'administrateur' as const,
      profile: {
        languages: [{ code: 'fr', name: 'Français', level: 'C2' as const, isNative: true }],
        skills: ['administration', 'gestion-systeme', 'supervision'],
        accessibility: {
          needsTextToSpeech: false,
          needsHighContrast: false,
          preferredFontSize: 'medium' as const,
          needsKeyboardNavigation: false,
          needsScreenReader: false,
          reducedMotion: false
        }
      },
      preferences: {
        language: 'fr' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: false,
          push: true,
          assessmentReminders: false,
          progressUpdates: false
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium' as const,
          reducedMotion: false
        },
        assessment: {
          showHints: true,
          autoAdvance: false,
          timeLimit: true,
          allowAdaptive: true,
          preferredDuration: 30
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true
    },
    password: 'admin123'
  },
  'conseiller@demo.com': {
    user: {
      id: 'conseiller-1',
      firstName: 'Nadine',
      lastName: 'Conseillère',
      email: 'conseiller@demo.com',
      role: 'conseiller' as const,
      profile: {
        languages: [{ code: 'fr', name: 'Français', level: 'C2' as const, isNative: true }],
        skills: ['accompagnement', 'orientation', 'interpretation-resultats'],
        accessibility: {
          needsTextToSpeech: false,
          needsHighContrast: false,
          preferredFontSize: 'medium' as const,
          needsKeyboardNavigation: false,
          needsScreenReader: false,
          reducedMotion: false
        }
      },
      preferences: {
        language: 'fr' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: false,
          push: true,
          assessmentReminders: true,
          progressUpdates: true
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium' as const,
          reducedMotion: false
        },
        assessment: {
          showHints: true,
          autoAdvance: false,
          timeLimit: true,
          allowAdaptive: true,
          preferredDuration: 30
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true
    },
    password: 'conseiller123'
  },
  'createur@demo.com': {
    user: {
      id: 'createur-1',
      firstName: 'Myriam',
      lastName: 'Créatrice',
      email: 'createur@demo.com',
      role: 'createur' as const,
      profile: {
        languages: [{ code: 'fr', name: 'Français', level: 'C2' as const, isNative: true }],
        skills: ['creation-contenu', 'pedagogie', 'evaluation'],
        accessibility: {
          needsTextToSpeech: false,
          needsHighContrast: false,
          preferredFontSize: 'medium' as const,
          needsKeyboardNavigation: false,
          needsScreenReader: false,
          reducedMotion: false
        }
      },
      preferences: {
        language: 'fr' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: false,
          push: true,
          assessmentReminders: false,
          progressUpdates: true
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium' as const,
          reducedMotion: false
        },
        assessment: {
          showHints: true,
          autoAdvance: false,
          timeLimit: true,
          allowAdaptive: true,
          preferredDuration: 45
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true
    },
    password: 'createur123'
  },
  'beneficiaire@demo.com': {
    user: {
      id: 'beneficiaire-1',
      firstName: 'Sara',
      lastName: 'Bénéficiaire',
      email: 'beneficiaire@demo.com',
      role: 'beneficiaire' as const,
      profile: {
        languages: [{ code: 'fr', name: 'Français', level: 'B2' as const, isNative: true }],
        skills: ['recherche-emploi', 'competences-base'],
        accessibility: {
          needsTextToSpeech: false,
          needsHighContrast: false,
          preferredFontSize: 'large' as const,
          needsKeyboardNavigation: false,
          needsScreenReader: false,
          reducedMotion: false
        }
      },
      preferences: {
        language: 'fr' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: true,
          push: true,
          assessmentReminders: true,
          progressUpdates: true
        },
        accessibility: {
          highContrast: false,
          fontSize: 'large' as const,
          reducedMotion: false
        },
        assessment: {
          showHints: true,
          autoAdvance: true,
          timeLimit: false,
          allowAdaptive: true,
          preferredDuration: 20
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true
    },
    password: 'beneficiaire123'
  },
  'client@demo.com': {
    user: {
      id: 'client-1',
      firstName: 'Catherine',
      lastName: 'Cliente RH',
      email: 'client@demo.com',
      role: 'client' as const,
      profile: {
        languages: [{ code: 'fr', name: 'Français', level: 'C2' as const, isNative: true }],
        skills: ['gestion-rh', 'pilotage-strategic', 'analyse-donnees'],
        accessibility: {
          needsTextToSpeech: false,
          needsHighContrast: false,
          preferredFontSize: 'medium' as const,
          needsKeyboardNavigation: false,
          needsScreenReader: false,
          reducedMotion: false
        }
      },
      preferences: {
        language: 'fr' as const,
        theme: 'light' as const,
        notifications: {
          email: true,
          sms: false,
          push: false,
          assessmentReminders: false,
          progressUpdates: false
        },
        accessibility: {
          highContrast: false,
          fontSize: 'medium' as const,
          reducedMotion: false
        },
        assessment: {
          showHints: false,
          autoAdvance: false,
          timeLimit: true,
          allowAdaptive: true,
          preferredDuration: 30
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isActive: true
    },
    password: 'client123'
  }
};

async function mockLogin(email: string, password: string): Promise<{ user: User, session: UserSession }> {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check demo accounts
  const demoAccount = demoAccounts[email as keyof typeof demoAccounts];
  if (demoAccount && demoAccount.password === password) {
    // Permissions basées sur le rôle - EXACT MAPPING TO PERSONAS
    let permissions = [];
    if (demoAccount.user.role === 'administrateur') {
      // ADMINISTRATEUR: Gérer accès, rôles, taux de complétion, extractions
      permissions = [
        { resource: 'assessment', actions: ['read', 'create', 'update', 'delete', 'manage'] }, // NO 'take' - admins don't take assessments
        { resource: 'user', actions: ['read', 'create', 'update', 'delete'] }, // Gérer les accès et les rôles
        { resource: 'question', actions: ['read', 'create', 'update', 'delete'] },
        { resource: 'results', actions: ['read', 'export', 'manage'] }, // Suivre taux de complétion, extractions
        { resource: 'analytics', actions: ['read', 'export'] }, // Suivre les usages et scores
        { resource: 'system', actions: ['read', 'update'] },
        { resource: 'profile', actions: ['read', 'update'] }
      ];
    } else if (demoAccount.user.role === 'createur') {
      // CRÉATEUR: Créer activités pédagogiques, organiser playlists, gérer contenu
      permissions = [
        { resource: 'assessment', actions: ['read', 'create', 'update', 'delete'] }, // NO 'take' - creators don't take assessments, they CREATE them
        { resource: 'question', actions: ['read', 'create', 'update', 'delete'] }, // Créer des activités pédagogiques diversifiées
        { resource: 'playlist', actions: ['read', 'create', 'update', 'delete'] }, // Organiser les playlists de test
        { resource: 'content', actions: ['read', 'create', 'update', 'delete'] }, // Gérer mises à jour du contenu
        { resource: 'results', actions: ['read', 'export'] }, // View results to improve content
        { resource: 'profile', actions: ['read', 'update'] }
      ];
    } else if (demoAccount.user.role === 'conseiller') {
      // CONSEILLER: Visualiser résultats, identifier compétences, suggérer parcours
      permissions = [
        { resource: 'assessment', actions: ['read'] }, // Can view assessments but not create them
        { resource: 'results', actions: ['read', 'export', 'interpret'] }, // Visualiser rapidement les résultats
        { resource: 'user', actions: ['read'] }, // See beneficiaries they counsel
        { resource: 'recommendations', actions: ['read', 'create'] }, // Suggérer des parcours adaptés
        { resource: 'competencies', actions: ['read', 'analyze'] }, // Identifier compétences manquantes
        { resource: 'profile', actions: ['read', 'update'] }
      ];
    } else if (demoAccount.user.role === 'client') {
      // CLIENT: Envoyer bénéficiaires, recevoir rapports agrégés, prouver impact
      permissions = [
        { resource: 'reports', actions: ['read', 'export'] }, // Recevoir des rapports agrégés
        { resource: 'results', actions: ['read', 'export'] }, // Aggregated results only
        { resource: 'mandate', actions: ['create'] }, // Envoyer des bénéficiaires sur la plateforme
        { resource: 'compliance', actions: ['read', 'export'] }, // Prouver l'impact ou la conformité
        { resource: 'profile', actions: ['read', 'update'] }
      ];
    } else {
      // BÉNÉFICIAIRE: Identifier compétences, parcours clair, comprendre résultats
      permissions = [
        { resource: 'assessment', actions: ['read', 'take'] }, // Accéder à un parcours clair
        { resource: 'results', actions: ['read'] }, // Comprendre ses résultats
        { resource: 'competencies', actions: ['read'] }, // Identifier ses compétences réelles
        { resource: 'recommendations', actions: ['read'] }, // Savoir quoi faire ensuite
        { resource: 'profile', actions: ['read', 'update'] }
      ];
    }

    const mockSession: UserSession = {
      id: 'session-' + Date.now(),
      userId: demoAccount.user.id,
      user: demoAccount.user,
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      createdAt: new Date(),
      isActive: true,
      permissions,
    };

    return { user: demoAccount.user, session: mockSession };
  }

  // Fallback for any other credentials (for demo purposes)
  const mockUser: User = {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: email,
    role: 'beneficiaire',
    profile: {
      languages: [{ code: 'fr', name: 'Français', level: 'B1' as const, isNative: true }],
      skills: ['communication', 'numerique-base'],
      accessibility: {
        needsTextToSpeech: false,
        needsHighContrast: false,
        preferredFontSize: 'medium' as const,
        needsKeyboardNavigation: false,
        needsScreenReader: false,
        reducedMotion: false
      }
    },
    preferences: {
      language: 'fr' as const,
      theme: 'light' as const,
      notifications: {
        email: true,
        sms: false,
        push: true,
        assessmentReminders: true,
        progressUpdates: true
      },
      accessibility: {
        highContrast: false,
        fontSize: 'medium' as const,
        reducedMotion: false
      },
      assessment: {
        showHints: true,
        autoAdvance: true,
        timeLimit: false,
        allowAdaptive: true,
        preferredDuration: 20
      }
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    isActive: true
  };

  const mockSession: UserSession = {
    id: 'session-' + Date.now(),
    userId: mockUser.id,
    user: mockUser,
    token: 'mock_jwt_token_' + Date.now(),
    refreshToken: 'mock_refresh_token_' + Date.now(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    createdAt: new Date(),
    isActive: true,
    permissions: [
      { resource: 'assessment', actions: ['read', 'take'] },
      { resource: 'profile', actions: ['read', 'update'] },
    ],
  };

  if (password === 'wrong') {
    throw new Error('Identifiants incorrects');
  }

  return { user: mockUser, session: mockSession };
}

async function mockRefreshToken(refreshToken: string): Promise<{ session: UserSession }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newSession: UserSession = {
    id: 'session-' + Date.now(),
    userId: 'user-current', // Will be updated from current state
    user: {} as User, // Will be filled from current state
    token: 'new_mock_jwt_token_' + Date.now(),
    refreshToken: refreshToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    isActive: true,
    permissions: [],
  };

  return { session: newSession };
}

async function mockUpdateProfile(_userId: string, updates: Partial<User>): Promise<Partial<User>> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return updates;
}

async function mockUpdatePreferences(_userId: string, preferences: Partial<UserPreferences>): Promise<Partial<UserPreferences>> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return preferences;
}

async function mockValidateToken(_token: string): Promise<{ user: User, session: UserSession }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Pour la démo, on retourne un utilisateur valide basé sur le rôle stocké
  const storedRole = localStorage.getItem('user_role') || 'beneficiaire';
  
  if (storedRole === 'administrateur') {
    return mockLogin('admin@demo.com', 'admin123');
  } else if (storedRole === 'createur') {
    return mockLogin('createur@demo.com', 'createur123');
  } else if (storedRole === 'conseiller') {
    return mockLogin('conseiller@demo.com', 'conseiller123');
  } else if (storedRole === 'client') {
    return mockLogin('client@demo.com', 'client123');
  } else {
    return mockLogin('beneficiaire@demo.com', 'beneficiaire123');
  }
}
