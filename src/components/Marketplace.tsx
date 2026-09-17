import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { generateMarketData, MarketDataPoint } from '@/data/marketData';
import { verifyWashSolution, WashResult } from '@/lib/marketPuzzleGenerator';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const washFeedbackMessage = (result: WashResult): string => {
  switch (result.status) {
    case 'buy-price-not-found':
      return 'BUY PRICE NOT FOUND IN HISTORY';
    case 'sell-price-not-found':
      return 'SELL PRICE NOT FOUND IN HISTORY';
    case 'wrong-order':
      return 'SELL MUST OCCUR AFTER BUY — CHECK CHRONOLOGICAL ORDER';
    case 'not-optimal':
      return `$${result.profit.toFixed(2)} PROFIT — NOT THE OPTIMAL TRADE`;
    case 'success':
      return 'OPTIMAL TRADE EXECUTED';
  }
};

export const Marketplace = () => {
  const { marketPuzzle, hasWashedCredits, completeWash } = useStore();
  const { toast } = useToast();
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [buyPriceInput, setBuyPriceInput] = useState('');
  const [sellPriceInput, setSellPriceInput] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    const data = generateMarketData();
    setMarketData(data);
    setCurrentPrice(data[data.length - 1].price);
    
    const startPrice = data[0].price;
    const endPrice = data[data.length - 1].price;
    setPriceChange(((endPrice - startPrice) / startPrice) * 100);
  }, []);

  // Simulate live price updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setMarketData(prev => {
        if (prev.length === 0) return prev;
        
        const lastPrice = prev[prev.length - 1].price;
        const change = (Math.random() - 0.48) * 3;
        const newPrice = Math.max(50, Math.min(400, lastPrice + change));
        
        const newPoint: MarketDataPoint = {
          time: new Date().toISOString(),
          price: parseFloat(newPrice.toFixed(2)),
        };
        
        setCurrentPrice(newPoint.price);
        
        // Keep last 720 points
        const updated = [...prev.slice(1), newPoint];
        return updated;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLive]);

  const handleDownloadHistory = () => {
    if (!marketPuzzle) return;

    // Chronological order matters here — the trade must be buy-before-sell,
    // so unlike the old cosmetic export, this data is never shuffled.
    const blob = new Blob([JSON.stringify(marketPuzzle.priceHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'market_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmitTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketPuzzle) return;

    const buy = parseFloat(buyPriceInput);
    const sell = parseFloat(sellPriceInput);
    if (isNaN(buy) || isNaN(sell)) {
      setFeedback({ ok: false, message: 'ENTER VALID BUY AND SELL PRICES' });
      return;
    }

    const result = verifyWashSolution(marketPuzzle, buy, sell);
    setFeedback({ ok: result.status === 'success', message: washFeedbackMessage(result) });

    if (result.status === 'success') {
      completeWash(result.profit);
      toast({
        title: 'CREDITS LAUNDERED',
        description: `$${result.profit.toFixed(2)} profit credited to balance`,
      });
    }
  };

  // Format data for chart display (show fewer points for performance)
  const chartData = marketData.filter((_, i) => i % 6 === 0).map(point => ({
    ...point,
    displayTime: new Date(point.time).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit'
    }),
  }));

  const minPrice = Math.min(...marketData.map(d => d.price));
  const maxPrice = Math.max(...marketData.map(d => d.price));

  if (!marketPuzzle) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-2xl md:text-3xl text-foreground neon-text"
          >
            MARKETPLACE
          </motion.h2>
          <p className="text-sm text-muted-foreground font-mono mt-2">
            TRADE // ANALYZE // PROFIT
          </p>
        </div>
        
        <Button
          onClick={handleDownloadHistory}
          className="bg-secondary hover:bg-secondary/80 text-foreground font-mono gap-2"
        >
          <Download className="w-4 h-4" />
          DOWNLOAD HISTORY
        </Button>
      </div>

      {/* Token Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6 relative overflow-hidden"
      >
        {/* Glitch overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          {/* Token Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">SLIDE-X TOKEN</h3>
                <p className="text-sm text-muted-foreground font-mono">$SLDX • Underground Asset</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                isLive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                <Activity className="w-3 h-3" />
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Price Display */}
          <div className="flex items-end gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground font-mono mb-1">CURRENT PRICE</p>
              <p className="font-mono text-4xl font-bold text-foreground">
                ${currentPrice.toFixed(2)}
              </p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded ${
              priceChange >= 0 ? 'bg-primary/20 text-primary' : 'bg-neon-red/20 text-neon-red'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-mono text-sm font-bold">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-background/50 rounded-lg border border-border/50">
            <div>
              <p className="text-xs text-muted-foreground font-mono">24H LOW</p>
              <p className="font-mono text-lg text-neon-red">${minPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">24H HIGH</p>
              <p className="font-mono text-lg text-primary">${maxPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">VOLUME</p>
              <p className="font-mono text-lg text-foreground">2.4M</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-mono">MARKET CAP</p>
              <p className="font-mono text-lg text-foreground">$847M</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="displayTime" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                  domain={['dataMin - 20', 'dataMax + 20']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                />
                <ReferenceLine y={minPrice} stroke="hsl(var(--neon-red))" strokeDasharray="5 5" opacity={0.5} />
                <ReferenceLine y={maxPrice} stroke="hsl(var(--primary))" strokeDasharray="5 5" opacity={0.5} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Hint */}
          <div className="mt-4 p-3 bg-neon-red/10 border border-neon-red/30 rounded-lg">
            <p className="text-xs text-neon-red font-mono">
              ⚠ INTEL: Historical data suggests optimal entry/exit points exist.
              Download and analyze to find the maximum profit window.
            </p>
          </div>
        </div>
      </motion.div>

      {/* The Wash — execute the laundering trade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="font-display font-bold text-lg text-foreground mb-1">THE WASH</h3>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-4">
          Execute one perfect trade to launder the dirty credits
        </p>

        {hasWashedCredits ? (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary neon-text">
              TRADE EXECUTED — CREDITS LAUNDERED
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmitTrade} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  Buy Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={buyPriceInput}
                  onChange={(e) => setBuyPriceInput(e.target.value)}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  Sell Price
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={sellPriceInput}
                  onChange={(e) => setSellPriceInput(e.target.value)}
                  placeholder="0.00"
                  className="font-mono"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground font-mono">
              EXECUTE TRADE
            </Button>
            {feedback && (
              <p className={`text-xs font-mono ${feedback.ok ? 'text-primary neon-text' : 'text-neon-red'}`}>
                {feedback.ok ? '✔' : '⚠'} {feedback.message}
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};
