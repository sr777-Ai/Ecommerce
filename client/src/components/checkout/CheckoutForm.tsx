import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { generateOrderNumber } from '@/lib/utils';
import OrderSummary from '@/components/cart/OrderSummary';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CreditCard, Check } from 'lucide-react';

// Form validation schema
const checkoutFormSchema = z.object({
  // Shipping Information
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  country: z.string().min(2, { message: "Country is required" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  
  // Payment Information
  cardName: z.string().min(3, { message: "Cardholder name is required" }),
  cardNumber: z.string().min(16, { message: "Card number must be at least 16 digits" }).max(16),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cardCvv: z.string().min(3, { message: "CVV must be at least 3 digits" }).max(4),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutForm() {
  const { user } = useAuth();
  const { cartProducts, getCartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Initialize form with user data if available
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: user?.name || "",
      address: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "USA",
      phone: user?.phone || "",
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
    },
  });

  const handleNextStep = () => {
    if (step === 1) {
      // Validate shipping fields before proceeding
      form.trigger(['fullName', 'address', 'city', 'state', 'zipCode', 'country', 'phone']);
      
      const shippingFieldsValid = [
        'fullName', 'address', 'city', 'state', 'zipCode', 'country', 'phone'
      ].every(field => !form.getFieldState(field as any).error);
      
      if (shippingFieldsValid) {
        setStep(2);
      }
    }
  };

  const handleBackStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartProducts.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate order ID
      const orderId = generateOrderNumber();
      
      // Create new order object
      const newOrder = {
        id: parseInt(orderId.replace('ORD-', '')),
        userId: user?.id || 0,
        products: cartProducts.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        status: "Processing",
        date: new Date().toISOString().split('T')[0],
        shippingAddress: {
          name: data.fullName,
          street: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        paymentMethod: paymentMethod === 'credit-card' 
          ? `Credit Card (ending in ${data.cardNumber.slice(-4)})` 
          : 'PayPal'
      };
      
      // Store order in localStorage (simulating database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));
      
      // Clear cart
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      // Navigate to order confirmation page
      setLocation(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "An error occurred while processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Checkout Form */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-700">Checkout</h2>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
              {/* Steps indicator */}
              <div className="mb-6">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 1 ? 'bg-[#FFA41C] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 ${
                    step >= 2 ? 'bg-[#FFA41C]' : 'bg-gray-200'
                  }`}></div>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 2 ? 'bg-[#FFA41C] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs font-medium text-gray-600">Shipping</span>
                  <span className="text-xs font-medium text-gray-600">Payment</span>
                </div>
              </div>
              
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="555-123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="bg-[#FFA41C] hover:bg-[#FFB340] text-white"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                  
                  <Tabs 
                    defaultValue="credit-card" 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="credit-card" className="pt-4">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="1234 5678 9012 3456" 
                                  {...field} 
                                  maxLength={16}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiration Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardCvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" {...field} maxLength={4} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paypal" className="pt-4">
                      <div className="text-center p-8 bg-gray-50 rounded-md">
                        <div className="mb-4">
                          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-blue-500">
                            <path d="M17.3 9.3a28.58 28.58 0 0 1-3.3.7 21.5 21.5 0 0 1-3.3.2 6.53 6.53 0 0 1-2.3-.4c-.5-.2-.9-.6-1.3-1a2.59 2.59 0 0 1-.6-1.8c0-2.2 3.7-3 6-3h.3l1.8.2"></path>
                            <path d="M17.3 9.3a22.42 22.42 0 0 0 2.7.2c1.3 0 2.3-.2 3.1-.7.8-.4 1.3-1.2 1.3-2.2a4.42 4.42 0 0 0-1.3-3.3c-1.2-1.2-3-1.8-5.8-1.8a22.75 22.75 0 0 0-6.6 1l-7.7 2.5"></path>
                            <path d="M18.9 13.6a27.36 27.36 0 0 0 1.1-3.2"></path>
                            <path d="M20.7 11.1a21.91 21.91 0 0 1-3.2.4h-9.8a6.13 6.13 0 0 0-3.99 1.6A6.41 6.41 0 0 0 1.7 17c0 2 .7 3.8 2 5.2a6.45 6.45 0 0 0 4.7 1.8 6.88 6.88 0 0 0 5.6-3.3"></path>
                            <path d="M21.3 11.6a20.52 20.52 0 0 1-.6 3.2 20.52 20.52 0 0 1-3.3 6.2 6.83 6.83 0 0 1-5.7 3 6.3 6.3 0 0 1-3.6-1.6"></path>
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-4">
                          You will be redirected to PayPal to complete your purchase securely.
                        </p>
                        <p className="text-sm text-gray-500">
                          Note: This is a demo application. No actual payment will be processed.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-8 bg-blue-50 p-4 rounded-md border border-blue-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Secure checkout</h4>
                        <p className="mt-1 text-sm text-blue-600">
                          Your payment information is secure. We use industry-standard encryption to protect your data.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleBackStep}
                    >
                      Back to Shipping
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="bg-[#FFA41C] hover:bg-[#FFB340] text-white"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          {paymentMethod === 'credit-card' ? (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" /> 
                              Place Order
                            </>
                          ) : (
                            <>
                              Continue to PayPal
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="lg:w-1/3">
        <OrderSummary 
          subtotal={subtotal} 
          shipping={shipping} 
          tax={tax} 
          showCheckoutButton={false} 
        />
        
        {/* Order Items */}
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-700">Order Items ({cartProducts.length})</h2>
          </div>
          
          <div className="p-6 divide-y divide-gray-200">
            {cartProducts.map(item => (
              <div key={item.id} className="py-3 flex items-center">
                <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
