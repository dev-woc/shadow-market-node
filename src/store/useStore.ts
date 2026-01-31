import { create } from 'zustand';
import { Product, products as initialProducts } from '@/data/products';
import { Transaction, generateInitialTransactions } from '@/data/transactions';
import { v4 as uuidv4 } from 'uuid';

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  balance: number;
  transactions: Transaction[];
  isAdminUnlocked: boolean;
  
  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: () => void;
  
  // Transaction actions
  requestRefund: (transaction: Transaction) => void;
  
  // Admin actions
  checkAdminUnlock: () => boolean;
  unlockAdmin: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  products: initialProducts,
  cart: [],
  balance: 1000.00,
  transactions: generateInitialTransactions(),
  isAdminUnlocked: false,
  
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          balance: parseFloat((state.balance - product.price).toFixed(2)),
        };
      }
      return {
        cart: [...state.cart, { ...product, quantity: 1 }],
        balance: parseFloat((state.balance - product.price).toFixed(2)),
      };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => {
      const item = state.cart.find((i) => i.id === productId);
      if (!item) return state;
      
      return {
        cart: state.cart.filter((i) => i.id !== productId),
        balance: parseFloat((state.balance + item.price * item.quantity).toFixed(2)),
      };
    });
  },
  
  clearCart: () => {
    set((state) => ({
      cart: [],
      balance: parseFloat((state.balance + state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)),
    }));
  },
  
  checkout: () => {
    const state = get();
    const newTransactions: Transaction[] = state.cart.map((item) => ({
      id: uuidv4(),
      orderId: uuidv4(),
      productName: item.name,
      amount: item.price,
      status: 'Completed' as const,
      date: new Date().toISOString(),
    }));
    
    set({
      cart: [],
      transactions: [...state.transactions, ...newTransactions],
    });
  },
  
  requestRefund: (transaction) => {
    // THE BUG: Creates a duplicate entry with "Refunded" status
    // Does NOT check if already refunded - allows infinite duplicates
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: uuidv4(), // New ID but same orderId
          status: 'Refunded' as const,
          date: new Date().toISOString(),
        },
      ],
      balance: parseFloat((state.balance + transaction.amount).toFixed(2)),
    }));
  },
  
  checkAdminUnlock: () => {
    const state = get();
    // Check if balance is exactly 0
    return Math.abs(state.balance) < 0.01;
  },
  
  unlockAdmin: () => {
    set({ isAdminUnlocked: true });
  },
}));
