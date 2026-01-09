import Trade from '../models/Trade.js';
import BacktestResult from '../models/BacktestResult.js';

class BacktestEngine {
  constructor(initialCapital = 10000, positionSize = 1000) {
    this.initialCapital = initialCapital;
    this.currentCapital = initialCapital;
    this.positionSize = positionSize; // Can be fixed amount or percent logic later
    this.trades = [];
    this.equityCurve = [];
    this.currentPosition = null; // Handles one position at a time for MVP
  }

  run(strategy, data) {
    if (!data || data.length === 0) {
      throw new Error('No historical data provided');
    }

    // Initialize strategy
    strategy.initialize(data);

    // Initial equity point
    this.equityCurve.push({ date: data[0].date, value: this.currentCapital });

    for (let i = 0; i < data.length; i++) {
      const candle = data[i];

      // 1. Process Open Position (Check SL/TP or Exit Signals)
      if (this.currentPosition) {
        // Simple logic: Close on opposite signal (or specialized exit logic from strategy - future)
        // For now, let's assume the strategy might return 'SELL' to close a 'LONG'
        const signal = strategy.generateSignal(candle, data, i);

        if (this.currentPosition.type === 'LONG' && signal === 'SELL') {
          this.closePosition(candle.date, candle.close);
        } else if (this.currentPosition.type === 'SHORT' && signal === 'BUY') {
           this.closePosition(candle.date, candle.close);
        }

        // Note: Real backtesting needs to check High/Low for SL/TP hits within the candle.
        // For MVP, we use Close price.
      }

      // 2. Process Entry Signals (if no position)
      if (!this.currentPosition) {
        const signal = strategy.generateSignal(candle, data, i);

        if (signal === 'BUY') {
          this.openPosition('LONG', candle.date, candle.close);
        } else if (signal === 'SELL') {
          this.openPosition('SHORT', candle.date, candle.close);
        }
      }

      // 3. Update Equity Curve
      // Mark-to-market valuation could be added here.
      // For now, we update equity only on realized P&L or keep it static?
      // Better: Current Capital + Unrealized P&L
      let unrealizedPnL = 0;
      if (this.currentPosition) {
         if (this.currentPosition.type === 'LONG') {
             unrealizedPnL = (candle.close - this.currentPosition.entryPrice) * this.currentPosition.size;
         } else {
             unrealizedPnL = (this.currentPosition.entryPrice - candle.close) * this.currentPosition.size;
         }
      }

      this.equityCurve.push({
        date: candle.date,
        value: this.currentCapital + unrealizedPnL
      });
    }

    // Close any remaining position at the end
    if (this.currentPosition) {
        const lastCandle = data[data.length - 1];
        this.closePosition(lastCandle.date, lastCandle.close);
    }

    return this.calculateResults();
  }

  openPosition(type, date, price) {
    // Basic position sizing: predefined unit size
    const size = this.positionSize;

    this.currentPosition = new Trade({
      type,
      entryDate: date,
      entryPrice: price,
      size
    });
  }

  closePosition(date, price) {
    if (!this.currentPosition) return;

    this.currentPosition.close(date, price);
    this.currentCapital += this.currentPosition.profit;
    this.trades.push(this.currentPosition);
    this.currentPosition = null;
  }

  calculateResults() {
    const winningTrades = this.trades.filter(t => t.profit > 0).length;
    const losingTrades = this.trades.filter(t => t.profit <= 0).length;
    const totalTrades = this.trades.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    const grossProfit = this.trades.reduce((acc, t) => acc + (t.profit > 0 ? t.profit : 0), 0);
    const grossLoss = this.trades.reduce((acc, t) => acc + (t.profit < 0 ? Math.abs(t.profit) : 0), 0);
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    // Calculate Max Drawdown
    let maxDrawdown = 0;
    let peak = -Infinity;

    for (const point of this.equityCurve) {
        if (point.value > peak) {
            peak = point.value;
        }
        const drawdown = point.value - peak;
        if (drawdown < maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    return new BacktestResult({
      initialCapital: this.initialCapital,
      finalCapital: this.currentCapital,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      profitFactor,
      maxDrawdown,
      trades: this.trades,
      equityCurve: this.equityCurve
    });
  }
}

export default BacktestEngine;
