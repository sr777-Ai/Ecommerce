import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { useProducts } from '@/hooks/useProducts';
import ProductDetail from '@/components/products/ProductDetail';
import ProductsGrid from '@/components/products/ProductsGrid';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    setLoading(true);
    
    try {
      const productId = parseInt(params.id);
      if (isNaN(productId)) {
        setError('Invalid product ID');
        setLoading(false);
        return;
      }
      
      const foundProduct = getProductById(productId);
      if (!foundProduct) {
        setError('Product not found');
        setLoading(false);
        return;
      }
      
      setProduct(foundProduct);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [params.id, getProductById]);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {loading ? (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/5">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2 mt-4">
                <Skeleton className="h-20 w-full rounded" />
                <Skeleton className="h-20 w-full rounded" />
                <Skeleton className="h-20 w-full rounded" />
                <Skeleton className="h-20 w-full rounded" />
              </div>
            </div>
            <div className="lg:w-3/5 space-y-4">
              <Skeleton className="h-10 w-3/4 rounded" />
              <Skeleton className="h-6 w-1/2 rounded" />
              <Skeleton className="h-6 w-1/4 rounded" />
              <Skeleton className="h-32 w-full rounded" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">{error}</h2>
          <p className="text-gray-600 mb-4">We couldn't find the product you're looking for.</p>
          <a 
            href="/products" 
            className="bg-[#FFA41C] hover:bg-[#FFB340] text-white px-4 py-2 rounded font-medium transition duration-200"
          >
            Browse Products
          </a>
        </div>
      ) : product ? (
        <>
          <ProductDetail product={product} />
          
          {/* Related Products Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#232F3E] mb-6">You May Also Like</h2>
            <ProductsGrid 
              category={product.category}
              limit={4}
            />
          </div>
        </>
      ) : null}
    </main>
  );
}
