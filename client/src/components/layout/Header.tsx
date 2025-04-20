import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu, 
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

interface HeaderProps {
  onLoginClick: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { categories } = useProducts();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
  };
  
  const handleProfileClick = () => {
    if (isAuthenticated) {
      setLocation('/profile');
    } else {
      onLoginClick();
    }
  };

  return (
    <header className="bg-[#232F3E] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-1">
            <Link href="/" className="flex items-center">
              <ShoppingCart className="text-[#FFA41C] mr-2" size={24} />
              <span className="text-xl font-bold">ShopNow</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-2 text-gray-500"
              >
                <Search size={18} />
              </Button>
            </form>
          </div>

          {/* Right Navigation Icons */}
          <nav className="flex items-center space-x-4">
            <button 
              onClick={handleProfileClick}
              className="text-white relative flex items-center"
            >
              <User size={20} />
              <span className="hidden md:inline ml-1">
                {isAuthenticated ? (user?.username || 'Account') : 'Account'}
              </span>
            </button>
            
            <Link href="/wishlist" className="text-white relative flex items-center">
              <Heart size={20} />
              <span className="hidden md:inline ml-1">Wishlist</span>
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFA41C] text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link href="/cart" className="text-white relative flex items-center">
              <ShoppingCart size={20} />
              <span className="hidden md:inline ml-1">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFA41C] text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <ChevronDown size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation('/orders')}>
                    Orders
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setLocation('/admin')}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-2 text-gray-500"
            >
              <Search size={18} />
            </Button>
          </form>
        </div>

        {/* Categories Navigation */}
        <div className="overflow-x-auto scrollbar-hide py-2 bg-[#37475A]">
          <div className="flex space-x-6 px-1 min-w-max">
            <Link href="/products" className="text-white whitespace-nowrap hover:text-[#FFA41C]">
              All Products
            </Link>
            {categories.map(category => (
              <Link 
                key={category.id}
                href={`/products/${category.name.toLowerCase()}`} 
                className="text-white whitespace-nowrap hover:text-[#FFA41C]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
