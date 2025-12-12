import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser'; // We will need to install this or use fs with manual parsing

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data/historical');

export const loadData = (symbol, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DATA_DIR, `${symbol}.csv`);
    const results = [];

    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Data file for ${symbol} not found`));
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Parse and validate data row here or later
        // Assuming CSV has headers: date, open, high, low, close, volume
        const dateStr = data.date || data.Date || data.time || data.Time;
        const date = new Date(dateStr);

        // Filter by date range if provided
        if (startDate && date < new Date(startDate)) return;
        if (endDate && date > new Date(endDate)) return;

        results.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD
          open: parseFloat(data.open || data.Open),
          high: parseFloat(data.high || data.High),
          low: parseFloat(data.low || data.Low),
          close: parseFloat(data.close || data.Close),
          volume: parseInt(data.volume || data.Volume || 0, 10)
        });
      })
      .on('end', () => {
        // Sort by date just in case
        results.sort((a, b) => new Date(a.date) - new Date(b.date));
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export default {
  loadData
};
