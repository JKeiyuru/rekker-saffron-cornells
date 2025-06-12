/* eslint-disable no-unused-vars */
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, Heart, HeartOff, Phone, MapPin, Clock, Truck } from "lucide-react";
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
      <ContactInfo />
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

function ContactInfo() {
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
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6 text-amber-800" />
          <span className="font-bold"><img src={logo} alt="Tempara Logo" className="h-10 w-20 inline" /></span>
        </Link>
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
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;