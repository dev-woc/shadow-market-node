import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, CreditCard } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const Cart = () => {
  const { cart, balance, removeFromCart, clearCart, checkout, checkAdminUnlock, unlockAdmin } = useStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "CART EMPTY",
        description: "Add items before checkout",
        variant: "destructive",
      });
      return;
    }

    const itemCount = cart.length;
    checkout();

    // Check if puzzle is solved (balance depleted to $0)
    if (checkAdminUnlock()) {
      unlockAdmin();
      toast({
        title: "SYSTEM BREACH DETECTED",
        description: "Balance depleted. Refund system now accessible in Order History.",
      });
    } else {
      toast({
        title: "ORDER CONFIRMED",
        description: `${itemCount} items purchased successfully`,
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded hover:border-primary transition-colors"
      >
        <ShoppingCart className="w-4 h-4 text-foreground" />
        <span className="font-mono text-sm text-foreground">{cart.length}</span>
        {cart.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold"
          >
            {cart.length}
          </motion.div>
        )}
      </motion.button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="font-display font-bold text-lg text-foreground">CART</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-mono text-sm">CART EMPTY</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-3 bg-secondary rounded border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
                          {item.quantity > 1 && (
                            <span className="text-xs font-mono text-primary/70">×{item.quantity}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-neon-red/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-neon-red" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 pb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-sm">SUBTOTAL</span>
                  <span className="font-mono text-lg text-primary">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  {cart.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="flex-1 border-border text-muted-foreground hover:text-foreground"
                    >
                      CLEAR
                    </Button>
                  )}
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    CHECKOUT
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
