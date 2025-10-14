/* eslint-disable no-unused-vars */
// client/src/components/shopping-view/header.jsx - Rekker Header with Guest Mode
import { 
  LogOut, Menu, ShoppingCart, UserCog, Heart, Phone, MapPin, 
  Clock, Truck, ChevronDown, ChevronUp, Globe, ArrowRight, LogIn, UserPlus
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
import { useEffect, useState, useRef } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import WishlistSheet from "./wishlist-sheet";
import { useToast } from "@/components/ui/use-toast";

// Rekker product categories - Updated to match previous navbar structure
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
      { id: "bags", label: "School Bags & Suitcases", desc: "Backpacks, Travel Bags, Suitcases" },
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
      { id: "handwash", label: "Handwash", desc: "Premium Antibacterial Handwash" },
      { id: "dishwashing", label: "Dishwashing Liquid", desc: "Concentrated Grease-Cutting Formula" },
      { id: "shower-gel", label: "Shower Gels", desc: "Moisturizing Body Wash" },
      { id: "aftershave", label: "After-Shave Anti-Bump", desc: "Men's Skincare Solution" },
      { id: "detergent", label: "Liquid Detergent", desc: "High-Efficiency Laundry Care" }
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
      { id: "lotions", label: "Bold & Beautiful Collection", desc: "Premium Body Lotions with Shea Butter" },
      { id: "sunscreen", label: "Cute & Pretty Collection", desc: "Gentle Family & Baby Care" },
      { id: "toners", label: "Dark & Beautiful Collection", desc: "Professional Hair Care Solutions" },
      { id: "beauty-care", label: "Super Food Collection", desc: "Nutritive Wellness Products" }
    ]
  }
];

const mainMenuItems = [
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "about", label: "About", path: "/shop/about" },
  { id: "brands", label: "Brands", path: "/shop/brands" },
  // { id: "distributors", label: "Distributors", path: "/shop/distributors" },
  { id: "contact", label: "Contact", path: "/shop/contact" },
];

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
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

  function handleCategoryClick(categoryId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [categoryId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?category=${categoryId}`);
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

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-6" ref={dropdownRef}>
      {mainMenuItems.map((menuItem) => (
        <Label
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem.path)}
          className="text-sm font-medium cursor-pointer hover:text-red-600 transition-colors"
        >
          {menuItem.label}
        </Label>
      ))}
      
      {/* Enhanced Products Dropdown - Desktop */}
      <div className="relative hidden lg:block">
        <button
          onMouseEnter={() => setActiveDropdown('products')}
          onClick={() => toggleDropdown('products')}
          className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-red-600 transition-colors"
        >
          <span>Products</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
        </button>
        
        {activeDropdown === 'products' && (
          <div 
  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-screen max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-in fade-in slide-in-from-top-3 duration-200 max-h-[80vh] overflow-y-auto"
  onMouseLeave={() => setActiveDropdown(null)}
>
  <div className="p-8">
    {/* Horizontal Layout with Three Sections */}
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
                      {/* Icon placeholder - you can add specific icons here */}
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
            onClick={() => navigate('/shop/listing')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm min-w-[180px]"
          >
            View All Products
          </Button>
          
          <Button
            onClick={() => navigate('/shop/brands')}
            className="bg-gradient-to-r from-orange-600 to-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm min-w-[180px]"
          >
            Explore Saffron & Cornells
          </Button>
        </div>
      </div>
    </div>
    
    {/* Bottom Action Bar */}
    <div className="mt-8 pt-6 border-t border-red-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-red-600">
          <span className="font-medium">Need bulk orders?</span> Contact us for wholesale pricing
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => handleNavigate("/shop/contact")}
            variant="outline"
            className="px-6 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  </div>
</div>
        )}
        </div>

      {/* Enhanced Products Dropdown - Mobile */}
      <div className="lg:hidden">
        <button
          onClick={() => toggleDropdown('mobile-products')}
          className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-red-600 transition-colors w-full justify-between"
        >
          <span>Products</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'mobile-products' ? 'rotate-180' : ''}`} />
        </button>
        
        {activeDropdown === 'mobile-products' && (
          <div className="mt-2 space-y-4 pl-4 border-l-2 border-red-100">
            {productCategories.map((category, idx) => (
              <div key={idx} className="pb-4 border-b border-red-100 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-sm font-bold uppercase ${category.iconColor}`}>{category.name}</h4>
                  {category.name === 'Cornells Brand' && (
                    <div className="flex items-center space-x-1 text-xs text-rose-600 font-medium">
                      <Globe className="w-3 h-3" />
                      <span>Global</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">{category.description}</p>
                <div className="space-y-2 mb-4">
                  {category.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleCategoryClick(item.id)}
                      className={`block w-full text-left px-3 py-2 text-sm text-gray-700 ${category.hoverColor} rounded-lg transition-colors font-medium border border-transparent hover:border-${category.borderColor.split('-')[1]}-200 bg-white/50`}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => handleBrandPageClick(category.brand)}
                  size="sm"
                  className={`w-full bg-gradient-to-r ${category.buttonGradient} text-white text-xs font-semibold`}
                >
                  {category.name === 'Rekker Products' ? 'View All Products' : 
                   category.name === 'Saffron Brand' ? 'Explore Saffron' : 'Explore Cornells'}
                </Button>
              </div>
            ))}
            
            {/* Mobile wholesale CTA */}
            <div className="pt-4">
              <div className="text-xs text-red-600 uppercase tracking-wide font-bold mb-3">Bulk Orders</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleNavigate("/shop/contact")}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Contact Us
                </Button>
                <Button
                  onClick={() => handleNavigate("/shop/wholesale-request")}
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs"
                >
                  Wholesale Quote
                </Button>
              </div>
            </div>
          </div>
        )}
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
      {/* Guest Mode - Show Login/Register */}
      {!isAuthenticated ? (
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/auth/login')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>
          <Button
            onClick={() => navigate('/auth/register')}
            size="sm"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </Button>
        </div>
      ) : (
        /* Authenticated Mode - Show Cart, Wishlist, Account */
        <>
          {/* Cart */}
          <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button
              onClick={handleCartClick}
              variant="outline"
              size="icon"
              className="relative"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                {cartItems?.items?.length || 0}
              </span>
              <span className="sr-only">User cart</span>
            </Button>
            <UserCartWrapper
              setOpenCartSheet={setOpenCartSheet}
              cartItems={
                cartItems?.items?.length > 0 ? cartItems.items : []
              }
            />
          </Sheet>

          {/* Wishlist */}
          <Sheet open={openWishlistSheet} onOpenChange={setOpenWishlistSheet}>
            <Button
              onClick={handleWishlistClick}
              variant="outline"
              size="icon"
              className="relative"
            >
              <Heart className="w-6 h-6 text-red-500" />
              <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                {wishlistItems?.length || 0}
              </span>
              <span className="sr-only">User wishlist</span>
            </Button>
            <WishlistSheet setOpenWishlistSheet={setOpenWishlistSheet} />
          </Sheet>

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-red-600 hover:cursor-pointer">
                <AvatarFallback className="bg-red-600 text-white font-extrabold">
                  {user?.userName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56">
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
      <div className="bg-gradient-to-r from-red-900 to-rose-900 px-3 py-2">
        <div className="flex items-center justify-between">
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
            className="h-6 w-6 p-0 text-white hover:bg-red-800/50"
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-red-700/50 space-y-2">
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
      <div className="bg-gradient-to-r from-red-900 to-rose-900 rounded-lg px-4 py-2 shadow-md">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center text-white">
            <Phone className="h-3 w-3 mr-2 text-red-300" />
            <span className="font-semibold text-red-200">Phone:</span>
            <span className="ml-1 font-medium">+254 XXX XXX XXX</span>
          </div>
          
          <div className="flex items-center text-white">
            <MapPin className="h-3 w-3 mr-2 text-red-300" />
            <span className="font-semibold text-red-200">Location:</span>
            <span className="ml-1 font-medium">Nairobi, Kenya</span>
          </div>
          
          <div className="flex items-center text-white">
            <Clock className="h-3 w-3 mr-2 text-red-300" />
            <span className="font-semibold text-red-200">Hours:</span>
            <span className="ml-1 font-medium">Mon-Fri: 8AM - 6PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <MobileContactInfo />
      
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div>
            <span className="font-bold text-2xl text-gray-900">REKKER</span>
            <p className="text-xs text-red-600">Quality Products, Trusted Brands</p>
          </div>
        </Link>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <div className="mt-6">
              <HeaderRightContent />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <MenuItems />
          <DesktopContactInfo />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;