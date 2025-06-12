/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck, ShoppingCart } from "lucide-react";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [isMpesaPaymentLoading, setIsMpesaPaymentLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Redirect to PayPal approval URL if present
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  // Calculate subtotal (items only)
  const subtotalAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Get delivery fee from selected address
  const deliveryFee = currentSelectedAddress?.deliveryFee || 0;

  // Calculate total amount (subtotal + delivery)
  const totalCartAmount = subtotalAmount + deliveryFee;

  function handleInitiatePaypalPayment() {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        county: currentSelectedAddress?.county,
        subCounty: currentSelectedAddress?.subCounty,
        location: currentSelectedAddress?.location,
        specificAddress: currentSelectedAddress?.specificAddress,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        deliveryFee: currentSelectedAddress?.deliveryFee,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      subtotalAmount: subtotalAmount,
      deliveryFee: deliveryFee,
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (!data?.payload?.success) {
        setIsPaymentStart(false);
        toast({
          title: "Failed to start PayPal payment. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  const handleMpesaPayment = async () => {
    if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!showPhoneInput) {
      setShowPhoneInput(true);
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsMpesaPaymentLoading(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        county: currentSelectedAddress?.county,
        subCounty: currentSelectedAddress?.subCounty,
        location: currentSelectedAddress?.location,
        specificAddress: currentSelectedAddress?.specificAddress,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        deliveryFee: currentSelectedAddress?.deliveryFee,
      },
      orderStatus: "pending",
      paymentMethod: "mpesa",
      paymentStatus: "pending",
      subtotalAmount: subtotalAmount,
      deliveryFee: deliveryFee,
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    try {
      const response = await axios.post("/api/shop/payment", {
        phone: phoneNumber,
        amount: totalCartAmount,
        callbackUrl: "https://nemmoh-ecommerce-server.onrender.com/api/shop/mpesa-callback",
        orderData,
      });

      if (response.data.success) {
        toast({
          title: "M-Pesa payment initiated. Please check your phone.",
          variant: "default",
        });
        setShowPhoneInput(false);
        setPhoneNumber("");
      } else {
        toast({
          title: "Failed to initiate M-Pesa payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "M-Pesa payment failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMpesaPaymentLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} alt="Checkout Banner" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">Checkout</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 p-6">
        {/* Address Selection */}
        <div className="space-y-6">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
          
          {/* Selected Address Summary */}
          {currentSelectedAddress && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Delivery Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Location:</strong> {currentSelectedAddress.location}, {currentSelectedAddress.subCounty}</p>
                  <p><strong>Address:</strong> {currentSelectedAddress.specificAddress}</p>
                  <p><strong>Phone:</strong> {currentSelectedAddress.phone}</p>
                  <p><strong>Delivery Fee:</strong> <span className="font-semibold text-blue-600">KSh {currentSelectedAddress.deliveryFee}</span></p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems?.items?.length > 0 ? (
                  cartItems.items.map((item) => (
                    <UserCartItemsContent key={item.productId} cartItem={item} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                )}
              </div>

              {/* Order Totals */}
              {cartItems?.items?.length > 0 && (
                <div className="space-y-3">
                  <Separator />
                  
                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.items.length} items)</span>
                    <span>KSh {subtotalAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* Delivery Fee */}
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Delivery Fee
                    </span>
                    <span className={deliveryFee > 0 ? "text-blue-600 font-medium" : "text-gray-500"}>
                      {deliveryFee > 0 ? `KSh ${deliveryFee.toFixed(2)}` : "Select address"}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-green-600">KSh {totalCartAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Buttons */}
          {cartItems?.items?.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
                
                {/* PayPal Payment */}
                <Button 
                  onClick={handleInitiatePaypalPayment} 
                  className="w-full h-12 text-lg" 
                  disabled={isPaymentStart || !currentSelectedAddress}
                >
                  {isPaymentStart ? "Processing PayPal Payment..." : `Pay KSh ${totalCartAmount.toFixed(2)} with PayPal`}
                </Button>
                
                {/* M-Pesa Payment */}
                <div className="space-y-3">
                  {showPhoneInput && (
                    <div>
                      <input
                        type="tel"
                        placeholder="Enter your M-Pesa phone number (254...)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleMpesaPayment}
                    className="w-full h-12 text-lg bg-green-600 hover:bg-green-700"
                    disabled={isMpesaPaymentLoading || !currentSelectedAddress}
                  >
                    {isMpesaPaymentLoading
                      ? "Processing M-Pesa Payment..."
                      : showPhoneInput
                      ? `Confirm M-Pesa Payment - KSh ${totalCartAmount.toFixed(2)}`
                      : `Pay KSh ${totalCartAmount.toFixed(2)} with M-Pesa`}
                  </Button>
                </div>
                
                {!currentSelectedAddress && (
                  <p className="text-sm text-red-500 text-center">
                    Please select a delivery address to continue
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;