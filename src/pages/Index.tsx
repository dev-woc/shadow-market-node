import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { OrderHistory } from '@/components/OrderHistory';

const Index = () => {
  const [activeTab, setActiveTab] = useState('store');

  return (
    <div className="min-h-screen flex flex-col bg-background terminal-grid crt-scanlines">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              {/* Store Header */}
              <div className="mb-6">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-bold text-2xl md:text-3xl text-foreground neon-text"
                >
                  INVENTORY DATABASE
                </motion.h2>
                <p className="text-sm text-muted-foreground font-mono mt-2">
                  BROWSE // ACQUIRE // DOMINATE
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs font-mono">
                  <span className="text-muted-foreground">
                    TARGET: <span className="text-primary">$1,000.00</span>
                  </span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">
                    OBJECTIVE: <span className="text-neon-red">DEPLETE TO $0.00</span>
                  </span>
                </div>
              </div>
              
              <ProductGrid />
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <OrderHistory />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
