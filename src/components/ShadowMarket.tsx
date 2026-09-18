import { motion } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import { useStore } from '@/store/useStore';

const COMING_SOON = [
  'THE UNDERBOSS', 'GHOST PROTOCOL', 'THE LEDGER', 'DEAD DROP', 'ENDGAME',
];

export const ShadowMarket = () => {
  const { isShadowMarketUnlocked } = useStore();

  if (!isShadowMarketUnlocked) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center gap-3">
        <DoorOpen className="w-8 h-8 text-primary" />
        <div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground neon-text">
            SHADOW MARKET
          </h2>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            THE DOORS SWING OPEN. YOU'RE INSIDE. BUT YOU'RE NOT ALONE — AND THE REAL GAME IS JUST BEGINNING.
          </p>
        </div>
      </div>

      <div className="border border-border rounded p-6 bg-secondary/30 font-mono text-sm text-muted-foreground">
        <p className="text-primary mb-3">// ACT II — COMING SOON</p>
        <ul className="space-y-1">
          {COMING_SOON.map((codename) => (
            <li key={codename}>[ ] {codename}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
