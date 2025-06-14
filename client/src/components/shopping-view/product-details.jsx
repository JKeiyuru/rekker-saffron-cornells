/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { StarIcon, ChevronDown, ChevronUp, X, Share2, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  // Handle image display logic
  const displayedImage = selectedVariation?.image || productDetails?.image;
  const displayedTitle = selectedVariation
    ? `${productDetails?.title} (${selectedVariation.label})`
    : productDetails?.title;

  // Create array of all images for thumbnails
  const getAllImages = () => {
    if (!productDetails) return [];
    
    const images = [];
    
    // Add original image if no variation is selected, or if selected variation is different
    if (!selectedVariation || selectedVariation.image !== productDetails.image) {
      images.push({
        image: productDetails.image,
        label: "Original",
        isOriginal: true
      });
    }
    
    // Add variations
    if (productDetails.variations && productDetails.variations.length > 0) {
      productDetails.variations.forEach(variation => {
        // Don't add the currently selected variation to thumbnails
        if (!selectedVariation || variation.image !== selectedVariation.image) {
          images.push(variation);
        }
      });
    }
    
    return images;
  };

  const thumbnailImages = getAllImages();

  // Handle thumbnail click
  const handleThumbnailClick = (imageData) => {
    if (imageData.isOriginal) {
      setSelectedVariation(null);
    } else {
      setSelectedVariation(imageData);
    }
  };

  // Truncate description for preview
  const getDescriptionPreview = (description, wordLimit = 20) => {
    if (!description) return "";
    const words = description.split(" ");
    if (words.length <= wordLimit) return description;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(productId, totalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedVariation(null);
    setIsDescriptionExpanded(false);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 rounded-none sm:w-[90vw] sm:h-[90vh] sm:max-w-[80vw] lg:max-w-[70vw] sm:rounded-xl sm:m-auto">
        
        {/* Mobile Layout */}
        <div className="flex flex-col h-full sm:hidden">
          
          {/* Mobile Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDialogClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Image Section */}
          <div className="bg-gray-50">
            <div className="relative">
              <img
                src={displayedImage}
                alt={displayedTitle}
                className="w-full h-80 object-cover"
              />
              
              {/* Image Indicators */}
              {thumbnailImages.length > 0 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  {thumbnailImages.map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-white/50"></div>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Thumbnails - Horizontal Scroll */}
            {thumbnailImages.length > 0 && (
              <div className="px-4 py-3 overflow-x-auto">
                <div className="flex gap-2 pb-1">
                  {thumbnailImages.map((imageData, index) => (
                    <img
                      key={index}
                      src={imageData.image}
                      alt={imageData.label}
                      className="flex-shrink-0 w-12 h-12 object-cover cursor-pointer border-2 rounded-lg transition-all duration-200 border-gray-200 hover:border-primary"
                      onClick={() => handleThumbnailClick(imageData)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 pb-20">
            
            {/* Product Title & Rating */}
            <div className="py-4">
              <h1 className="text-2xl font-bold leading-tight mb-2">{displayedTitle}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-sm text-muted-foreground">
                  ({averageReview.toFixed(1)}) • {reviews?.length || 0} reviews
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="pb-4">
              <div className="flex items-center gap-3">
                {productDetails?.salePrice > 0 ? (
                  <>
                    <span className="text-2xl font-bold text-primary">
                      KES{productDetails?.salePrice}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      KES{productDetails?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">
                    KES{productDetails?.price}
                  </span>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Mobile Description - Enhanced */}
            <div className="pb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Description</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="h-8 px-2 text-sm"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <span className="mr-1">Less</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span className="mr-1">More</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-gray-700">
                {isDescriptionExpanded ? (
                  <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-4 border">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {productDetails?.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">
                    {getDescriptionPreview(productDetails?.description)}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Reviews Section - Enhanced for Mobile */}
            <div className="pb-6">
              <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
              
              {/* Reviews Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{averageReview.toFixed(1)}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <StarRatingComponent rating={averageReview} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Based on {reviews?.length || 0} reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 border">
                          <AvatarFallback className="text-xs">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{reviewItem?.userName}</h4>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No reviews yet</p>
                    <p className="text-xs mt-1">Be the first to review this product!</p>
                  </div>
                )}
              </div>

              {/* Write Review Section */}
              <div className="mt-6 space-y-3">
                <Label className="text-sm font-medium">Write a Review</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Your rating:</span>
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="min-h-[80px] resize-none"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === "" || rating === 0}
                  className="w-full"
                  size="sm"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Sticky Bottom Bar */}
          <div className="sticky bottom-0 bg-white border-t px-4 py-3 z-10">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full h-12 bg-gray-400 cursor-not-allowed" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full h-12 text-base font-medium"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>

        {/* Desktop Layout (unchanged from original but with some enhancements) */}
        <div className="hidden sm:grid grid-cols-2 gap-8 p-12 h-full overflow-y-auto">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={displayedImage}
              alt={displayedTitle}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
            />
            {/* Thumbnail images */}
            {thumbnailImages.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {thumbnailImages.map((imageData, index) => (
                  <img
                    key={index}
                    src={imageData.image}
                    alt={imageData.label}
                    className="w-16 h-16 object-cover cursor-pointer border rounded-md transition-all duration-200 border-gray-300 hover:border-primary"
                    onClick={() => handleThumbnailClick(imageData)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div>
              <h1 className="text-3xl font-extrabold">{displayedTitle}</h1>
              
              {/* Collapsible Description */}
              <div className="mt-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">Description</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="h-6 w-6 p-0"
                  >
                    {isDescriptionExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="text-muted-foreground">
                  {isDescriptionExpanded ? (
                    <div className="text-sm leading-relaxed max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
                      {productDetails?.description}
                    </div>
                  ) : (
                    <p className="text-base">
                      {getDescriptionPreview(productDetails?.description, 30)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p
                className={`text-2xl font-bold text-muted-foreground ${
                  productDetails?.salePrice > 0 ? "line-through" : ""
                }`}
              >
                KES{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 && (
                <p className="text-3xl font-bold text-primary">
                  KES{productDetails?.salePrice}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-0.5">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground">
                ({averageReview.toFixed(2)})
              </span>
            </div>

            <div className="mt-5 mb-5">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() =>
                    handleAddToCart(
                      productDetails?._id,
                      productDetails?.totalStock
                    )
                  }
                >
                  Add to Cart
                </Button>
              )}
            </div>

            <Separator />

            <div className="flex-1 min-h-0">
              <h2 className="text-xl font-bold mb-4 mt-4">Reviews</h2>
              <div className="max-h-[200px] overflow-y-auto">
                <div className="grid gap-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem, index) => (
                      <div key={index} className="flex gap-4">
                        <Avatar className="w-10 h-10 border">
                          <AvatarFallback>
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{reviewItem?.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <h1>No Reviews</h1>
                  )}
                </div>
              </div>

              <div className="mt-6 flex-col flex gap-2">
                <Label>Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;