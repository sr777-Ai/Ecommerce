import { createContext, useState, useEffect, ReactNode } from 'react';
import productsData from '../data/products.json';

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartProducts: CartProduct[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartProducts: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
    }
  }, []);

  // Update cartProducts whenever cartItems changes
  useEffect(() => {
    const products = cartItems.map(item => {
      const product = productsData.find(p => p.id === item.productId);
      if (!product) return null;
      
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        quantity: item.quantity
      };
    }).filter(item => item !== null) as CartProduct[];
    
    setCartProducts(products);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productId: number, quantity: number = 1) => {
    const productExists = cartItems.find(item => item.productId === productId);
    
    if (productExists) {
      // If product already in cart, increase quantity
      setCartItems(
        cartItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        )
      );
    } else {
      // If product not in cart, add it
      setCartItems([...cartItems, { productId, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartProducts, 
      addToCart, 
      removeFromCart, 
      updateCartItemQuantity, 
      clearCart, 
      getCartTotal, 
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}
