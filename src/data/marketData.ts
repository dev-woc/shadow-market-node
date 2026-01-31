export interface MarketDataPoint {
  time: string;
  price: number;
}

// Generate realistic-looking price fluctuations for "SLIDE-X Token"
export const generateMarketData = (): MarketDataPoint[] => {
  const data: MarketDataPoint[] = [];
  const now = new Date();
  let price = 150 + Math.random() * 50; // Start between 150-200
  
  // Generate 30 days of hourly data (720 points)
  for (let i = 720; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Random walk with momentum
    const change = (Math.random() - 0.48) * 8; // Slight upward bias
    price = Math.max(50, Math.min(400, price + change));
    
    // Add some volatility spikes
    if (Math.random() > 0.95) {
      price += (Math.random() - 0.5) * 30;
    }
    
    data.push({
      time: time.toISOString(),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  // Ensure there's a clear "buy low, sell high" opportunity
  // Find the lowest and highest points
  const minIndex = Math.floor(data.length * 0.3);
  const maxIndex = Math.floor(data.length * 0.7);
  
  // Create a dip and spike
  data[minIndex].price = 67.50; // Clear buy point
  data[maxIndex].price = 385.99; // Clear sell point
  
  return data;
};
