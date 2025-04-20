import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function ShoppingCart() {
  const { cartProducts, clearCart, getCartTotal, getCartCount } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleClearCart = () => {
    clearCart();
    setDialogOpen(false);
    toast({
      title: "Cart cleared",
      description: "Your shopping cart has been cleared",
    });
  };
  
  const handleContinueShopping = () => {
    setLocation('/products');
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#232F3E] mb-6">Shopping Cart</h1>
      
      {cartProducts.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-700">Cart Items ({getCartCount()})</h2>
              </div>
              
              {cartProducts.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border border-[#232F3E] text-[#232F3E] hover:bg-[#232F3E] hover:text-white font-medium py-2 px-4 rounded transition duration-200"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </Button>
              
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 px-4 rounded transition duration-200"
                  >
                    Clear Cart
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Shopping Cart</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear your shopping cart? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearCart}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Clear Cart
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <OrderSummary 
              subtotal={getCartTotal()} 
              shipping={getCartTotal() > 50 ? 0 : 10}
              tax={getCartTotal() * 0.08}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
          <div className="mb-4">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Button
            className="bg-[#FFA41C] hover:bg-[#FFB340] text-white font-bold py-2 px-6 rounded transition duration-200"
            onClick={handleContinueShopping}
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
