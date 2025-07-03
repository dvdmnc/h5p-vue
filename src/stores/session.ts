import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  SessionSlot, 
  SessionReservation, 
  WorkStation,
  KPIMetrics 
} from '@/types/assessment'

export const useSessionStore = defineStore('session', () => {
  // État
  const sessionSlots = ref<SessionSlot[]>([])
  const reservations = ref<SessionReservation[]>([])
  const workStations = ref<WorkStation[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters calculés
  const availableSlots = computed(() => 
    sessionSlots.value.filter(slot => 
      slot.status === 'available' && 
      slot.currentParticipants < slot.maxParticipants
    )
  )

  const upcomingSessions = computed(() => {
    const now = new Date()
    return sessionSlots.value.filter(slot => {
      const slotDate = new Date(`${slot.date}T${slot.startTime}`)
      return slotDate > now
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}`)
      const dateB = new Date(`${b.date}T${b.startTime}`)
      return dateA.getTime() - dateB.getTime()
    })
  })

  const noShowReservations = computed(() =>
    reservations.value.filter(r => r.status === 'no-show')
  )

  const sessionKPIs = computed((): KPIMetrics => {
    const totalReservations = reservations.value.length
    const noShows = noShowReservations.value.length
    const completed = reservations.value.filter(r => r.status === 'completed').length
    
    // Calcul du taux d'utilisation des sessions
    const totalCapacity = sessionSlots.value.reduce((sum, slot) => sum + slot.maxParticipants, 0)
    const utilization = totalCapacity > 0 ? (totalReservations / totalCapacity) * 100 : 0

    // Créneaux populaires
    const slotCounts = sessionSlots.value.reduce((acc, slot) => {
      const timeSlot = `${slot.startTime}-${slot.endTime}`
      acc[timeSlot] = (acc[timeSlot] || 0) + slot.currentParticipants
      return acc
    }, {} as Record<string, number>)

    const popularTimeSlots = Object.entries(slotCounts)
      .map(([time, bookings]) => ({ time, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5)

    // Utilisation des équipements
    const equipmentCounts = workStations.value.reduce((acc, station) => {
      station.equipment.forEach(eq => {
        acc[eq] = (acc[eq] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const totalStations = workStations.value.length
    const equipmentUsage = Object.entries(equipmentCounts)
      .map(([equipment, count]) => ({
        equipment,
        usageRate: totalStations > 0 ? (count / totalStations) * 100 : 0
      }))

    return {
      totalParticipants: totalReservations,
      completionRate: totalReservations > 0 ? (completed / totalReservations) * 100 : 0,
      avgScore: 0, // À calculer avec les résultats d'évaluation
      noShowRate: totalReservations > 0 ? (noShows / totalReservations) * 100 : 0,
      sessionUtilization: utilization,
      popularTimeSlots,
      topProvenances: [], // À implémenter avec les données utilisateur
      equipmentUsage
    }
  })

  // Actions
  async function fetchSessionSlots() {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulation API - remplacer par vraie API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      sessionSlots.value = [
        {
          id: '1',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '11:00',
          maxParticipants: 8,
          currentParticipants: 5,
          location: 'Salle A - Bâtiment principal',
          equipmentRequired: ['Ordinateur', 'Casque audio'],
          status: 'available'
        },
        {
          id: '2',
          date: '2024-01-15',
          startTime: '14:00',
          endTime: '16:00',
          maxParticipants: 10,
          currentParticipants: 10,
          location: 'Salle B - Bâtiment annexe',
          equipmentRequired: ['Ordinateur', 'Tablette graphique'],
          status: 'full'
        },
        {
          id: '3',
          date: '2024-01-16',
          startTime: '10:00',
          endTime: '12:00',
          maxParticipants: 6,
          currentParticipants: 2,
          location: 'Salle C - Centre de formation',
          equipmentRequired: ['Ordinateur'],
          status: 'available'
        }
      ]
    } catch (err) {
      error.value = 'Erreur lors du chargement des créneaux'
      console.error('Erreur fetchSessionSlots:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchReservations() {
    isLoading.value = true
    
    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      reservations.value = [
        {
          id: 'res1',
          sessionSlotId: '1',
          participantId: 'user1',
          participantName: 'Marie Dupont',
          participantEmail: 'marie.dupont@email.com',
          reservationDate: '2024-01-10T10:30:00Z',
          status: 'confirmed',
          confirmationCode: 'CONF-001',
          reminderSent: true
        },
        {
          id: 'res2',
          sessionSlotId: '1',
          participantId: 'user2',
          participantName: 'Jean Martin',
          participantEmail: 'jean.martin@email.com',
          reservationDate: '2024-01-11T14:15:00Z',
          status: 'no-show',
          confirmationCode: 'CONF-002',
          reminderSent: true
        }
      ]
    } catch (err) {
      error.value = 'Erreur lors du chargement des réservations'
      console.error('Erreur fetchReservations:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchWorkStations() {
    try {
      // Simulation API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      workStations.value = [
        {
          id: 'ws1',
          name: 'Poste 1 - Salle A',
          location: 'Salle A - Bâtiment principal',
          equipment: ['Ordinateur', 'Casque audio', 'Webcam'],
          isAvailable: true
        },
        {
          id: 'ws2',
          name: 'Poste 2 - Salle A',
          location: 'Salle A - Bâtiment principal',
          equipment: ['Ordinateur', 'Casque audio'],
          isAvailable: true
        },
        {
          id: 'ws3',
          name: 'Poste 1 - Salle B',
          location: 'Salle B - Bâtiment annexe',
          equipment: ['Ordinateur', 'Tablette graphique', 'Écran secondaire'],
          isAvailable: false,
          maintenanceNotes: 'Tablette graphique défaillante'
        }
      ]
    } catch (err) {
      error.value = 'Erreur lors du chargement des postes de travail'
      console.error('Erreur fetchWorkStations:', err)
    }
  }

  async function createSessionSlot(slot: Omit<SessionSlot, 'id' | 'currentParticipants'>) {
    try {
      // Simulation API
      const newSlot: SessionSlot = {
        ...slot,
        id: `slot_${Date.now()}`,
        currentParticipants: 0
      }
      
      sessionSlots.value.push(newSlot)
      return newSlot
    } catch (err) {
      error.value = 'Erreur lors de la création du créneau'
      throw err
    }
  }

  async function makeReservation(sessionSlotId: string, participantData: {
    participantId: string
    participantName: string
    participantEmail: string
  }) {
    try {
      const slot = sessionSlots.value.find(s => s.id === sessionSlotId)
      if (!slot) throw new Error('Créneau non trouvé')
      
      if (slot.currentParticipants >= slot.maxParticipants) {
        throw new Error('Créneau complet')
      }

      const reservation: SessionReservation = {
        id: `res_${Date.now()}`,
        sessionSlotId,
        ...participantData,
        reservationDate: new Date().toISOString(),
        status: 'confirmed',
        confirmationCode: `CONF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        reminderSent: false
      }

      reservations.value.push(reservation)
      slot.currentParticipants++

      return reservation
    } catch (err) {
      error.value = 'Erreur lors de la réservation'
      throw err
    }
  }

  async function updateReservationStatus(reservationId: string, status: SessionReservation['status']) {
    try {
      const reservation = reservations.value.find(r => r.id === reservationId)
      if (!reservation) throw new Error('Réservation non trouvée')

      const oldStatus = reservation.status
      reservation.status = status

      // Ajuster le compteur de participants si nécessaire
      if (oldStatus === 'confirmed' && (status === 'cancelled' || status === 'no-show')) {
        const slot = sessionSlots.value.find(s => s.id === reservation.sessionSlotId)
        if (slot) slot.currentParticipants--
      } else if ((oldStatus === 'cancelled' || oldStatus === 'no-show') && status === 'confirmed') {
        const slot = sessionSlots.value.find(s => s.id === reservation.sessionSlotId)
        if (slot) slot.currentParticipants++
      }

      return reservation
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour de la réservation'
      throw err
    }
  }

  async function sendReminders(sessionSlotId?: string) {
    try {
      const targetReservations = sessionSlotId 
        ? reservations.value.filter(r => r.sessionSlotId === sessionSlotId && r.status === 'confirmed')
        : reservations.value.filter(r => r.status === 'confirmed')

      // Simulation envoi email
      await new Promise(resolve => setTimeout(resolve, 1000))

      targetReservations.forEach(reservation => {
        reservation.reminderSent = true
      })

      return targetReservations.length
    } catch (err) {
      error.value = 'Erreur lors de l\'envoi des rappels'
      throw err
    }
  }

  // Initialisation
  function initialize() {
    fetchSessionSlots()
    fetchReservations()
    fetchWorkStations()
  }

  return {
    // État
    sessionSlots,
    reservations,
    workStations,
    isLoading,
    error,
    
    // Getters
    availableSlots,
    upcomingSessions,
    noShowReservations,
    sessionKPIs,
    
    // Actions
    initialize,
    fetchSessionSlots,
    fetchReservations,
    fetchWorkStations,
    createSessionSlot,
    makeReservation,
    updateReservationStatus,
    sendReminders
  }
})
