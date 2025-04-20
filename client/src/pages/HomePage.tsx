import { useEffect } from 'react';
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import ProductsGrid from '@/components/products/ProductsGrid';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function HomePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      {/* Hero Carousel */}
      <HeroCarousel />
      
      {/* Featured Categories */}
      <FeaturedCategories />
      
      {/* Featured Products */}
      <ProductsGrid 
        sortOption="featured"
        limit={8}
      />
      
      {/* View All Products Button */}
      <div className="text-center mt-8 mb-16">
        <Button
          variant="outline"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-[#232F3E] font-medium px-6 py-2 rounded-lg transition duration-200"
          onClick={() => setLocation('/products')}
        >
          View All Products
        </Button>
      </div>
      
      {/* Special Offers Banner */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-[#232F3E] to-[#37475A] rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-6 md:p-10 text-white flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Limited Time Offer!</h2>
              <p className="mb-6">Get free shipping on all orders over $50. Use code <span className="font-bold">FREESHIP50</span> at checkout.</p>
              <Button
                className="bg-[#FFA41C] hover:bg-[#FFB340] text-white px-6 py-2 rounded font-medium transition duration-200 self-start"
                onClick={() => setLocation('/products')}
              >
                Shop Now
              </Button>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=300&q=80" 
                alt="Special offer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
