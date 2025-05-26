/* eslint-disable react/prop-types */
// WishlistSheet.jsx
import { SheetContent } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist, fetchWishlist } from "@/store/shop/wishlist-slice";
import { HeartOff } from "lucide-react";

function WishlistSheet({ setOpenWishlistSheet }) {
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.shopWishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishlist({ userId: user.id, productId }));
    dispatch(fetchWishlist(user.id));
  };

  return (
    <SheetContent side="right" className="w-[350px] sm:w-[400px]">
      <h2 className="text-xl font-bold mb-4">My Wishlist</h2>
      <ScrollArea className="h-[calc(100vh-120px)] pr-2">
        {wishlistItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No items in wishlist.</p>
        ) : (
          wishlistItems.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between mb-4 border-b pb-2"
            >
              <div
                onClick={() => {
                  navigate(`/shop/product/${product._id}`);
                  setOpenWishlistSheet(false);
                }}
                className="cursor-pointer"
              >
                <h4 className="font-semibold text-sm">{product.title}</h4>
                <p className="text-xs text-muted-foreground">KES {product.salePrice || product.price}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(product._id)}
              >
                <HeartOff className="text-red-500 w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </ScrollArea>
    </SheetContent>
  );
}

export default WishlistSheet;
