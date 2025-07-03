<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Access Control: Only certain roles can view results -->
    <div v-if="!authStore.canViewResults" class="unauthorized-message bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto mt-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Accès non autorisé</h3>
      <p class="mt-1 text-sm text-gray-500">
        Vous n'avez pas l'autorisation de consulter les résultats. 
        {{ 
          authStore.userRole === 'beneficiaire' ? 'Les bénéficiaires peuvent consulter leurs propres résultats depuis le tableau de bord.' :
          'Seuls les créateurs, conseillers et administrateurs peuvent consulter les résultats.'
        }}
      </p>
      <div class="mt-6">
        <router-link to="/dashboard" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
          Retour au tableau de bord
        </router-link>
      </div>
    </div>

    <!-- Main Results View (only for authorized roles) -->
    <div v-else>
      <!-- Role-specific header text -->
      <div class="bg-primary-600 text-white py-4 mb-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-lg font-medium">
            {{
              authStore.userRole === 'createur' ? 'Résultats des évaluations que vous avez créées' :
              authStore.userRole === 'conseiller' ? 'Résultats pour accompagner vos bénéficiaires' :
              authStore.userRole === 'administrateur' ? 'Vue d\'ensemble de tous les résultats' :
              authStore.userRole === 'client' ? 'Rapports agrégés pour votre organisation' :
              'Résultats des évaluations'
            }}
          </h2>
          <p class="text-primary-100 text-sm">
            {{
              authStore.userRole === 'createur' ? 'Analysez les performances de vos évaluations et optimisez-les' :
              authStore.userRole === 'conseiller' ? 'Interprétez les résultats pour proposer des parcours personnalisés' :
              authStore.userRole === 'administrateur' ? 'Gérez et supervisez l\'ensemble des évaluations' :
              authStore.userRole === 'client' ? 'Consultez les statistiques de performance de votre organisation' :
              'Consultez et analysez les résultats'
            }}
          </p>
        </div>
      </div>

      <!-- En-tête avec retour -->
      <div class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center space-x-4">
              <router-link 
                to="/dashboard" 
                class="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au tableau de bord
              </router-link>
              <div class="h-6 w-px bg-gray-300"></div>
              <h1 class="text-xl font-bold text-gray-900">Résultats des évaluations</h1>
            </div>
            
            <div class="flex items-center space-x-3">
              <button
                @click="exportResults"
                :disabled="!filteredResults.length"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter PDF
            </button>
            <button
              @click="refreshResults"
              class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Statistiques rapides -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Total évaluations</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.totalAssessments }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Terminées</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.completedAssessments }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Score moyen</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.averageScore }}%</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow-sm rounded-lg border">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-500">Participants</p>
                  <p class="text-2xl font-bold text-gray-900">{{ summary.totalParticipants }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="bg-white shadow-sm rounded-lg border p-6 mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select v-model="filters.period" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="all">Toutes les périodes</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select v-model="filters.status" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminé</option>
              <option value="in-progress">En cours</option>
              <option value="abandoned">Abandonné</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Évaluation</label>
            <select v-model="filters.assessmentId" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
              <option value="all">Toutes les évaluations</option>
              <option v-for="assessment in assessments" :key="assessment.id" :value="assessment.id">
                {{ assessment.title }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Score minimum (%)</label>
            <input
              v-model.number="filters.minScore"
              type="number"
              min="0"
              max="100"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
          </div>
          
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>

      <!-- Tableau des résultats -->
      <div class="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Historique des évaluations
              <span class="ml-2 text-sm font-normal text-gray-500">
                ({{ filteredResults.length }} résultat{{ filteredResults.length > 1 ? 's' : '' }})
              </span>
            </h3>
            <div class="flex items-center space-x-3">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                <svg class="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <select v-model="sortBy" class="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
                <option value="date">Trier par date</option>
                <option value="score">Trier par score</option>
                <option value="title">Trier par titre</option>
                <option value="participant">Trier par participant</option>
              </select>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 hover:bg-primary-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </div>
        </div>

        <div v-else-if="!filteredResults.length" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun résultat</h3>
          <p class="mt-1 text-sm text-gray-500">Aucune évaluation ne correspond aux critères sélectionnés.</p>
          <div class="mt-6">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Effacer les filtres
            </button>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Évaluation
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temps
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="result in paginatedResults" :key="result.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-700">
                          {{ result.participantName?.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ result.participantName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ result.participantEmail }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ result.assessmentTitle }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ result.category }}
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(result.completedAt) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">
                      {{ result.score }}%
                    </div>
                    <div class="ml-2 flex-shrink-0">
                      <div class="flex items-center justify-center h-6 w-12 rounded-full text-xs font-medium"
                           :class="getScoreClasses(result.score || 0)">
                        {{ getScoreGrade(result.score || 0) }}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">                   {{ formatDuration(result.duration || 0) }}
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClasses(result.status || 'unknown')">
                    {{ getStatusText(result.status || 'unknown') }}
                  </span>
                </td>
                
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewDetails(result)"
                      class="text-primary-600 hover:text-primary-900 transition-colors"
                      title="Voir les détails"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="downloadResult(result)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Télécharger"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredResults.length > itemsPerPage" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage > 1 && (currentPage -= 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              @click="currentPage < totalPages && (currentPage += 1)"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                à
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredResults.length) }}</span>
                sur
                <span class="font-medium">{{ filteredResults.length }}</span>
                résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="currentPage > 1 && (currentPage -= 1)"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Précédent</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <template v-for="page in visiblePages" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="currentPage = typeof page === 'number' ? page : currentPage"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                </template>
                
                <button
                  @click="currentPage < totalPages && (currentPage += 1)"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Suivant</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de détails des résultats -->
    </div>
    <!-- End of authorized content -->

    <DetailedResultsModal
      v-if="showModal && selectedResult"
      :result="selectedResult"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAssessmentStore } from '@/stores/assessment';
import { useAuthStore } from '@/stores/auth';
import type { AssessmentResult, DifficultyLevel } from '@/types/assessment';
import DetailedResultsModal from '@/components/Assessment/DetailedResultsModal.vue';

// Stores
const assessmentStore = useAssessmentStore();
const authStore = useAuthStore();

// State
const loading = ref(false);
const selectedResult = ref<AssessmentResult | null>(null);
const showModal = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const searchQuery = ref('');
const sortBy = ref('date');
const sortDirection = ref<'asc' | 'desc'>('desc');

// Demo assessment data
const assessments = ref([
  { id: '1', title: 'Compétences numériques', category: 'Numérique' },
  { id: '2', title: 'Français - Communication écrite', category: 'Français' },
  { id: '3', title: 'Mathématiques de base', category: 'Mathématiques' },
  { id: '4', title: 'Compétences transversales', category: 'Soft skills' }
]);

// Filters
const filters = ref({
  period: 'all',
  status: 'all',
  assessmentId: 'all',
  minScore: null as number | null
});

// Fetch results or use store data
const results = ref<AssessmentResult[]>(assessmentStore.results);

// Computed properties
const totalParticipants = computed(() => {
  const uniqueUserIds = new Set(results.value.map(r => r.userId));
  return uniqueUserIds.size;
});

const summary = computed(() => {
  const completedResults = filteredResults.value.filter(r => r.status === 'completed');
  return {
    totalAssessments: filteredResults.value.length,
    completedAssessments: completedResults.length,
    averageScore: completedResults.length > 0 
      ? Math.round(completedResults.reduce((sum, r) => sum + (r.score || 0), 0) / completedResults.length)
      : 0,
    averageTime: completedResults.length > 0
      ? Math.round(completedResults.reduce((sum, r) => sum + (r.duration || 0), 0) / completedResults.length / 60)
      : 0,
    successRate: completedResults.length > 0
      ? Math.round(completedResults.filter(r => (r.score || 0) >= 70).length / completedResults.length * 100)
      : 0,
    totalParticipants: totalParticipants.value
  };
});

const filteredResults = computed(() => {
  return results.value
    .filter(result => {
      // Search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const matches = 
          result.participantName?.toLowerCase().includes(query) ||
          result.participantEmail?.toLowerCase().includes(query) ||
          result.assessmentTitle?.toLowerCase().includes(query);
        
        if (!matches) return false;
      }
      
      // Filter by status
      if (filters.value.status !== 'all' && result.status !== filters.value.status) {
        return false;
      }
      
      // Filter by assessment
      if (filters.value.assessmentId !== 'all' && result.assessmentId !== filters.value.assessmentId) {
        return false;
      }
      
      // Filter by minimum score
      if (filters.value.minScore !== null && (result.score || 0) < filters.value.minScore) {
        return false;
      }
      
      // Filter by period
      if (filters.value.period !== 'all') {
        const now = new Date();
        const resultDate = new Date(result.completedAt);
        
        switch (filters.value.period) {
          case 'week':
            if (now.getTime() - resultDate.getTime() > 7 * 24 * 60 * 60 * 1000) return false;
            break;
          case 'month':
            if (now.getTime() - resultDate.getTime() > 30 * 24 * 60 * 60 * 1000) return false;
            break;
          case 'quarter':
            if (now.getTime() - resultDate.getTime() > 90 * 24 * 60 * 60 * 1000) return false;
            break;
          case 'year':
            if (now.getTime() - resultDate.getTime() > 365 * 24 * 60 * 60 * 1000) return false;
            break;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      const factor = sortDirection.value === 'desc' ? -1 : 1;
      
      switch (sortBy.value) {
        case 'date':
          return factor * (new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        case 'score':
          return factor * ((b.score || 0) - (a.score || 0));
        case 'title':
          return factor * (a.assessmentTitle?.localeCompare(b.assessmentTitle || '') || 0);
        case 'participant':
          return factor * (a.participantName?.localeCompare(b.participantName || '') || 0);
        default:
          return 0;
      }
    });
});

const totalPages = computed(() => Math.ceil(filteredResults.value.length / itemsPerPage.value));

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredResults.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const totalPagesCount = totalPages.value;
  
  if (totalPagesCount <= 7) {
    for (let i = 1; i <= totalPagesCount; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (currentPage.value > 3) {
      pages.push('...');
    }
    
    const startPage = Math.max(2, currentPage.value - 1);
    const endPage = Math.min(totalPagesCount - 1, currentPage.value + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    if (currentPage.value < totalPagesCount - 2) {
      pages.push('...');
    }
    
    pages.push(totalPagesCount);
  }
  
  return pages;
});

// Methods
const applyFilters = () => {
  // Filters are reactive, no need to do anything specific
  currentPage.value = 1; // Reset to first page when filters change
};

const clearFilters = () => {
  filters.value = {
    period: 'all',
    status: 'all',
    assessmentId: 'all',
    minScore: null
  };
  searchQuery.value = '';
  currentPage.value = 1;
};

const refreshResults = async () => {
  loading.value = true;
  
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, we'll refresh with mock data
    if (results.value.length === 0) {
      loadDemoData();
    }
  } catch (error) {
    console.error('Error refreshing results:', error);
  } finally {
    loading.value = false;
  }
};

const viewDetails = (result: AssessmentResult) => {
  selectedResult.value = result;
  showModal.value = true;
  console.log('Opening details for result:', result.id);
};

const closeModal = () => {
  showModal.value = false;
  selectedResult.value = null;
};

const downloadResult = (result: AssessmentResult) => {
  alert(`Téléchargement du résultat pour ${result.participantName} (ID: ${result.id})`);
  // In a real app, this would generate and download a PDF or other document
};

const exportResults = () => {
  alert('Export des résultats en PDF en cours de développement');
  // In a real app, this would generate a PDF report of filtered results
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

const getScoreClasses = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-800';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getScoreGrade = (score: number) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'abandoned':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in-progress':
      return 'En cours';
    case 'abandoned':
      return 'Abandonné';
    default:
      return 'Inconnu';
  }
};

const loadDemoData = () => {
  const mockResults = generateMockResults();
  results.value = mockResults;
};

const generateMockResults = () => {
  // Generate 20 mock assessment results
  const mockResults = [];
  
  const statuses = ['completed', 'in-progress', 'abandoned'];
  const userNames = [
    'Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Dubois', 
    'Thomas Robert', 'Julie Richard', 'Nicolas Petit', 'Camille Durand'
  ];
  
  for (let i = 0; i < 20; i++) {
    const randomUserIndex = Math.floor(Math.random() * userNames.length);
    const randomUser = userNames[randomUserIndex];
    const [firstName, lastName] = randomUser.split(' ');
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    const randomAssessmentIndex = Math.floor(Math.random() * assessments.value.length);
    const assessment = assessments.value[randomAssessmentIndex];
    
    const randomStatus = statuses[Math.floor(Math.random() * (i < 15 ? 1 : statuses.length))] as 'completed' | 'in-progress' | 'abandoned';
    const score = randomStatus === 'completed' ? Math.floor(Math.random() * 101) : 0;
    
    const daysAgo = Math.floor(Math.random() * 90);
    const completedAt = new Date();
    completedAt.setDate(completedAt.getDate() - daysAgo);
    
    const duration = Math.floor(Math.random() * 1800) + 300; // 5-35 minutes
    
    mockResults.push({
      id: `result-${i + 1}`,
      userId: `user-${randomUserIndex + 1}`,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      category: assessment.category,
      participantName: randomUser,
      participantEmail: email,
      score,
      duration,
      completedAt,
      status: randomStatus,
      questions: [],
      totalScore: score,
      maxScore: 100,
      percentage: score,
      timeTotal: duration,
      adaptiveLevel: 'moyen' as DifficultyLevel,
      questionnaire: assessment.title
    });
  }
  
  return mockResults;
};

// Lifecycle hooks
onMounted(() => {
  // Check if we have any results already in the store
  if (results.value.length === 0) {
    loading.value = true;
    
    // Simulate API call delay
    setTimeout(() => {
      loadDemoData();
      loading.value = false;
    }, 1000);
  }
});
</script>
