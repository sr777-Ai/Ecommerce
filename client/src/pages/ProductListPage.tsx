import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import ProductsGrid from '@/components/products/ProductsGrid';

export default function ProductListPage() {
  const params = useParams<{ category?: string }>();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('featured');
  
  useEffect(() => {
    // Scroll to top when component mounts or params change
    window.scrollTo(0, 0);
    
    // Parse search query from URL if it exists
    const url = new URL(window.location.href);
    const search = url.searchParams.get('search');
    const sort = url.searchParams.get('sort');
    
    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery(null);
    }
    
    if (sort) {
      setSortOption(sort);
    } else {
      setSortOption('featured');
    }
  }, [location]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <ProductsGrid 
        category={params.category} 
        searchQuery={searchQuery}
        sortOption={sortOption}
      />
    </main>
  );
}
