import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  AdvancedFilter, 
  CorrelationAnalysis, 
  KPIMetrics,
  EnhancedAssessmentResult 
} from '@/types/assessment'

export const useAdvancedAnalyticsStore = defineStore('advancedAnalytics', () => {
  // État
  const assessmentResults = ref<EnhancedAssessmentResult[]>([])
  const currentFilter = ref<AdvancedFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 jours
      end: new Date().toISOString().split('T')[0]
    },
    provenance: [],
    clientReferrer: [],
    timeOfDay: { start: '00:00', end: '23:59' },
    deviceType: [],
    sessionType: 'both'
  })
  const correlationData = ref<CorrelationAnalysis | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters calculés
  const filteredResults = computed(() => {
    let filtered = assessmentResults.value

    // Filtrage par date
    const startDate = new Date(currentFilter.value.dateRange.start)
    const endDate = new Date(currentFilter.value.dateRange.end)
    filtered = filtered.filter(result => {
      const resultDate = new Date(result.completedAt)
      return resultDate >= startDate && resultDate <= endDate
    })

    // Filtrage par provenance
    if (currentFilter.value.provenance.length > 0) {
      filtered = filtered.filter(result => 
        currentFilter.value.provenance.includes(result.provenance)
      )
    }

    // Filtrage par client référent
    if (currentFilter.value.clientReferrer.length > 0) {
      filtered = filtered.filter(result => 
        currentFilter.value.clientReferrer.includes(result.clientReferrer)
      )
    }

    // Filtrage par heure
    filtered = filtered.filter(result => {
      const resultTime = new Date(result.completedAt).toTimeString().slice(0, 5)
      return resultTime >= currentFilter.value.timeOfDay.start && 
             resultTime <= currentFilter.value.timeOfDay.end
    })

    // Filtrage par type de device
    if (currentFilter.value.deviceType.length > 0) {
      filtered = filtered.filter(result => 
        currentFilter.value.deviceType.includes(result.deviceInfo.type)
      )
    }

    // Filtrage par type de session
    if (currentFilter.value.sessionType !== 'both') {
      filtered = filtered.filter(result => 
        result.sessionType === currentFilter.value.sessionType
      )
    }

    return filtered
  })

  const kpiMetrics = computed((): KPIMetrics => {
    const results = filteredResults.value
    const totalParticipants = results.length
    
    if (totalParticipants === 0) {
      return {
        totalParticipants: 0,
        completionRate: 0,
        avgScore: 0,
        noShowRate: 0,
        sessionUtilization: 0,
        popularTimeSlots: [],
        topProvenances: [],
        equipmentUsage: []
      }
    }

    // Calcul des métriques de base
    const completedResults = results.filter(r => r.status === 'completed')
    const completionRate = (completedResults.length / totalParticipants) * 100
    const avgScore = completedResults.reduce((sum, r) => sum + r.percentage, 0) / completedResults.length

    // Calcul du taux de no-show (sessions présentielles uniquement)
    const presentialResults = results.filter(r => r.sessionType === 'presential')
    const noShows = presentialResults.filter(r => r.status === 'abandoned').length
    const noShowRate = presentialResults.length > 0 ? (noShows / presentialResults.length) * 100 : 0

    // Créneaux horaires populaires
    const hourCounts: Record<string, number> = {}
    results.forEach(result => {
      const hour = new Date(result.completedAt).getHours()
      const timeSlot = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`
      hourCounts[timeSlot] = (hourCounts[timeSlot] || 0) + 1
    })

    const popularTimeSlots = Object.entries(hourCounts)
      .map(([time, bookings]) => ({ time, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 8)

    // Top provenances
    const provenanceCounts: Record<string, { count: number; totalScore: number }> = {}
    results.forEach(result => {
      if (!provenanceCounts[result.provenance]) {
        provenanceCounts[result.provenance] = { count: 0, totalScore: 0 }
      }
      provenanceCounts[result.provenance].count++
      if (result.status === 'completed') {
        provenanceCounts[result.provenance].totalScore += result.percentage
      }
    })

    const topProvenances = Object.entries(provenanceCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgScore: data.count > 0 ? data.totalScore / data.count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Utilisation des équipements (simulé)
    const equipmentUsage = [
      { equipment: 'Ordinateur', usageRate: 100 },
      { equipment: 'Casque audio', usageRate: 85 },
      { equipment: 'Webcam', usageRate: 60 },
      { equipment: 'Tablette graphique', usageRate: 25 }
    ]

    return {
      totalParticipants,
      completionRate,
      avgScore,
      noShowRate,
      sessionUtilization: 0, // À calculer avec les données de session
      popularTimeSlots,
      topProvenances,
      equipmentUsage
    }
  })

  const pauseAnalysis = computed(() => {
    const results = filteredResults.value
    const analysisData = results.map(result => ({
      pauseCount: result.pauseEvents.length,
      totalPauseTime: result.pauseEvents.reduce((sum, pause) => sum + pause.duration, 0),
      score: result.percentage,
      avgPauseDuration: result.pauseEvents.length > 0 
        ? result.pauseEvents.reduce((sum, pause) => sum + pause.duration, 0) / result.pauseEvents.length 
        : 0
    }))

    return {
      avgPauseCount: analysisData.reduce((sum, d) => sum + d.pauseCount, 0) / analysisData.length,
      avgPauseTime: analysisData.reduce((sum, d) => sum + d.totalPauseTime, 0) / analysisData.length,
      pauseScoreCorrelation: calculateCorrelation(
        analysisData.map(d => d.pauseCount),
        analysisData.map(d => d.score)
      )
    }
  })

  const timePerformanceAnalysis = computed(() => {
    const results = filteredResults.value
    const hourlyData: Record<number, { scores: number[]; count: number }> = {}

    results.forEach(result => {
      if (result.status === 'completed') {
        const hour = new Date(result.completedAt).getHours()
        if (!hourlyData[hour]) {
          hourlyData[hour] = { scores: [], count: 0 }
        }
        hourlyData[hour].scores.push(result.percentage)
        hourlyData[hour].count++
      }
    })

    const hourlyPerformance = Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        avgScore: data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length,
        participantCount: data.count
      }))
      .sort((a, b) => a.hour - b.hour)

    // Identifier les créneaux optimaux (score > moyenne et au moins 5 participants)
    const avgScore = hourlyPerformance.reduce((sum, h) => sum + h.avgScore, 0) / hourlyPerformance.length
    const optimalTimeSlots = hourlyPerformance
      .filter(h => h.avgScore > avgScore && h.participantCount >= 5)
      .map(h => `${h.hour.toString().padStart(2, '0')}:00-${(h.hour + 1).toString().padStart(2, '0')}:00`)

    return {
      hourlyPerformance,
      optimalTimeSlots,
      bestPerformanceHour: hourlyPerformance.reduce((best, current) => 
        current.avgScore > best.avgScore ? current : best
      ),
      worstPerformanceHour: hourlyPerformance.reduce((worst, current) => 
        current.avgScore < worst.avgScore ? current : worst
      )
    }
  })

  // Actions
  async function fetchAnalyticsData() {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation API - récupération des données enrichies
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Données de démonstration enrichies
      assessmentResults.value = generateDemoData()
      
    } catch (err) {
      error.value = 'Erreur lors du chargement des données analytics'
      console.error('Erreur fetchAnalyticsData:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function calculateCorrelations() {
    try {
      const results = filteredResults.value
      
      // Corrélation pauses-score
      const pauseCounts = results.map(r => r.pauseEvents.length)
      const scores = results.map(r => r.percentage)
      const pauseScoreCorr = calculateCorrelation(pauseCounts, scores)

      // Analyse par provenance
      const provenanceGroups: Record<string, EnhancedAssessmentResult[]> = {}
      results.forEach(result => {
        if (!provenanceGroups[result.provenance]) {
          provenanceGroups[result.provenance] = []
        }
        provenanceGroups[result.provenance].push(result)
      })

      const provenanceAnalysis = Object.entries(provenanceGroups).map(([provenance, data]) => {
        const completedData = data.filter(r => r.status === 'completed')
        const avgScore = completedData.length > 0 
          ? completedData.reduce((sum, r) => sum + r.percentage, 0) / completedData.length 
          : 0
        
        const skillCounts: Record<string, number> = {}
        const weakAreaCounts: Record<string, number> = {}
        
        completedData.forEach(result => {
          result.questions.forEach(q => {
            if (q.isCorrect && q.maxScore > 0) {
              skillCounts[q.questionId] = (skillCounts[q.questionId] || 0) + 1
            } else {
              weakAreaCounts[q.questionId] = (weakAreaCounts[q.questionId] || 0) + 1
            }
          })
        })

        return {
          provenance,
          avgScore,
          completionRate: (completedData.length / data.length) * 100,
          participantCount: data.length,
          topSkills: Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([skill]) => skill),
          weakAreas: Object.entries(weakAreaCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([area]) => area)
        }
      })

      correlationData.value = {
        pauseScoreCorrelation: {
          correlation: pauseScoreCorr.correlation,
          significance: pauseScoreCorr.significance,
          pauseCount: pauseCounts,
          scores: scores
        },
        timePerformanceCorrelation: timePerformanceAnalysis.value,
        provenanceAnalysis
      }

      return correlationData.value
    } catch (err) {
      error.value = 'Erreur lors du calcul des corrélations'
      throw err
    }
  }

  function updateFilter(newFilter: Partial<AdvancedFilter>) {
    currentFilter.value = { ...currentFilter.value, ...newFilter }
  }

  function exportAnalyticsData(format: 'csv' | 'excel' | 'pdf') {
    try {
      const data = {
        kpis: kpiMetrics.value,
        filteredResults: filteredResults.value,
        correlations: correlationData.value,
        filters: currentFilter.value
      }

      // Simulation de l'export
      console.log(`Exportation des données en format ${format}:`, data)
      
      // Ici, on implémenterait la logique d'export réelle
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'json' : format}`
      a.click()
      URL.revokeObjectURL(url)

      return true
    } catch (err) {
      error.value = 'Erreur lors de l\'export des données'
      throw err
    }
  }

  // Fonctions utilitaires
  function calculateCorrelation(x: number[], y: number[]) {
    if (x.length !== y.length || x.length === 0) {
      return { correlation: 0, significance: 0 }
    }

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0)

    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY))

    // Calcul rudimentaire de la significance (t-test)
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation))
    const significance = Math.abs(t) > 2 ? 0.05 : 0.1 // Simplification

    return { correlation: isNaN(correlation) ? 0 : correlation, significance }
  }

  function generateDemoData(): EnhancedAssessmentResult[] {
    const provenances = ['Pôle Emploi', 'Mission Locale', 'AFPA', 'CAP Emploi', 'Entreprise']
    const clients = ['Client A', 'Client B', 'Client C', 'Organisme Public']
    const devices = ['desktop', 'tablet', 'mobile'] as const
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge']
    const os = ['Windows', 'macOS', 'Linux', 'iOS', 'Android']

    return Array.from({ length: 150 }, (_, i) => {
      const completedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      const pauseCount = Math.floor(Math.random() * 6)
      const score = 40 + Math.random() * 60 // Score entre 40 et 100
      
      return {
        id: `result_${i + 1}`,
        userId: `user_${i + 1}`,
        questionnaire: 'Évaluation Compétences Numériques',
        questions: [],
        totalScore: score,
        maxScore: 100,
        percentage: score,
        timeTotal: 1800 + Math.random() * 1800, // 30-60 minutes
        completedAt,
        adaptiveLevel: ['facile', 'moyen', 'difficile'][Math.floor(Math.random() * 3)] as any,
        status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'in-progress' : 'abandoned'),
        
        // Données enrichies
        sessionType: Math.random() > 0.3 ? 'online' : 'presential',
        provenance: provenances[Math.floor(Math.random() * provenances.length)],
        clientReferrer: clients[Math.floor(Math.random() * clients.length)],
        deviceInfo: {
          type: devices[Math.floor(Math.random() * devices.length)],
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: os[Math.floor(Math.random() * os.length)]
        },
        pauseEvents: Array.from({ length: pauseCount }, () => ({
          timestamp: new Date(completedAt.getTime() - Math.random() * 3600000).toISOString(),
          duration: Math.floor(Math.random() * 300) + 30, // 30s à 5min
          reason: Math.random() > 0.7 ? 'Pause déclarée' : undefined
        })),
        timeSpentPerQuestion: [],
        clickTracker: []
      }
    })
  }

  // Initialisation
  function initialize() {
    fetchAnalyticsData()
  }

  return {
    // État
    assessmentResults,
    currentFilter,
    correlationData,
    isLoading,
    error,
    
    // Getters
    filteredResults,
    kpiMetrics,
    pauseAnalysis,
    timePerformanceAnalysis,
    
    // Actions
    initialize,
    fetchAnalyticsData,
    calculateCorrelations,
    updateFilter,
    exportAnalyticsData
  }
})
