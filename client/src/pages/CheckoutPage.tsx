import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const { cartProducts } = useCart();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Checkout | ShopNow';
    
    // Redirect if not authenticated or cart is empty
    if (!isAuthenticated) {
      setLocation('/');
      return;
    }
    
    if (cartProducts.length === 0) {
      setLocation('/cart');
      return;
    }
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, [isAuthenticated, cartProducts.length, setLocation]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#232F3E] mb-6">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}
