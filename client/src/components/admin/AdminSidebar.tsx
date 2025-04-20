import { useLocation } from 'wouter';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Settings,
  ShoppingBag
} from 'lucide-react';

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingBag className="text-[#FFA41C] mr-2" size={24} />
          <span className="text-xl font-semibold">ShopNow Admin</span>
        </div>
        {onClose && (
          <button 
            className="text-gray-400 hover:text-white md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-2">
        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
            isActive('/admin') 
              ? 'bg-[#37475A] text-white' 
              : 'text-gray-300 hover:bg-[#37475A] hover:text-white'
          }`}
          onClick={() => handleNavigation('/admin')}
        >
          <LayoutDashboard size={20} className="mr-3" />
          Dashboard
        </button>

        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
            isActive('/admin/products') 
              ? 'bg-[#37475A] text-white' 
              : 'text-gray-300 hover:bg-[#37475A] hover:text-white'
          }`}
          onClick={() => handleNavigation('/admin/products')}
        >
          <Package size={20} className="mr-3" />
          Products
        </button>

        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
            isActive('/admin/orders') 
              ? 'bg-[#37475A] text-white' 
              : 'text-gray-300 hover:bg-[#37475A] hover:text-white'
          }`}
          onClick={() => handleNavigation('/admin/orders')}
        >
          <ShoppingCart size={20} className="mr-3" />
          Orders
        </button>

        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
            isActive('/admin/users') 
              ? 'bg-[#37475A] text-white' 
              : 'text-gray-300 hover:bg-[#37475A] hover:text-white'
          }`}
          onClick={() => handleNavigation('/admin/users')}
        >
          <Users size={20} className="mr-3" />
          Customers
        </button>

        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#37475A] hover:text-white`}
          onClick={() => handleNavigation('/admin')}
        >
          <Tag size={20} className="mr-3" />
          Categories
        </button>

        <button
          className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#37475A] hover:text-white`}
          onClick={() => handleNavigation('/admin')}
        >
          <Settings size={20} className="mr-3" />
          Settings
        </button>
      </nav>

      <div className="p-4 mt-6 bg-[#37475A] mx-2 rounded-md mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#FFA41C]">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">Need help?</h3>
            <p className="text-xs text-gray-300 mt-1">
              Check our documentation for admin panel usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
