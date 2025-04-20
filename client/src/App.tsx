import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ProductListPage from "@/pages/ProductListPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import UserProfilePage from "@/pages/UserProfilePage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState, useEffect } from "react";

function Router() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [location] = useLocation();

  // Hide login modal when navigating to a new page
  useEffect(() => {
    setShowLogin(false);
  }, [location]);

  return (
    <>
      <Header onLoginClick={() => setShowLogin(true)} />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductListPage} />
        <Route path="/products/:category" component={ProductListPage} />
        <Route path="/product/:id" component={ProductDetailPage} />
        
        <Route path="/cart">
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/wishlist">
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/checkout">
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/order-confirmation/:orderId">
          <ProtectedRoute>
            <OrderConfirmationPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/orders">
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/profile">
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin">
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/products">
          <ProtectedRoute adminOnly>
            <AdminProductsPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/orders">
          <ProtectedRoute adminOnly>
            <AdminOrdersPage />
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/users">
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
      
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
