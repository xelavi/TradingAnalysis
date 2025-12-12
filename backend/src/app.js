import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend de Trading Backtest funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta de prueba para estrategias disponibles
app.get('/api/strategies', (req, res) => {
  res.json({
    success: true,
    strategies: [
      {
        id: 'SMA_Crossover',
        name: 'SMA Crossover',
        description: 'Estrategia basada en cruce de medias móviles simples',
        parameters: {
          fastPeriod: { type: 'number', default: 10, min: 5, max: 50 },
          slowPeriod: { type: 'number', default: 30, min: 20, max: 200 }
        }
      },
      {
        id: 'RSI_Strategy',
        name: 'RSI Oversold/Overbought',
        description: 'Estrategia basada en niveles de RSI',
        parameters: {
          period: { type: 'number', default: 14, min: 5, max: 30 },
          oversold: { type: 'number', default: 30, min: 10, max: 40 },
          overbought: { type: 'number', default: 70, min: 60, max: 90 }
        }
      },
      {
        id: 'Breakout_Strategy',
        name: 'Breakout Strategy',
        description: 'Estrategia de ruptura de niveles',
        parameters: {
          lookbackPeriod: { type: 'number', default: 20, min: 10, max: 50 }
        }
      }
    ]
  });
});

// Ruta de prueba para símbolos disponibles
app.get('/api/symbols', (req, res) => {
  res.json({
    success: true,
    symbols: [
      { id: 'EURUSD', name: 'EUR/USD', description: 'Euro vs Dólar Estadounidense' },
      { id: 'GBPUSD', name: 'GBP/USD', description: 'Libra Esterlina vs Dólar Estadounidense' },
      { id: 'USDJPY', name: 'USD/JPY', description: 'Dólar Estadounidense vs Yen Japonés' },
      { id: 'GBPJPY', name: 'GBP/JPY', description: 'Libra Esterlina vs Yen Japonés' }
    ]
  });
});

// Ruta placeholder para backtest (se implementará en fases posteriores)
app.post('/api/backtest', (req, res) => {
  const { symbol, startDate, endDate, strategy } = req.body;
  
  // Validación básica
  if (!symbol || !startDate || !endDate || !strategy) {
    return res.status(400).json({
      success: false,
      error: 'Faltan parámetros requeridos: symbol, startDate, endDate, strategy'
    });
  }

  // Respuesta temporal
  res.json({
    success: true,
    message: 'Endpoint de backtest - Se implementará en las próximas fases',
    received: { symbol, startDate, endDate, strategy }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 API disponible en http://localhost:${PORT}/api`);
});
