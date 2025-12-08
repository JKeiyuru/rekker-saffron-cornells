// client/src/pages/shopping-view/search.jsx - Enhanced Search Experience
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import LuxuryProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, X, Sparkles, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  // Popular search suggestions
  const popularSearches = [
    "Shampoo",
    "Body Lotion",
    "Stationery",
    "School Bags",
    "Kitchen Tools",
    "Baby Care",
  ];

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
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
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const handlePopularSearch = (searchTerm) => {
    setKeyword(searchTerm);
  };

  const clearSearch = () => {
    setKeyword("");
    dispatch(resetSearchResults());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl mb-6 shadow-lg">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Search Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Find exactly what you're looking for from our extensive collection
            </p>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                value={keyword}
                name="keyword"
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full pl-16 pr-16 py-7 text-lg rounded-2xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all shadow-lg"
                placeholder="Search for products, brands, categories..."
                autoFocus
              />
              {keyword && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-red-50"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-red-600" />
                </Button>
              )}
            </div>

            {/* Search hint */}
            <p className="text-sm text-gray-500 mt-3 text-center">
              {keyword.length > 0 && keyword.length <= 2 
                ? "Type at least 3 characters to search..." 
                : keyword.length === 0 
                ? "Start typing to search our products..." 
                : `Searching for "${keyword}"...`}
            </p>
          </div>

          {/* Popular Searches */}
          {!keyword && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-semibold text-gray-700">Popular Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(term)}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto">
          {keyword && keyword.length > 2 && (
            <div className="mb-6">
              <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Search Results
                  </h2>
                  <p className="text-sm text-gray-600">
                    {searchResults.length > 0 
                      ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'product' : 'products'} matching "${keyword}"`
                      : `No products found for "${keyword}"`}
                  </p>
                </div>
                {searchResults.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSearch}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((item) => (
                <LuxuryProductTile
                  key={item._id}
                  handleAddtoCart={handleAddtoCart}
                  product={item}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          ) : keyword && keyword.length > 2 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-300/50 animate-pulse" />
                <Package className="w-16 h-16 text-gray-400 relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Results Found
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any products matching "<span className="font-semibold text-gray-900">{keyword}</span>". Try different keywords or browse our categories.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  onClick={clearSearch}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Search
                </Button>
                <Button
                  onClick={() => navigate('/shop/listing')}
                  variant="outline"
                  className="border-gray-300 hover:border-red-600 hover:text-red-600"
                >
                  Browse All Products
                </Button>
              </div>

              {/* Search Tips */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Search Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Check your spelling</li>
                  <li>✓ Try more general keywords</li>
                  <li>✓ Browse our popular categories</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-200/50 to-rose-200/50 animate-pulse" />
                <Sparkles className="w-16 h-16 text-red-500 relative z-10" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start Your Search
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enter a product name, brand, or category in the search box above to find what you're looking for.
              </p>
              
              <Button
                onClick={() => navigate('/shop/listing')}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
              >
                Browse All Products
              </Button>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;