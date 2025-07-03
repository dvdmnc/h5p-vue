<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- En-tête -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Gestion des Sessions Présentielles</h1>
        <p class="mt-2 text-gray-600">
          Planification et suivi des sessions d'évaluation en présentiel
        </p>
      </div>
      <button
        @click="showCreateModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nouveau Créneau
      </button>
    </div>

    <!-- KPIs des sessions -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Participants</p>
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
            <p class="text-sm font-medium text-gray-600">Taux de Présence</p>
            <p class="text-2xl font-semibold text-gray-900">{{ (100 - kpis.noShowRate).toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Utilisation Salles</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.sessionUtilization.toFixed(1) }}%</p>
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
            <p class="text-sm font-medium text-gray-600">No-Show</p>
            <p class="text-2xl font-semibold text-gray-900">{{ kpis.noShowRate.toFixed(1) }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="bg-white p-6 rounded-lg shadow border">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select v-model="filters.period" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="custom">Personnalisé</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
          <select v-model="filters.status" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Tous</option>
            <option value="available">Disponible</option>
            <option value="full">Complet</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
          <select v-model="filters.location" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Tous les lieux</option>
            <option value="salle-a">Salle A</option>
            <option value="salle-b">Salle B</option>
            <option value="salle-c">Salle C</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="sendReminders"
            :disabled="isLoading"
            class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
          >
            Envoyer Rappels
          </button>
        </div>
      </div>
    </div>

    <!-- Tableau des créneaux -->
    <div class="bg-white rounded-lg shadow border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Créneaux de Session</h2>
      </div>
      
      <div v-if="isLoading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Chargement...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Heure</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lieu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Équipement</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="slot in filteredSlots" :key="slot.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(slot.date) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ slot.startTime }} - {{ slot.endTime }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ slot.location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ slot.currentParticipants }} / {{ slot.maxParticipants }}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(slot.currentParticipants / slot.maxParticipants) * 100}%` }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <span 
                    v-for="equipment in slot.equipmentRequired" 
                    :key="equipment"
                    class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                  >
                    {{ equipment }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(slot.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getStatusLabel(slot.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewReservations(slot.id)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Voir
                </button>
                <button
                  @click="editSlot(slot)"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  Modifier
                </button>
                <button
                  @click="cancelSlot(slot.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Annuler
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création/édition de créneau -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingSlot ? 'Modifier le Créneau' : 'Nouveau Créneau' }}
        </h3>
        
        <form @submit.prevent="saveSlot" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                v-model="slotForm.date"
                type="date"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Lieu</label>
              <input
                v-model="slotForm.location"
                type="text"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Salle A - Bâtiment principal"
              >
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Heure début</label>
              <input
                v-model="slotForm.startTime"
                type="time"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Heure fin</label>
              <input
                v-model="slotForm.endTime"
                type="time"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max participants</label>
              <input
                v-model.number="slotForm.maxParticipants"
                type="number"
                min="1"
                max="20"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Équipement requis</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <label v-for="equipment in availableEquipment" :key="equipment" class="flex items-center">
                <input
                  type="checkbox"
                  :value="equipment"
                  v-model="slotForm.equipmentRequired"
                  class="mr-2"
                >
                <span class="text-sm">{{ equipment }}</span>
              </label>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {{ editingSlot ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal des réservations -->
    <div v-if="showReservationsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Réservations du Créneau</h3>
          <button @click="showReservationsModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="reservation in selectedSlotReservations" :key="reservation.id">
                <td class="px-4 py-4 text-sm text-gray-900">{{ reservation.participantName }}</td>
                <td class="px-4 py-4 text-sm text-gray-600">{{ reservation.participantEmail }}</td>
                <td class="px-4 py-4">
                  <span :class="getReservationStatusClass(reservation.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getReservationStatusLabel(reservation.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-sm font-mono text-gray-900">{{ reservation.confirmationCode }}</td>
                <td class="px-4 py-4 text-sm">
                  <select 
                    :value="reservation.status" 
                    @change="updateReservationStatus(reservation.id, ($event.target as HTMLSelectElement).value)"
                    class="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="confirmed">Confirmé</option>
                    <option value="cancelled">Annulé</option>
                    <option value="no-show">No-show</option>
                    <option value="completed">Terminé</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSessionStore } from '@/stores/session'
import type { SessionSlot } from '@/types/assessment'

const sessionStore = useSessionStore()

// État local
const showCreateModal = ref(false)
const showReservationsModal = ref(false)
const editingSlot = ref<SessionSlot | null>(null)
const selectedSlotId = ref<string>('')

const filters = ref({
  period: 'month',
  status: '',
  location: ''
})

const slotForm = ref({
  date: '',
  startTime: '',
  endTime: '',
  maxParticipants: 8,
  location: '',
  equipmentRequired: [] as string[]
})

const availableEquipment = [
  'Ordinateur',
  'Casque audio',
  'Webcam',
  'Tablette graphique',
  'Écran secondaire',
  'Imprimante'
]

// Données calculées
const { sessionSlots, reservations, isLoading, sessionKPIs: kpis } = sessionStore

const filteredSlots = computed(() => {
  let filtered = sessionSlots

  if (filters.value.status) {
    filtered = filtered.filter(slot => slot.status === filters.value.status)
  }

  if (filters.value.location) {
    filtered = filtered.filter(slot => 
      slot.location.toLowerCase().includes(filters.value.location.toLowerCase())
    )
  }

  return filtered.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`)
    const dateB = new Date(`${b.date}T${b.startTime}`)
    return dateA.getTime() - dateB.getTime()
  })
})

const selectedSlotReservations = computed(() => 
  reservations.filter(r => r.sessionSlotId === selectedSlotId.value)
)

// Méthodes
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getStatusClass(status: string) {
  const classes = {
    available: 'bg-green-100 text-green-800',
    full: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string) {
  const labels = {
    available: 'Disponible',
    full: 'Complet',
    cancelled: 'Annulé'
  }
  return labels[status as keyof typeof labels] || status
}

function getReservationStatusClass(status: string) {
  const classes = {
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
    'no-show': 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

function getReservationStatusLabel(status: string) {
  const labels = {
    confirmed: 'Confirmé',
    cancelled: 'Annulé',
    'no-show': 'No-show',
    completed: 'Terminé'
  }
  return labels[status as keyof typeof labels] || status
}

function editSlot(slot: SessionSlot) {
  editingSlot.value = slot
  slotForm.value = {
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    maxParticipants: slot.maxParticipants,
    location: slot.location,
    equipmentRequired: [...slot.equipmentRequired]
  }
  showCreateModal.value = true
}

function viewReservations(slotId: string) {
  selectedSlotId.value = slotId
  showReservationsModal.value = true
}

async function saveSlot() {
  try {
    if (editingSlot.value) {
      // Logique de modification (à implémenter dans le store)
      console.log('Modification du créneau:', editingSlot.value.id, slotForm.value)
    } else {
      await sessionStore.createSessionSlot({
        ...slotForm.value,
        status: 'available'
      })
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

function closeModal() {
  showCreateModal.value = false
  editingSlot.value = null
  slotForm.value = {
    date: '',
    startTime: '',
    endTime: '',
    maxParticipants: 8,
    location: '',
    equipmentRequired: []
  }
}

async function cancelSlot(slotId: string) {
  if (confirm('Êtes-vous sûr de vouloir annuler ce créneau ?')) {
    // Logique d'annulation (à implémenter dans le store)
    console.log('Annulation du créneau:', slotId)
  }
}

async function updateReservationStatus(reservationId: string, newStatus: string) {
  try {
    await sessionStore.updateReservationStatus(reservationId, newStatus as any)
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  }
}

async function sendReminders() {
  try {
    const count = await sessionStore.sendReminders()
    alert(`${count} rappels envoyés avec succès`)
  } catch (error) {
    console.error('Erreur lors de l\'envoi des rappels:', error)
  }
}

// Initialisation
onMounted(() => {
  sessionStore.initialize()
})
</script>
