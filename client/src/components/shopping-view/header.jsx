/* eslint-disable no-unused-vars */
// client/src/components/shopping-view/header.jsx - Luxury Header with Premium Design
import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, Menu, ShoppingCart, UserCog, Heart, Phone, MapPin, 
  Clock, Truck, ChevronDown, ChevronUp, Globe, ArrowRight, LogIn, UserPlus,
  X, Search, Sparkles
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
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

// Product categories with proper structure
const productCategories = [
  {
    name: "Rekker Products",
    isHeader: true,
    description: "Quality products imported and distributed by Rekker",
    brand: "rekker",
    bgGradient: "from-red-50 to-rose-50",
    borderColor: "border-red-200",
    iconBg: "from-red-100 to-red-200",
    iconColor: "text-red-700",
    hoverColor: "hover:text-red-700",
    buttonGradient: "from-red-600 to-red-700",
    items: [
      { id: "stationery", label: "Stationery", desc: "Pens, Pencils, Rulers, Papers, Math Sets" },
      { id: "bags-suitcases", label: "School Bags & Suitcases", desc: "Backpacks, Travel Bags, Suitcases" },
      { id: "toys", label: "Toys", desc: "Educational Toys, Building Blocks, Games" },
      { id: "kitchenware", label: "Kitchenware", desc: "Cooking Sets, Kitchen Tools, Utensils" },
      { id: "padlocks", label: "Padlocks", desc: "Security Locks, Heavy Duty Padlocks" },
      { id: "stuffed-toys", label: "Teddy Bears & Stuffed Toys", desc: "Plush Toys, Teddy Bears, Soft Toys" },
      { id: "party-items", label: "Party Items", desc: "Paper Cups, Plates, Balloons, Party Supplies" },
      { id: "educational", label: "Educational Items", desc: "Art Supplies, Paintbrushes, Canvas, Clay" }
    ]
  },
  {
    name: "Saffron Brand",
    isHeader: true,
    description: "Premium personal care products designed in France and manufactured by Rekker",
    brand: "saffron",
    bgGradient: "from-orange-50 to-red-50",
    borderColor: "border-orange-200",
    iconBg: "from-orange-100 to-red-100",
    iconColor: "text-orange-700",
    hoverColor: "hover:text-orange-700",
    buttonGradient: "from-orange-600 to-red-600",
    items: [
      { id: "home-care-hygiene", label: "Home Care & Hygiene", desc: "Premium cleaning solutions" },
      { id: "beauty-body-care", label: "Beauty & Body Care", desc: "Moisturizing and skincare" },
    ]
  },
  {
    name: "Cornells Brand",
    isHeader: true,
    description: "Cornells premium products exclusively imported and distributed by Rekker",
    brand: "cornells",
    bgGradient: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
    iconBg: "from-rose-100 to-pink-100",
    iconColor: "text-rose-700",
    hoverColor: "hover:text-rose-700",
    buttonGradient: "from-rose-600 to-pink-600",
    items: [
      { id: "super-foods", label: "Super Foods", desc: "Premium hair and body care" },
      { id: "dark-beautiful", label: "Dark & Beautiful", desc: "Professional hair care" },
      { id: "bold-beautiful", label: "Bold & Beautiful", desc: "Body care and skincare" },
      { id: "cute-pretty", label: "Cute & Pretty", desc: "Baby and kids care" },
    ]
  }
];

const mainMenuItems = [
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "about", label: "About", path: "/shop/about" },
  { id: "brands", label: "Brands", path: "/shop/brands" },
  { id: "contact", label: "Contact", path: "/shop/contact" },
];

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleNavigate(path) {
    sessionStorage.removeItem("filters");
    navigate(path);
    setActiveDropdown(null);
  }

  function handleCategoryClick(categoryId, isSubcategory = false) {
    sessionStorage.removeItem("filters");
    const currentFilter = isSubcategory 
      ? { subcategory: [categoryId] }
      : { category: [categoryId] };
      
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?${isSubcategory ? 'subcategory' : 'category'}=${categoryId}`);
    setActiveDropdown(null);
  }

  function handleBrandPageClick(brand) {
    sessionStorage.removeItem("filters");
    if (brand === 'rekker') {
      navigate('/shop/brands');
    } else if (brand === 'saffron') {
      navigate('/shop/brands/saffron');
    } else if (brand === 'cornells') {
      navigate('/shop/brands/cornells');
    }
    setActiveDropdown(null);
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-6" ref={dropdownRef}>
      {mainMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem.path)}
          className="text-sm font-medium cursor-pointer hover:text-red-600 transition-colors relative group"
        >
          {menuItem.label}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-rose-600 group-hover:w-full transition-all duration-300" />
        </Label>
      ))}
      
      {/* Click-Based Products Dropdown - Desktop */}
      <div className="relative hidden lg:block">
        <button
          onClick={() => toggleDropdown('products')}
          className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-red-600 transition-colors relative group"
        >
          <span>Products</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-rose-600 group-hover:w-full transition-all duration-300" />
        </button>
        
        {activeDropdown === 'products' && (
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-3 duration-200 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Three Column Layout */}
              <div className="grid grid-cols-3 gap-8">
                {productCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className={`p-6 rounded-xl bg-gradient-to-br ${category.bgGradient} border ${category.borderColor} flex flex-col h-full`}>
                    {/* Section Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                          {category.name}
                        </h3>
                        {category.name === 'Cornells Brand' && (
                          <div className="flex items-center space-x-1 text-xs text-rose-600 font-medium bg-white px-2 py-1 rounded-full">
                            <Globe className="w-3 h-3" />
                            <span>Global</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                    </div>
                    
                    {/* Products Grid - Scrollable */}
                    <div className="flex-1 overflow-y-auto max-h-80 pr-2">
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <button
                            key={itemIndex}
                            onClick={() => handleCategoryClick(item.id)}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/70 transition-all duration-200 group border border-transparent hover:border-white/50 w-full text-left"
                          >
                            <div className={`w-10 h-10 bg-gradient-to-br ${category.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm flex-shrink-0`}>
                              <div className={category.iconColor}>
                                <div className="w-5 h-5 bg-current rounded-full opacity-70"></div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-gray-900 group-${category.hoverColor} transition-colors text-sm leading-tight`}>
                                {item.label}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Centered CTA Buttons Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-gray-900">Explore Our Products</h4>
                    <p className="text-sm text-gray-600 mt-1">Browse our complete catalog or discover our premium brands</p>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setActiveDropdown(null);
                        navigate('/shop/listing');
                      }}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm min-w-[180px]"
                    >
                      View All Products
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setActiveDropdown(null);
                        navigate('/shop/brands');
                      }}
                      className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm min-w-[180px]"
                    >
                      Explore Saffron & Cornells
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar - Desktop */}
      <div className={`hidden lg:flex items-center transition-all duration-300 ${
        searchFocused ? 'w-96' : 'w-72'
      }`}>
        <div className="relative w-full group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            searchFocused ? 'text-red-600' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search premium products..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-2 transition-all duration-300 text-sm ${
              searchFocused
                ? 'border-red-600 bg-white shadow-lg'
                : 'border-transparent hover:border-gray-200'
            }`}
          />
        </div>
      </div>
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const wishlistItems = useSelector((state) => state.shopWishlist.items || []);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openWishlistSheet, setOpenWishlistSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

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

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/auth/login')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-600 rounded-xl"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
          <Button
            onClick={() => navigate('/auth/register')}
            size="sm"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white flex items-center gap-2 rounded-xl"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </Button>
        </div>
      ) : (
        <>
          <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
            <Button
              onClick={handleCartClick}
              variant="outline"
              size="icon"
              className="relative rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all" />
              {cartItems?.items?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartItems.items.length}
                </span>
              )}
              <span className="sr-only">User cart</span>
            </Button>
            <UserCartWrapper
              setOpenCartSheet={setOpenCartSheet}
              cartItems={
                cartItems?.items?.length > 0 ? cartItems.items : []
              }
            />
          </Sheet>

          <Sheet open={openWishlistSheet} onOpenChange={setOpenWishlistSheet}>
            <Button
              onClick={handleWishlistClick}
              variant="outline"
              size="icon"
              className="relative rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-600 group-hover:scale-110 transition-all" />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">User wishlist</span>
            </Button>
            <WishlistSheet setOpenWishlistSheet={setOpenWishlistSheet} />
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-red-600 hover:cursor-pointer rounded-2xl">
                <AvatarFallback className="bg-red-600 text-white font-extrabold">
                  {user?.userName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 rounded-2xl">
              <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/shop/account")}>
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}

function MobileContactInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 px-3 py-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 text-xs text-white overflow-hidden">
            <div className="flex items-center whitespace-nowrap">
              <Phone className="h-3 w-3 mr-1 text-red-300 flex-shrink-0" />
              <span className="font-medium">+254 XXX XXX XXX</span>
            </div>
            <div className="flex items-center whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1 text-red-300 flex-shrink-0" />
              <span className="font-medium">Mon-Fri: 8AM - 6PM</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-white hover:bg-red-800/50 rounded-full"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-red-700/50 space-y-2 relative z-10">
            <div className="flex items-center text-xs text-white">
              <MapPin className="h-3 w-3 mr-2 text-red-300 flex-shrink-0" />
              <span className="font-semibold text-red-200">Location:</span>
              <span className="ml-1 font-medium">Nairobi, Kenya</span>
            </div>
            
            <div className="flex items-start text-xs text-white">
              <Truck className="h-3 w-3 mr-2 text-red-300 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-200">Delivery:</span>
                <span className="ml-1 font-medium">Kenya-wide shipping available</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopContactInfo() {
  return (
    <div className="hidden lg:block">
      <div className="bg-gradient-to-r from-red-900 to-rose-900 rounded-lg px-4 py-3 shadow-md overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="flex items-center justify-between gap-6 text-xs relative z-10">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Phone className="h-3.5 w-3.5 text-red-300 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-red-200">Phone: </span>
              <span className="font-medium text-white ml-1 truncate">+254 XXX XXX XXX</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <MapPin className="h-3.5 w-3.5 text-red-300 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-red-200">Location: </span>
              <span className="font-medium text-white ml-1 truncate">Nairobi, Kenya</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Clock className="h-3.5 w-3.5 text-red-300 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-red-200">Hours: </span>
              <span className="font-medium text-white ml-1 truncate">Mon-Fri: 8AM - 6PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-900 text-white py-2 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-xs md:text-sm">
            <div className="flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Free Shipping on Orders Over KES 5,000</span>
            </div>
          </div>
        </div>
      </div>

      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-lg' 
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo with premium animation */}
            <Link to="/shop/home" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                  <span className="text-white font-bold text-2xl">R</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                  REKKER
                </h1>
                <p className="text-xs text-gray-500 font-medium">Quality Excellence</p>
              </div>
            </Link>
            
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <MenuItems />
              <DesktopContactInfo />
            </div>

            <div className="hidden lg:block">
              <HeaderRightContent />
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-2xl">
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs rounded-r-3xl">
                <MenuItems />
                <div className="mt-6">
                  <HeaderRightContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <MobileContactInfo />
      </header>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ShoppingHeader;