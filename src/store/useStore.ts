import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';
import { Transaction, generateInitialTransactions } from '@/data/transactions';
import { generatePuzzle, PuzzleConfig } from '@/lib/puzzleGenerator';
import { v4 as uuidv4 } from 'uuid';

interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  // User & Puzzle
  userSeed: string | null;
  puzzle: PuzzleConfig | null;

  // Store data
  products: Product[];
  cart: CartItem[];
  balance: number;
  target: number;
  transactions: Transaction[];
  isAdminUnlocked: boolean;

  // User actions
  initializeUser: (seed: string) => void;
  resetUser: () => void;

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

  // UI Actions
  isTerminalOpen: boolean;
  setTerminalOpen: (isOpen: boolean) => void;
}

// Default state when no user is set
const defaultState = {
  userSeed: null,
  puzzle: null,
  products: [],
  cart: [],
  balance: 0,
  target: 0,
  transactions: [],
  isAdminUnlocked: false,
  isTerminalOpen: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      initializeUser: (seed: string) => {
        const puzzle = generatePuzzle(seed);
        set({
          userSeed: seed,
          puzzle,
          products: puzzle.products,
          cart: [],
          balance: puzzle.target, // Start with balance = target
          target: puzzle.target,
          transactions: generateInitialTransactions(),
          isAdminUnlocked: false,
        });
      },

      resetUser: () => {
        set(defaultState);
      },

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

      setTerminalOpen: (isOpen) => {
        set({ isTerminalOpen: isOpen });
      },
    }),
    {
      name: 'shadow-market-storage',
      partialize: (state) => ({
        userSeed: state.userSeed,
        cart: state.cart,
        balance: state.balance,
        transactions: state.transactions,
        isAdminUnlocked: state.isAdminUnlocked,
      }),
    }
  )
);
