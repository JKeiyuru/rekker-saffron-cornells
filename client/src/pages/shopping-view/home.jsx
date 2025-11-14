/* eslint-disable react/jsx-no-undef */
// client/src/pages/shopping-view/home.jsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // ✅ ADDED - This was missing!
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
  Sparkles,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import LuxuryProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { fetchWishlist } from "@/store/shop/wishlist-slice";
import TermsAndConditionsSheet from "@/components/shopping-view/terms-conditions-sheet";

const brandHeroSlides = [
  {
    id: "rekker",
    title: "REKKER",
    subtitle: "Quality Products for Every Need",
    description: "Kenya's trusted manufacturer and distributor of everyday essentials, serving retailers and institutions nationwide.",
    ctaText: "Explore Rekker Products",
    ctaAction: "listing",
    videoUrl: "/videos/rekker-hero-mp4.mp4",
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
    gradient: "from-rose-600 via-pink-600 to-rose-700",
    textColor: "text-white",
  },
];

const productCategories = [
  {
    id: "rekker-stationery",
    name: "Stationery",
    description: "Complete office and school supplies",
    icon: "📝",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "rekker-bags-suitcases",
    name: "Bags & Suitcases",
    description: "Quality school bags and travel cases",
    icon: "🎒",
    color: "from-rose-500 to-red-600",
  },
  {
    id: "rekker-toys",
    name: "Toys",
    description: "Safe and educational toys",
    icon: "🧸",
    color: "from-red-600 to-rose-600",
  },
  {
    id: "rekker-kitchenware",
    name: "Kitchenware",
    description: "Essential kitchen tools",
    icon: "🍳",
    color: "from-rose-600 to-red-700",
  },
];

function LuxuryHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const videoRefs = useRef([]);
  const [scrollY, setScrollY] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      navigate('/shop/listing');
    } else if (action === "saffron") {
      const saffronFilter = {
        brand: ["saffron"],
      };
      sessionStorage.setItem("filters", JSON.stringify(saffronFilter));
      navigate('/shop/listing?brand=saffron');
    } else if (action === "cornells") {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % brandHeroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20">
      {/* Hero Section with Parallax */}
      <div className="relative w-full h-screen overflow-hidden">
        {brandHeroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
            }`}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              loop
              playsInline
            >
              <source src={slide.videoUrl} type="video/mp4" />
            </video>

            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-85`}></div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 10 + 10}s`,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl space-y-6 animate-slide-up">
                  <div className="inline-block">
                    <Badge className="px-4 py-2 bg-white/10 backdrop-blur-md border-white/20 text-white rounded-full">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Premium Quality
                    </Badge>
                  </div>
                  
                  <h1 className={`text-6xl md:text-7xl font-bold ${slide.textColor} mb-4 leading-tight`}>
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
                    className="group bg-white/95 backdrop-blur-md hover:bg-white text-gray-900 px-8 py-6 text-lg font-semibold shadow-2xl rounded-full transition-all duration-300 hover:scale-105"
                  >
                    {slide.ctaText}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + brandHeroSlides.length) % brandHeroSlides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white z-30 rounded-full w-12 h-12"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % brandHeroSlides.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white z-30 rounded-full w-12 h-12"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </Button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {brandHeroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-12 h-3 bg-white' 
                  : 'w-3 h-3 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section with Animation */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-50/50 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to Rekker
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Kenya's trusted manufacturer and distributor of quality products
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Building2, value: "10+", label: "Years Experience", delay: "0ms" },
              { icon: Truck, value: "500+", label: "Products", delay: "100ms" },
              { icon: Users, value: "1000+", label: "Happy Clients", delay: "200ms" },
              { icon: Globe, value: "47", label: "Counties Served", delay: "300ms" },
            ].map((stat, index) => (
              <Card
                key={index}
                className="group text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-red-50/30 border-2 border-transparent hover:border-red-100"
                style={{ animationDelay: stat.delay }}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section with Hover Effects */}
      <section className="py-20 bg-gradient-to-br from-red-50/30 to-rose-50/30 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Product Categories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive range of quality products serving diverse market needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category, index) => (
              <Card
                key={category.id}
                onClick={() => handleNavigateToCategory(category.id)}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white border-2 border-transparent hover:border-red-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-rose-500/0 group-hover:from-red-500/10 group-hover:to-rose-500/10 transition-all duration-500" />
                
                <CardContent className="p-8 text-center relative z-10">
                  <div className="text-6xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-sm font-semibold">Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/shop/listing')}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {productList && productList.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Featured Products</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most popular products loved by thousands
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productList.slice(0, 8).map((product, index) => (
                <div
                  key={product._id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in"
                >
                  <LuxuryProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose Rekker</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-rose-400 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { icon: Award, title: "Quality Assured", desc: "Rigorous quality control ensures every product meets international standards" },
              { icon: Truck, title: "Reliable Distribution", desc: "Comprehensive network ensuring timely delivery across Kenya" },
              { icon: Heart, title: "Customer First", desc: "Dedicated support from selection to after-sales care" },
            ].map((item, index) => (
              <div
                key={index}
                className="group text-center transform hover:-translate-y-4 transition-all duration-500"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 backdrop-blur-xl border border-white/10">
                  <item.icon className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl font-bold mb-6">Ready to Shop with Rekker?</h2>
            <p className="text-2xl text-red-100 mb-10 leading-relaxed">
              Browse our extensive catalog and enjoy quality products delivered across Kenya
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={() => navigate('/shop/listing')}
                className="bg-white text-red-700 hover:bg-gray-100 px-10 py-6 text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Browse Products
              </Button>
              <Button
                onClick={() => navigate('/shop/contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-red-700 px-10 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105"
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
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
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

export default LuxuryHome;