import { v4 as uuidv4 } from 'uuid';
import { createSeededRandom, seededRandomInt, seededShuffle } from './seededRandom';
import { Product } from '@/data/products';

// Product name pool
const productNames = [
  "Turbocharger Kit", "Carbon Fiber Spoiler", "Racing Brake Pads", "Performance Exhaust",
  "Nitrous Oxide System", "Coilover Suspension", "Cold Air Intake", "Racing Clutch",
  "Lightweight Flywheel", "Performance Headers", "Fuel Injectors", "ECU Tuner",
  "Racing Seats", "Harness Bar", "Roll Cage Kit", "Racing Wheel", "Quick Release Hub",
  "Shift Knob", "Short Shifter", "Strut Tower Brace", "Sway Bar Kit", "Control Arms",
  "Tie Rod Ends", "Ball Joints", "Wheel Bearings", "Axle Shafts", "Differential",
  "Limited Slip Diff", "Transmission Mount", "Engine Mount", "Oil Cooler", "Radiator",
  "Intercooler", "Blow Off Valve", "Wastegate", "Boost Controller", "Wideband O2",
  "Gauge Pod", "Tachometer", "Boost Gauge", "Oil Pressure Gauge", "AFR Gauge",
  "Racing Helmet", "Racing Suit", "Racing Gloves", "Racing Shoes", "HANS Device",
  "Fire Extinguisher", "Window Net", "Tow Hook", "Splitter", "Diffuser", "Side Skirts",
  "Fender Flares", "Hood Pins", "Hood Scoop", "Vented Hood", "Carbon Trunk", "Rear Wing",
  "Canards", "Wheel Spacers", "Lug Nuts", "Valve Stems", "Tire Pressure Monitor",
  "Racing Slicks", "Rain Tires", "Compound Upgrade", "Wheel Set", "Forged Wheels",
  "Carbon Ceramic Brakes", "Big Brake Kit", "Brake Fluid", "Brake Lines", "Master Cylinder",
  "Pedal Box", "Throttle Body", "Camshaft", "Valve Springs", "Pistons", "Connecting Rods",
  "Crankshaft", "Head Gasket", "Timing Belt", "Water Pump", "Fuel Pump", "Fuel Rail",
  "Catch Can", "Oil Filter", "Air Filter", "Spark Plugs", "Ignition Coils", "Wiring Harness",
  "Data Logger", "Lap Timer", "Action Camera Mount", "LED Light Bar", "Underglow Kit",
  "Carbon Mirror Caps", "Aero Mirrors", "Sequential Signals"
];

// Special names for solution items (hinting they're important)
const solutionNames = [
  ["Ghost Protocol ECU", "Phantom Turbo Kit"],
  ["Shadow Core Module", "Void Compression Kit"],
  ["Specter Fuel System", "Wraith Exhaust Package"],
  ["Eclipse Power Unit", "Nova Boost Controller"],
  ["Cipher Electronics", "Enigma Engine Block"],
];

const categories = ["Engine", "Suspension", "Brakes", "Exterior", "Interior", "Wheels", "Electronics", "Safety"];

export interface PuzzleConfig {
  target: number;
  products: Product[];
  solution: {
    product1Id: string;
    product2Id: string;
    price1: number;
    price2: number;
  };
}

/**
 * Generate a unique puzzle based on user seed
 * Same seed = same puzzle every time
 */
export function generatePuzzle(userSeed: string): PuzzleConfig {
  const random = createSeededRandom(userSeed);

  // 1. Generate target balance (between $200 and $1500)
  const targetBase = seededRandomInt(random, 200, 1500);
  const targetCents = seededRandomInt(random, 0, 99);
  const target = parseFloat(`${targetBase}.${targetCents.toString().padStart(2, '0')}`);

  // 2. Generate solution pair (two prices that sum to target exactly)
  const minPrice = Math.max(50, target * 0.2); // At least 20% of target
  const maxPrice = target - 50; // Leave room for second item
  const price1Base = seededRandomInt(random, Math.floor(minPrice), Math.floor(maxPrice));
  const price1Cents = seededRandomInt(random, 0, 99);
  const price1 = parseFloat(`${price1Base}.${price1Cents.toString().padStart(2, '0')}`);
  const price2 = parseFloat((target - price1).toFixed(2));

  // Pick solution names
  const solutionPairIndex = seededRandomInt(random, 0, solutionNames.length - 1);
  const solutionPair = solutionNames[solutionPairIndex];

  // Generate solution product IDs (deterministic based on seed)
  const solution1Id = `sol-${userSeed}-1`;
  const solution2Id = `sol-${userSeed}-2`;

  // 3. Generate decoy products
  const shuffledNames = seededShuffle(random, [...productNames]);
  const products: Product[] = [];

  // Add solution items
  products.push({
    id: solution1Id,
    name: solutionPair[0],
    price: price1,
    category: "Electronics",
    sku: `SN-${seededRandomInt(random, 1000, 9999).toString(16).toUpperCase()}`,
  });

  products.push({
    id: solution2Id,
    name: solutionPair[1],
    price: price2,
    category: "Engine",
    sku: `PN-${seededRandomInt(random, 1000, 9999).toString(16).toUpperCase()}`,
  });

  // Add decoy products (100+)
  let nameIndex = 0;
  for (let i = 0; i < 118; i++) {
    // Generate random price
    const base = seededRandomInt(random, 10, 900);
    const cents = seededRandomInt(random, 0, 99);
    let price = parseFloat(`${base}.${cents.toString().padStart(2, '0')}`);

    // Make sure this decoy doesn't accidentally create another solution
    const wouldCreateSolution =
      Math.abs(price + price1 - target) < 0.01 ||
      Math.abs(price + price2 - target) < 0.01 ||
      products.some(p => Math.abs(price + p.price - target) < 0.01);

    if (wouldCreateSolution) {
      // Adjust price to avoid accidental solution
      price = parseFloat((price + seededRandomInt(random, 5, 50)).toFixed(2));
    }

    const name = shuffledNames[nameIndex % shuffledNames.length];
    const suffix = nameIndex >= shuffledNames.length ? ` v${Math.floor(nameIndex / shuffledNames.length) + 1}` : '';

    products.push({
      id: `prod-${userSeed}-${i}`,
      name: name + suffix,
      price,
      category: categories[seededRandomInt(random, 0, categories.length - 1)],
      sku: `${['SN', 'PN', 'RX', 'TX', 'MK'][seededRandomInt(random, 0, 4)]}-${seededRandomInt(random, 1000, 9999).toString(16).toUpperCase()}`,
    });

    nameIndex++;
  }

  // Shuffle all products so solution items aren't at the top
  const shuffledProducts = seededShuffle(random, products);

  return {
    target,
    products: shuffledProducts,
    solution: {
      product1Id: solution1Id,
      product2Id: solution2Id,
      price1,
      price2,
    },
  };
}

/**
 * Verify if a cart solves the puzzle
 */
export function verifySolution(cart: Product[], target: number): boolean {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  return Math.abs(total - target) < 0.01;
}
