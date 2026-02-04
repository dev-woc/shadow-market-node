import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "@/store/useStore";

describe("useStore", () => {
  beforeEach(() => {
    // Reset store to default state before each test
    useStore.setState({
      userSeed: null,
      puzzle: null,
      products: [],
      cart: [],
      balance: 1000,
      target: 1000,
      transactions: [],
      isAdminUnlocked: false,
      isTerminalOpen: false,
      terminalCodeMode: false,
    });
  });

  describe("cart operations", () => {
    const mockProduct = {
      id: "test-1",
      name: "Test Product",
      price: 100,
      category: "Test",
      sku: "TST-001",
    };

    it("should add item to cart", () => {
      const { addToCart } = useStore.getState();
      addToCart(mockProduct);

      const state = useStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].name).toBe("Test Product");
      expect(state.cart[0].quantity).toBe(1);
    });

    it("should deduct balance when adding to cart", () => {
      const { addToCart } = useStore.getState();
      addToCart(mockProduct);

      const state = useStore.getState();
      expect(state.balance).toBe(900);
    });

    it("should increment quantity for duplicate items", () => {
      const { addToCart } = useStore.getState();
      addToCart(mockProduct);
      addToCart(mockProduct);

      const state = useStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(2);
      expect(state.balance).toBe(800);
    });

    it("should remove item from cart", () => {
      const { addToCart, removeFromCart } = useStore.getState();
      addToCart(mockProduct);
      removeFromCart(mockProduct.id);

      const state = useStore.getState();
      expect(state.cart).toHaveLength(0);
    });

    it("should restore balance when removing from cart", () => {
      const { addToCart, removeFromCart } = useStore.getState();
      addToCart(mockProduct);
      addToCart(mockProduct); // quantity = 2, balance = 800
      removeFromCart(mockProduct.id);

      const state = useStore.getState();
      expect(state.balance).toBe(1000); // Full refund for both quantities
    });

    it("should clear entire cart", () => {
      const { addToCart, clearCart } = useStore.getState();
      addToCart(mockProduct);
      addToCart({ ...mockProduct, id: "test-2", name: "Another Product" });
      clearCart();

      const state = useStore.getState();
      expect(state.cart).toHaveLength(0);
      expect(state.balance).toBe(1000);
    });
  });

  describe("checkout", () => {
    const mockProduct = {
      id: "test-1",
      name: "Test Product",
      price: 250,
      category: "Test",
      sku: "TST-001",
    };

    it("should clear cart on checkout", () => {
      const { addToCart, checkout } = useStore.getState();
      addToCart(mockProduct);
      checkout();

      const state = useStore.getState();
      expect(state.cart).toHaveLength(0);
    });

    it("should create transaction records on checkout", () => {
      const { addToCart, checkout } = useStore.getState();
      addToCart(mockProduct);
      checkout();

      const state = useStore.getState();
      expect(state.transactions).toHaveLength(1);
      expect(state.transactions[0].productName).toBe("Test Product");
      expect(state.transactions[0].amount).toBe(250);
      expect(state.transactions[0].status).toBe("Completed");
    });

    it("should preserve balance after checkout", () => {
      const { addToCart, checkout } = useStore.getState();
      addToCart(mockProduct);
      const balanceBeforeCheckout = useStore.getState().balance;
      checkout();

      const state = useStore.getState();
      expect(state.balance).toBe(balanceBeforeCheckout);
    });
  });

  describe("refund system", () => {
    const mockTransaction = {
      id: "txn-1",
      orderId: "order-1",
      productName: "Refundable Item",
      amount: 150,
      status: "Completed" as const,
      date: new Date().toISOString(),
    };

    it("should add refund to balance", () => {
      useStore.setState({ transactions: [mockTransaction] });
      const { requestRefund } = useStore.getState();
      requestRefund(mockTransaction);

      const state = useStore.getState();
      expect(state.balance).toBe(1150);
    });

    it("should create refunded transaction record", () => {
      useStore.setState({ transactions: [mockTransaction] });
      const { requestRefund } = useStore.getState();
      requestRefund(mockTransaction);

      const state = useStore.getState();
      expect(state.transactions).toHaveLength(2);
      expect(state.transactions[1].status).toBe("Refunded");
    });

    it("should allow duplicate refunds (the bug)", () => {
      useStore.setState({ transactions: [mockTransaction] });
      const { requestRefund } = useStore.getState();

      requestRefund(mockTransaction);
      requestRefund(mockTransaction);
      requestRefund(mockTransaction);

      const state = useStore.getState();
      expect(state.transactions).toHaveLength(4); // Original + 3 refunds
      expect(state.balance).toBe(1450); // 1000 + 150 * 3
    });
  });

  describe("admin unlock", () => {
    it("should return true when balance is zero", () => {
      useStore.setState({ balance: 0 });
      const { checkAdminUnlock } = useStore.getState();
      expect(checkAdminUnlock()).toBe(true);
    });

    it("should return true when balance is near zero", () => {
      useStore.setState({ balance: 0.005 });
      const { checkAdminUnlock } = useStore.getState();
      expect(checkAdminUnlock()).toBe(true);
    });

    it("should return false when balance is not zero", () => {
      useStore.setState({ balance: 100 });
      const { checkAdminUnlock } = useStore.getState();
      expect(checkAdminUnlock()).toBe(false);
    });

    it("should set isAdminUnlocked to true", () => {
      const { unlockAdmin } = useStore.getState();
      unlockAdmin();

      const state = useStore.getState();
      expect(state.isAdminUnlocked).toBe(true);
    });
  });

  describe("terminal state", () => {
    it("should toggle terminal open state", () => {
      const { setTerminalOpen } = useStore.getState();
      setTerminalOpen(true);

      expect(useStore.getState().isTerminalOpen).toBe(true);

      setTerminalOpen(false);
      expect(useStore.getState().isTerminalOpen).toBe(false);
    });

    it("should set code mode when opening terminal", () => {
      const { setTerminalOpen } = useStore.getState();
      setTerminalOpen(true, true);

      const state = useStore.getState();
      expect(state.isTerminalOpen).toBe(true);
      expect(state.terminalCodeMode).toBe(true);
    });
  });
});
