import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ProductManagement from '@/components/admin/ProductManagement';

export default function AdminProductsPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Product Management | ShopNow Admin';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <AdminLayout title="Products">
      <ProductManagement />
    </AdminLayout>
  );
}
