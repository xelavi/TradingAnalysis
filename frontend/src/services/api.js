import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Health Check
  getHealth() {
    return api.get('/health');
  },

  // Obtener estrategias disponibles
  getStrategies() {
    return api.get('/strategies');
  },

  // Obtener símbolos disponibles
  getSymbols() {
    return api.get('/symbols');
  },

  // Ejecutar backtest
  runBacktest(params) {
    return api.post('/backtest', params);
  }
};
