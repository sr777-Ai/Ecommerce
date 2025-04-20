import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/home/ProductCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductsGridProps {
  category?: string;
  searchQuery?: string;
  sortOption?: string;
  limit?: number;
}

export default function ProductsGrid({ 
  category, 
  searchQuery, 
  sortOption = 'featured',
  limit
}: ProductsGridProps) {
  const { 
    products,
    categories,
    getProductsByCategory,
    searchProducts,
    sortProducts
  } = useProducts();
  
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');
  const [selectedSort, setSelectedSort] = useState<string>(sortOption);
  const [visibleCount, setVisibleCount] = useState<number>(limit || 8);
  
  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);
  
  useEffect(() => {
    // Apply filters and sorting
    let filteredProducts = products;
    
    // Filter by category if selected
    if (selectedCategory && selectedCategory !== 'all') {
      filteredProducts = getProductsByCategory(selectedCategory);
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      filteredProducts = searchProducts(searchQuery);
    }
    
    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, selectedSort);
    
    // Apply limit if needed
    const limitedProducts = limit 
      ? filteredProducts.slice(0, limit) 
      : filteredProducts.slice(0, visibleCount);
    
    setDisplayedProducts(limitedProducts);
  }, [
    products, 
    selectedCategory, 
    selectedSort, 
    searchQuery, 
    limit, 
    visibleCount, 
    getProductsByCategory, 
    searchProducts, 
    sortProducts
  ]);
  
  const loadMoreProducts = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setVisibleCount(limit || 8);
  };
  
  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  return (
    <section className="mb-16">
      {/* Section Header with Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#232F3E]">
          {searchQuery 
            ? `Search Results for "${searchQuery}"` 
            : selectedCategory !== 'all' 
              ? `${selectedCategory} Products` 
              : 'All Products'}
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name.toLowerCase()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
              <ProductCard 
                key={product.id}
                id={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
              />
            ))}
          </div>
          
          {/* Load More Button - Show only if not limited and there are more products */}
          {!limit && products.length > visibleCount && (
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                className="bg-white border border-gray-300 hover:bg-gray-50 text-[#232F3E] font-medium px-6 py-2 rounded-lg transition duration-200"
                onClick={loadMoreProducts}
              >
                Load More Products
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </section>
  );
}
