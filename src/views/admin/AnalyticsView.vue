<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- En-tête avec filtres avancés -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Analytics Avancées</h1>
        <p class="mt-2 text-gray-600">
          Analyse approfondie des performances, corrélations et KPIs
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="calculateCorrelations"
          :disabled="isLoading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Recalculer
        </button>
        <button
          @click="exportData"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exporter
        </button>
      </div>
    </div>

    <!-- Filtres avancés -->
    <div class="bg-white p-6 rounded-lg shadow border">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres Avancés</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date début</label>
          <input
            v-model="filters.dateRange.start"
            type="date"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
          <input
            v-model="filters.dateRange.end"
            type="date"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Provenance</label>
          <select v-model="filters.provenance" multiple class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="Pôle Emploi">Pôle Emploi</option>
            <option value="Mission Locale">Mission Locale</option>
            <option value="AFPA">AFPA</option>
            <option value="CAP Emploi">CAP Emploi</option>
            <option value="Entreprise">Entreprise</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type session</label>
          <select v-model="filters.sessionType" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="both">Toutes</option>
            <option value="online">En ligne</option>
            <option value="presential">Présentiel</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Device</label>
          <select v-model="filters.deviceType" multiple class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablette</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>

    <!-- KPIs principaux -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Participants Total</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.totalParticipants }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux de Completion</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.completionRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Score Moyen</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.avgScore.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Taux No-Show</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.noShowRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Utilisation Salles</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.sessionUtilization.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analyse des pauses -->
    <div class="bg-white rounded-lg shadow border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Analyse des Pauses</h2>
        <p class="text-sm text-gray-600">Impact des pauses sur les performances</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-sm font-medium text-gray-600">Nombre moyen de pauses</p>
            <p class="text-2xl font-semibold text-gray-900">{{ pauseAnalysis.avgPauseCount.toFixed(1) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-gray-600">Durée moyenne des pauses</p>
            <p class="text-2xl font-semibold text-gray-900">{{ formatDuration(pauseAnalysis.avgPauseTime) }}</p>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-gray-600">Corrélation pause-score</p>
            <p class="text-2xl font-semibold" :class="pauseAnalysis.pauseScoreCorrelation.correlation < 0 ? 'text-green-600' : 'text-red-600'">
              {{ pauseAnalysis.pauseScoreCorrelation.correlation.toFixed(3) }}
            </p>
          </div>
        </div>
        <div class="mt-4 p-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-600">
            <strong>Interprétation :</strong>
            <span v-if="pauseAnalysis.pauseScoreCorrelation.correlation < -0.3">
              Corrélation négative forte : plus de pauses = scores plus faibles
            </span>
            <span v-else-if="pauseAnalysis.pauseScoreCorrelation.correlation < -0.1">
              Corrélation négative modérée : les pauses peuvent affecter les performances
            </span>
            <span v-else-if="pauseAnalysis.pauseScoreCorrelation.correlation > 0.1">
              Corrélation positive : les pauses peuvent améliorer les performances
            </span>
            <span v-else>
              Pas de corrélation significative entre pauses et performances
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Performance par créneau horaire -->
    <div class="bg-white rounded-lg shadow border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Performance par Créneau Horaire</h2>
        <p class="text-sm text-gray-600">Identification des créneaux optimaux</p>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-4">Créneaux Optimaux</h3>
            <div class="space-y-2">
              <div
                v-for="slot in timePerformanceAnalysis.optimalTimeSlots"
                :key="slot"
                class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded"
              >
                <span class="font-medium text-green-800">{{ slot }}</span>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Optimal
                </span>
              </div>
              <div v-if="timePerformanceAnalysis.optimalTimeSlots.length === 0" class="text-center py-4 text-gray-500">
                Aucun créneau optimal identifié
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-4">Performance par Heure</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="hour in timePerformanceAnalysis.hourlyPerformance"
                :key="hour.hour"
                class="flex items-center justify-between p-2 border border-gray-200 rounded"
              >
                <div class="flex items-center space-x-3">
                  <span class="font-medium text-gray-900">
                    {{ hour.hour.toString().padStart(2, '0') }}:00
                  </span>
                  <span class="text-sm text-gray-500">
                    ({{ hour.participantCount }} participants)
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: `${hour.avgScore}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">
                    {{ hour.avgScore.toFixed(1) }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analyse par provenance -->
    <div class="bg-white rounded-lg shadow border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Analyse par Provenance</h2>
        <p class="text-sm text-gray-600">Performance selon l'origine des participants</p>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provenance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score Moyen</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taux Completion</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points Forts</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points Faibles</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="analysis in provenanceAnalysis" :key="analysis.provenance">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ analysis.provenance }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ analysis.participantCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        class="bg-blue-600 h-2 rounded-full" 
                        :style="{ width: `${analysis.avgScore}%` }"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-900">{{ analysis.avgScore.toFixed(1) }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ analysis.completionRate.toFixed(1) }}%
                </td>
                <td class="px-6 py-4">
                  <div class="text-xs">
                    <span 
                      v-for="skill in analysis.topSkills.slice(0, 2)" 
                      :key="skill"
                      class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-1 mb-1"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-xs">
                    <span 
                      v-for="weakness in analysis.weakAreas.slice(0, 2)" 
                      :key="weakness"
                      class="inline-block bg-red-100 text-red-800 px-2 py-1 rounded mr-1 mb-1"
                    >
                      {{ weakness }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Créneaux populaires -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Créneaux Populaires</h2>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div
              v-for="slot in kpis.popularTimeSlots"
              :key="slot.time"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-900">{{ slot.time }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(slot.bookings / Math.max(...kpis.popularTimeSlots.map((s: any) => s.bookings))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600">{{ slot.bookings }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow border">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Utilisation Équipements</h2>
        </div>
        <div class="p-6">
          <div class="space-y-3">
            <div
              v-for="equipment in kpis.equipmentUsage"
              :key="equipment.equipment"
              class="flex items-center justify-between"
            >
              <span class="text-sm font-medium text-gray-900">{{ equipment.equipment }}</span>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full" 
                    :style="{ width: `${equipment.usageRate}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600">{{ equipment.usageRate.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdvancedAnalyticsStore } from '@/stores/advancedAnalytics'

const analyticsStore = useAdvancedAnalyticsStore()

// État local
const exportFormat = ref<'csv' | 'excel' | 'pdf'>('csv')

// Données du store
const isLoading = computed(() => analyticsStore.isLoading)
const filters = computed(() => analyticsStore.currentFilter)
const kpis = computed(() => analyticsStore.kpiMetrics)
const pauseAnalysis = computed(() => analyticsStore.pauseAnalysis)
const timePerformanceAnalysis = computed(() => analyticsStore.timePerformanceAnalysis)
const correlationData = computed(() => analyticsStore.correlationData)

// Données calculées
const provenanceAnalysis = computed(() => 
  correlationData.value?.provenanceAnalysis || []
)

// Méthodes
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}m ${remainingSeconds}s`
}

async function calculateCorrelations() {
  try {
    await analyticsStore.calculateCorrelations()
  } catch (error) {
    console.error('Erreur lors du calcul des corrélations:', error)
  }
}

function applyFilters() {
  // Les filtres sont déjà appliqués automatiquement via la réactivité
  console.log('Filtres appliqués:', filters)
}

async function exportData() {
  try {
    await analyticsStore.exportAnalyticsData(exportFormat.value)
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
  }
}

// Initialisation
onMounted(() => {
  analyticsStore.initialize()
})
</script>
