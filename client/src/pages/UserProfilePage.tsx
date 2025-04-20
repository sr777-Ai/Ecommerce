import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Phone, ShieldCheck, LogOut } from 'lucide-react';

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  street: z.string().min(5, { message: "Street address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters" }),
  country: z.string().min(2, { message: "Country is required" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Password change schema
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password confirmation must be at least 6 characters" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function UserProfilePage() {
  const { user, updateUserProfile, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [submitting, setSubmitting] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      zipCode: user?.address?.zipCode || "",
      country: user?.address?.country || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Your Profile | ShopNow';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  // Fill form fields when user data is available
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setSubmitting(true);
    try {
      // Update the user profile with the new data
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
        },
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateUserProfile(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setSubmitting(true);
    try {
      // In a real app, this would make an API call to change the password
      // Here we're just simulating the process since we're using dummy data
      
      // Check if current password matches (in this demo, any password is valid)
      if (data.currentPassword !== "password") {
        toast({
          title: "Incorrect password",
          description: "The current password you entered is incorrect.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset form
      passwordForm.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#232F3E] mb-2">Profile Not Available</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#232F3E] mb-6">Your Profile</h1>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your account profile information and address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{user.username}</h3>
                          <p className="text-sm text-gray-500">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                        </div>
                      </div>
                      
                      <div className="border-b border-gray-200 py-3">
                        <h3 className="text-md font-medium flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Contact Information
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-b border-gray-200 py-3 mt-2">
                        <h3 className="text-md font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Shipping Address
                        </h3>
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State / Province</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip / Postal Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={profileForm.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#FFA41C] hover:bg-[#FFB340]"
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security settings and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 py-3">
                        <h3 className="text-md font-medium flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Change Password
                        </h3>
                      </div>
                      
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2">
                        <p className="text-sm text-gray-500">
                          Your password must be at least 6 characters and include a mix of letters and numbers for security.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-[#FFA41C] hover:bg-[#FFB340]"
                        disabled={submitting}
                      >
                        {submitting ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </Form>
                
                <div className="border-t border-gray-200 mt-8 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Account Actions</h3>
                      <p className="text-sm text-gray-500 mt-1">Sign out from all sessions</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
