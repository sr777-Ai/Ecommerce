import { createContext, useState, useEffect, ReactNode } from 'react';
import productsData from '../data/products.json';

interface WishlistContextType {
  wishlistItems: number[];
  wishlistProducts: any[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  moveToCart: (productId: number, addToCartFn: (id: number) => void) => void;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  wishlistProducts: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  clearWishlist: () => {},
  moveToCart: () => {},
});

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  // Load wishlist from localStorage on init
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  // Update wishlistProducts whenever wishlistItems changes
  useEffect(() => {
    const products = wishlistItems.map(id => 
      productsData.find(product => product.id === id)
    ).filter(product => product !== undefined);
    
    setWishlistProducts(products);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (productId: number) => {
    if (!wishlistItems.includes(productId)) {
      setWishlistItems([...wishlistItems, productId]);
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems(wishlistItems.filter(id => id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const moveToCart = (productId: number, addToCartFn: (id: number) => void) => {
    addToCartFn(productId);
    removeFromWishlist(productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      wishlistProducts, 
      addToWishlist, 
      removeFromWishlist, 
      isInWishlist, 
      clearWishlist, 
      moveToCart 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
