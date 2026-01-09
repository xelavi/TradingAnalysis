class Strategy {
  constructor(parameters = {}) {
    this.parameters = parameters;
  }

  /**
   * Initialize the strategy with historical data.
   * Useful for pre-calculating indicators.
   * @param {Array} data - Array of OHLC objects
   */
  initialize(data) {
    // Override to implement initialization logic
  }

  /**
   * Generate a trading signal for the current candle.
   * @param {Object} currentCandle - The current OHLC candle
   * @param {Array} historicalData - Array of OHLC objects up to the current index
   * @param {Number} currentIndex - Index of the current candle in the data array
   * @returns {String} 'BUY', 'SELL', or 'HOLD' (or null)
   */
  generateSignal(currentCandle, historicalData, currentIndex) {
    throw new Error('Must implement generateSignal');
  }
}

export default Strategy;
