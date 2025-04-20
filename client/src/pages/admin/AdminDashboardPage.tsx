import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';

export default function AdminDashboardPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'Admin Dashboard | ShopNow';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <Dashboard />
    </AdminLayout>
  );
}
