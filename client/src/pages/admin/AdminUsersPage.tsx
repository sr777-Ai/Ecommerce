import { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminUsersPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set document title
    document.title = 'User Management | ShopNow Admin';
    
    return () => {
      // Reset title on unmount
      document.title = 'ShopNow';
    };
  }, []);

  return (
    <AdminLayout title="Customers">
      <UserManagement />
    </AdminLayout>
  );
}
