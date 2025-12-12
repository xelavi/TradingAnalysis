class Trade {
  constructor({
    type,
    entryDate,
    entryPrice,
    size,
    stopLoss = null,
    takeProfit = null
  }) {
    this.type = type; // 'LONG' or 'SHORT'
    this.entryDate = entryDate;
    this.entryPrice = entryPrice;
    this.size = size;
    this.stopLoss = stopLoss;
    this.takeProfit = takeProfit;

    this.exitDate = null;
    this.exitPrice = null;
    this.profit = null;
    this.profitPercent = null;
    this.status = 'OPEN'; // 'OPEN' or 'CLOSED'
  }

  close(exitDate, exitPrice) {
    this.exitDate = exitDate;
    this.exitPrice = exitPrice;
    this.status = 'CLOSED';

    if (this.type === 'LONG') {
      this.profit = (this.exitPrice - this.entryPrice) * this.size;
      this.profitPercent = ((this.exitPrice - this.entryPrice) / this.entryPrice) * 100;
    } else if (this.type === 'SHORT') {
      this.profit = (this.entryPrice - this.exitPrice) * this.size;
      this.profitPercent = ((this.entryPrice - this.exitPrice) / this.entryPrice) * 100;
    }
  }
}

export default Trade;
