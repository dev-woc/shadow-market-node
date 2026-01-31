import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  orderId: string;
  productName: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Refunded';
  date: string;
}

const sampleProducts = [
  { name: "Turbocharger Kit", price: 299.99 },
  { name: "Carbon Fiber Spoiler", price: 189.50 },
  { name: "Racing Brake Pads", price: 124.75 },
  { name: "Performance Exhaust", price: 449.00 },
  { name: "Nitrous Oxide System", price: 599.99 },
  { name: "Coilover Suspension", price: 879.25 },
  { name: "Cold Air Intake", price: 234.50 },
  { name: "Racing Clutch", price: 345.00 },
  { name: "Lightweight Flywheel", price: 267.80 },
  { name: "Performance Headers", price: 412.33 },
];

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const generateInitialTransactions = (): Transaction[] => {
  return sampleProducts.map((product, index) => ({
    id: uuidv4(),
    orderId: uuidv4(),
    productName: product.name,
    amount: product.price,
    status: 'Completed' as const,
    date: generateDate(index + 1),
  }));
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
