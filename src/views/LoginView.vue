<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Check Compétences
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Connectez-vous à votre compte
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            
            <a href="#" class="text-sm text-primary-600 hover:text-primary-500">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="!isLoading">Se connecter</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connexion...
            </span>
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Pas encore de compte ?
            <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
              Créer un compte
            </router-link>
          </p>
        </div>
        
        <!-- Demo accounts -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Comptes de démonstration :</h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-blue-700">Administrateur:</span>
              <button @click="fillDemoAccount('admin')" class="text-blue-600 hover:underline">
                admin@demo.com / admin123
              </button>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Créateur:</span>
              <button @click="fillDemoAccount('createur')" class="text-blue-600 hover:underline">
                createur@demo.com / createur123
              </button>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Conseiller:</span>
              <button @click="fillDemoAccount('conseiller')" class="text-blue-600 hover:underline">
                conseiller@demo.com / conseiller123
              </button>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Bénéficiaire:</span>
              <button @click="fillDemoAccount('beneficiaire')" class="text-blue-600 hover:underline">
                beneficiaire@demo.com / beneficiaire123
              </button>
            </div>
            <div class="flex justify-between">
              <span class="text-blue-700">Client:</span>
              <button @click="fillDemoAccount('client')" class="text-blue-600 hover:underline">
                client@demo.com / client123
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember
    })
    
    // Redirect to dashboard or intended route
    const redirect = router.currentRoute.value.query.redirect as string || '/dashboard'
    router.push(redirect)
  } catch (error) {
    console.error('Login failed:', error)
    // Handle error (show toast, etc.)
  } finally {
    isLoading.value = false
  }
}

const fillDemoAccount = (type: 'admin' | 'createur' | 'conseiller' | 'beneficiaire' | 'client') => {
  const accounts = {
    admin: { email: 'admin@demo.com', password: 'admin123' },
    createur: { email: 'createur@demo.com', password: 'createur123' },
    conseiller: { email: 'conseiller@demo.com', password: 'conseiller123' },
    beneficiaire: { email: 'beneficiaire@demo.com', password: 'beneficiaire123' },
    client: { email: 'client@demo.com', password: 'client123' }
  }
  
  form.email = accounts[type].email
  form.password = accounts[type].password
}
</script>
