import { useEffect } from 'react';
import ShoppingCart from '@/components/cart/ShoppingCart';

export default function CartPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Shopping Cart | ShopNow';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <ShoppingCart />
    </main>
  );
}
