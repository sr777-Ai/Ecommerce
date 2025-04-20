import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import StatsCard from './StatsCard';
import ChartComponent from './ChartComponent';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Order {
  id: number;
  userId: number;
  products: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  date: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

export default function Dashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [salesTimeframe, setSalesTimeframe] = useState('month');
  const [topProducts, setTopProducts] = useState<{id: number; title: string; image: string; totalSales: number}[]>([]);

  // Calculate metrics for dashboard
  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);

    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);

    // Calculate top selling products
    if (storedOrders.length > 0 && products.length > 0) {
      const productSales: {[key: number]: number} = {};
      
      // Count sales for each product
      storedOrders.forEach((order: Order) => {
        order.products.forEach(item => {
          const productId = item.productId;
          const saleAmount = item.price * item.quantity;
          
          if (productSales[productId]) {
            productSales[productId] += saleAmount;
          } else {
            productSales[productId] = saleAmount;
          }
        });
      });
      
      // Convert to array and sort by sales amount
      const topProductsArray = Object.entries(productSales)
        .map(([productId, totalSales]) => {
          const product = products.find(p => p.id === parseInt(productId));
          return {
            id: parseInt(productId),
            title: product?.title || 'Unknown Product',
            image: product?.image || '',
            totalSales
          };
        })
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 4); // Get top 4 products
      
      setTopProducts(topProductsArray);
    }
  }, [products]);

  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Calculate total orders
  const totalOrders = orders.length;
  
  // Calculate total customers
  const totalCustomers = users.filter(user => user.role === 'user').length;
  
  // Calculate total products
  const totalProductCount = products.length;

  // Mock data for the sales chart
  const salesData = [
    { name: 'Jan', sales: 2400 },
    { name: 'Feb', sales: 1398 },
    { name: 'Mar', sales: 9800 },
    { name: 'Apr', sales: 3908 },
    { name: 'May', sales: 4800 },
    { name: 'Jun', sales: 3800 },
    { name: 'Jul', sales: 4300 },
  ];

  // Function to get percentage change
  const getPercentageChange = (currentValue: number, previousValue: number): number => {
    if (previousValue === 0) return 100;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  // Mock previous values for calculating changes
  const previousRevenue = totalRevenue * 0.88; // 12% increase from previous month
  const previousOrders = Math.round(totalOrders * 0.92); // 8% increase
  const previousCustomers = Math.round(totalCustomers * 0.95); // 5% increase
  const previousProducts = totalProductCount - 12; // 12 new products

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="text-blue-600" />}
          change={getPercentageChange(totalRevenue, previousRevenue)}
          trend="up"
        />
        
        <StatsCard
          title="Total Orders"
          value={totalOrders.toString()}
          icon={<ShoppingCart className="text-green-600" />}
          change={getPercentageChange(totalOrders, previousOrders)}
          trend="up"
        />
        
        <StatsCard
          title="Total Customers"
          value={totalCustomers.toString()}
          icon={<Users className="text-yellow-600" />}
          change={getPercentageChange(totalCustomers, previousCustomers)}
          trend="up"
        />
        
        <StatsCard
          title="Total Products"
          value={totalProductCount.toString()}
          icon={<Package className="text-red-600" />}
          change={12}
          trend="up"
          description="New products this month"
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                {salesTimeframe === 'month' ? 'Monthly' : salesTimeframe === 'week' ? 'Weekly' : 'Daily'} sales revenue
              </CardDescription>
            </div>
            <Select
              value={salesTimeframe}
              onValueChange={setSalesTimeframe}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="day">Today</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="h-80">
            <ChartComponent data={salesData} />
          </CardContent>
        </Card>
        
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Best selling products by revenue
              </CardDescription>
            </div>
            <Select defaultValue="month">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden mr-3">
                      <img 
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{product.title}</p>
                        <p className="font-semibold text-[#232F3E]">{formatCurrency(product.totalSales)}</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-[#FFA41C] h-2 rounded-full" 
                          style={{ 
                            width: `${Math.max(5, Math.min(100, (product.totalSales / (topProducts[0]?.totalSales || 1)) * 100))}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-48 text-gray-500">
                  <div className="text-center">
                    <BarChart className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">No sales data available</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest customer orders
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/admin/orders'}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.shippingAddress.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Canceled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="link" 
                          size="sm"
                          className="text-[#FFA41C] hover:underline"
                          onClick={() => window.location.href = `/admin/orders`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500 text-center" colSpan={6}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
