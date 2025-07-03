<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Mon Profil</h1>
      <p class="text-gray-600">Gérer vos informations personnelles</p>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
          <input
            type="text"
            value="Utilisateur Demo"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value="demo@example.com"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex justify-end">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Profile view
</script>
