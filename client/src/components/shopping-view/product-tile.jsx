// client/src/components/shopping-view/luxury-product-tile.jsx
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Heart, ShoppingCart, Eye, Star, Sparkles, Zap } from "lucide-react";
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

function LuxuryProductTile({
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Magnetic hover effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

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
          title: "Removed from wishlist",
        });
      } else {
        await dispatch(addToWishlist({ userId: user.id, productId: product._id }));
        toast({
          title: "Added to wishlist",
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

  const getBrandGradient = (brand) => {
    const gradients = {
      rekker: 'from-red-600 via-rose-500 to-red-600',
      saffron: 'from-orange-600 via-amber-500 to-orange-600',
      cornells: 'from-rose-600 via-pink-500 to-rose-600',
    };
    return gradients[brand] || 'from-gray-600 via-gray-500 to-gray-600';
  };

  const discountPercentage = product?.salePrice > 0 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  return (
    <div
      ref={cardRef}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${(mousePosition.y - 150) / 30}deg) rotateY(${(mousePosition.x - 150) / 30}deg) translateZ(20px)`
          : 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Hover glow effect */}
      <div 
        className={`absolute -inset-0.5 bg-gradient-to-r ${getBrandGradient(product?.brand)} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-700 -z-10`}
      />

      {/* Main card */}
      <Card className="relative bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100 group-hover:border-white">
        
        {/* Animated gradient border on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className={`absolute inset-0 bg-gradient-to-r ${getBrandGradient(product?.brand)} opacity-20 blur-xl`} />
        </div>
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {/* Brand badge */}
          <Badge className={`relative px-4 py-2 rounded-full bg-gradient-to-r ${getBrandGradient(product?.brand)} text-white text-xs font-bold uppercase tracking-wider shadow-lg border-0 overflow-hidden`}>
            <span className="relative z-10">{brandOptionsMap[product?.brand]}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" />
          </Badge>

          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="relative w-11 h-11 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-white/50 hover:scale-110 group/wish"
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
          </button>
        </div>

        {/* Discount badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-16 z-20">
            <Badge className="relative px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold shadow-lg border-0 overflow-hidden">
              <span className="relative z-10 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                {discountPercentage}% OFF
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </Badge>
          </div>
        )}

        {/* Image section */}
        <div 
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
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
              isHovered ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />

          {/* Stock indicator */}
          {product?.totalStock < 10 && product?.totalStock > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className="px-3 py-2 rounded-full bg-orange-500/95 backdrop-blur-md text-white text-xs font-semibold shadow-lg border-0">
                Only {product?.totalStock} left
              </Badge>
            </div>
          )}

          {product?.totalStock === 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className="px-3 py-2 rounded-full bg-red-600/95 backdrop-blur-md text-white text-xs font-semibold shadow-lg border-0">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Quick action button */}
          <div className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
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

        {/* Product details */}
        <CardContent className="p-6 space-y-4 relative z-10">
          {/* Category tags */}
          <div className="flex flex-wrap gap-2">
            {product?.category && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                {categoryOptionsMap[product?.category]}
              </span>
            )}
            {product?.subcategory && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium">
                {subcategoryOptionsMap[product?.subcategory]}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors duration-300 min-h-[3.5rem] cursor-pointer"
            onClick={() => handleGetProductDetails(product?._id)}
          >
            {product?.title}
          </h3>

          {/* Rating */}
          {product?.averageReview > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 transition-all ${
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

          {/* Price section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
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
              className={`w-full bg-gradient-to-r ${getBrandGradient(product?.brand)} text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group/cart overflow-hidden relative`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 group-hover/cart:scale-110 transition-transform" />
                Add to Cart
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/cart:translate-x-[200%] transition-transform duration-700" />
            </Button>
          )}
        </CardFooter>

        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-rose-500/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </div>
  );
}

export default LuxuryProductTile;