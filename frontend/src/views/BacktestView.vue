<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Backtest View</h1>
    <p class="mb-4">Welcome to the Trading Backtester.</p>

    <div v-if="loading" class="text-blue-500">Loading...</div>

    <div v-if="status" class="bg-green-100 p-4 rounded border border-green-500 mb-4">
      <h2 class="font-bold text-green-700">Backend Status:</h2>
      <pre class="text-sm">{{ status }}</pre>
    </div>

    <div v-if="error" class="bg-red-100 p-4 rounded border border-red-500 mb-4">
      <h2 class="font-bold text-red-700">Error:</h2>
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const status = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await api.getHealth();
    status.value = response.data;
  } catch (err) {
    error.value = 'Could not connect to backend. Make sure it is running.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
