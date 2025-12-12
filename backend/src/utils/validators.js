
export const validateOHLC = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array');
  }

  return data.every(candle => {
    return (
      candle.date &&
      !isNaN(new Date(candle.date).getTime()) &&
      typeof candle.open === 'number' && !isNaN(candle.open) &&
      typeof candle.high === 'number' && !isNaN(candle.high) &&
      typeof candle.low === 'number' && !isNaN(candle.low) &&
      typeof candle.close === 'number' && !isNaN(candle.close)
    );
  });
};

export const normalizeData = (data) => {
    // Already doing normalization in dataService for now,
    // but this could contain logic to handle different source formats.
    return data;
}

export default {
    validateOHLC,
    normalizeData
}
