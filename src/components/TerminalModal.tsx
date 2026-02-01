import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Lock, Unlock, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalModal = ({ isOpen, onClose }: TerminalModalProps) => {
  const { balance, checkAdminUnlock, unlockAdmin, isAdminUnlocked } = useStore();
  const [commandHistory, setCommandHistory] = useState<string[]>([
    '> SYSTEM STATUS: ACTIVE',
    '> AUTH_MODULE: LOADED',
    '> AWAITING INPUT...',
  ]);
  const [currentInput, setCurrentInput] = useState('');

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cmd = currentInput.trim().toLowerCase();
    setCommandHistory((prev) => [...prev, `$ ${currentInput}`]);
    
    if (cmd === 'help') {
      setCommandHistory((prev) => [
        ...prev,
        '> AVAILABLE COMMANDS:',
        '>   help     - Show this message',
        '>   status   - Check system status',
        '>   balance  - Check current balance',
        '>   unlock   - Attempt admin unlock',
        '>   clear    - Clear terminal',
      ]);
    } else if (cmd === 'status') {
      setCommandHistory((prev) => [
        ...prev,
        '> SYSTEM: SLIDE_NATION_v3.7.2',
        '> UPTIME: 99.97%',
        `> ADMIN: ${isAdminUnlocked ? 'UNLOCKED' : 'LOCKED'}`,
        '> SECURITY: NOMINAL',
      ]);
    } else if (cmd === 'balance') {
      setCommandHistory((prev) => [
        ...prev,
        `> CURRENT_BALANCE: $${balance.toFixed(2)}`,
        balance === 0 ? '> WARNING: BALANCE DEPLETED' : '> STATUS: ACTIVE',
      ]);
    } else if (cmd === 'unlock') {
      if (checkAdminUnlock()) {
        unlockAdmin();
        setCommandHistory((prev) => [
          ...prev,
          '> ████████████████████████████████',
          '> ██   BASED ACCESS GRANTED    ██',
          '> ██         [ RARE ]          ██',
          '> ████████████████████████████████',
          '> TWO_SUM VALIDATION: PASSED',
          '> YOU ARE SPECIAL, OPERATOR.',
        ]);
      } else {
        setCommandHistory((prev) => [
          ...prev,
          '> ERROR: UNLOCK FAILED',
          `> BALANCE_CHECK: $${balance.toFixed(2)} != $0.00`,
          '> HINT: DEPLETE BALANCE TO EXACTLY $0.00',
          '> USE THE TWO_SUM EXPLOIT.',
        ]);
      }
    } else if (cmd === 'clear') {
      setCommandHistory(['> TERMINAL CLEARED', '> AWAITING INPUT...']);
    } else if (cmd) {
      setCommandHistory((prev) => [
        ...prev,
        `> ERROR: UNKNOWN COMMAND '${currentInput}'`,
        '> TYPE "help" FOR AVAILABLE COMMANDS',
      ]);
    }
    
    setCurrentInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4 bg-terminal-bg border border-primary rounded overflow-hidden neon-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm text-foreground">SLIDE_NATION://ADMIN</span>
              </div>
              <div className="flex items-center gap-3">
                {isAdminUnlocked ? (
                  <div className="flex items-center gap-1 text-primary">
                    <Unlock className="w-3 h-3" />
                    <span className="text-xs font-mono">UNLOCKED</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-neon-red">
                    <Lock className="w-3 h-3" />
                    <span className="text-xs font-mono">LOCKED</span>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="h-80 overflow-y-auto p-4 font-mono text-sm terminal-grid crt-scanlines">
              {commandHistory.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${
                    line.startsWith('> ERROR') || line.startsWith('> WARNING')
                      ? 'text-neon-red'
                      : line.startsWith('> ██') || line.includes('GRANTED')
                      ? 'text-primary neon-text'
                      : 'text-muted-foreground'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleCommand} className="flex items-center border-t border-border">
              <span className="px-4 text-primary font-mono">$</span>
              <Input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 font-mono text-foreground"
                autoFocus
              />
              <Button
                type="submit"
                variant="ghost"
                className="px-4 text-primary hover:bg-primary/20"
              >
                EXECUTE
              </Button>
            </form>

            {/* Hint */}
            {!isAdminUnlocked && (
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border-t border-border">
                <AlertCircle className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">
                  HINT: Find two items that sum to exactly $1,000.00 to unlock admin access
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
