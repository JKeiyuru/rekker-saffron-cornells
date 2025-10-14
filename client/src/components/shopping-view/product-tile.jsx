/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// client/src/components/shopping-view/product-tile.jsx - Rekker Product Tile with Guest Mode
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  brandOptionsMap,
  categoryOptionsMap,
  subcategoryOptionsMap,
} from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const wishlistState = useSelector((state) => state.shopWishlist);
  const wishlistItems = wishlistState?.items || [];

  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist",
        variant: "destructive",
      });
      navigate('/auth/login');
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

      dispatch(fetchWishlist(user.id));
    } catch (err) {
      toast({
        title: "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    handleAddtoCart(product?._id, product?.totalStock);
  };

  // Get brand color
  const getBrandColor = (brand) => {
    const colors = {
      rekker: "from-red-500 to-rose-500",
      saffron: "from-orange-500 to-red-500",
      cornells: "from-rose-500 to-pink-500",
    };
    return colors[brand] || "from-gray-500 to-gray-600";
  };

  // Get brand badge color
  const getBrandBadgeColor = (brand) => {
    const colors = {
      rekker: "bg-red-600 hover:bg-red-700",
      saffron: "bg-orange-600 hover:bg-orange-700",
      cornells: "bg-rose-600 hover:bg-rose-700",
    };
    return colors[brand] || "bg-gray-600 hover:bg-gray-700";
  };

  return (
    <Card className="relative w-full max-w-sm mx-auto group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      {/* Brand Badge - Top Left */}
      <Badge className={`absolute top-3 left-3 z-10 ${getBrandBadgeColor(product?.brand)} text-white text-xs font-semibold`}>
        {brandOptionsMap[product?.brand]}
      </Badge>

      {/* Wishlist Button - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full"
          onClick={toggleWishlist}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </Button>
      </div>

      {/* Product Image Section */}
      <div
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer relative overflow-hidden"
      >
        <div className="relative aspect-square bg-gray-100">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Stock Status Badges */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            {product?.totalStock === 0 ? (
              <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                Out of Stock
              </Badge>
            ) : product?.totalStock < 10 ? (
              <Badge className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs">
                Only {product?.totalStock} left
              </Badge>
            ) : null}
            
            {product?.salePrice > 0 && (
              <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                Sale
              </Badge>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <CardContent className="p-4 space-y-3">
        {/* Category Tags */}
        <div className="flex flex-wrap gap-1">
          {product?.category && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              {categoryOptionsMap[product?.category]}
            </span>
          )}
          {product?.subcategory && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
              {subcategoryOptionsMap[product?.subcategory]}
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3
          className="text-base font-bold text-gray-900 line-clamp-2 hover:text-red-600 transition-colors cursor-pointer min-h-[3rem]"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          {product?.title}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product?.salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  KES {product?.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  KES {product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                KES {product?.price}
              </span>
            )}
          </div>
          
          {product?.salePrice > 0 && (
            <Badge variant="destructive" className="text-xs font-semibold">
              -{Math.round(((product?.price - product?.salePrice) / product?.price) * 100)}%
            </Badge>
          )}
        </div>

        {/* Rating (if you have it) */}
        {product?.averageReview > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.averageReview)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.averageReview.toFixed(1)})
            </span>
          </div>
        )}
      </CardContent>

      {/* Add to Cart Button */}
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button
            className="w-full bg-gray-400 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={handleAddToCartClick}
            className={`w-full bg-gradient-to-r ${getBrandColor(product?.brand)} hover:shadow-lg transition-all duration-300 text-white font-semibold`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;