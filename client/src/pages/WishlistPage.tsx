import { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { useLocation } from 'wouter';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistProducts } = useWishlist();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Wishlist | ShopNow';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#232F3E] mb-6">My Wishlist</h1>
      
      {wishlistProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <WishlistItem key={product.id} product={product} />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-[#232F3E] hover:bg-[#37475A] text-white"
              onClick={() => setLocation('/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
          <div className="mb-4">
            <Heart size={64} className="mx-auto text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-6">
            Save items you love in your wishlist and come back later to find them here.
          </p>
          <Button
            className="bg-[#FFA41C] hover:bg-[#FFB340] text-white font-bold py-2 px-6 rounded transition duration-200"
            onClick={() => setLocation('/products')}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Start Shopping
          </Button>
        </div>
      )}
    </main>
  );
}

// SVG component for the empty state
function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}
