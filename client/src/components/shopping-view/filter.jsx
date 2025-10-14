/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// client/src/components/shopping-view/filter.jsx - Rekker Product Filter
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import {
  brandOptions,
  rekkerCategories,
  saffronCategories,
  cornellsCategories,
} from "@/config";

function ProductFilter({ filters, handleFilter }) {
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    rekker: false,
    saffron: false,
    cornells: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    // This would need to be passed from parent component
    // For now, we'll assume handleFilter can handle clearing
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) {
        filters[key].forEach(value => {
          handleFilter(key, value);
        });
      }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    Object.values(filters).forEach(filterArray => {
      if (Array.isArray(filterArray)) {
        count += filterArray.length;
      }
    });
    return count;
  };

  const isFilterActive = (key, value) => {
    return filters?.[key]?.includes(value) || false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-rose-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-3 h-3 mr-1" />
              Clear ({getActiveFilterCount()})
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Brand Filter */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
              Brand
            </h3>
            {expandedSections.brand ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.brand && (
            <div className="space-y-2 ml-2">
              {brandOptions.map((brand) => (
                <Label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <Checkbox
                    checked={isFilterActive("brand", brand.id)}
                    onCheckedChange={() => handleFilter("brand", brand.id)}
                  />
                  <span className="font-medium text-sm">{brand.label}</span>
                  {isFilterActive("brand", brand.id) && (
                    <span className="ml-auto text-xs text-red-600 font-semibold">✓</span>
                  )}
                </Label>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Rekker Categories */}
        <div>
          <button
            onClick={() => toggleSection('rekker')}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                Rekker Products
              </h3>
            </div>
            {expandedSections.rekker ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.rekker && (
            <div className="space-y-2 ml-5">
              {rekkerCategories.map((category) => (
                <Label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-red-50 p-2 rounded transition-colors"
                >
                  <Checkbox
                    checked={isFilterActive("category", category.id)}
                    onCheckedChange={() => handleFilter("category", category.id)}
                  />
                  <span className="font-medium text-sm">{category.label}</span>
                  {isFilterActive("category", category.id) && (
                    <span className="ml-auto text-xs text-red-600 font-semibold">✓</span>
                  )}
                </Label>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Saffron Categories with Subcategories */}
        <div>
          <button
            onClick={() => toggleSection('saffron')}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                Saffron Products
              </h3>
            </div>
            {expandedSections.saffron ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.saffron && (
            <div className="space-y-3 ml-5">
              {saffronCategories.map((category) => (
                <div key={category.id}>
                  <Label className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-2 rounded transition-colors font-semibold">
                    <Checkbox
                      checked={isFilterActive("category", category.id)}
                      onCheckedChange={() => handleFilter("category", category.id)}
                    />
                    <span className="text-sm">{category.label}</span>
                    {isFilterActive("category", category.id) && (
                      <span className="ml-auto text-xs text-orange-600 font-semibold">✓</span>
                    )}
                  </Label>
                  {/* Subcategories */}
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subcategories.map((subcat) => (
                      <Label
                        key={subcat.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-orange-50 p-1.5 rounded transition-colors"
                      >
                        <Checkbox
                          checked={isFilterActive("subcategory", subcat.id)}
                          onCheckedChange={() => handleFilter("subcategory", subcat.id)}
                        />
                        <span className="text-xs">{subcat.label}</span>
                        {isFilterActive("subcategory", subcat.id) && (
                          <span className="ml-auto text-xs text-orange-600 font-semibold">✓</span>
                        )}
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Cornells Categories with Subcategories */}
        <div>
          <button
            onClick={() => toggleSection('cornells')}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-600 rounded-full"></div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                Cornells Products
              </h3>
            </div>
            {expandedSections.cornells ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {expandedSections.cornells && (
            <div className="space-y-3 ml-5">
              {cornellsCategories.map((category) => (
                <div key={category.id}>
                  <Label className="flex items-center gap-2 cursor-pointer hover:bg-rose-50 p-2 rounded transition-colors font-semibold">
                    <Checkbox
                      checked={isFilterActive("category", category.id)}
                      onCheckedChange={() => handleFilter("category", category.id)}
                    />
                    <span className="text-sm">{category.label}</span>
                    {isFilterActive("category", category.id) && (
                      <span className="ml-auto text-xs text-rose-600 font-semibold">✓</span>
                    )}
                  </Label>
                  {/* Subcategories */}
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subcategories.map((subcat) => (
                      <Label
                        key={subcat.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-rose-50 p-1.5 rounded transition-colors"
                      >
                        <Checkbox
                          checked={isFilterActive("subcategory", subcat.id)}
                          onCheckedChange={() => handleFilter("subcategory", subcat.id)}
                        />
                        <span className="text-xs">{subcat.label}</span>
                        {isFilterActive("subcategory", subcat.id) && (
                          <span className="ml-auto text-xs text-rose-600 font-semibold">✓</span>
                        )}
                      </Label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;