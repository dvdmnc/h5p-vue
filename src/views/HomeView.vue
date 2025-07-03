<template>
  <AppLayout>
    <div class="relative overflow-hidden">
      <!-- Hero Section -->
      <div class="relative bg-gradient-to-br from-primary-50 to-blue-100">
        <div class="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
          <svg class="absolute inset-0 h-full w-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" class="text-primary-100 opacity-50" />
          </svg>
        </div>
        
        <div class="relative max-w-7xl mx-auto py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div class="lg:grid lg:grid-cols-12 lg:gap-8">
            <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 class="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
                <span class="block">Évaluez vos</span>
                <span class="block text-primary-600">compétences</span>
                <span class="block">avec H5P</span>
              </h1>
              
              <p class="mt-6 text-xl text-gray-500 sm:max-w-3xl">
                Une plateforme innovante pour créer, passer et analyser des évaluations interactives adaptées à vos besoins.
              </p>
              
              <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div v-if="!authStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4">
                  <router-link
                    to="/login"
                    class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Se connecter
                  </router-link>
                  <router-link
                    to="/assessment"
                    class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Essayer une démo
                  </router-link>
                </div>
                
                <div v-else class="flex flex-col sm:flex-row gap-4">
                  <router-link
                    to="/dashboard"
                    class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Accéder au tableau de bord
                  </router-link>
                  <router-link
                    to="/assessment"
                    class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Commencer une évaluation
                  </router-link>
                </div>
              </div>
            </div>
            
            <!-- Feature preview -->
            <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div class="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <div class="p-6 space-y-4">
                    <div class="flex items-center space-x-3">
                      <div class="h-4 w-4 bg-primary-500 rounded-full"></div>
                      <div class="h-3 bg-gray-200 rounded flex-1"></div>
                    </div>
                    <div class="space-y-2">
                      <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div class="h-8 bg-primary-100 rounded border-2 border-primary-200"></div>
                      <div class="h-8 bg-gray-100 rounded border-2 border-gray-200"></div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                      <div class="text-xs text-gray-500">Question 1/5</div>
                      <div class="h-6 w-16 bg-primary-500 rounded text-xs text-white flex items-center justify-center">
                        Suivant
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-base text-primary-600 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
            <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              Une plateforme complète d'évaluation
            </p>
            <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Créez, gérez et analysez vos évaluations avec des outils modernes et intuitifs.
            </p>
          </div>

          <div class="mt-20">
            <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <!-- Feature 1 -->
              <div class="text-center">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 class="mt-6 text-lg leading-6 font-medium text-gray-900">Questions interactives</h3>
                <p class="mt-2 text-base text-gray-500">
                  Créez des QCM, glisser-déposer, textes à trous et autres types de questions engageantes avec H5P.
                </p>
              </div>

              <!-- Feature 2 -->
              <div class="text-center">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 class="mt-6 text-lg leading-6 font-medium text-gray-900">Évaluation adaptative</h3>
                <p class="mt-2 text-base text-gray-500">
                  L'algorithme adapte automatiquement la difficulté des questions en fonction des performances.
                </p>
              </div>

              <!-- Feature 3 -->
              <div class="text-center">
                <div class="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 class="mt-6 text-lg leading-6 font-medium text-gray-900">Analyses détaillées</h3>
                <p class="mt-2 text-base text-gray-500">
                  Obtenez des rapports complets sur les performances et identifiez les axes d'amélioration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-primary-600 py-16">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-white mb-4">
            Prêt à évaluer vos compétences ?
          </h2>
          <p class="text-xl text-primary-100 mb-8">
            Commencez dès maintenant votre évaluation personnalisée
          </p>
          <router-link to="/assessment" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition-colors">
            Commencer maintenant
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import AppLayout from '../components/layout/AppLayout.vue'

const authStore = useAuthStore()
</script>
