<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div class="text-6xl mb-4">🚫</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
      <p class="text-gray-600 mb-6">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <div class="space-y-3">
        <router-link to="/" class="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Retour à l'accueil
        </router-link>
        <router-link to="/login" class="block text-blue-600 hover:text-blue-800">
          Se connecter
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Unauthorized error view
</script>
