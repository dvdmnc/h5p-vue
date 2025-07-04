import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Import views
import HomeView from '@/views/HomeView.vue';
import AssessmentView from '@/views/AssessmentView.vue';
import CreatorView from '@/views/CreatorView.vue';

// Define routes
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Accueil - Check Compétences',
      description: 'Évaluez vos compétences de base avec notre plateforme interactive',
    },
  },
  {
    path: '/assessment',
    name: 'Assessment',
    component: AssessmentView,
    meta: {
      title: 'Évaluation - Check Compétences',
      description: 'Passez votre évaluation de compétences interactive',
      requiresAuth: false, // Set to true in production
    },
  },
  {
    path: '/creator',
    name: 'Creator',
    component: CreatorView,
    meta: {
      title: 'Créateur de Questions - Check Compétences',
      description: 'Créez des questions interactives avec H5P',
      requiresAuth: true, // Enable auth requirement
      roles: ['createur'], // Only creators can access content creation
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Connexion - Check Compétences',
      description: 'Connectez-vous à votre compte',
      layout: 'auth',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: 'Tableau de Bord - Check Compétences',
      description: 'Votre tableau de bord personnel',
      requiresAuth: true,
    },
  },
  {
    path: '/results',
    name: 'Results',
    component: () => import('@/views/ResultsView.vue'),
    meta: {
      title: 'Résultats - Check Compétences',
      description: 'Consultez tous les résultats d\'évaluation',
      requiresAuth: true,
    },
  },
  {
    path: '/results/:id',
    name: 'ResultDetail',
    component: () => import('@/views/ResultsView.vue'),
    props: true,
    meta: {
      title: 'Détail du Résultat - Check Compétences',
      description: 'Consultez le détail d\'un résultat d\'évaluation',
      requiresAuth: true,
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: {
      title: 'Administration - Check Compétences',
      description: 'Interface d\'administration',
      requiresAuth: true,
      roles: ['administrateur'],
    },
    children: [
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          title: 'Gestion des Utilisateurs',
        },
      },
      {
        path: 'questions',
        name: 'AdminQuestions',
        component: () => import('@/views/admin/QuestionsView.vue'),
        meta: {
          title: 'Gestion des Questions',
        },
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: () => import('@/views/admin/AnalyticsView.vue'),
        meta: {
          title: 'Analyses et Statistiques',
        },
      },
      {
        path: 'sessions',
        name: 'AdminSessions',
        component: () => import('@/views/admin/SessionsView.vue'),
        meta: {
          title: 'Gestion des Sessions Présentielles',
        },
      },
      {
        path: 'workflow',
        name: 'AdminWorkflow',
        component: () => import('@/views/admin/WorkflowView.vue'),
        meta: {
          title: 'Workflow des Questions',
        },
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/SettingsView.vue'),
        meta: {
          title: 'Paramètres Système',
        },
      },
    ],
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: 'Mon Profil - Check Compétences',
      description: 'Gérez votre profil et vos préférences',
      requiresAuth: true,
    },
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('@/views/HelpView.vue'),
    meta: {
      title: 'Aide - Check Compétences',
      description: 'Centre d\'aide et documentation',
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'À Propos - Check Compétences',
      description: 'En savoir plus sur notre mission',
    },
  },
  {
    path: '/h5p-demo',
    name: 'H5PDemo',
    component: () => import('@/views/H5PDemoView.vue'),
    meta: {
      title: 'Démonstration H5P + Vue.js - Check Compétences',
      description: 'Démonstration de l\'encapsulation H5P dans des composants Vue.js',
    },
  },
  {
    path: '/h5p-standard',
    name: 'H5PStandard',
    component: () => import('@/components/H5P/H5PStandardDemo.vue'),
    meta: {
      title: 'H5P Standard Demo - Check Compétences',
      description: 'Standard H5P integration test',
    },
  },
  // Error routes
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/errors/UnauthorizedView.vue'),
    meta: {
      title: 'Accès Non Autorisé',
      layout: 'minimal',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFoundView.vue'),
    meta: {
      title: 'Page Non Trouvée',
      layout: 'minimal',
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// Global navigation guards
router.beforeEach(async (to, _from, next) => {
  // Import auth store dynamically to avoid circular dependencies
  const { useAuthStore } = await import('@/stores/auth');
  const authStore = useAuthStore();

  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  // Update meta description
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', to.meta.description as string);
  }

  // Check authentication requirements
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Try to initialize auth from stored token
      const initialized = await authStore.initializeAuth();
      if (!initialized) {
        next({
          name: 'Login',
          query: { redirect: to.fullPath },
        });
        return;
      }
    }

    // Check role requirements
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = authStore.userRole;
      if (!userRole) {
        console.log('Access denied: No user role');
        next({ name: 'Unauthorized' });
        return;
      }
      
      // Special case for Results - allow if isAuthenticated
      if (to.name === 'Results' || to.name === 'ResultDetail') {
        console.log('Allowing access to Results page for authenticated user with role:', userRole);
        if (authStore.isAuthenticated) {
          next();
          return;
        }
      }
      
      // Regular role check for other routes
      if (!to.meta.roles.includes(userRole)) {
        console.log('Access denied for role', userRole, 'required roles:', to.meta.roles);
        next({ name: 'Unauthorized' });
        return;
      }
    }
  }

  // Redirect authenticated users away from auth pages
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

// After each route change
router.afterEach((to, from) => {
  // Analytics tracking
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: to.meta.title,
      page_location: window.location.href,
    });
  }

  // Log navigation for debugging
  if (import.meta.env.DEV) {
    console.log(`Navigation: ${String(from.name)} -> ${String(to.name)}`);
  }
});

// Handle router errors
router.onError((error) => {
  console.error('Router error:', error);
  
  // In production, you might want to send this to an error tracking service
  if (import.meta.env.PROD) {
    // Sentry.captureException(error);
  }
});

export default router;
