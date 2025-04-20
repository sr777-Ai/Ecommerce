import { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { Heart, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeFromCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(item.quantity);
  
  const handleQuantityDecrease = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      updateCartItemQuantity(item.id, newQuantity);
    }
  };

  const handleQuantityIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateCartItemQuantity(item.id, newQuantity);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
      updateCartItemQuantity(item.id, newQuantity);
    }
  };
  
  const handleRemoveFromCart = () => {
    removeFromCart(item.id);
    toast({
      title: "Item removed",
      description: `${item.title} has been removed from your cart`,
    });
  };
  
  const handleMoveToWishlist = () => {
    if (!isInWishlist(item.id)) {
      addToWishlist(item.id);
      removeFromCart(item.id);
      toast({
        title: "Moved to wishlist",
        description: `${item.title} has been moved to your wishlist`,
      });
    } else {
      toast({
        title: "Already in wishlist",
        description: `${item.title} is already in your wishlist`,
      });
    }
  };
  
  const handleProductClick = () => {
    setLocation(`/product/${item.id}`);
  };

  return (
    <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
      <div 
        className="sm:w-24 h-24 bg-gray-100 rounded cursor-pointer"
        onClick={handleProductClick}
      >
        <img 
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between mb-2">
          <h3 
            className="font-semibold text-gray-800 cursor-pointer hover:text-[#FFA41C]"
            onClick={handleProductClick}
          >
            {item.title}
          </h3>
          <p className="font-bold text-[#232F3E]">${item.price.toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">Color: Black</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="bg-gray-200 px-2 py-1 rounded-l text-gray-700"
              onClick={handleQuantityDecrease}
            >
              -
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={handleQuantityChange}
              min="1" 
              className="w-12 text-center border border-gray-300 py-1"
            />
            <button 
              className="bg-gray-200 px-2 py-1 rounded-r text-gray-700"
              onClick={handleQuantityIncrease}
            >
              +
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="text-gray-500 hover:text-[#232F3E]"
              onClick={handleMoveToWishlist}
              aria-label="Move to wishlist"
            >
              <Heart size={18} />
            </button>
            <button 
              className="text-gray-500 hover:text-red-500"
              onClick={handleRemoveFromCart}
              aria-label="Remove from cart"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
