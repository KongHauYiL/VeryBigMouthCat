
import React from 'react';
import { Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  globalTaps: number;
  personalTaps: number;
  user: any;
  isLoading: boolean;
  onSettingsToggle: () => void;
  onAuthToggle: () => void;
}

export function Navbar({
  globalTaps,
  personalTaps,
  user,
  isLoading,
  onSettingsToggle,
  onAuthToggle
}: NavbarProps) {
  const { signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/7ea14553-d4aa-410c-b9a7-e24d70cc057a.png" 
            alt="BigMouthCat Icon" 
            className="w-8 h-8 object-contain" 
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
            BigMouthCat
          </h1>
        </div>

        {/* User info and controls */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
              <User className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-medium text-white">{user.username}</span>
            </div>
          )}

          {/* Settings Button */}
          <Button 
            onClick={onSettingsToggle} 
            variant="ghost" 
            size="icon" 
            className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 rounded-xl h-10 w-10"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Auth Button */}
          {user ? (
            <Button 
              onClick={signOut} 
              variant="ghost" 
              size="icon" 
              className="bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 rounded-xl h-10 w-10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={onAuthToggle} 
              className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
