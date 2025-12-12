class BacktestResult {
  constructor({
    initialCapital,
    finalCapital,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    profitFactor,
    maxDrawdown,
    trades,
    equityCurve
  }) {
    this.initialCapital = initialCapital;
    this.finalCapital = finalCapital;
    this.totalTrades = totalTrades;
    this.winningTrades = winningTrades;
    this.losingTrades = losingTrades;
    this.winRate = winRate;
    this.profitFactor = profitFactor;
    this.maxDrawdown = maxDrawdown;
    this.trades = trades;
    this.equityCurve = equityCurve;
    this.netProfit = finalCapital - initialCapital;
    this.netProfitPercent = (this.netProfit / initialCapital) * 100;
  }
}

export default BacktestResult;
