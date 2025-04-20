import { createContext, useState, useEffect, ReactNode } from 'react';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviews: Array<{
    userId: number;
    comment: string;
    rating: number;
  }>;
  features?: string[];
  colors?: string[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  sortProducts: (products: Product[], sortBy: string) => Product[];
  filterProducts: (filters: { 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    minRating?: number;
  }) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

export const ProductContext = createContext<ProductContextType>({
  products: [],
  categories: [],
  featuredProducts: [],
  getProductById: () => undefined,
  getProductsByCategory: () => [],
  searchProducts: () => [],
  sortProducts: () => [],
  filterProducts: () => [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
});

interface ProductProviderProps {
  children: ReactNode;
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [categories] = useState<Category[]>(categoriesData);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // On init, set featured products (top rated)
  useEffect(() => {
    const featured = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    setFeaturedProducts(featured);
  }, [products]);

  const getProductById = (id: number) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    if (category === 'all' || !category) {
      return products;
    }
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (query: string) => {
    if (!query) return products;
    
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(lowerCaseQuery) || 
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  };

  const sortProducts = (productsToSort: Product[], sortBy: string) => {
    switch (sortBy) {
      case 'price-low':
        return [...productsToSort].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...productsToSort].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...productsToSort].sort((a, b) => b.rating - a.rating);
      case 'name-asc':
        return [...productsToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return [...productsToSort].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return productsToSort;
    }
  };

  const filterProducts = (filters: { 
    category?: string; 
    minPrice?: number; 
    maxPrice?: number; 
    minRating?: number;
  }) => {
    return products.filter(product => {
      // Filter by category
      if (filters.category && filters.category !== 'all' && 
          product.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
      
      // Filter by price range
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }
      
      // Filter by rating
      if (filters.minRating !== undefined && product.rating < filters.minRating) {
        return false;
      }
      
      return true;
    });
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    const newProduct = { ...product, id: newId };
    setProducts([...products, newProduct as Product]);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      categories, 
      featuredProducts, 
      getProductById, 
      getProductsByCategory, 
      searchProducts, 
      sortProducts, 
      filterProducts, 
      addProduct, 
      updateProduct, 
      deleteProduct 
    }}>
      {children}
    </ProductContext.Provider>
  );
}
