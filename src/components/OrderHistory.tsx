import { useState } from 'react';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { shuffleArray, Transaction } from '@/data/transactions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const OrderHistory = () => {
  const { transactions, requestRefund, isAdminUnlocked, hasDepletedBalance } = useStore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleRefund = async (transaction: Transaction) => {
    if (transaction.status !== 'Completed') {
      toast({
        title: "REFUND DENIED",
        description: "Only completed orders can be refunded",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(transaction.id);
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // THE EXPLOIT: Request refund without checking for duplicates
    requestRefund(transaction);
    
    toast({
      title: "REFUND PROCESSED",
      description: `$${transaction.amount.toFixed(2)} credited to balance`,
    });
    
    setProcessingId(null);
  };

  const exportLogs = () => {
    // CRITICAL: Shuffle the transactions before export
    const shuffledTransactions = shuffleArray(transactions);
    
    const json = JSON.stringify(shuffledTransactions, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "LOGS EXPORTED",
      description: `${transactions.length} records saved to transactions.json`,
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-primary';
      case 'Refunded':
        return 'text-neon-red';
      case 'Pending':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">TRANSACTION LOG</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {transactions.length} RECORDS FOUND
          </p>
        </div>
        
        <Button
          onClick={exportLogs}
          className="bg-secondary text-foreground border border-primary hover:bg-primary hover:text-primary-foreground font-mono text-xs gap-2"
        >
          <Download className="w-4 h-4" />
          EXPORT LOGS
        </Button>
      </div>

      {/* Warning - only show after challenge is solved */}
      {isAdminUnlocked && (
        <div className="flex items-center gap-2 p-3 bg-secondary/50 border border-neon-red/30 rounded mb-4">
          <AlertTriangle className="w-4 h-4 text-neon-red flex-shrink-0" />
          <p className="text-xs text-muted-foreground font-mono">
            REFUND SYSTEM v2.3.1 - LEGACY MODE ACTIVE
          </p>
        </div>
      )}

      {/* Transaction Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background">
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-mono text-muted-foreground">ORDER ID</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-muted-foreground">PRODUCT</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-muted-foreground">AMOUNT</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-muted-foreground">DATE</th>
              <th className="text-left py-3 px-2 text-xs font-mono text-muted-foreground">STATUS</th>
              <th className="text-right py-3 px-2 text-xs font-mono text-muted-foreground">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {transactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-2 text-xs font-mono text-muted-foreground">
                    {transaction.orderId.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-2 text-sm text-foreground">
                    {transaction.productName}
                  </td>
                  <td className="py-3 px-2 text-sm font-mono text-primary">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-xs font-mono text-muted-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className={`py-3 px-2 text-xs font-mono font-bold ${getStatusColor(transaction.status)}`}>
                    {transaction.status.toUpperCase()}
                  </td>
                  <td className="py-3 px-2 text-right">
                    {isAdminUnlocked && hasDepletedBalance && transaction.status === 'Completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefund(transaction)}
                        disabled={processingId === transaction.id}
                        className="text-neon-red hover:bg-neon-red/20 text-xs font-mono h-7"
                      >
                        {processingId === transaction.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          'REQUEST REFUND'
                        )}
                      </Button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
