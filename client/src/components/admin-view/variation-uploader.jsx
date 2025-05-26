/* eslint-disable react/prop-types */
import { useState, useRef, useCallback } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { UploadCloud, XIcon, ImageIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

function VariationUploader({ formData, setFormData }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploadStates, setUploadStates] = useState({});
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [uploadedVariationImages, setUploadedVariationImages] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState(new Set());

  // Memoized variation check
  const variationExists = useCallback((newLabel) => {
    return (formData?.variations || []).some(
      v => v.label.toLowerCase() === newLabel.toLowerCase().trim()
    );
  }, [formData?.variations]);

  const handleImageUpload = async () => {
    setError("");
    
    // Validate inputs
    if (!imageFile) return setError("Please select an image file");
    if (!label.trim()) return setError("Please enter a variation label");
    if (variationExists(label)) {
      return setError("A variation with this label already exists");
    }
    if (uploadedFiles.has(imageFile.name)) {
      return setError("This image has already been uploaded");
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(imageFile.type)) {
      return setError('Only JPG, PNG, and WEBP images are allowed');
    }

    setUploadStates(prev => ({ ...prev, [label.trim()]: true }));
    setUploadedFiles(prev => new Set(prev).add(imageFile.name));

    const form = new FormData();
    form.append("my_file", imageFile);

    try {
      const res = await axios.post(
        "https://nemmoh-ecommerce-server.onrender.com/api/admin/products/upload-image",
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (res.data?.success) {
        const newVariation = {
          image: res.data.result.url,
          label: label.trim(),
        };

        setUploadedVariationImages(prev => ({
          ...prev,
          [label.trim()]: res.data.result.url
        }));

        setFormData(prev => ({
          ...prev,
          variations: [...(prev.variations || []), newVariation]
        }));

        // Reset form
        setImageFile(null);
        setLabel("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(res.data?.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadStates(prev => ({ ...prev, [label.trim()]: false }));
    }
  };

  const handleRemoveVariation = (index) => {
    const variationToRemove = formData.variations[index];
    setUploadedVariationImages(prev => {
      const newState = {...prev};
      delete newState[variationToRemove.label];
      return newState;
    });
    
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setError("");
    }
  };

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
    setError("");
  };

  // Current variations count
  const variationCount = formData?.variations?.length || 0;

  return (
    <div className="mt-6">
      <Label className="block font-semibold text-lg mb-2">
        Product Variations
      </Label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="variation-file" className="text-sm font-medium">
              Select Image
            </Label>
            <Input
              id="variation-file"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              className="mt-1"
            />
            {imageFile && (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-green-600">
                  Selected: {imageFile.name}
                </p>
                <div className="h-20 w-20 rounded-md overflow-hidden border">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="variation-label" className="text-sm font-medium">
              Variation Label
            </Label>
            <Input
              id="variation-label"
              placeholder="e.g. Red, Black, Small, Large..."
              value={label}
              onChange={handleLabelChange}
              className="mt-1"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleImageUpload}
            disabled={!imageFile || !label.trim() || uploadStates[label]}
            className="w-full"
            type="button"
          >
            {uploadStates[label] ? (
              <>
                <Skeleton className="w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 mr-2" />
                Add Variation
              </>
            )}
          </Button>
        </div>
      </div>

      {variationCount > 0 ? (
        <div className="mt-4">
          <h3 className="font-medium mb-3 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            Current Variations ({variationCount})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.variations.map((variation, index) => (
              <div
                key={`${variation.label}-${index}`}
                className="relative bg-gray-50 border rounded-lg p-3 group hover:shadow-md transition-shadow"
              >
                <div className="aspect-square w-full mb-2 bg-white rounded border overflow-hidden">
                  {uploadStates[variation.label] ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <img
                      src={variation.image}
                      alt={variation.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-image.png";
                        e.target.alt = "Image failed to load";
                      }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <span className="font-medium text-sm block truncate" title={variation.label}>
                    {variation.label}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveVariation(index)}
                  type="button"
                >
                  <XIcon className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-600">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No variations added yet.</p>
          <p className="text-xs text-gray-500 mt-1">
            Upload an image and add a label to create your first variation.
          </p>
        </div>
      )}
    </div>
  );
}

export default VariationUploader;