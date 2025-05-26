/* eslint-disable react/prop-types */
// client/src/components/shopping-view/product-tile.jsx
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Heart, HeartOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const wishlistState = useSelector((state) => state.shopWishlist);
  const wishlistItems = wishlistState?.items || [];

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const toggleWishlist = async (e) => {
    e.stopPropagation(); // Prevent triggering product details modal

    if (!user) {
      toast({
        title: "Please login to use wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ userId: user.id, productId: product._id }));
        toast({
          title: "Product removed from wishlist",
        });
      } else {
        await dispatch(addToWishlist({ userId: user.id, productId: product._id }));
        toast({
          title: "Product added to wishlist",
        });
      }

      // ✅ Refresh wishlist after update
      dispatch(fetchWishlist(user.id));
    } catch (err) {
      toast({
        title: "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="relative w-full max-w-sm mx-auto">
      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/70 hover:bg-white"
          onClick={toggleWishlist}
        >
          {isWishlisted ? (
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Product Click Section */}
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              KES{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                KES{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>

      {/* Cart Button */}
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
