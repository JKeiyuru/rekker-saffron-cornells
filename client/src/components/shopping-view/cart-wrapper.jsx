/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingCart, LogIn } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Guest user view
  if (!isAuthenticated || !user) {
    return (
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Login to View Your Cart
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Please login or create an account to add items to your cart and checkout
          </p>
          <div className="space-y-3 w-full">
            <Button
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/auth/login");
              }}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login to Continue
            </Button>
            <Button
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/auth/register");
              }}
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </div>
      </SheetContent>
    );
  }

  // Authenticated user view
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Your cart is empty</p>
            <Button
              onClick={() => {
                setOpenCartSheet(false);
                navigate("/shop/listing");
              }}
              className="mt-4"
              variant="outline"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
      {cartItems && cartItems.length > 0 && (
        <>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">KES {totalCartAmount}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
          >
            Checkout
          </Button>
        </>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;