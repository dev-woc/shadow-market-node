import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '@/store/useStore';

export const BalanceDisplay = () => {
  const { balance } = useStore();
  
  const isLow = balance < 100;
  const isZero = Math.abs(balance) < 0.01;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-2 rounded border ${
        isZero
          ? 'bg-primary/20 border-primary neon-border'
          : isLow
          ? 'bg-neon-red/10 border-neon-red/50'
          : 'bg-secondary border-border'
      }`}
    >
      <Wallet className={`w-4 h-4 ${isZero ? 'text-primary' : isLow ? 'text-neon-red' : 'text-foreground'}`} />
      
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          {isZero ? '[ RARE ]' : 'BALANCE'}
        </span>
        <motion.span
          key={balance}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`font-mono font-bold text-lg ${
            isZero ? 'text-primary neon-text' : isLow ? 'text-neon-red' : 'text-foreground'
          }`}
        >
          ${balance.toFixed(2)}
        </motion.span>
      </div>

      {isZero ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-1 flex items-center gap-1"
        >
          <TrendingUp className="w-4 h-4 text-primary" />
        </motion.div>
      ) : isLow ? (
        <TrendingDown className="w-4 h-4 text-neon-red ml-1" />
      ) : null}
    </motion.div>
  );
};
