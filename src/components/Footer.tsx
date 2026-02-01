import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Github, AlertTriangle } from 'lucide-react';
import { TerminalModal } from './TerminalModal';
import { useStore } from '@/store/useStore';

export const Footer = () => {
  const { isTerminalOpen, setTerminalOpen } = useStore();

  return (
    <>
      <footer className="border-t border-border bg-secondary/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-4">
              <span className="font-display font-bold text-foreground">SLIDE NATION</span>
              <span className="text-xs text-muted-foreground font-mono">v3.7.2</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors">
                TERMS
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors">
                PRIVACY
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground font-mono transition-colors">
                SUPPORT
              </a>

              {/* The Hidden Admin Link */}
              <motion.button
                onClick={() => setTerminalOpen(true)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary font-mono transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Terminal className="w-3 h-3" />
                SYSTEM STATUS
              </motion.button>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <AlertTriangle className="w-3 h-3" />
              <span>UNAUTHORIZED ACCESS PROHIBITED</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground font-mono">
              © 2024 SLIDE NATION UNDERGROUND. ALL RIGHTS RESERVED. FOR EDUCATIONAL PURPOSES ONLY.
            </p>
          </div>
        </div>
      </footer>

      <TerminalModal isOpen={isTerminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
};
