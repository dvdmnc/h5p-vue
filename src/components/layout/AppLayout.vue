<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and primary navigation -->
          <div class="flex items-center space-x-8">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">Check Compétences</span>
            </router-link>
            
            <!-- Main Navigation -->
            <div v-if="authStore.isAuthenticated" class="hidden md:flex space-x-8">
              <router-link
                to="/dashboard"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/dashboard'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Tableau de bord
              </router-link>
              
              <router-link
                v-if="authStore.canTakeAssessments"
                to="/assessment"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/assessment'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Évaluations
              </router-link>
              
              <router-link
                v-if="authStore.isCreator"
                to="/creator"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/creator'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Créateur
              </router-link>
              
              <router-link
                to="/results"
                v-if="authStore.canViewResults"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/results'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Résultats
              </router-link>
              
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/admin'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Administration
              </router-link>
              
              <router-link
                to="/h5p-demo"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/h5p-demo'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                Démo H5P
              </router-link>
              
              <router-link
                to="/h5p-standard"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                  $route.path === '/h5p-standard'
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                H5P Standard
              </router-link>
            </div>
          </div>
          
          <!-- User menu and actions -->
          <div class="flex items-center space-x-4">
            <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-4">
              <router-link
                to="/login"
                class="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                Se connecter
              </router-link>
            </div>
            
            <div v-else class="flex items-center space-x-4">
              <!-- User info -->
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">
                    {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">
                    {{ authStore.user?.role }}
                  </p>
                </div>
                <div class="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-gray-700">
                    {{ authStore.user?.firstName?.charAt(0) }}{{ authStore.user?.lastName?.charAt(0) }}
                  </span>
                </div>
              </div>
              
              <!-- Logout button -->
              <button
                @click="handleLogout"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                title="Se déconnecter"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            
            <!-- Mobile menu button -->
            <button
              v-if="authStore.isAuthenticated"
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen && authStore.isAuthenticated" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-gray-50">
          <router-link
            to="/dashboard"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/dashboard'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Tableau de bord
          </router-link>
          
          <router-link
            v-if="authStore.canTakeAssessments"
            to="/assessment"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/assessment'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Évaluations
          </router-link>
          
          <router-link
            v-if="authStore.isCreator"
            to="/creator"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/creator'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Créateur
          </router-link>
          
          <router-link
            v-if="authStore.canViewResults"
            to="/results"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/results'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Résultats
          </router-link>
          
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/admin'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Administration
          </router-link>
          
          <router-link
            to="/h5p-demo"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/h5p-demo'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            Démo H5P
          </router-link>
          
          <router-link
            to="/h5p-standard"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors',
              $route.path === '/h5p-standard'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            H5P Standard
          </router-link>
        </div>
      </div>
    </nav>
    
    <!-- Main content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">
            © 2024 Check Compétences. Tous droits réservés.
          </p>
          <div class="flex space-x-6">
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">
              Aide
            </a>
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">
              Confidentialité
            </a>
            <a href="#" class="text-sm text-gray-500 hover:text-gray-700">
              Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>
