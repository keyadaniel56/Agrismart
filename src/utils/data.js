// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const STAGES = ['Seedling', 'Growing', 'Flowering', 'Harvest']

export const CROP_COLORS = {
  Maize:        '#c8940a',
  Tomatoes:     '#c0392b',
  Beans:        '#7a5c44',
  Kales:        '#2d5a2d',
  'Sweet Potato': '#c0602a',
  Sunflower:    '#c8940a',
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

export const CROPS = [
  {
    id: 1, name: 'Maize', acreage: 3.5, status: 'Growing', stageIndex: 1,
    plantDate: '2026-01-15', harvestDate: '2026-04-20',
    expectedYield: 1200, actualYield: null, roi: 68,
    inputs: [
      { type: 'Seed',       cost: 4200, qty: '25 kg',  date: '2026-01-15' },
      { type: 'Fertilizer', cost: 8500, qty: '50 kg',  date: '2026-01-28' },
      { type: 'Pesticide',  cost: 2100, qty: '5 litres', date: '2026-02-10' },
    ],
  },
  {
    id: 2, name: 'Tomatoes', acreage: 1.2, status: 'Flowering', stageIndex: 2,
    plantDate: '2025-12-01', harvestDate: '2026-03-10',
    expectedYield: 800, actualYield: 720, roi: 142,
    inputs: [
      { type: 'Seed',       cost: 2800, qty: '1 kg',   date: '2025-12-01' },
      { type: 'Fertilizer', cost: 6200, qty: '40 kg',  date: '2025-12-20' },
      { type: 'Pesticide',  cost: 3100, qty: '8 litres', date: '2026-01-10' },
    ],
  },
  {
    id: 3, name: 'Beans', acreage: 2.0, status: 'Seedling', stageIndex: 0,
    plantDate: '2026-02-10', harvestDate: '2026-05-15',
    expectedYield: 600, actualYield: null, roi: null,
    inputs: [
      { type: 'Seed',       cost: 1800, qty: '30 kg',  date: '2026-02-10' },
      { type: 'Fertilizer', cost: 3200, qty: '20 kg',  date: '2026-02-18' },
    ],
  },
  {
    id: 4, name: 'Kales', acreage: 0.8, status: 'Harvest', stageIndex: 3,
    plantDate: '2025-11-05', harvestDate: '2026-02-28',
    expectedYield: 400, actualYield: 380, roi: 215,
    inputs: [
      { type: 'Seed',       cost:  900, qty: '0.5 kg', date: '2025-11-05' },
      { type: 'Fertilizer', cost: 1800, qty: '15 kg',  date: '2025-11-20' },
      { type: 'Pesticide',  cost:  600, qty: '2 litres', date: '2025-12-10' },
    ],
  },
  {
    id: 5, name: 'Sweet Potato', acreage: 1.5, status: 'Growing', stageIndex: 1,
    plantDate: '2026-01-20', harvestDate: '2026-05-05',
    expectedYield: 900, actualYield: null, roi: 78,
    inputs: [
      { type: 'Seed',       cost: 3200, qty: '50 kg', date: '2026-01-20' },
      { type: 'Fertilizer', cost: 5500, qty: '35 kg', date: '2026-02-05' },
    ],
  },
  {
    id: 6, name: 'Sunflower', acreage: 2.5, status: 'Flowering', stageIndex: 2,
    plantDate: '2025-12-20', harvestDate: '2026-04-01',
    expectedYield: 700, actualYield: null, roi: 95,
    inputs: [
      { type: 'Seed',       cost: 2100, qty: '10 kg', date: '2025-12-20' },
      { type: 'Fertilizer', cost: 4800, qty: '45 kg', date: '2026-01-10' },
    ],
  },
]

export const TRANSACTIONS = [
  { id: 1, type: 'income',  description: 'Kales — Nairobi Market',    category: 'Sale',       amount: 18500, date: '2026-02-24', crop: 'Kales' },
  { id: 2, type: 'expense', description: 'NPK Fertilizer — Tomatoes',  category: 'Fertilizer', amount:  6200, date: '2026-02-22', crop: 'Tomatoes' },
  { id: 3, type: 'income',  description: 'Tomatoes — Wholesale',       category: 'Sale',       amount: 34000, date: '2026-02-20', crop: 'Tomatoes' },
  { id: 4, type: 'expense', description: 'Labour — Maize weeding',     category: 'Labour',     amount:  4500, date: '2026-02-19', crop: 'Maize' },
  { id: 5, type: 'expense', description: 'Pesticide — Maize',          category: 'Pesticide',  amount:  2100, date: '2026-02-18', crop: 'Maize' },
  { id: 6, type: 'income',  description: 'Beans advance payment',      category: 'Sale',       amount: 12000, date: '2026-02-15', crop: 'Beans' },
  { id: 7, type: 'expense', description: 'Irrigation — Tomatoes',      category: 'Water',      amount:  3800, date: '2026-02-14', crop: 'Tomatoes' },
  { id: 8, type: 'expense', description: 'Maize seeds',                category: 'Seeds',      amount:  4200, date: '2026-02-10', crop: 'Maize' },
]

export const LISTINGS = [
  { id: 1, crop: 'Kales',        farmer: 'James Mutua',   location: 'Kiambu',    pricePerKg: 35,  qtyTotal: 500,  qtyAvail: 280, postedAgo: '1 day ago' },
  { id: 2, crop: 'Tomatoes',     farmer: 'Mary Wanjiku',  location: 'Kirinyaga', pricePerKg: 80,  qtyTotal: 300,  qtyAvail: 120, postedAgo: '2 hours ago' },
  { id: 3, crop: 'Maize',        farmer: 'Peter Ochieng', location: 'Kisumu',    pricePerKg: 45,  qtyTotal: 2000, qtyAvail: 1500, postedAgo: 'Today' },
  { id: 4, crop: 'Sweet Potato', farmer: 'Grace Njeri',   location: "Murang'a",  pricePerKg: 55,  qtyTotal: 800,  qtyAvail: 650, postedAgo: '3 hours ago' },
  { id: 5, crop: 'Beans',        farmer: 'Samuel Kamau',  location: 'Meru',      pricePerKg: 120, qtyTotal: 400,  qtyAvail: 200, postedAgo: 'Yesterday' },
]

export const ORDERS = [
  { id: 'ORD-001', crop: 'Kales',        buyer: 'Nakumatt Suppliers', qty: 200, totalKsh: 7000,  status: 'delivered', date: '2026-02-24' },
  { id: 'ORD-002', crop: 'Tomatoes',     buyer: 'Quickmart Stores',   qty: 150, totalKsh: 12000, status: 'transit',   date: '2026-02-25' },
  { id: 'ORD-003', crop: 'Maize',        buyer: 'Unga Mills Ltd',     qty: 500, totalKsh: 22500, status: 'approved',  date: '2026-02-26' },
  { id: 'ORD-004', crop: 'Beans',        buyer: 'Jane Njoki',         qty: 50,  totalKsh: 6000,  status: 'pending',   date: '2026-02-26' },
]

export const CHART_DATA = [
  { month: 'Oct', revenue: 48000, expenses: 22000 },
  { month: 'Nov', revenue: 62000, expenses: 31000 },
  { month: 'Dec', revenue: 38000, expenses: 18000 },
  { month: 'Jan', revenue: 75000, expenses: 42000 },
  { month: 'Feb', revenue: 54000, expenses: 28000 },
  { month: 'Mar', revenue: 92000, expenses: 38000 },
]

// ─── HELPERS ───────────────────────────────────────────────────────────────────

export const fmt = (n) =>
  `KSh ${Number(n).toLocaleString('en-KE')}`

export const fmtDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}
