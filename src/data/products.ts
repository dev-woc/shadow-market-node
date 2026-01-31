import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
}

// Racing/Car part themed names
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

const categories = ["Engine", "Suspension", "Brakes", "Exterior", "Interior", "Wheels", "Electronics", "Safety"];

// Generate random price with messy decimals
const generateRandomPrice = (): number => {
  const base = Math.floor(Math.random() * 900) + 10;
  const cents = Math.floor(Math.random() * 100);
  return parseFloat(`${base}.${cents.toString().padStart(2, '0')}`);
};

// Generate SKU
const generateSKU = (index: number): string => {
  const prefix = ['SN', 'PN', 'RX', 'TX', 'MK'][Math.floor(Math.random() * 5)];
  return `${prefix}-${(1000 + index).toString(16).toUpperCase()}`;
};

// Generate 100+ products with ONE hidden pair that sums to exactly $1000
export const generateProducts = (): Product[] => {
  const products: Product[] = [];
  
  // The secret pair: $430.50 + $569.50 = $1000.00
  const secretPair = [
    { name: "Ghost Protocol ECU", price: 430.50, category: "Electronics" },
    { name: "Phantom Turbo Kit", price: 569.50, category: "Engine" }
  ];
  
  // Add the secret pair at random positions
  const secretIndex1 = Math.floor(Math.random() * 40) + 10;
  const secretIndex2 = Math.floor(Math.random() * 40) + 60;
  
  let productIndex = 0;
  
  for (let i = 0; i < 120; i++) {
    if (i === secretIndex1) {
      products.push({
        id: uuidv4(),
        name: secretPair[0].name,
        price: secretPair[0].price,
        category: secretPair[0].category,
        sku: generateSKU(i),
      });
    } else if (i === secretIndex2) {
      products.push({
        id: uuidv4(),
        name: secretPair[1].name,
        price: secretPair[1].price,
        category: secretPair[1].category,
        sku: generateSKU(i),
      });
    } else {
      // Generate random product that doesn't interfere with the secret pair
      let price = generateRandomPrice();
      
      // Make sure no random product can pair with our secret items to sum to 1000
      while (
        Math.abs(price + 430.50 - 1000) < 0.01 || 
        Math.abs(price + 569.50 - 1000) < 0.01
      ) {
        price = generateRandomPrice();
      }
      
      products.push({
        id: uuidv4(),
        name: productNames[productIndex % productNames.length] + (productIndex >= productNames.length ? ` v${Math.floor(productIndex / productNames.length) + 1}` : ''),
        price,
        category: categories[Math.floor(Math.random() * categories.length)],
        sku: generateSKU(i),
      });
      productIndex++;
    }
  }
  
  return products;
};

export const products = generateProducts();
