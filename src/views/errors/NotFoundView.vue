<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div class="text-6xl mb-4">404</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Page non trouvée</h1>
      <p class="text-gray-600 mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div class="space-y-3">
        <router-link to="/" class="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          Retour à l'accueil
        </router-link>
        <button @click="$router.go(-1)" class="block w-full text-blue-600 hover:text-blue-800">
          Retour à la page précédente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found error view
</script>
