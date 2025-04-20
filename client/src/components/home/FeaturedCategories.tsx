import { useProducts } from '@/hooks/useProducts';
import { useLocation } from 'wouter';
import { 
  Laptop, 
  Shirt, 
  Home, 
  BookOpen, 
  Sparkles, 
  Terminal, 
  Gamepad
} from 'lucide-react';

export default function FeaturedCategories() {
  const { categories } = useProducts();
  const [, setLocation] = useLocation();

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'laptop':
        return <Laptop className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'tshirt':
        return <Shirt className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'home':
        return <Home className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'book':
        return <BookOpen className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'magic':
        return <Sparkles className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'running':
        return <Terminal className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      case 'gamepad':
        return <Gamepad className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
      default:
        return <Laptop className="text-5xl text-[#232F3E] group-hover:text-[#FFA41C] transition-colors duration-300" />;
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    setLocation(`/products/${categoryName.toLowerCase()}`);
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-[#232F3E]">Browse Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <div 
            key={category.id}
            className="group cursor-pointer"
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-32 bg-gray-100 flex items-center justify-center p-4">
                {getCategoryIcon(category.icon)}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-medium">{category.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
