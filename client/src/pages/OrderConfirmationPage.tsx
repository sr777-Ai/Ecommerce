import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { CheckCircle, Package, Truck, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

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

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = `Order Confirmation | ShopNow`;

    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Load orders from localStorage
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const parsedOrderId = parseInt(orderId.replace('ORD-', ''));
        
        // Find the order with the matching ID
        const foundOrder = storedOrders.find((o: Order) => o.id === parsedOrderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
          
          // Load product details
          const storedProducts = await import('@/data/products.json').then(module => module.default);
          const orderProducts = foundOrder.products.map((item: any) => {
            const product = storedProducts.find((p: any) => p.id === item.productId);
            return {
              ...product,
              quantity: item.quantity,
              price: item.price
            };
          });
          
          setProducts(orderProducts);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, [orderId]);

  const handleContinueShopping = () => {
    setLocation('/products');
  };

  const handleViewOrders = () => {
    setLocation('/orders');
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

  if (!order) {
    return (
      <main className="flex-grow container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 pb-8 text-center">
            <div className="mb-4 text-red-500">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for. It may have been removed or the order ID is incorrect.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-[#FFA41C] hover:bg-[#FFB340] text-white"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={handleViewOrders}
              >
                View Your Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="text-green-500 mb-4">
              <CheckCircle size={64} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="mt-2 bg-gray-100 px-4 py-2 rounded-full">
              <span className="font-bold">Order Number:</span> {orderId}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">{formatDate(order.date)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded">
                  {order.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg text-[#232F3E]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-[#232F3E]">{product.title}</h3>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
                      <p className="font-medium">{formatCurrency(product.price * product.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-start">
              <div className="text-blue-500 mr-3 mt-1">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="font-medium text-blue-800">Delivery Information</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Your order will be processed within 1-2 business days. You will receive a shipping confirmation email with tracking details once your order ships.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-[#FFA41C] hover:bg-[#FFB340] text-white"
                onClick={handleContinueShopping}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={handleViewOrders}
              >
                View Your Orders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
