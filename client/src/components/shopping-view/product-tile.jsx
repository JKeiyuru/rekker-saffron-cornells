/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// client/src/components/shopping-view/product-tile.jsx - Rekker Product Tile with Guest Mode
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, ShoppingCart, Eye, Star, Sparkles } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  // Get brand gradient
  const getBrandGradient = (brand) => {
    const gradients = {
      rekker: 'from-red-600 via-rose-500 to-red-600',
      saffron: 'from-orange-600 via-amber-500 to-orange-600',
      cornells: 'from-rose-600 via-pink-500 to-rose-600',
    };
    return gradients[brand] || 'from-gray-600 via-gray-500 to-gray-600';
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

  const discountPercentage = product?.salePrice > 0 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card with glass morphism effect */}
      <Card className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-white/20">
        
        {/* Animated gradient border */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getBrandGradient(product?.brand)} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`} />
        
        {/* Top badges section */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {/* Brand badge with shine effect */}
          <Badge className={`relative px-4 py-2 rounded-full bg-gradient-to-r ${getBrandGradient(product?.brand)} text-white text-xs font-bold uppercase tracking-wider shadow-lg overflow-hidden border-0`}>
            <span className="relative z-10">{brandOptionsMap[product?.brand]}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </Badge>

          {/* Wishlist button with sophisticated hover */}
          <Button
            variant="ghost"
            size="icon"
            className="group/wish relative w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-white/50 hover:scale-110"
            onClick={toggleWishlist}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isWishlisted
                  ? 'text-red-500 fill-red-500 scale-110'
                  : 'text-gray-600 group-hover/wish:text-red-500 group-hover/wish:scale-110'
              }`}
            />
            {isWishlisted && (
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            )}
          </Button>
        </div>

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 z-20">
            <Badge className="relative px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg overflow-hidden border-0">
              <span className="relative z-10 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {discountPercentage}% OFF
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </Badge>
          </div>
        )}

        {/* Image section with parallax effect */}
        <div 
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 cursor-pointer"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-red-500 animate-spin" />
            </div>
          )}
          
          <img
            src={product?.image}
            alt={product?.title}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Overlay gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Stock indicator */}
          {product?.totalStock < 10 && product?.totalStock > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className="px-3 py-1.5 rounded-full bg-orange-500/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg border-0">
                Only {product?.totalStock} left
              </Badge>
            </div>
          )}

          {/* Out of Stock Badge */}
          {product?.totalStock === 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className="px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg border-0">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick actions on hover */}
          <div className={`absolute inset-x-4 bottom-4 flex gap-2 transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
              onClick={(e) => {
                e.stopPropagation();
                handleGetProductDetails(product?._id);
              }}
            >
              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product details section */}
        <CardContent className="p-6 space-y-4">
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

          {/* Title with elegant truncation */}
          <h3 
            className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-300 min-h-[3.5rem] cursor-pointer"
            onClick={() => handleGetProductDetails(product?._id)}
          >
            {product?.title}
          </h3>

          {/* Rating section */}
          {product?.averageReview > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product?.averageReview)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                ({product?.averageReview.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price section with animation */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              {product?.salePrice > 0 ? (
                <>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                    KES {product?.salePrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    KES {product?.price}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  KES {product?.price}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        {/* Add to cart button */}
        <CardFooter className="p-6 pt-0">
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
              className={`w-full bg-gradient-to-r ${getBrandGradient(product?.brand)} text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/cart overflow-hidden relative`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                Add to Cart
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/cart:animate-shimmer" />
            </Button>
          )}
        </CardFooter>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default ShoppingProductTile;