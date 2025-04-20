import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "Summer Sale",
    description: "Get up to 50% off on all electronics. Limited time offer!",
    buttonText: "Shop Now",
    buttonLink: "/products/electronics"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "New Arrivals",
    description: "Check out our latest products in store now!",
    buttonText: "Discover",
    buttonLink: "/products?sort=newest"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=400&q=80",
    title: "Free Shipping",
    description: "On all orders over $50. Shop today!",
    buttonText: "Learn More",
    buttonLink: "/products"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleButtonClick = (link: string) => {
    setLocation(link);
  };

  return (
    <div className="relative overflow-hidden rounded-lg mb-8 shadow-md">
      <div className="h-64 md:h-96 bg-gray-200 relative">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ pointerEvents: index === currentSlide ? 'auto' : 'none' }}
          >
            <img 
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#232F3E]/80 to-transparent flex items-center">
              <div className="text-white p-6 md:p-10 max-w-lg">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{slide.title}</h2>
                <p className="text-sm md:text-base mb-4">{slide.description}</p>
                <Button 
                  className="bg-[#FFA41C] hover:bg-[#FFB340] text-white px-4 py-2 rounded font-medium transition duration-200"
                  onClick={() => handleButtonClick(slide.buttonLink)}
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Arrows */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`h-2 w-2 rounded-full transition-opacity ${
                index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-50'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
