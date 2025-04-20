import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  X, 
  Trash2, 
  User, 
  UserCog,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Badge,
} from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
}

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // Load users from localStorage or data file
  useEffect(() => {
    // Try to load from localStorage first (if saved by other components)
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (storedUsers.length > 0) {
      setUsers(storedUsers);
    } else {
      // If not found in localStorage, load from the imported users data
      import('@/data/users.json').then(usersData => {
        setUsers(usersData.default);
      }).catch(error => {
        console.error('Failed to load users data:', error);
      });
    }
  }, []);

  // Filter users based on search
  useEffect(() => {
    if (search) {
      const searchLower = search.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, search]);

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const confirmDelete = (userId: number) => {
    if (currentUser && userId === currentUser.id) {
      toast({
        title: "Cannot delete own account",
        description: "You cannot delete your own admin account",
        variant: "destructive",
      });
      return;
    }
    
    setDeleteUserId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (deleteUserId !== null) {
      // Filter out the user to delete
      const updatedUsers = users.filter(user => user.id !== deleteUserId);
      setUsers(updatedUsers);
      
      // Update localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      });
      
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Users</CardTitle>
            <CardDescription>Manage users and customer accounts</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users by name, email, or role..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <User size={16} className="text-blue-500" />
                          </Button>
                          {(currentUser?.id !== user.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => confirmDelete(user.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {selectedUser && `User information for ${selectedUser.username}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  {selectedUser.role === 'admin' ? (
                    <UserCog className="h-8 w-8 text-blue-500" />
                  ) : (
                    <User className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                  <Badge className={selectedUser.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{selectedUser.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-medium">{selectedUser.id}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Mail className="h-4 w-4 mr-1" /> Email
                  </p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1" /> Phone
                    </p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                )}
                
                {selectedUser.address && (
                  <div>
                    <p className="text-sm text-gray-500 flex items-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg> Address
                    </p>
                    <div className="text-sm">
                      <p>{selectedUser.address.street}</p>
                      <p>{selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zipCode}</p>
                      <p>{selectedUser.address.country}</p>
                    </div>
                  </div>
                )}
                
                {selectedUser.role === 'admin' && (
                  <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Admin User</p>
                      <p className="text-xs text-blue-600">This user has administrative privileges and can access the admin panel.</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
