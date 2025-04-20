import { useState } from 'react';
import { useLocation } from 'wouter';
import { Heart, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews?: Array<{ userId: number; comment: string; rating: number }>;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  originalPrice,
  image,
  rating,
  reviews = []
}: ProductCardProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [inWishlist, setInWishlist] = useState(isInWishlist(id));

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400" size={16} />);
    }
    
    return stars;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(id);
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(id);
      setInWishlist(false);
      toast({
        title: "Removed from wishlist",
        description: `${title} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(id);
      setInWishlist(true);
      toast({
        title: "Added to wishlist",
        description: `${title} has been added to your wishlist`,
      });
    }
  };

  const navigateToProduct = () => {
    setLocation(`/product/${id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={navigateToProduct}
    >
      <div className="relative">
        <img 
          src={image}
          alt={title}
          className="w-full h-48 object-cover object-center"
        />
        <button 
          className={`absolute top-2 right-2 ${
            inWishlist ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
          } bg-white rounded-full p-2 shadow-sm z-10`}
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={inWishlist ? 'fill-current' : ''} size={16} />
        </button>
        
        {originalPrice && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            SALE
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-gray-800">{title}</h3>
            <div className="flex items-center mb-1">
              <div className="flex">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)} ({reviews.length})</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-lg text-[#232F3E]">${price.toFixed(2)}</p>
            {originalPrice && (
              <p className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <Button 
          className="w-full bg-[#FFA41C] hover:bg-[#FFB340] text-white py-2 px-4 rounded font-medium transition duration-200"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
