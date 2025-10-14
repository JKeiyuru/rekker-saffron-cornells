/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
// client/src/pages/shopping-view/home.jsx - Rekker Home Page
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Building2,
  Truck,
  Users,
  Globe,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
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

// Brand hero slides with video/image support
const brandHeroSlides = [
  {
    id: "rekker",
    title: "REKKER",
    subtitle: "Quality Products for Every Need",
    description: "Kenya's trusted manufacturer and distributor of everyday essentials, serving retailers and institutions nationwide.",
    ctaText: "Explore Rekker Products",
    ctaAction: "listing", // or "brand" for brand page
    videoUrl: "/videos/rekker-hero-mp4.mp4", // 6-second video
    //fallbackImage: "/images/rekker-hero.jpg",
    gradient: "from-red-900 via-red-800 to-rose-900",
    textColor: "text-white",
  },
  {
    id: "saffron",
    title: "SAFFRON",
    subtitle: "Manufactured by Rekker",
    description: "Premium cleaning and personal care solutions, proudly made in Kenya with international quality standards.",
    ctaText: "Explore Saffron Products",
    ctaAction: "saffron",
    videoUrl: "/videos/SaffronRange.mp4",
    //fallbackImage: "/images/saffron-hero.jpg",
    gradient: "from-orange-600 via-orange-500 to-amber-600",
    textColor: "text-white",
  },
  {
    id: "cornells",
    title: "CORNELLS",
    subtitle: "Distributed by Rekker",
    description: "Exclusive distributor of premium beauty and skincare products, bringing world-class quality to Kenya.",
    ctaText: "Explore Cornells Products",
    ctaAction: "cornells",
    videoUrl: "/videos/CornellsB&BSemirange.mp4",
    //fallbackImage: "/images/cornells-hero.jpg",
    gradient: "from-rose-600 via-pink-600 to-rose-700",
    textColor: "text-white",
  },
];

// Rekker product categories
const productCategories = [
  {
    id: "stationery",
    name: "Stationery",
    description: "Complete office and school supplies",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "bags",
    name: "Bags & Suitcases",
    description: "Quality school bags and travel cases",
    color: "from-rose-500 to-red-600",
  },
  {
    id: "toys",
    name: "Toys",
    description: "Safe and educational toys",
    color: "from-red-600 to-rose-600",
  },
  {
    id: "kitchenware",
    name: "Kitchenware",
    description: "Essential kitchen tools",
    color: "from-rose-600 to-red-700",
  },
  {
    id: "padlocks",
    name: "Padlocks",
    description: "Secure and durable locks",
    color: "from-red-700 to-rose-700",
  },
  {
    id: "stuffed-toys",
    name: "Teddy Bears",
    description: "Soft and cuddly companions",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "party-items",
    name: "Party Items",
    description: "Complete party supplies",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "educational",
    name: "Educational Items",
    description: "Art and craft supplies",
    color: "from-rose-600 to-red-700",
  },
];

// Brand cards for the brands section
const brands = [
  {
    name: "Saffron",
    tagline: "Manufactured by Rekker",
    description: "Premium cleaning and personal care products made in Kenya",
    color: "from-orange-500 to-red-500",
    link: "/shop/brands/saffron",
  },
  {
    name: "Cornells",
    tagline: "Distributed by Rekker",
    description: "Exclusive distributor of premium beauty products",
    color: "from-rose-500 to-pink-500",
    link: "/shop/brands/cornells",
  },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const videoRefs = useRef([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToCategory(categoryId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [categoryId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?category=${categoryId}`);
  }

  function handleBrandCTA(action) {
    sessionStorage.removeItem("filters");
    
    if (action === "listing") {
      // Navigate to all products
      navigate('/shop/listing');
    } else if (action === "saffron") {
      // Navigate to products page filtered for Saffron
      const saffronFilter = {
        brand: ["saffron"],
      };
      sessionStorage.setItem("filters", JSON.stringify(saffronFilter));
      navigate('/shop/listing?brand=saffron');
    } else if (action === "cornells") {
      // Navigate to products page filtered for Cornells
      const cornellsFilter = {
        brand: ["cornells"],
      };
      sessionStorage.setItem("filters", JSON.stringify(cornellsFilter));
      navigate('/shop/listing?brand=cornells');
    }
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

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

  // Video carousel with 6-second auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % brandHeroSlides.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(timer);
  }, []);

  // Play/pause videos based on current slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide) {
          video.play().catch(err => console.log("Video autoplay prevented:", err));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentSlide]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30">
      {/* Hero Section with Brand Video Carousel */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {brandHeroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Video Background */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
              poster={slide.fallbackImage}
            >
              <source src={slide.videoUrl} type="video/mp4" />
              {/* Fallback to image if video fails */}
              <img
                src={slide.fallbackImage}
                alt={`${slide.title} background`}
                className="w-full h-full object-cover"
              />
            </video>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80`}></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl">
                  <h1 className={`text-5xl md:text-6xl font-bold ${slide.textColor} mb-4 leading-tight`}>
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl text-white/90 mb-4 font-semibold">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <Button
                    onClick={() => handleBrandCTA(slide.ctaAction)}
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl"
                  >
                    {slide.ctaText}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + brandHeroSlides.length) % brandHeroSlides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-30"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % brandHeroSlides.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white z-30"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {brandHeroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Company Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to Rekker
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              Kenya's trusted manufacturer and distributor of quality products. From everyday essentials 
              to premium branded solutions, we serve retailers, wholesalers, and institutions across the region.
            </p>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all">
                  <Building2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
                <p className="text-gray-600 font-medium">Years Experience</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all">
                  <Truck className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600 font-medium">Products</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all">
                  <Users className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
                <p className="text-gray-600 font-medium">Happy Clients</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all">
                  <Globe className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">47</h3>
                <p className="text-gray-600 font-medium">Counties Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gradient-to-br from-red-50/30 to-rose-50/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Product Categories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive range of quality products serving diverse market needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category) => (
              <Card
                key={category.id}
                onClick={() => handleNavigateToCategory(category.id)}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/shop/listing')}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-4 text-lg"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {productList && productList.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most popular and best-selling products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.slice(0, 8).map((productItem) => (
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
      )}

      {/* Our Brands */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-rose-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Our Premium Brands</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-rose-400 mx-auto mb-8"></div>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Trusted brands delivering quality and value across Kenya
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {brands.map((brand) => (
              <Card
                key={brand.name}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-white/20"
                onClick={() => navigate(brand.link)}
              >
                <CardContent className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${brand.color} rounded-xl flex items-center justify-center mb-6`}>
                    <span className="text-white font-bold text-2xl">{brand.name[0]}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{brand.name}</h3>
                  <p className="text-red-200 text-sm mb-4">{brand.tagline}</p>
                  <p className="text-red-100 mb-6">{brand.description}</p>
                  <Button
                    className="bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Explore {brand.name}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/shop/brands')}
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              View All Brands
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Rekker */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Rekker</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all">
                <Award className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Rigorous quality control processes ensure every product meets international standards.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all">
                <Truck className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reliable Distribution</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive distribution network ensuring timely delivery across Kenya.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all">
                <Users className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600 leading-relaxed">
                Dedicated customer service providing professional support from selection to after-sales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-rose-600 to-red-700">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Shop with Rekker?</h2>
            <p className="text-xl text-red-100 mb-10 leading-relaxed">
              Browse our extensive catalog and enjoy quality products delivered to your doorstep.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => navigate('/shop/listing')}
                className="bg-white text-red-700 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Browse Products
              </Button>
              <Button
                onClick={() => navigate('/shop/contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-red-700 px-8 py-4 text-lg"
                variant="outline"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © 2025 Rekker Limited. All rights reserved.
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