<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configuration Système</h1>
      <p class="text-gray-600">Paramètres généraux de l'application</p>
    </div>

    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Paramètres Généraux</h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'application
            </label>
            <input
              type="text"
              value="Check Compétences"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email administrateur
            </label>
            <input
              type="email"
              value="admin@checkcompetences.fr"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-medium">Paramètres des Évaluations</h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Durée maximale par défaut (minutes)
            </label>
            <input
              type="number"
              value="30"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre maximum de tentatives
            </label>
            <input
              type="number"
              value="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Settings view implementation
</script>
