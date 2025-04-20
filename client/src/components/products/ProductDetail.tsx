import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { Star, StarHalf, Check, Heart, ShoppingCart, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailProps {
  product: {
    id: number;
    title: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    stock: number;
    rating: number;
    reviews: Array<{ userId: number; comment: string; rating: number }>;
    features?: string[];
    colors?: string[];
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'black');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-yellow-400 fill-yellow-400" size={16} />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-yellow-400" size={16} />);
    }
    
    return stars;
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product.id, quantity);
    toast({
      title: "Added to cart",
      description: `${product.title} (${quantity}) has been added to your cart`,
    });
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }
    
    if (inWishlist) {
      removeFromWishlist(product.id);
      setInWishlist(false);
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(product.id);
      setInWishlist(true);
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist`,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-2/5">
          <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img 
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-100 rounded cursor-pointer border-2 border-[#FFA41C]">
              <img 
                src={product.image}
                alt="Thumbnail 1"
                className="w-full h-20 object-cover"
              />
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded cursor-pointer">
                <img 
                  src={product.image}
                  alt={`Thumbnail ${index + 2}`}
                  className="w-full h-20 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="lg:w-3/5">
          <nav className="flex text-sm mb-4">
            <button onClick={() => setLocation('/')} className="text-gray-500 hover:text-[#FFA41C]">Home</button>
            <span className="mx-2 text-gray-500"><ChevronRight size={14} /></span>
            <button onClick={() => setLocation(`/products/${product.category.toLowerCase()}`)} className="text-gray-500 hover:text-[#FFA41C]">{product.category}</button>
            <span className="mx-2 text-gray-500"><ChevronRight size={14} /></span>
            <span className="text-gray-700">{product.title}</span>
          </nav>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-3">
            <div className="flex mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">{product.rating.toFixed(1)} ({product.reviews.length} reviews)</span>
          </div>
          
          <div className="mb-4">
            <p className="text-2xl font-bold text-[#232F3E]">${product.price.toFixed(2)}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
            )}
            <p className="text-sm text-green-600 flex items-center">
              <Check size={16} className="mr-1" /> In Stock ({product.stock} items)
            </p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <p className="text-gray-700 mb-4">
              {product.description}
            </p>
            
            {product.features && (
              <ul className="text-sm text-gray-600 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={16} className="text-green-500 mt-1 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            {product.colors && (
              <div>
                <label className="font-medium text-gray-700 block mb-2">Color</label>
                <div className="flex space-x-2">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color === 'white' ? 'white' : color} border-2 ${selectedColor === color ? 'border-[#FFA41C]' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA41C]`}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select ${color} color`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="quantity" className="font-medium text-gray-700 block mb-2">Quantity</label>
              <div className="flex items-center">
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-l-md"
                  onClick={handleQuantityDecrease}
                >
                  -
                </button>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1" 
                  max={product.stock}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button 
                  className="bg-gray-200 px-3 py-1 rounded-r-md"
                  onClick={handleQuantityIncrease}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              className="flex-1 bg-[#FFA41C] hover:bg-[#FFB340] text-white font-bold py-3 px-4 rounded transition duration-200"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className={`${inWishlist ? 'bg-gray-100' : 'bg-white'} border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded transition duration-200`}
              onClick={handleToggleWishlist}
            >
              <Heart size={16} className={`mr-1 ${inWishlist ? 'fill-current text-red-500' : ''}`} /> 
              {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="border-b border-gray-200 w-full justify-start">
            <TabsTrigger value="description" className="py-4 px-6 text-center">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="py-4 px-6 text-center">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="py-4 px-6 text-center">
              Reviews ({product.reviews.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Product Description</h3>
              <p className="text-gray-700 mb-4">
                {product.description}
              </p>
              <p className="text-gray-700 mb-4">
                Experience premium quality with our {product.title}. Designed for comfort and durability, this product features advanced technology to enhance your experience.
              </p>
              <p className="text-gray-700">
                Whether you're working, traveling, or relaxing at home, the {product.title} delivers exceptional performance in any environment.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="py-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">General Information</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium">{product.stock} units</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium">{product.rating.toFixed(1)} out of 5</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-2">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="flex text-sm">
                        <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center mb-2">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">Verified Purchase</span>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
