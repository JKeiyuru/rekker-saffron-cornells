// Central corporate site content — edit here, no component changes needed.

export const SHOP_URL = "https://shop.rekker.co.ke";

export const company = {
  name: "Rekker",
  legal: "Rekker Limited",
  tagline: "Manufacturing and distributing the brands Kenya uses every day.",
  phone: "+254 700 000 000",
  email: "info@rekker.co.ke",
  address: "Nairobi, Kenya",
};

export const brands = [
  {
    slug: "saffron-milan",
    name: "Saffron Milan",
    category: "Home & Cleaning",
    color: "primary",
    image: "/images/brand-saffron.jpg",
    tagline: "Detergents, cleaning and household care built for real Kenyan homes.",
    story:
      "Saffron Milan is Rekker's home and household care brand. From laundry to dishwashing to surface care, every formulation is developed for hard water, heavy use and value-conscious households — then manufactured and quality-tested locally.",
    highlights: [
      "Laundry detergents and fabric care",
      "Dishwashing and kitchen cleaning",
      "Household surface and floor care",
      "Bulk and retail pack sizes",
    ],
    shopPath: "/products?brand=saffron-milan",
  },
  {
    slug: "bio-saff",
    name: "Bio Saff",
    category: "Beauty & Personal Care",
    color: "leaf",
    image: "/images/brand-biosaff.jpg",
    tagline: "Hair and body care formulated for African hair and skin.",
    story:
      "Bio Saff is Rekker's beauty and personal care brand — braid sprays, edge control, shampoos, body care and more. The brand is built around real routines, honest ingredients and results customers can see and review.",
    highlights: [
      "Hair care and braid maintenance",
      "Edge control and styling",
      "Body and skin care",
      "Salon and retail formats",
    ],
    shopPath: "/products?brand=bio-saff",
  },
  {
    slug: "cornells",
    name: "Cornells",
    category: "Fragrance",
    color: "ink",
    image: "/images/brand-cornells.jpg",
    tagline: "Fragrance by Starling Parfums, distributed nationwide by Rekker.",
    story:
      "Cornells brings international fragrance craft to the Kenyan market. Rekker distributes the range nationwide, from modern retail to independent stockists, with consumer sales now handled on the Rekker shop platform.",
    highlights: [
      "Signature fragrance collections",
      "Gifting and seasonal sets",
      "Retail and wholesale supply",
      "Nationwide availability",
    ],
    shopPath: "/products?brand=cornells",
  },
  {
    slug: "petcare",
    name: "PetCare",
    category: "Pet Care",
    color: "leaf",
    // logo on cards (the banner artwork carries its own text, so it isn't cropped into a card)
    image: "/images/petcare-logo.jpg",
    imageFit: "contain",
    banner: "/images/petcare-banner.jpg",
    tagline: "Little Paws, Lots of Love. Premium pet shampoo for dogs, cats and horses.",
    story:
      "PetCare is Rekker's premium pet-care brand, dedicated to making everyday pet care safer, gentler and more enjoyable. Introduced in January and launched with a premium pet shampoo in May after months of research and product development, PetCare is being built as a brand for all things pets — guided by quality, safety and the well-being of the animals it serves.",
    highlights: [
      "Premium pet shampoo for dogs, cats and horses",
      "Developed with pet safety and well-being in mind",
      "Quality-led, thoughtful product development",
      "A growing range of pet-care essentials",
    ],
    shopPath: "/products?brand=petcare",
    isNew: true,
    isFeatured: true,
  },
];

export const capabilities = [
  {
    title: "Manufacturing",
    body: "Local production of home care and personal care lines, with formulation, filling, labelling and batch quality control under one roof.",
  },
  {
    title: "Brand Development",
    body: "We build brands end to end — positioning, packaging, pricing and go-to-market — rather than simply moving boxes.",
  },
  {
    title: "Distribution",
    body: "Nationwide reach through modern trade, general trade, wholesalers, salons and independent stockists across Kenya.",
  },
  {
    title: "Consumer Commerce",
    body: "A dedicated online shopping platform that lets any Rekker brand sell direct to consumers without building a new website.",
  },
];

export const stats = [
  { value: "4+", label: "Owned & distributed brands" },
  { value: "47", label: "Counties reachable" },
  { value: "1,000+", label: "Retail touchpoints" },
  { value: "24hr", label: "Order turnaround target" },
];

export const nav = [
  { label: "Company", to: "/about" },
  { label: "Brands", to: "/brands" },
  { label: "Manufacturing", to: "/manufacturing" },
  { label: "Distribution", to: "/distribution" },
  { label: "Partnerships", to: "/partnerships" },
  { label: "Contact", to: "/contact" },
];
