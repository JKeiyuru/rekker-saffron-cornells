// client/src/pages/admin-view/products.jsx
import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VariationUploader from "@/components/admin-view/variation-uploader";
import { Separator } from "@/components/ui/separator";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  variations: [],
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList, isLoading } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("FormData updated:", {
      ...formData,
      variations: formData.variations?.map(v => ({
        label: v.label,
        imagePreview: v.image?.substring(0, 50) + "...",
        hasId: !!v._id
      }))
    });
  }, [formData]);

  function resetForm() {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setCurrentEditedId(null);
  }

  function handleCloseDialog() {
    setOpenCreateProductsDialog(false);
    resetForm();
  }

  function onSubmit(event) {
    event.preventDefault();

    // Prepare the payload
    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image || null,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
      totalStock: Number(formData.totalStock),
      averageReview: formData.averageReview ? Number(formData.averageReview) : 0,
      variations: formData.variations?.map(v => ({
        image: v.image,
        label: v.label
        // Don't send _id for new variations, let MongoDB generate it
      })) || []
    };

    console.log("Submitting payload:", {
      ...payload,
      variations: payload.variations.map(v => ({
        label: v.label,
        hasImage: !!v.image
      }))
    });

    const action = currentEditedId 
      ? dispatch(editProduct({ id: currentEditedId, formData: payload }))
      : dispatch(addNewProduct(payload));

    action.then((data) => {
      console.log("Submit response:", data);
      
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ 
          title: currentEditedId 
            ? "Product updated successfully" 
            : "Product added successfully",
          description: `Product "${payload.title}" has been ${currentEditedId ? 'updated' : 'added'} with ${payload.variations.length} variations.`
        });
        handleCloseDialog();
      } else {
        const errorMessage = data?.payload?.message || data?.error?.message || "Unknown error occurred";
        console.error("Submit error:", errorMessage);
        toast({ 
          title: currentEditedId 
            ? "Failed to update product" 
            : "Failed to add product",
          description: errorMessage,
          variant: "destructive" 
        });
      }
    }).catch((error) => {
      console.error("Submit catch error:", error);
      toast({ 
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive" 
      });
    });
  }

  function handleDelete(getCurrentProductId) {
    if (!getCurrentProductId) {
      toast({
        title: "Error",
        description: "Invalid product ID",
        variant: "destructive"
      });
      return;
    }

    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ 
          title: "Product deleted successfully",
          description: "The product has been removed from your inventory."
        });
      } else {
        toast({
          title: "Failed to delete product",
          description: data?.payload?.message || "An error occurred",
          variant: "destructive"
        });
      }
    });
  }

  function isFormValid() {
    // Check required fields
    const requiredFields = ['title', 'category', 'price', 'totalStock'];
    const areRequiredFieldsFilled = requiredFields.every(field => {
      const value = formData[field];
      return value !== "" && value !== null && value !== undefined;
    });

    // Check if there's at least one image (main image or variations)
    const hasMainImage = uploadedImageUrl || formData.image;
    const hasVariations = formData.variations?.length > 0;
    const hasImage = hasMainImage || hasVariations;

    // Validate price values
    const priceValid = formData.price && !isNaN(Number(formData.price)) && Number(formData.price) >= 0;
    const stockValid = formData.totalStock && !isNaN(Number(formData.totalStock)) && Number(formData.totalStock) >= 0;

    return areRequiredFieldsFilled && hasImage && priceValid && stockValid;
  }

  function handleEdit(productData) {
    console.log("Handling edit with data:", productData);
    
    setFormData(productData);
    setUploadedImageUrl(productData.image || "");
    setCurrentEditedId(productData._id || null);
    setOpenCreateProductsDialog(true);
  }

  function handleAddNewProduct() {
    resetForm();
    setOpenCreateProductsDialog(true);
  }

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const isEditMode = !!currentEditedId;

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory and variations
          </p>
        </div>
        <Button onClick={handleAddNewProduct} className="gap-2">
          <span>+</span>
          Add New Product
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="w-full max-w-sm mx-auto">
              <div className="animate-pulse">
                <div className="h-[300px] bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                    <div className="h-8 bg-gray-300 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : productList && productList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              product={productItem}
              handleDelete={handleDelete}
              onEdit={handleEdit}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l3 3 3-3"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first product to the inventory.
            </p>
            <Button onClick={handleAddNewProduct}>
              Add Your First Product
            </Button>
          </div>
        </div>
      )}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDialog();
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            {isEditMode && (
              <p className="text-sm text-gray-600">
                Updating product with ID: {currentEditedId?.slice(-8)}
              </p>
            )}
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Main Product Image Upload */}
            <div>
              <h3 className="text-lg font-medium mb-3">Main Product Image</h3>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                imageLoadingState={imageLoadingState}
                setImageLoadingState={setImageLoadingState}
                isEditMode={false} // Allow image upload in edit mode
                isCustomStyling={true}
              />
              <p className="text-sm text-gray-600 mt-2">
                This will be the main image shown for your product. You can also add variations below.
              </p>
            </div>

            <Separator />

            {/* Product Variations */}
            <div>
              <VariationUploader 
                formData={formData} 
                setFormData={setFormData} 
              />
            </div>

            <Separator />

            {/* Product Details Form */}
            <div>
              <h3 className="text-lg font-medium mb-3">Product Details</h3>
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                buttonText={isEditMode ? "Update Product" : "Add Product"}
                formControls={addProductFormElements}
                isBtnDisabled={!isFormValid()}
              />
            </div>

            {/* Form Validation Status */}
            {!isFormValid() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Form Requirements:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Title is required</li>
                  <li>• Category is required</li>
                  <li>• Price must be a valid number ≥ 0</li>
                  <li>• Stock must be a valid number ≥ 0</li>
                  <li>• At least one image (main image or variation) is required</li>
                </ul>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;