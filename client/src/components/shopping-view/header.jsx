/* eslint-disable no-unused-vars */
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Heart, HeartOff, Phone, MapPin, Clock, Truck, ChevronDown, ChevronUp } from "lucide-react";
import logo from "../../assets/Tempara1.5.jpg";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
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
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import WishlistSheet from "./wishlist-sheet";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <div className="flex flex-col gap-2">
      <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row pt-8 lg:pt-6">
        {shoppingViewHeaderMenuItems.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer hover:text-emerald-600 transition-colors"
            key={menuItem.id}
          >
            {menuItem.label}
          </Label>
        ))}
      </nav>
    </div>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const wishlistItems = useSelector((state) => state.shopWishlist.items || []);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [openWishlistSheet, setOpenWishlistSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Cart */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
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
          onClick={() => setOpenWishlistSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <HeartOff className="w-6 h-6 text-red-500" />
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
          <Avatar className="bg-black hover:cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
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
    </div>
  );
}

function MobileContactInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Compact Contact Bar */}
      <div className="bg-gradient-to-r from-red-900 to-black px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white overflow-hidden">
            <div className="flex items-center whitespace-nowrap">
              <Phone className="h-3 w-3 mr-1 text-red-400 flex-shrink-0" />
              <span className="font-medium">0736601307</span>
            </div>
            <div className="flex items-center whitespace-nowrap">
              <Clock className="h-3 w-3 mr-1 text-red-400 flex-shrink-0" />
              <span className="font-medium">6:30 AM - 6:00 PM</span>
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
        
        {/* Expanded Contact Info */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-red-700/50 space-y-2">
            <div className="flex items-center text-xs text-white">
              <MapPin className="h-3 w-3 mr-2 text-red-400 flex-shrink-0" />
              <span className="font-semibold text-red-300">Location:</span>
              <span className="ml-1 font-medium">Magic Business Center, Nairobi</span>
            </div>
            
            <div className="flex items-start text-xs text-white">
              <Truck className="h-3 w-3 mr-2 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300">Express Delivery:</span>
                <span className="ml-1 font-medium">Call for expedited delivery (extra cost)</span>
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
    <div className="hidden lg:block mt-2">
      <div className="bg-gradient-to-r from-red-900 to-black rounded-lg px-4 py-3 shadow-md">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center text-white">
            <Phone className="h-3 w-3 mr-2 text-red-400" />
            <span className="font-semibold text-red-300">Phone:</span>
            <span className="ml-1 font-medium">0736601307</span>
          </div>
          
          <div className="flex items-center text-white">
            <MapPin className="h-3 w-3 mr-2 text-red-400" />
            <span className="font-semibold text-red-300">Location:</span>
            <span className="ml-1 font-medium">Magic Business Center, Nairobi</span>
          </div>
          
          <div className="flex items-center text-white">
            <Clock className="h-3 w-3 mr-2 text-red-400" />
            <span className="font-semibold text-red-300">Hours:</span>
            <span className="ml-1 font-medium">6:30 AM - 6:00 PM</span>
          </div>
          
          <div className="flex items-center text-white">
            <Truck className="h-3 w-3 mr-2 text-red-400" />
            <span className="font-semibold text-red-300">Express:</span>
            <span className="ml-1 font-medium">Call for expedited delivery (extra cost)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Mobile Contact Info Bar */}
      <MobileContactInfo />
      
      {/* Main Header */}
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6 text-amber-800" />
          <span className="font-bold">
            <img src={logo} alt="Tempara Logo" className="h-10 w-20 inline" />
          </span>
        </Link>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        
        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
          <DesktopContactInfo />
        </div>

        {/* Desktop Right Content */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;