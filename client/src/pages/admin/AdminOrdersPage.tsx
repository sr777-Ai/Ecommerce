import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import OrderManagement from '@/components/admin/OrderManagement';

export default function AdminOrdersPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Order Management | ShopNow Admin';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <AdminLayout title="Orders">
      <OrderManagement />
    </AdminLayout>
  );
}
