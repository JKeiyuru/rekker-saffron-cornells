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
import DirectApiTest from "@/components/test/DirectApiTest";

const initialFormData = {
  image: null,
  title: "",
  description: "Description",
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

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    console.log("FormData updated:", {
      ...formData,
      variations: formData.variations?.map(v => ({
        label: v.label,
        image: v.image?.substring(0, 20) + "..."
      }))
    });
  }, [formData]);

  function onSubmit(event) {
    event.preventDefault();

    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
      totalStock: Number(formData.totalStock),
      variations: formData.variations?.map(v => ({
        image: v.image,
        label: v.label
      })) || []
    };

    console.log("Submitting payload:", payload);

    const action = currentEditedId 
      ? dispatch(editProduct({ id: currentEditedId, formData: payload }))
      : dispatch(addNewProduct(payload));

    action.then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ 
          title: currentEditedId 
            ? "Product updated successfully" 
            : "Product added successfully" 
        });
        // Only reset on success
        if (!currentEditedId) {
          setFormData(initialFormData);
          setImageFile(null);
          setUploadedImageUrl("");
        }
        setOpenCreateProductsDialog(false);
      } else {
        toast({ 
          title: currentEditedId 
            ? "Failed to update product" 
            : "Failed to add product", 
          variant: "destructive" 
        });
      }
    });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({ title: "Product deleted successfully" });
      }
    });
  }

  function isFormValid() {
    const requiredFields = ['title', 'category', 'price', 'totalStock'];
    const areRequiredFieldsFilled = requiredFields.every(field => 
      formData[field] !== "" && formData[field] !== null && formData[field] !== undefined
    );

    const hasImage = uploadedImageUrl || formData.image;
    const hasVariations = formData.variations?.length > 0;
    
    return areRequiredFieldsFilled && (hasImage || hasVariations);
  }

  function handleEdit(product) {
    console.log("Editing product:", product);
    setFormData({
      ...product,
      variations: product.variations?.map(v => ({ ...v })) || [] // Deep copy
    });
    setUploadedImageUrl(product.image || "");
    setCurrentEditedId(product._id);
    setOpenCreateProductsDialog(true);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <DirectApiTest/>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList?.map((productItem) => (
          <AdminProductTile
            key={productItem._id}
            product={productItem}
            handleDelete={handleDelete}
            onEdit={() => handleEdit(productItem)}
          />
        ))}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl("");
          }
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={!!currentEditedId}
          />

          <VariationUploader 
            formData={formData} 
            setFormData={setFormData} 
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId ? "Update" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;