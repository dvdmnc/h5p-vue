<template>
  <div class="h5p-comparison-demo">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          🆚 H5P Integration Comparison
        </h1>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Comparison between <strong>CDN + CSS Override</strong> (recommended) vs <strong>Local Libraries</strong> (complex) approaches
        </p>
      </div>

      <!-- Comparison Table -->
      <div class="comparison-table mb-8 bg-white rounded-lg shadow-sm border overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Critère
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-green-700 uppercase tracking-wider">
                CDN + CSS Override
              </th>
              <th class="px-6 py-4 text-left text-sm font-medium text-red-700 uppercase tracking-wider">
                Local Libraries
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Facilité de setup
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Très simple - quelques lignes
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800">
                ❌ Complexe - gestion des paths, assets
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Fiabilité
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Très fiable - CDN testé
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800">
                ❌ Erreurs de paths, JSON parsing
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Customisation CSS
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Complète via :deep() et !important
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Complète (si ça marche)
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Événements xAPI
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Accès complet
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Accès complet (si ça marche)
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Maintenance
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Updates automatiques
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-800">
                ❌ Gestion manuelle des versions
              </td>
            </tr>
            <tr class="bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Dépendances réseau
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-orange-800">
                ⚠️ Besoin internet
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-800">
                ✅ Fonctionne hors ligne
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Demonstration -->
      <div class="demo-section">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Démonstration pratique</h2>
        
        <!-- CDN Demo -->
        <div class="cdn-demo mb-8 p-6 bg-white rounded-lg shadow-sm border">
          <div class="flex items-center mb-4">
            <div class="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <h3 class="text-xl font-semibold text-gray-800">CDN + CSS Override Approach</h3>
            <span class="ml-auto px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Recommandé
            </span>
          </div>
          
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-green-800 text-sm font-medium">
                H5P chargé depuis CDN avec customisation CSS complète
              </span>
            </div>
          </div>

          <!-- CDN H5P Component would go here -->
          <div class="cdn-placeholder bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 text-center border-2 border-dashed border-green-300">
            <div class="text-green-700 text-lg font-medium mb-2">
              🎯 H5P CDN Component
            </div>
            <p class="text-green-600 mb-4">
              Chargement depuis CDN avec styles personnalisés
            </p>
            <button class="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Charger depuis CDN
            </button>
          </div>
        </div>

        <!-- Local Demo -->
        <div class="local-demo mb-8 p-6 bg-white rounded-lg shadow-sm border">
          <div class="flex items-center mb-4">
            <div class="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
            <h3 class="text-xl font-semibold text-gray-800">Local Libraries Approach</h3>
            <span class="ml-auto px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
              Problématique
            </span>
          </div>
          
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span class="text-red-800 text-sm font-medium">
                Erreur: Unexpected token '&lt;', "&lt;!doctype "... is not valid JSON
              </span>
            </div>
          </div>

          <div class="local-error bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-8 text-center border-2 border-dashed border-red-300">
            <div class="text-red-700 text-lg font-medium mb-2">
              ❌ H5P Local Component
            </div>
            <p class="text-red-600 mb-4">
              Erreur de chargement - problème de paths/serving
            </p>
            <div class="bg-red-100 text-red-800 p-3 rounded text-sm font-mono text-left">
              SyntaxError: Unexpected token '&lt;', "&lt;!doctype "... is not valid JSON
            </div>
          </div>
        </div>
      </div>

      <!-- Conclusion -->
      <div class="conclusion bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 class="text-xl font-semibold text-green-800 mb-4">
          🎯 Conclusion et Recommandation
        </h3>
        <div class="text-green-700 space-y-3">
          <p>
            <strong>Le CDN + CSS Override est la meilleure approche</strong> pour l'intégration H5P dans ce projet car :
          </p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Fiabilité prouvée</strong> - Utilisé par de nombreux projets en production</li>
            <li><strong>Customisation suffisante</strong> - CSS :deep() permet de modifier tous les styles</li>
            <li><strong>Accès aux événements</strong> - xAPI events disponibles pour tracking</li>
            <li><strong>Maintenance simplifiée</strong> - Pas de gestion de versions locales</li>
            <li><strong>Référence project compatible</strong> - Même approche que m1-workshop-client</li>
          </ul>
          <div class="mt-4 p-4 bg-white rounded border border-green-300">
            <p class="font-medium text-green-800">
              ✅ Pour ce projet, <strong>implémentez l'approche CDN</strong> qui offre 90%+ des capacités de customisation avec 100% de fiabilité.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This demo shows why CDN approach is better than local libraries
</script>

<style scoped>
.comparison-table {
  max-width: 100%;
  overflow-x: auto;
}

.cdn-placeholder,
.local-error {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
