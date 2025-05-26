/* eslint-disable react/prop-types */
// client/src/components/admin-view/product-tile.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  
  function handleEdit() {
    console.log("Editing product:", product); // Debug log
    
    // Set the form data with all product information including variations
    setFormData({
      image: product.image || "",
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      totalStock: product.totalStock || "",
      averageReview: product.averageReview || 0,
      variations: product.variations || [], // Ensure variations are included
    });
    
    setCurrentEditedId(product._id);
    setOpenCreateProductsDialog(true);
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[300px] object-cover rounded-t-lg"
        />
        
        {/* Show variation count if variations exist */}
        {product?.variations && product.variations.length > 0 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
            {product.variations.length} variation{product.variations.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 ? (
            <span className="text-lg font-bold">${product?.salePrice}</span>
          ) : null}
        </div>
        
        {/* Show variations preview */}
        {product?.variations && product.variations.length > 0 && (
          <div className="mb-2">
            <p className="text-sm text-gray-600 mb-1">Variations:</p>
            <div className="flex flex-wrap gap-1">
              {product.variations.slice(0, 3).map((variation, index) => (
                <img
                  key={index}
                  src={variation.image}
                  alt={variation.label}
                  className="w-8 h-8 object-cover rounded border"
                />
              ))}
              {product.variations.length > 3 && (
                <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs">
                  +{product.variations.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4">
        <Button onClick={handleEdit} className="w-full mr-2">
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(product._id)}
          variant="destructive"
          className="w-full"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;