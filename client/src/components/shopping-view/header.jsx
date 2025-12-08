// client/src/components/shopping-view/header.jsx
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, Menu, ShoppingCart, UserCog, Heart, Phone, MapPin, 
  Clock, Truck, ChevronDown, X, Search, Sparkles, LogIn, UserPlus
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import WishlistSheet from "./wishlist-sheet";
import { useToast } from "@/components/ui/use-toast";

const mainMenuItems = [
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "about", label: "About", path: "/shop/about" },
  { id: "shop", label: "Shop", path: "/shop/listing" },
  { id: "brands", label: "Brands", path: "/shop/brands" },
  { id: "contact", label: "Contact", path: "/shop/contact" },
];

function LuxuryHeader() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const wishlistItems = useSelector((state) => state.shopWishlist.items || []);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openWishlistSheet, setOpenWishlistSheet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleCartClick() {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to view your cart",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }
    setOpenCartSheet(true);
  }

  function handleWishlistClick() {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to view your wishlist",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }
    setOpenWishlistSheet(true);
  }

  return (
    <div className="relative">
      {/* Top announcement bar with luxury animation */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-900 text-white py-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-xs md:text-sm relative z-10">
            <div className="flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-medium">Free Shipping on Orders Over KES 5,000</span>
            </div>
          </div>
        </div>
      </div>

      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-red-500/5' 
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo with luxury animation */}
            <Link to="/shop/home" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500" />
                
                {/* Main logo */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <span className="text-white font-bold text-2xl">R</span>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600 group-hover:from-red-700 group-hover:to-rose-700 transition-all duration-300">
                  REKKER
                </h1>
                <p className="text-xs text-gray-500 font-medium">Quality Excellence</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="relative text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-rose-600 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Right section - Auth & Actions */}
            <div className="flex items-center gap-3">
              {/* Search icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/shop/search')}
                className="hidden md:flex rounded-full hover:bg-red-50"
              >
                <Search className="w-5 h-5 text-gray-700 hover:text-red-600 transition-colors" />
              </Button>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => navigate('/auth/login')}
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-2 rounded-full border-gray-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/auth/register')}
                    size="sm"
                    className="hidden sm:flex bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white items-center gap-2 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart Button */}
                  <Button
                    onClick={handleCartClick}
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-red-50 transition-all group"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                    {cartItems?.items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {cartItems.items.length}
                      </span>
                    )}
                  </Button>

                  {/* Wishlist Button */}
                  <Button
                    onClick={handleWishlistClick}
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-red-50 transition-all group"
                  >
                    <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all" />
                    {wishlistItems?.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar className="bg-gradient-to-br from-red-600 to-rose-600 hover:cursor-pointer rounded-full ring-2 ring-red-600/20 hover:ring-red-600/40 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-red-600 to-rose-600 text-white font-extrabold">
                          {user?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100">
                      <DropdownMenuLabel>Hi, {user?.userName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/shop/account")} className="rounded-xl cursor-pointer">
                        <UserCog className="mr-2 h-4 w-4" />
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-xs rounded-l-3xl">
                  <nav className="flex flex-col gap-4 mt-8">
                    {mainMenuItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="text-lg font-medium text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      to="/shop/search"
                      className="text-lg font-medium text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2"
                    >
                      <Search className="w-5 h-5" />
                      Search
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sheet */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items?.length > 0 ? cartItems.items : []}
        />
      </Sheet>

      {/* Wishlist Sheet */}
      <Sheet open={openWishlistSheet} onOpenChange={setOpenWishlistSheet}>
        <WishlistSheet setOpenWishlistSheet={setOpenWishlistSheet} />
      </Sheet>
    </div>
  );
}

export default LuxuryHeader;