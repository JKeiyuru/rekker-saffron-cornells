/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */

// ─────────────────────────────────────────────────────────────────────────────
//  Rekker — Cinematic Home Page
//  Drop-in replacement for client/pages/shopping-view/home.jsx
//  All Redux logic preserved. Framer Motion handles visuals.
//  Run:  npm install framer-motion   (if not already in package.json)
// ─────────────────────────────────────────────────────────────────────────────

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Building2,
  Truck,
  Users,
  Globe,
  Award,
  ArrowRight,
  Sparkles,
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

// ─── Framer Motion ────────────────────────────────────────────────────────────
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const brandHeroSlides = [
  {
    id: "rekker",
    title: "REKKER",
    subtitle: "Quality Products for Every Need",
    description:
      "Kenya's trusted manufacturer and distributor of everyday essentials, serving retailers and institutions nationwide.",
    videoUrl: "/videos/rekker-hero-mp4.mp4",
    accent: "#dc2626",
    gradient: "from-red-950 via-red-900 to-rose-950",
  },
  {
    id: "saffron",
    title: "SAFFRON",
    subtitle: "Manufactured by Rekker",
    description:
      "Premium cleaning and personal care solutions, proudly made in Kenya with international quality standards.",
    videoUrl: "/videos/SaffronRange.mp4",
    accent: "#ea580c",
    gradient: "from-orange-950 via-orange-900 to-amber-950",
  },
  {
    id: "cornells",
    title: "CORNELLS",
    subtitle: "Distributed by Rekker",
    description:
      "Exclusive distributor of premium beauty and skincare products, bringing world-class quality to Kenya.",
    videoUrl: "/videos/CornellsB&BSemirange.mp4",
    accent: "#e11d48",
    gradient: "from-rose-950 via-pink-900 to-rose-950",
  },
];

const productCategories = [
  { id: "stationery",     name: "Stationery",       description: "Complete office and school supplies",  icon: "📝" },
  { id: "bags-suitcases", name: "Bags & Suitcases",  description: "Quality school bags and travel cases", icon: "🎒" },
  { id: "toys",           name: "Toys",              description: "Safe and educational toys",            icon: "🧸" },
  { id: "kitchenware",    name: "Kitchenware",       description: "Essential kitchen tools",              icon: "🍳" },
];

const stats = [
  { icon: Building2, value: "10+",  label: "Years Experience" },
  { icon: Truck,     value: "500+", label: "Products" },
  { icon: Users,     value: "1000+",label: "Happy Clients" },
  { icon: Globe,     value: "47",   label: "Counties Served" },
];

const whyChoose = [
  { icon: Award,  title: "Quality Assured",      desc: "Rigorous quality control ensures every product meets international standards." },
  { icon: Truck,  title: "Reliable Distribution",desc: "Comprehensive network ensuring timely delivery across all 47 counties." },
  { icon: Heart,  title: "Customer First",        desc: "Dedicated support from product selection through to after-sales care." },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Reusable reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/60" />
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/60" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function LuxuryHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { productList, productDetails } = useSelector((s) => s.shopProducts);
  const { user, isAuthenticated }       = useSelector((s) => s.auth);

  const videoRefs = useRef([]);
  const heroRef   = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY     = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ── Slide timer ──
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((s) => (s + 1) % brandHeroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  // ── Video management ──
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentSlide) v.play().catch(() => {});
      else { v.pause(); v.currentTime = 0; }
    });
  }, [currentSlide]);

  // ── Data fetching ──
  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) dispatch(fetchWishlist(user.id));
  }, [dispatch, user]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // ── Handlers ──
  function handleNavigateToCategory(id) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ category: [id] }));
    navigate(`/shop/listing?category=${id}`);
  }

  function handleGetProductDetails(id) {
    dispatch(fetchProductDetails(id));
  }

  function handleAddtoCart(id) {
    if (!isAuthenticated || !user) {
      toast({ title: "Login Required", description: "Please login to add items to your cart", variant: "destructive" });
      navigate("/auth/login");
      return;
    }
    dispatch(addToCart({ userId: user?.id, productId: id, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  const slide = brandHeroSlides[currentSlide];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
        {/* Parallax video layer */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full scale-110">
          {brandHeroSlides.map((s, i) => (
            <video
              key={s.id}
              ref={(el) => (videoRefs.current[i] = el)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                i === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              muted loop playsInline
            >
              <source src={s.videoUrl} type="video/mp4" />
            </video>
          ))}
        </motion.div>

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-80 transition-all duration-1000`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 flex items-center z-20">
          <div className="container mx-auto px-6 md:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-3xl space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs tracking-[0.2em] uppercase">
                    <Sparkles className="w-3 h-3 inline mr-2" />
                    Premium Quality · Made in Kenya
                  </Badge>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-7xl md:text-9xl font-black tracking-tighter leading-none"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl text-white/70 font-light tracking-wide"
                >
                  {slide.subtitle}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg text-white/55 leading-relaxed max-w-xl"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 pt-2"
                >
                  <button
                    onClick={() => navigate("/shop/listing")}
                    className="group px-8 py-3.5 bg-white text-black text-sm font-semibold tracking-wide rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                  >
                    Shop Now
                    <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/shop/about")}
                    className="px-8 py-3.5 border border-white/30 text-white text-sm font-semibold tracking-wide rounded-full hover:border-white/70 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  >
                    Our Story
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Slide controls */}
        <button
          onClick={() => setCurrentSlide((s) => (s - 1 + brandHeroSlides.length) % brandHeroSlides.length)}
          className="absolute top-1/2 left-5 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((s) => (s + 1) % brandHeroSlides.length)}
          className="absolute top-1/2 right-5 -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {brandHeroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-500 ${
                i === currentSlide ? "w-10 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 right-10 z-30 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase rotate-90 origin-center translate-y-4">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── BRAND STATEMENT ────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <Reveal>
            <p className="text-xs tracking-[0.4em] text-red-400/80 uppercase mb-6">Est. Kenya</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight mb-6">
              Welcome to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">Rekker</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <Divider />
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
              Kenya's trusted manufacturer and distributor of quality products — from stationery to personal care,
              serving retailers and institutions across all 47 counties.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0d0d0d] border-y border-white/[0.04]">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/[0.06]"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center py-10 px-6 group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-600/20 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                <div className="text-xs tracking-[0.2em] text-white/40 uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <Reveal className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] text-red-400/80 uppercase mb-4">What we offer</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">Product Categories</h2>
            <p className="text-white/40 text-lg font-light max-w-lg mx-auto">
              Comprehensive range of quality products serving diverse market needs
            </p>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {productCategories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={fadeUp}
                onClick={() => handleNavigateToCategory(cat.id)}
                className="group relative cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-500 overflow-hidden"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-rose-600/0 group-hover:from-red-600/8 group-hover:to-rose-600/5 transition-all duration-500 rounded-2xl" />

                <div className="relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 origin-left">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors">{cat.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{cat.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-red-400 text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Reveal delay={0.2} className="text-center mt-12">
            <button
              onClick={() => navigate("/shop/listing")}
              className="group px-10 py-4 border border-white/20 text-white text-sm font-semibold tracking-wide rounded-full hover:border-red-500/60 hover:bg-red-600/10 transition-all duration-300"
            >
              View All Products
              <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────────── */}
      {productList && productList.length > 0 && (
        <section className="py-32 bg-[#0d0d0d] border-t border-white/[0.04]">
          <div className="container mx-auto px-6 md:px-12">
            <Reveal className="text-center mb-16">
              <p className="text-xs tracking-[0.4em] text-red-400/80 uppercase mb-4">Handpicked for you</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">Featured Products</h2>
              <p className="text-white/40 text-lg font-light max-w-lg mx-auto">
                Our most loved products, trusted by thousands of Kenyans
              </p>
            </Reveal>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {productList.slice(0, 8).map((product) => (
                <motion.div key={product._id} variants={scaleIn}>
                  <LuxuryProductTile
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── WHY REKKER ───────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        {/* Large ambient glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-red-900/20 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-rose-900/20 blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <Reveal className="text-center mb-20">
            <p className="text-xs tracking-[0.4em] text-red-400/80 uppercase mb-4">Our promise</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">Why Choose Rekker</h2>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-10 hover:border-red-500/20 hover:bg-white/[0.04] transition-all duration-500"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/0 to-rose-600/0 group-hover:from-red-600/5 group-hover:to-rose-600/3 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-8 group-hover:bg-red-600/20 group-hover:border-red-500/40 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/40 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#0d0d0d] border-t border-white/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)]" />

        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <Reveal>
            <Sparkles className="w-10 h-10 mx-auto mb-8 text-red-400/60" />
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
              Ready to shop<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400">with Rekker?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg font-light mb-12 max-w-xl mx-auto">
              Browse our extensive catalog and enjoy quality products delivered across Kenya.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/shop/listing")}
              className="group px-10 py-4 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold tracking-wide rounded-full transition-all duration-300 hover:shadow-[0_0_50px_rgba(220,38,38,0.5)]"
            >
              Browse Products
              <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/shop/contact")}
              className="px-10 py-4 border border-white/20 text-white text-sm font-semibold tracking-wide rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              Contact Us
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── PRODUCT DETAILS DIALOG ───────────────────────────────────────────── */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#070707] border-t border-white/[0.04] py-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/25 text-sm">© 2025 Rekker Limited. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <TermsAndConditionsSheet />
              <p className="text-white/20 text-xs max-w-xs text-center">
                By using our website, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LuxuryHome;