import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { Product } from '@/data/products';
import { useStore } from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, balance } = useStore();
  const { toast } = useToast();

  const handleBuy = () => {
    if (balance < product.price) {
      toast({
        title: "INSUFFICIENT FUNDS",
        description: `Balance: $${balance.toFixed(2)} | Required: $${product.price.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product);
    toast({
      title: "ITEM ACQUIRED",
      description: `${product.name} added to cart`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-card border border-border rounded p-4 glitch-hover group"
    >
      {/* Category badge */}
      <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-secondary border border-border rounded font-mono text-muted-foreground">
        {product.category}
      </div>
      
      {/* SKU */}
      <p className="text-[10px] text-muted-foreground font-mono mb-2">{product.sku}</p>
      
      {/* Product name */}
      <h3 className="font-display font-bold text-sm text-foreground mb-3 pr-16 leading-tight">
        {product.name}
      </h3>
      
      {/* Price */}
      <div className="flex items-center justify-between">
        <span className="price-tag text-lg text-primary neon-text">
          ${product.price.toFixed(2)}
        </span>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBuy}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded border border-primary hover:neon-border transition-all"
        >
          <Plus className="w-3 h-3" />
          BUY
        </motion.button>
      </div>
      
      {/* Hover scanline effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden rounded">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scanline" />
      </div>
    </motion.div>
  );
};
