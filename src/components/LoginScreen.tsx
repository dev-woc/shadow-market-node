import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, User, ArrowRight, Shuffle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginScreen = () => {
  const { initializeUser } = useStore();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    // Small delay for effect
    setTimeout(() => {
      initializeUser(username.trim().toLowerCase());
    }, 800);
  };

  const generateRandomSeed = () => {
    const adjectives = ['shadow', 'ghost', 'phantom', 'cyber', 'void', 'dark', 'silent', 'crypto'];
    const nouns = ['runner', 'hacker', 'agent', 'wolf', 'fox', 'hawk', 'viper', 'reaper'];
    const num = Math.floor(Math.random() * 999);
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    setUsername(`${adj}_${noun}_${num}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background terminal-grid crt-scanlines p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-6">
          <Terminal className="w-6 h-6 text-primary" />
          <h1 className="font-display font-bold text-2xl text-foreground neon-text">
            SHADOW MARKET
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-secondary border border-border rounded-lg p-6">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground font-mono mb-2">
              {'>'} INITIALIZING CONNECTION...
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              {'>'} ENTER OPERATIVE ID TO CONTINUE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-mono">
                OPERATIVE ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="enter_username"
                  className="pl-10 bg-background border-border font-mono"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomSeed}
                disabled={isLoading}
                className="border-border text-muted-foreground hover:text-foreground"
              >
                <Shuffle className="w-4 h-4" />
              </Button>

              <Button
                type="submit"
                disabled={!username.trim() || isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Terminal className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <>
                    CONNECT
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-mono">
              {'>'} Each operative receives a unique mission
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {'>'} Same ID = Same puzzle
            </p>
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground font-mono mt-4">
          v0.4.2 // SHADOW_NODE_ACTIVE
        </p>
      </motion.div>
    </div>
  );
};
