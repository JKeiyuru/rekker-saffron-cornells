/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
//bannerTwo;
import bannerThree from "../../assets/banner-3.webp";
import {
  HomeIcon,
  DollarSignIcon,
  BookOpenIcon,
  UsersIcon,
  BatteryFullIcon,
  PuzzleIcon,
  GiftIcon,
  PenToolIcon,
  ShoppingBagIcon,
  PaintbrushIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import TermsAndConditionsSheet from "@/components/shopping-view/terms-conditions-sheet";

const categoriesWithIcon = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "under-100", label: "Under 100/", icon: DollarSignIcon },
  { id: "educational-toys", label: "Educational Toys", icon: BookOpenIcon },
  { id: "pretend-play", label: "Pretend Play & Role Play", icon: UsersIcon },
  { id: "action-outdoor", label: "Action & Outdoor", icon: BatteryFullIcon },
  { id: "card-board-games", label: "Card & Board Games", icon: PuzzleIcon },
  { id: "party-supplies", label: "Party Supplies", icon: GiftIcon },
  { id: "stationery-school", label: "Stationery & School", icon: PenToolIcon },
  { id: "fashion-accessories", label: "Fashion & Accessories", icon: ShoppingBagIcon },
  { id: "home-decor", label: "Home & Decor", icon: PaintbrushIcon },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 &&
          featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`$${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">A Family-first Toy Haven</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-12">
            Born from a mother of five's passion for child-driven development, our family-run business is committed to rediscovering joy beyond screens — encouraging creativity, play, and family bonding through classic and new-age games.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="rounded-full bg-gray-100 shadow p-6 w-[250px] h-[250px] flex items-center justify-center text-center">
              <p className="text-sm font-medium">
                <strong>New Products:</strong> We stay ahead of trends and dig into the archives of forgotten fun — reviving excitement with every box we stock.
              </p>
            </div>
            <div className="rounded-full bg-gray-200 shadow p-6 w-[250px] h-[250px] flex items-center justify-center text-center">
              <p className="text-sm font-medium">
                <strong>Customer Care:</strong> From order to doorstep, we are with you. Real people, real follow-up, real support.
              </p>
            </div>
            <div className="rounded-full bg-gray-300 shadow p-6 w-[250px] h-[250px] flex items-center justify-center text-center">
              <p className="text-sm font-medium">
                <strong>Secure Checkout:</strong> Our encrypted payment gateway ensures your personal and payment info stays safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0 &&
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* Footer with Terms and Conditions */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © 2025 Tempara. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <TermsAndConditionsSheet />
              <p className="text-xs text-gray-500 max-w-md text-center">
                By using our website, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingHome;