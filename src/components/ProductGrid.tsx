import { useState, useMemo } from 'react';
import { Search, Download, Grid, List, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ProductGrid = () => {
  const { products, setTerminalOpen } = useStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const exportToCSV = () => {
    const headers = ['SKU', 'Name', 'Price', 'Category'];
    const rows = products.map((p) => [p.sku, p.name, p.price.toFixed(2), p.category]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "DATA EXPORTED",
      description: "inventory.csv downloaded successfully",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="SEARCH INVENTORY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>

          <Button
            onClick={() => setTerminalOpen(true, true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs gap-2 animate-pulse"
          >
            <Terminal className="w-4 h-4" />
            READY TO SLIDE
          </Button>

          <Button
            onClick={exportToCSV}
            className="bg-secondary text-foreground border border-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs gap-2"
          >
            <Download className="w-4 h-4" />
            EXPORT DATA
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4 font-mono">
        DISPLAYING {filteredProducts.length} / {products.length} ITEMS
      </p>

      {/* Product Grid */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-2'} overflow-y-auto flex-1 pr-2`}>
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.01 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
