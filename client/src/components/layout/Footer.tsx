import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-[#232F3E] text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white">All Products</Link></li>
              <li><Link href="/products?sort=featured" className="text-gray-300 hover:text-white">Featured Items</Link></li>
              <li><Link href="/products?sort=newest" className="text-gray-300 hover:text-white">New Arrivals</Link></li>
              <li><Link href="/products?discount=true" className="text-gray-300 hover:text-white">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">FAQs</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Returns & Exchanges</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-300 hover:text-white">Our Story</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for updates on new products and special promotions.</p>
            
            <form className="mb-4">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 px-3 py-2 rounded-l-md text-gray-800 focus:outline-none"
                />
                <Button 
                  type="submit"
                  className="bg-[#FFA41C] hover:bg-[#FFB340] px-4 py-2 rounded-r-md transition duration-200"
                >
                  Sign Up
                </Button>
              </div>
            </form>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-lg">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-lg">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-lg">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-lg">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} ShopNow E-commerce Platform. All rights reserved.</p>
          <p className="mt-2">This is a demo e-commerce frontend. No real purchases will be made.</p>
        </div>
      </div>
    </footer>
  );
}
