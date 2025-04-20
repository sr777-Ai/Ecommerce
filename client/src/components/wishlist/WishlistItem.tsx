import { useLocation } from 'wouter';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistItemProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: number;
  };
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const handleRemoveFromWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
    toast({
      title: "Removed from wishlist",
      description: `${product.title} has been removed from your wishlist`,
    });
  };
  
  const handleMoveToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id);
    removeFromWishlist(product.id);
    toast({
      title: "Moved to cart",
      description: `${product.title} has been moved to your cart`,
    });
  };
  
  const handleProductClick = () => {
    setLocation(`/product/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <img 
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover object-center"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg mb-1 text-gray-800">{product.title}</h3>
          <p className="font-bold text-lg text-[#232F3E]">${product.price.toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex space-x-2">
          <Button 
            className="flex-1 bg-[#FFA41C] hover:bg-[#FFB340] text-white py-2 px-4 rounded font-medium transition duration-200"
            onClick={handleMoveToCart}
          >
            <ShoppingCart size={16} className="mr-2" /> Move to Cart
          </Button>
          
          <Button 
            variant="outline"
            className="p-2 border border-gray-300 text-red-500 hover:bg-red-50 rounded transition duration-200"
            onClick={handleRemoveFromWishlist}
            aria-label="Remove from wishlist"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
