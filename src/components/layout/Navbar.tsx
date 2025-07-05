"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, Moon, Sun, Search, Heart, MessageCircle, LogIn, 
  LogOut, User as UserIcon, Plus, Settings
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isLoading, isError,isLoggedIn,logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push('/');
  };

  const handleSearch = () => {
    router.push('/pets');
    toast({
      title: "Search",
      description: "We'll implement a comprehensive search feature soon!",
    });
  };

  const handleFavorites = () => {
    if (isLoggedIn) {
      router.push('/dashboard?tab=favorites');
      toast({
        title: "Favorites",
        description: "You can find your favorite pets in your dashboard.",
      });
    } else {
      router.push('/login');
      toast({
        title: "Login Required",
        description: "Please log in to view your favorites.",
      });
    }
  };

  const handleMessages = () => {
    if (isLoggedIn) {
      // In a real app, we'd router.push to a chat list page
      // For now, we'll direct to the first pet chat as an example
       router.push('/dashboard?tab=messages');
       toast({
        title: "Messages",
        description: "You can find your messages in your dashboard.",
      });
    } else {
      router.push('/login');
      toast({
        title: "Login Required",
        description: "Please log in to view your messages.",
      });
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-purple-600"
          >
            <path d="M10 16c1-1 3-1 4 0" />
            <path d="M8 11.973c2 1 6 1 8 0" />
            <path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
          <span className="text-xl font-bold text-purple-600">ThePetWala</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
          <Link href="/pets" className="text-sm font-medium transition-colors hover:text-primary">Find Pets</Link>
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">About</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Search" onClick={handleSearch}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Favorites" onClick={handleFavorites}>
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Messages" onClick={handleMessages}>
            <MessageCircle className="h-5 w-5" />
          </Button>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/add-pet')}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add Pet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard?tab=settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 md:hidden animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/pets" 
                className="flex items-center gap-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Pets
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-2 border-t flex flex-col space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    setIsMenuOpen(false);
                  }}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleSearch();
                    setIsMenuOpen(false);
                  }}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleFavorites();
                    setIsMenuOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  Favorites
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleMessages();
                    setIsMenuOpen(false);
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  Messages
                </Button>
                
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <UserIcon className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/settings" className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <Button 
                      variant="default" 
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <Link href="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full justify-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
