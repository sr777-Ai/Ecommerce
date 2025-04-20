import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
        });
        onClose();
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password. Try user/password or admin/password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#232F3E]">Sign In</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" className="block text-gray-700 mb-2">Username</Label>
            <Input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="password" className="block text-gray-700 mb-2">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
              placeholder="Enter password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Demo credentials: user/password or admin/password</p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#FFA41C] hover:bg-[#FFB340] text-white font-bold py-2 px-4 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">Don't have an account? <a href="#" className="text-[#36C2B4] hover:underline">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
