# Arquitectura - Herramienta de Backtesting de Divisas

## 📋 Descripción General

Herramienta web para realizar backtesting de estrategias de trading en pares de divisas (Forex). El usuario podrá seleccionar un par de divisas, definir un rango de fechas, y ejecutar estrategias predefinidas para evaluar su rendimiento histórico.

## 🎯 Funcionalidades Principales

### MVP (Mínimo Producto Viable)
1. **Selección de Par de Divisas**: EURUSD, GBPUSD, USDJPY, GBPJPY
2. **Selección de Rango de Fechas**: Inicio y fin del periodo de backtesting
3. **Selección de Estrategia**: Lista de estrategias predefinidas
4. **Ejecución del Backtest**: Procesamiento de datos históricos
5. **Visualización de Resultados**: 
   - Gráfico de equity curve
   - Métricas de rendimiento (win rate, profit factor, drawdown, etc.)
   - Lista de trades ejecutados

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

#### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **UI Framework**: 
  - Tailwind CSS (estilos)
  - Headless UI (componentes)
- **Gráficos**: Chart.js o Apache ECharts
- **HTTP Client**: Axios
- **State Management**: Pinia (si es necesario)

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Lenguaje**: TypeScript/JavaScript
- **Validación**: Joi o Zod

#### Datos
- **Fuente de Datos Históricos**: 
  - Opción 1: API pública (Alpha Vantage, Twelve Data)
  - Opción 2: Archivos CSV locales (para desarrollo)
  - Opción 3: API de Yahoo Finance (gratuita)
- **Almacenamiento Local**: 
  - JSON files (para estrategias y configuración)
  - SQLite (opcional, para caché de datos históricos)

### Estructura de Directorios

```
TradingAnalysis/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── backtestController.js
│   │   ├── services/
│   │   │   ├── dataService.js          # Obtención de datos históricos
│   │   │   ├── backtestEngine.js       # Motor de backtesting
│   │   │   └── strategyLoader.js       # Carga de estrategias
│   │   ├── strategies/
│   │   │   ├── Strategy.js             # Clase base
│   │   │   ├── SMA_Crossover.js        # Estrategia 1: Cruce de medias móviles
│   │   │   ├── RSI_Strategy.js         # Estrategia 2: RSI
│   │   │   └── Breakout_Strategy.js    # Estrategia 3: Breakout
│   │   ├── utils/
│   │   │   ├── indicators.js           # Indicadores técnicos
│   │   │   └── metrics.js              # Cálculo de métricas
│   │   ├── models/
│   │   │   ├── Trade.js                # Modelo de trade
│   │   │   └── BacktestResult.js       # Modelo de resultado
│   │   └── app.js                      # Punto de entrada
│   ├── data/
│   │   └── historical/                 # Datos históricos en CSV (opcional)
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BacktestForm.vue        # Formulario de configuración
│   │   │   ├── EquityCurve.vue         # Gráfico de equity curve
│   │   │   ├── MetricsPanel.vue        # Panel de métricas
│   │   │   ├── TradesTable.vue         # Tabla de trades
│   │   │   └── LoadingSpinner.vue      # Spinner de carga
│   │   ├── services/
│   │   │   └── api.js                  # Cliente API
│   │   ├── stores/
│   │   │   └── backtestStore.js        # Store de Pinia (opcional)
│   │   ├── views/
│   │   │   └── BacktestView.vue        # Vista principal
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── ARQUITECTURA.md                     # Este documento
└── README.md                           # Instrucciones de uso
```

## 🔄 Flujo de Datos

1. **Usuario** → Selecciona par de divisas, fechas y estrategia
2. **Frontend** → Envía request POST a `/api/backtest`
3. **Backend Controller** → Valida parámetros
4. **Data Service** → Obtiene datos históricos (API o caché)
5. **Backtest Engine** → Ejecuta la estrategia seleccionada
6. **Strategy** → Genera señales de compra/venta
7. **Backtest Engine** → Simula trades y calcula equity
8. **Metrics Calculator** → Calcula métricas de rendimiento
9. **Backend** → Retorna resultados al frontend
10. **Frontend** → Renderiza gráficos y métricas

## 📊 Modelos de Datos

### Request (Frontend → Backend)

```json
{
  "symbol": "EURUSD",
  "startDate": "2023-01-01",
  "endDate": "2023-12-31",
  "strategy": "SMA_Crossover",
  "parameters": {
    "fastPeriod": 10,
    "slowPeriod": 30
  },
  "initialCapital": 10000,
  "positionSize": 0.1
}
```

### Response (Backend → Frontend)

```json
{
  "success": true,
  "data": {
    "equity": [
      {"date": "2023-01-01", "value": 10000},
      {"date": "2023-01-02", "value": 10150}
    ],
    "trades": [
      {
        "entryDate": "2023-01-01",
        "exitDate": "2023-01-05",
        "type": "LONG",
        "entryPrice": 1.0850,
        "exitPrice": 1.0900,
        "profit": 150,
        "profitPercent": 1.5
      }
    ],
    "metrics": {
      "totalTrades": 45,
      "winningTrades": 28,
      "losingTrades": 17,
      "winRate": 62.22,
      "profitFactor": 1.85,
      "netProfit": 2350,
      "netProfitPercent": 23.5,
      "maxDrawdown": -850,
      "maxDrawdownPercent": -8.5,
      "sharpeRatio": 1.42,
      "avgWin": 180,
      "avgLoss": -95,
      "largestWin": 450,
      "largestLoss": -280
    }
  }
}
```

### Estructura de Datos Históricos (OHLC)

```javascript
{
  date: "2023-01-01",
  open: 1.0850,
  high: 1.0920,
  low: 1.0830,
  close: 1.0900,
  volume: 125000 // opcional
}
```

## 🎨 Diseño de Interfaz

### Layout Principal

```
┌─────────────────────────────────────────────────────────┐
│  Trading Backtester                                      │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │  Configuración del Backtest                       │  │
│  │  ┌───────────┐ ┌─────────┐ ┌─────────┐           │  │
│  │  │ Par: EUR  │ │ Fecha:  │ │Estrateg │           │  │
│  │  │     USD   │ │ [Start] │ │  ia:    │ [Ejecutar]│  │
│  │  └───────────┘ │ [End]   │ │ [Select]│           │  │
│  │                └─────────┘ └─────────┘           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Equity Curve                                     │  │
│  │  [Gráfico de línea mostrando evolución capital]  │  │
│  │                                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────┐  ┌──────────────────────────────┐ │
│  │ Métricas Clave  │  │  Trades Ejecutados           │ │
│  │ Win Rate: 62%   │  │  [Tabla con todos los trades]│ │
│  │ Profit: $2,350  │  │                              │ │
│  │ Drawdown: -8.5% │  │                              │ │
│  └─────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🧩 Componentes Clave del Backend

### 1. Backtest Engine

Responsable de:
- Iterar sobre datos históricos
- Llamar a la estrategia para obtener señales
- Ejecutar trades virtuales
- Calcular equity en cada paso
- Gestionar posiciones abiertas

### 2. Strategy Base Class

```javascript
class Strategy {
  constructor(parameters) {
    this.parameters = parameters;
  }
  
  // Método que debe implementar cada estrategia
  generateSignal(data, currentIndex) {
    // Retorna: 'BUY', 'SELL', o 'HOLD'
    throw new Error('Must implement generateSignal');
  }
  
  // Método opcional para inicialización
  initialize(data) {
    // Calcular indicadores, etc.
  }
}
```

### 3. Data Service

- Obtener datos de API externa
- Cachear datos localmente
- Validar y limpiar datos
- Convertir a formato OHLC estándar

### 4. Indicators Library

Funciones para calcular:
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- RSI (Relative Strength Index)
- MACD
- Bollinger Bands
- ATR (Average True Range)

## 📈 Estrategias Iniciales

### Estrategia 1: SMA Crossover
- **Parámetros**: Fast Period, Slow Period
- **Señal de Compra**: SMA rápida cruza por encima de SMA lenta
- **Señal de Venta**: SMA rápida cruza por debajo de SMA lenta

### Estrategia 2: RSI Oversold/Overbought
- **Parámetros**: RSI Period, Oversold Level, Overbought Level
- **Señal de Compra**: RSI < 30 (oversold)
- **Señal de Venta**: RSI > 70 (overbought)

### Estrategia 3: Breakout Strategy
- **Parámetros**: Lookback Period
- **Señal de Compra**: Precio rompe máximo de N periodos
- **Señal de Venta**: Precio rompe mínimo de N periodos

## 🚀 Plan de Implementación (Fases)

### FASE 1: Setup y Estructura Base ⭐
**Objetivo**: Crear la estructura del proyecto y configuración inicial

**Tareas**:
1. ✅ Crear documento de arquitectura (este documento)
2. Inicializar proyecto backend (Node.js + Express)
3. Inicializar proyecto frontend (Vue 3 + Vite)
4. Configurar estructura de carpetas
5. Instalar dependencias básicas
6. Configurar CORS y conexión frontend-backend

**Archivos a crear**:
- `backend/package.json`
- `backend/src/app.js`
- `frontend/package.json`
- `frontend/src/main.js`
- `frontend/src/App.vue`

---

### FASE 2: Data Service y Datos de Prueba
**Objetivo**: Implementar obtención de datos históricos

**Tareas**:
1. Crear servicio de datos históricos
2. Implementar función para cargar CSV (datos de prueba)
3. O implementar integración con API gratuita (Yahoo Finance)
4. Crear datos de prueba en CSV para desarrollo
5. Implementar validación y normalización de datos

**Archivos a crear**:
- `backend/src/services/dataService.js`
- `backend/data/historical/EURUSD.csv` (datos de prueba)
- `backend/src/utils/validators.js`

---

### FASE 3: Motor de Backtesting
**Objetivo**: Implementar el core del sistema

**Tareas**:
1. Crear clase base Strategy
2. Implementar BacktestEngine
3. Implementar sistema de gestión de trades
4. Crear modelos Trade y BacktestResult
5. Implementar cálculo de equity curve

**Archivos a crear**:
- `backend/src/strategies/Strategy.js`
- `backend/src/services/backtestEngine.js`
- `backend/src/models/Trade.js`
- `backend/src/models/BacktestResult.js`

---

### FASE 4: Indicadores Técnicos
**Objetivo**: Implementar librería de indicadores

**Tareas**:
1. Implementar SMA
2. Implementar EMA
3. Implementar RSI
4. Implementar MACD
5. Crear tests unitarios para indicadores

**Archivos a crear**:
- `backend/src/utils/indicators.js`
- `backend/tests/indicators.test.js` (opcional)

---

### FASE 5: Estrategias de Trading
**Objetivo**: Implementar estrategias predefinidas

**Tareas**:
1. Implementar SMA Crossover Strategy
2. Implementar RSI Strategy
3. Implementar Breakout Strategy
4. Crear sistema de carga dinámica de estrategias
5. Validar estrategias con datos de prueba

**Archivos a crear**:
- `backend/src/strategies/SMA_Crossover.js`
- `backend/src/strategies/RSI_Strategy.js`
- `backend/src/strategies/Breakout_Strategy.js`
- `backend/src/services/strategyLoader.js`

---

### FASE 6: Cálculo de Métricas
**Objetivo**: Implementar análisis de rendimiento

**Tareas**:
1. Implementar cálculo de métricas básicas (win rate, profit factor)
2. Implementar cálculo de drawdown
3. Implementar Sharpe Ratio
4. Implementar métricas adicionales
5. Crear resumen de rendimiento

**Archivos a crear**:
- `backend/src/utils/metrics.js`

---

### FASE 7: API REST
**Objetivo**: Crear endpoints para el frontend

**Tareas**:
1. Crear controller de backtest
2. Implementar endpoint POST /api/backtest
3. Implementar endpoint GET /api/strategies
4. Implementar endpoint GET /api/symbols
5. Implementar manejo de errores
6. Documentar API

**Archivos a crear**:
- `backend/src/controllers/backtestController.js`
- `backend/src/routes/index.js`
- `backend/src/middleware/errorHandler.js`

---

### FASE 8: Frontend - Formulario
**Objetivo**: Crear interfaz de configuración

**Tareas**:
1. Crear componente BacktestForm
2. Implementar selección de par de divisas
3. Implementar selección de fechas
4. Implementar selección de estrategia
5. Implementar validación de formulario
6. Crear servicio API en frontend

**Archivos a crear**:
- `frontend/src/components/BacktestForm.vue`
- `frontend/src/services/api.js`
- `frontend/src/views/BacktestView.vue`

---

### FASE 9: Frontend - Visualización
**Objetivo**: Mostrar resultados del backtest

**Tareas**:
1. Implementar gráfico de Equity Curve
2. Crear panel de métricas
3. Crear tabla de trades
4. Implementar loading states
5. Implementar manejo de errores en UI
6. Mejorar diseño y responsividad

**Archivos a crear**:
- `frontend/src/components/EquityCurve.vue`
- `frontend/src/components/MetricsPanel.vue`
- `frontend/src/components/TradesTable.vue`
- `frontend/src/components/LoadingSpinner.vue`

---

### FASE 10: Refinamiento y Testing
**Objetivo**: Pulir y optimizar

**Tareas**:
1. Realizar pruebas end-to-end
2. Optimizar rendimiento del backtest
3. Mejorar manejo de errores
4. Agregar documentación de código
5. Crear README con instrucciones
6. Agregar configuración de parámetros de estrategias en UI

**Archivos a crear**:
- `README.md`
- `backend/.env.example`

---

## 🔧 Consideraciones Técnicas

### Performance
- Cachear datos históricos para evitar llamadas repetidas a API
- Usar datos diarios inicialmente (más manejable que intraday)
- Limitar rango de fechas a 5 años máximo inicialmente
- Considerar Web Workers para procesamiento en frontend (futuro)

### Escalabilidad Futura
- Agregar más pares de divisas
- Soportar timeframes (1h, 4h, daily, weekly)
- Permitir estrategias custom (editor de código)
- Agregar optimización de parámetros
- Walk-forward analysis
- Monte Carlo simulation

### Seguridad
- Validar todos los inputs
- Limitar rate de requests
- Sanitizar datos de API externa
- No exponer API keys en frontend

## 📝 Notas de Desarrollo

### Librerías Recomendadas

**Backend**:
```json
{
  "express": "^4.18.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "axios": "^1.6.0",
  "joi": "^17.11.0"
}
```

**Frontend**:
```json
{
  "vue": "^3.4.0",
  "vue-router": "^4.2.0",
  "axios": "^1.6.0",
  "chart.js": "^4.4.0",
  "vue-chartjs": "^5.3.0",
  "tailwindcss": "^3.4.0"
}
```

### APIs de Datos Gratuitas
1. **Yahoo Finance** (vía yfinance o similar) - Gratis, sin límites
2. **Alpha Vantage** - 25 requests/día gratis
3. **Twelve Data** - 800 requests/día gratis
4. **Datos CSV locales** - Mejor para desarrollo inicial

## ✅ Checklist de Progreso

- [x] Fase 1: Setup y Estructura Base
- [x] Fase 2: Data Service y Datos de Prueba
- [ ] Fase 3: Motor de Backtesting
- [ ] Fase 4: Indicadores Técnicos
- [ ] Fase 5: Estrategias de Trading
- [ ] Fase 6: Cálculo de Métricas
- [ ] Fase 7: API REST
- [ ] Fase 8: Frontend - Formulario
- [ ] Fase 9: Frontend - Visualización
- [ ] Fase 10: Refinamiento y Testing

---

## 🎯 Estado Actual

**Fase Actual**: FASE 3 - Motor de Backtesting
**Última Actualización**: 2025-12-12
**Progreso General**: 20%

---

## 📞 Próximos Pasos

En el siguiente prompt, comenzaremos con la **FASE 3**:
1. Crear clase base Strategy
2. Implementar BacktestEngine
3. Implementar sistema de gestión de trades
4. Crear modelos Trade y BacktestResult
5. Implementar cálculo de equity curve

Una vez completada la Fase 3, continuaremos con la Fase 4 y así sucesivamente, usando este documento como referencia en cada paso.
