// OURGOODS Admin Dashboard Mock Data

// Generate 50 Demo Products
export const productsData = Array.from({ length: 50 }, (_, i) => ({
  id: `PROD-${1000 + i}`,
  name: `Premium Item ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  category: i % 3 === 0 ? 'Women Fashion' : i % 3 === 1 ? 'Beauty & Health' : 'Home & Decor',
  brand: i % 2 === 0 ? 'Ourgoods Choice' : 'Generic',
  vendor: i % 5 === 0 ? 'Ourgoods Direct' : `Vendor ${i % 10 + 1}`,
  type: i % 4 === 0 ? 'Pre-Order' : 'Local Stock',
  price: 500 + (i * 50),
  stock: i % 7 === 0 ? 0 : i % 5 === 0 ? 5 : 50 + i,
  status: i % 10 === 0 ? 'Out of Stock' : 'Active',
  addedDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
}));

// Generate 20 Demo Orders
const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
export const ordersData = Array.from({ length: 20 }, (_, i) => ({
  orderId: `ORD-${5000 + i}`,
  customerName: `Customer ${i + 1}`,
  phone: `+88017110000${i.toString().padStart(2, '0')}`,
  totalAmount: 1200 + (i * 150),
  paymentMethod: i % 3 === 0 ? 'COD' : i % 3 === 1 ? 'bKash' : 'Card',
  paymentStatus: i % 3 === 0 ? 'Pending' : 'Paid',
  orderStatus: orderStatuses[i % orderStatuses.length],
  date: new Date(Date.now() - Math.floor(Math.random() * 5000000000)).toISOString().split('T')[0],
}));

// Generate 10 Demo Vendors
export const vendorsData = Array.from({ length: 10 }, (_, i) => ({
  id: `VEND-${100 + i}`,
  businessName: `Vendor Store ${i + 1}`,
  ownerName: `Owner ${i + 1}`,
  phone: `+88018110000${i}`,
  category: 'Fashion & Beauty',
  status: i % 4 === 0 ? 'Pending' : 'Approved',
  sales: 50000 + (i * 15000),
  commissionDue: 5000 + (i * 1500),
}));

// Generate 30 Demo Customers
export const customersData = Array.from({ length: 30 }, (_, i) => ({
  id: `CUST-${2000 + i}`,
  name: `User ${i + 1}`,
  phone: `+88019110000${i.toString().padStart(2, '0')}`,
  totalSpent: 3000 + (i * 500),
  orderCount: 1 + i,
  status: i % 10 === 0 ? 'Blocked' : 'Active',
}));

// Pre-Orders (10)
export const preOrdersData = Array.from({ length: 10 }, (_, i) => ({
  id: `PRE-${8000 + i}`,
  customerName: `Customer ${i + 1}`,
  productName: `China Imported Item ${i + 1}`,
  rmbPrice: 50 + (i * 10),
  bdtPrice: (50 + (i * 10)) * 20, // 1 RMB = 20 BDT
  advancePaid: ((50 + (i * 10)) * 20) * 0.6, // 60% advance
  status: i % 4 === 0 ? 'China Warehouse' : i % 4 === 1 ? 'Shipped to BD' : 'Pending Advance',
}));

// Other stats
export const statCards = {
  totalRevenue: '৳ 2,45,000',
  todayRevenue: '৳ 12,500',
  totalOrders: 1542,
  todayOrders: 45,
  pendingOrders: 120,
  activeVendors: 45,
};

// Daily Sales Chart Data
export const dailySalesData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  sales: 5000 + Math.floor(Math.random() * 20000),
  orders: 10 + Math.floor(Math.random() * 50),
}));

export const topCategoriesData = [
  { name: 'Women Fashion', value: 45 },
  { name: 'Beauty', value: 25 },
  { name: 'Home Decor', value: 20 },
  { name: 'Electronics', value: 10 },
];
