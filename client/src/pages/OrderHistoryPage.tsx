import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Search, Package, ExternalLink, ShoppingBag, Clock } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  products: OrderItem[];
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

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Order History | ShopNow';
    
    // Load orders from localStorage
    const fetchOrders = () => {
      setLoading(true);
      try {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Filter orders by the current user's ID
        if (user) {
          const userOrders = storedOrders.filter((order: Order) => order.userId === user.id);
          setOrders(userOrders);
          setFilteredOrders(userOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, [user]);

  // Filter orders when search or status filter changes
  useEffect(() => {
    if (!orders.length) return;

    let result = [...orders];
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(searchLower) ||
        formatDate(order.date).toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredOrders(result);
  }, [orders, search, statusFilter]);

  const handleContinueShopping = () => {
    setLocation('/products');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrderDetails = (orderId: number) => {
    setLocation(`/order-confirmation/ORD-${orderId}`);
  };

  if (loading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA41C]"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#232F3E] mb-6">Your Orders</h1>
        
        {orders.length > 0 ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={statusFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(null)}
                  className={statusFilter === null ? "bg-[#232F3E]" : ""}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === "Processing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Processing")}
                  className={statusFilter === "Processing" ? "bg-blue-600" : ""}
                >
                  Processing
                </Button>
                <Button 
                  variant={statusFilter === "Shipped" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Shipped")}
                  className={statusFilter === "Shipped" ? "bg-yellow-600" : ""}
                >
                  Shipped
                </Button>
                <Button 
                  variant={statusFilter === "Delivered" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("Delivered")}
                  className={statusFilter === "Delivered" ? "bg-green-600" : ""}
                >
                  Delivered
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                        </div>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Total</h3>
                            <p className="font-semibold">{formatCurrency(order.total)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Items</h3>
                            <p className="font-medium">{order.products.reduce((acc, item) => acc + item.quantity, 0)} items</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Payment</h3>
                            <p className="font-medium">{order.paymentMethod}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 sm:self-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order.id)}
                            className="flex gap-1 items-center"
                          >
                            <ExternalLink size={16} />
                            <span>Details</span>
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#FFA41C] hover:bg-[#FFB340]"
                            onClick={() => handleViewOrderDetails(order.id)}
                          >
                            Track Order
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {order.products.slice(0, 3).map((item) => {
                            // Fetch product info (simulated here as actual lookup would be done)
                            const product = {
                              id: item.productId,
                              image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80`,
                              title: `Product #${item.productId}`
                            };
                            
                            // In a real implementation, you'd look up the full product details from your products data
                            
                            return (
                              <div key={item.productId} className="flex items-center bg-gray-50 p-2 rounded">
                                <div className="w-12 h-12 bg-white rounded border border-gray-200 mr-3">
                                  <img 
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{product.title}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            );
                          })}
                          
                          {order.products.length > 3 && (
                            <div className="flex items-center justify-center bg-gray-50 p-2 rounded">
                              <p className="text-sm text-gray-500">+{order.products.length - 3} more items</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center py-8">
                    <div className="text-gray-400 mb-3">
                      <Search size={48} />
                    </div>
                    <h3 className="text-lg font-medium">No orders found</h3>
                    <p className="text-gray-500 text-center max-w-md mt-1">
                      We couldn't find any orders matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    {statusFilter && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setStatusFilter(null);
                          setSearch('');
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : (
          <Card className="text-center">
            <CardContent className="pt-10 pb-10">
              <div className="mx-auto mb-4 bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Order History</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button
                className="bg-[#FFA41C] hover:bg-[#FFB340] text-white"
                onClick={handleContinueShopping}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
