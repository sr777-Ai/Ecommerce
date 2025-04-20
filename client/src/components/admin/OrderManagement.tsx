import { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Search, 
  X, 
  ChevronDown, 
  Eye,
  FileText,
  Package
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';

interface OrderProduct {
  productId: number;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  products: OrderProduct[];
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

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { products } = useProducts();
  const { toast } = useToast();

  // Load orders from localStorage
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
    setFilteredOrders(storedOrders);
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let result = orders;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(order => 
        order.id.toString().includes(searchLower) ||
        order.shippingAddress.name.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredOrders(result);
  }, [orders, search, statusFilter]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    toast({
      title: "Order status updated",
      description: `Order #${orderId} status changed to ${newStatus}`,
    });
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

  // Get product details by ID
  const getProductById = (productId: number) => {
    return products.find(product => product.id === productId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Orders</CardTitle>
            <CardDescription>Manage and track customer orders</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search orders by ID or customer name..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{order.shippingAddress.name}</TableCell>
                      <TableCell>{formatDate(order.date)}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye size={16} className="text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Order Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="h-8 w-[130px]">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Canceled">Canceled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order #${selectedOrder.id} - ${formatDate(selectedOrder.date)}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex justify-between items-center">
                <Badge className={`${getStatusBadgeColor(selectedOrder.status)} text-xs px-2 py-1`}>
                  {selectedOrder.status}
                </Badge>
                <p className="text-sm text-gray-500">
                  Payment via {selectedOrder.paymentMethod}
                </p>
              </div>
              
              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-1" /> Customer Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span> {selectedOrder.shippingAddress.name}
                    </p>
                    <p>
                      <span className="font-medium">User ID:</span> {selectedOrder.userId}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-1" /> Shipping Address
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.products.map((item) => {
                    const product = getProductById(item.productId);
                    return (
                      <div key={item.productId} className="p-3 flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                          {product && (
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h5 className="text-sm font-medium">
                            {product ? product.title : `Product ID: ${item.productId}`}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    {formatCurrency(selectedOrder.products.reduce(
                      (sum, item) => sum + (item.price * item.quantity), 
                      0
                    ))}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Shipping & Tax:</span>
                  <span>
                    {formatCurrency(selectedOrder.total - selectedOrder.products.reduce(
                      (sum, item) => sum + (item.price * item.quantity), 
                      0
                    ))}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base mt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-between items-center">
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    updateOrderStatus(selectedOrder.id, value);
                    setSelectedOrder({ ...selectedOrder, status: value });
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
