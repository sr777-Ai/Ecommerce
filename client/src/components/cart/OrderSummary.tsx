import { useState } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  showCheckoutButton?: boolean;
}

export default function OrderSummary({ 
  subtotal, 
  shipping, 
  tax, 
  showCheckoutButton = true 
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const total = subtotal + shipping + tax - discount;
  
  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === 'FREESHIP50' && subtotal >= 50) {
      setDiscount(shipping);
      toast({
        title: "Coupon applied",
        description: "Free shipping has been applied to your order",
      });
    } else if (couponCode.toUpperCase() === 'DISCOUNT10') {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast({
        title: "Coupon applied",
        description: "10% discount has been applied to your order",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "Please enter a valid coupon code",
        variant: "destructive",
      });
    }
  };
  
  const handleProceedToCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-gray-700">Order Summary</h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl text-[#232F3E]">${total.toFixed(2)}</span>
        </div>
        
        <div className="pt-2">
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <div className="flex">
            <Input 
              type="text" 
              id="coupon" 
              placeholder="Enter code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
            />
            <Button
              className="bg-[#232F3E] hover:bg-[#37475A] text-white px-4 py-2 rounded-r transition duration-200"
              onClick={handleCouponApply}
            >
              Apply
            </Button>
          </div>
        </div>
        
        {showCheckoutButton && (
          <Button 
            className="w-full bg-[#FFA41C] hover:bg-[#FFB340] text-white font-bold py-3 px-4 rounded transition duration-200 mt-4"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        )}
        
        <div className="flex justify-center space-x-4 pt-4">
          <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-6" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="Mastercard" className="h-6" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="PayPal" className="h-6" />
          <img src="https://cdn-icons-png.flaticon.com/128/196/196539.png" alt="American Express" className="h-6" />
        </div>
      </div>
    </div>
  );
}
