import { useState, useEffect } from 'react';
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
  const { balance, checkAdminUnlock, unlockAdmin, isAdminUnlocked, puzzle, products, target, terminalCodeMode } = useStore();
  const [commandHistory, setCommandHistory] = useState<string[]>([
    '> SYSTEM STATUS: ACTIVE',
    '> AUTH_MODULE: LOADED',
    '> AWAITING INPUT...',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [codeMode, setCodeMode] = useState(false);
  const [userCode, setUserCode] = useState(`// --- USER CODE HERE ---
// inventory = [{name, price, sku}, ...]
// target = number (balance to match)
// Return: [item1, item2]

var seen = {};
for (var i = 0; i < inventory.length; i++) {
  var item = inventory[i];
  var complement = Math.round((target - item.price) * 100) / 100;
  if (seen[complement]) {
    return [seen[complement], item];
  }
  seen[item.price] = item;
}
return null;

// --- END USER CODE ---`);

  // Open in code mode if requested
  useEffect(() => {
    if (isOpen && terminalCodeMode) {
      setCodeMode(true);
      setCommandHistory((prev) => [
        ...prev,
        '> CODE EDITOR ACTIVATED',
        '> Write your two-sum solver function',
        `> TARGET: $${target.toFixed(2)}`,
      ]);
    }
  }, [isOpen, terminalCodeMode, target]);

  const executeUserCode = () => {
    setCommandHistory((prev) => [...prev, '> EXECUTING CODE...']);

    try {
      // Prepare inventory data for the user's code
      const inventoryData = products.map(p => ({
        name: p.name,
        price: p.price,
        sku: p.sku,
        id: p.id,
      }));

      // Create and execute the function
      // User code is the function body, just needs to return [item1, item2]
      // eslint-disable-next-line no-new-func
      const solver = new Function('inventory', 'target', userCode);
      const result = solver(inventoryData, target);

      if (result && Array.isArray(result) && result.length === 2) {
        const [item1, item2] = result;
        const total = (item1.price + item2.price);
        const isCorrect = Math.abs(total - target) < 0.01;

        setCommandHistory((prev) => [
          ...prev,
          '> ═══════════════════════════════════════════',
          '> SOLUTION FOUND:',
          '> ───────────────────────────────────────────',
          `> [1] ${item1.name}`,
          `>     SKU: ${item1.sku}  PRICE: $${item1.price.toFixed(2)}`,
          '> ',
          `> [2] ${item2.name}`,
          `>     SKU: ${item2.sku}  PRICE: $${item2.price.toFixed(2)}`,
          '> ───────────────────────────────────────────',
          `> TOTAL: $${total.toFixed(2)}`,
          `> TARGET: $${target.toFixed(2)}`,
          `> STATUS: ${isCorrect ? 'VALID SOLUTION' : 'INVALID - DOES NOT MATCH TARGET'}`,
          '> ═══════════════════════════════════════════',
        ]);

        if (isCorrect) {
          unlockAdmin();
          setCommandHistory((prev) => [
            ...prev,
            '> ',
            '> ████████████████████████████████',
            '> ██   BASED ACCESS GRANTED    ██',
            '> ██         [ RARE ]          ██',
            '> ████████████████████████████████',
            '> ',
            '> VR CONSOLE UNLOCKED IN FOOTER!',
          ]);
        }
      } else {
        setCommandHistory((prev) => [
          ...prev,
          '> ERROR: Invalid return value',
          '> Expected: [item1, item2]',
        ]);
      }
    } catch (err: any) {
      setCommandHistory((prev) => [
        ...prev,
        `> ERROR: ${err.message}`,
        '> Check your code syntax',
      ]);
    }

    setCodeMode(false);
  };

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
        '>   code     - Open code editor (solve the puzzle)',
        '>   python   - Execute script files',
      ]);
    } else if (cmd === 'code') {
      setCodeMode(true);
      setCommandHistory((prev) => [
        ...prev,
        '> CODE EDITOR ACTIVATED',
        '> Write your two-sum solver function',
        `> TARGET: $${target.toFixed(2)}`,
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
    } else if (cmd.includes('python hack_gatekeeper.py --benchmark')) {
      // SIMULATED HACK SEQUENCE
      const runSimulation = async () => {
        setCommandHistory(prev => [...prev, '> INITIALIZING PYTHON ENV...', '> LOADING MODULES: csv, rich, complexity...']);
        await new Promise(r => setTimeout(r, 800));
        setCommandHistory(prev => [...prev, '> LOADING INVENTORY... [15,000 ITEMS]']);
        await new Promise(r => setTimeout(r, 1000));

        // Panel Header
        setCommandHistory(prev => [...prev,
          '╭────────────────────────────────╮',
          '│ INITIATING COMPLEXITY ANALYSIS │',
          '╰────────────────────────────────╯',
          'Dataset Size: 15,002 items'
        ]);
        await new Promise(r => setTimeout(r, 500));

        // Brute Force - hang
        setCommandHistory(prev => [...prev, '⠙ Brute Force (O(n²))...']);
        await new Promise(r => setTimeout(r, 3000)); // The "Hang"
        // Replace loading spinner with done
        setCommandHistory(prev => [...prev.slice(0, -1), '✔ Brute Force (O(n²))... 100% (11.24s)']);

        // Hash Map - instant
        setCommandHistory(prev => [...prev, '✔ Hash Map (O(n))...    100% (0.006s)']);
        await new Promise(r => setTimeout(r, 500));

        // Result
        setCommandHistory(prev => [...prev,
          '╭──────────────────── Benchmark Results ────────────────────╮',
          '│ Optimization Factor: 1755.3x FASTER                       │',
          '│ Status: ALGORITHM OPTIMIZED                               │',
          '╰───────────────────────────────────────────────────────────╯'
        ]);
        await new Promise(r => setTimeout(r, 800));

        // DISPLAY WINNING ITEMS
        if (puzzle && puzzle.solution) {
          const item1 = products.find(p => p.id === puzzle.solution.product1Id);
          const item2 = products.find(p => p.id === puzzle.solution.product2Id);

          if (item1 && item2) {
            setCommandHistory(prev => [...prev,
              '╭──────────────────── Purchase Manifest ────────────────────╮',
              '│ SKU        Item Name                   Price              │',
              '├───────────────────────────────────────────────────────────┤',
            `│ ${item1.sku.padEnd(10)} ${item1.name.padEnd(27)} $${item1.price.toFixed(2).padEnd(17)}│`,
            `│ ${item2.sku.padEnd(10)} ${item2.name.padEnd(27)} $${item2.price.toFixed(2).padEnd(17)}│`,
              '├───────────────────────────────────────────────────────────┤',
            `│ TOTAL      TARGET BALANCE              $${(item1.price + item2.price).toFixed(2).padEnd(17)}│`,
              '╰───────────────────────────────────────────────────────────╯'
            ]);
            await new Promise(r => setTimeout(r, 1000));
          }
        }

        // Unlock
        if (!isAdminUnlocked) {
          unlockAdmin();
          setCommandHistory(prev => [...prev,
            '> ROOT ACCESS: GRANTED',
            '> ADMIN PANEL: UNLOCKED',
          ]);
        } else {
          setCommandHistory(prev => [...prev, '> ADMIN PANEL: ALREADY UNLOCKED']);
        }
      };
      runSimulation();

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
            {!codeMode ? (
              <div className="h-80 overflow-y-auto p-4 font-mono text-sm terminal-grid crt-scanlines">
                {commandHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`${line.startsWith('> ERROR') || line.startsWith('> WARNING')
                      ? 'text-neon-red'
                      : line.startsWith('> ██') || line.includes('GRANTED') || line.includes('VALID SOLUTION')
                        ? 'text-primary neon-text'
                        : 'text-muted-foreground'
                      }`}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-80 flex flex-col p-4 terminal-grid">
                <div className="text-xs text-muted-foreground font-mono mb-2">
                  // inventory: [{'{'}name, price, sku{'}'}] | target: ${target.toFixed(2)}
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 bg-background border border-border rounded p-3 font-mono text-sm text-foreground resize-none focus:outline-none focus:border-primary"
                  spellCheck={false}
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    onClick={() => setCodeMode(false)}
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={executeUserCode}
                    className="flex-1 bg-primary text-primary-foreground"
                  >
                    RUN CODE
                  </Button>
                </div>
              </div>
            )}


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
