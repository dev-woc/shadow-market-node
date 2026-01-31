import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Menu, X } from 'lucide-react';
import { BalanceDisplay } from './BalanceDisplay';
import { Cart } from './Cart';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'store', label: 'STOREFRONT' },
    { id: 'orders', label: 'ORDER HISTORY' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Gauge className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground tracking-wider">
                SLIDE NATION
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">
                UNDERGROUND RACING SUPPLY
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 font-mono text-sm rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <BalanceDisplay />
            </div>
            <Cart />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Balance */}
        <div className="sm:hidden pb-3">
          <BalanceDisplay />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-1"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 font-mono text-sm rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
};
