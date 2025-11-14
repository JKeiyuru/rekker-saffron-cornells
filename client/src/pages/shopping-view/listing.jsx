/* eslint-disable react/jsx-key */
// client/src/pages/shopping-view/listing.jsx - Optimized Product Listing
import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import LuxuryProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, Grid3x3, LayoutGrid, Filter, X } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [gridView, setGridView] = useState("4");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  const handleSort = useCallback((value) => {
    setSort(value);
  }, []);

  const handleFilter = useCallback((getSectionId, getCurrentOption) => {
    setFilters(prevFilters => {
      const cpyFilters = { ...prevFilters };
      const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

      if (indexOfCurrentSection === -1) {
        cpyFilters[getSectionId] = [getCurrentOption];
      } else {
        const indexOfCurrentOption =
          cpyFilters[getSectionId].indexOf(getCurrentOption);

        if (indexOfCurrentOption === -1) {
          cpyFilters[getSectionId].push(getCurrentOption);
        } else {
          cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }
      }

      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
      return cpyFilters;
    });
  }, []);

  const handleGetProductDetails = useCallback((getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  }, [dispatch]);

  const handleAddtoCart = useCallback((getCurrentProductId, getTotalStock) => {
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
  }, [isAuthenticated, user, cartItems, navigate, dispatch, toast]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    sessionStorage.removeItem("filters");
    setSearchParams({});
  }, [setSearchParams]);

  const getActiveFilterCount = useMemo(() => {
    let count = 0;
    Object.values(filters).forEach(filterArray => {
      if (Array.isArray(filterArray)) {
        count += filterArray.length;
      }
    });
    return count;
  }, [filters]);

  // Initialize filters
  useEffect(() => {
    const stored = sessionStorage.getItem("filters");
    if (stored) {
      setFilters(JSON.parse(stored));
    }
  }, [categorySearchParam]);

  // Update URL params when filters change
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  // Fetch products when filters or sort changes
  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
    }
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const gridClasses = {
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    "5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/20">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <ProductFilter filters={filters} handleFilter={handleFilter} />
            </div>
          </div>

          {/* Main Products Section */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden relative">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {getActiveFilterCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {getActiveFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                      <div className="h-full overflow-auto">
                        <ProductFilter filters={filters} handleFilter={handleFilter} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      All Products
                    </h2>
                    <p className="text-sm text-gray-600">
                      {productList?.length || 0} products found
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Clear Filters Button */}
                  {getActiveFilterCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear Filters ({getActiveFilterCount})
                    </Button>
                  )}

                  {/* Grid View Toggle */}
                  <div className="hidden md:flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      variant={gridView === "3" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setGridView("3")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={gridView === "4" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setGridView("4")}
                      className="h-8 w-8 p-0"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 min-w-[140px]"
                      >
                        <ArrowUpDownIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Sort</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                        {sortOptions.map((sortItem) => (
                          <DropdownMenuRadioItem
                            value={sortItem.id}
                            key={sortItem.id}
                          >
                            {sortItem.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                    {Object.entries(filters).map(([key, values]) =>
                      values.map((value) => (
                        <Button
                          key={`${key}-${value}`}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFilter(key, value)}
                          className="h-7 text-xs"
                        >
                          {value}
                          <X className="w-3 h-3 ml-1" />
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {productList && productList.length > 0 ? (
              <div className={`grid ${gridClasses[gridView]} gap-6`}>
                {productList.map((productItem) => (
                  <LuxuryProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                {getActiveFilterCount > 0 && (
                  <Button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
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

export default ShoppingListing;