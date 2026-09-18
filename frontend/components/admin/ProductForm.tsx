"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Category, Product, ProductImage } from "@/types";
import { adminGetCategories, adminCreateProduct, adminUpdateProduct } from "@/lib/adminApi";
import ImageUploader from "./ImageUploader";
import { useToast } from "@/components/Toast";

interface Props {
  product?: Product;
}

interface SpecEntry {
  key: string;
  value: string;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState(product?.name ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [model, setModel] = useState(product?.model ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stockQuantity?.toString() ?? "0");
  const [description, setDescription] = useState(product?.description ?? "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  // Specifications
  const [specs, setSpecs] = useState<SpecEntry[]>(
    product?.specifications && Object.keys(product.specifications).length > 0
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }]
  );

  // Images
  const [existingImages, setExistingImages] = useState<ProductImage[]>(product?.images ?? []);
  const [removeIds, setRemoveIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    adminGetCategories().then(setCategories).catch(() => {});
  }, []);

  // Spec helpers
  function setSpec(idx: number, field: "key" | "value", val: string) {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }
  function addSpec() {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  }
  function removeSpec(idx: number) {
    setSpecs((prev) => prev.filter((_, i) => i !== idx));
  }

  // Image helpers
  function handleRemoveExisting(id: string) {
    setRemoveIds((prev) => [...prev, id]);
  }
  function handleAddFiles(files: File[]) {
    setNewFiles((prev) => [...prev, ...files]);
  }
  function handleRemoveNew(idx: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("category_id", categoryId);
      fd.append("brand", brand.trim());
      fd.append("model", model.trim());
      fd.append("price", String(Number(price || 0)));
      fd.append("stock_quantity", String(Number(stock || 0)));
      const trimmedDesc = description.trim();
      fd.append("short_description", trimmedDesc.slice(0, 300));
      fd.append("description", trimmedDesc);
      fd.append("is_featured", String(Boolean(isFeatured)));

      fd.append("features", JSON.stringify([]));

      const specsObj: Record<string, string> = {};
      specs.forEach(({ key, value }) => {
        const cleanKey = key.trim();
        const cleanValue = value.trim();
        if (cleanKey && cleanValue) specsObj[cleanKey] = cleanValue;
      });
      fd.append("specifications", JSON.stringify(specsObj));

      if (isEdit) {
        fd.append("is_active", String(Boolean(isActive)));
        if (removeIds.length > 0) {
          fd.append("remove_image_ids", JSON.stringify(removeIds));
        }
      }

      newFiles.forEach((file) => fd.append("images", file));

      if (isEdit && product) {
        await adminUpdateProduct(product.id, fd);
        showToast("Product updated successfully.");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        await adminCreateProduct(fd);
        showToast("Product created successfully.");
        setTimeout(() => router.push("/admin/products"), 1000);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save product";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-900">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
            <input
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
            <input
              required
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured Product</span>
          </label>
          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Active (visible to customers)</span>
            </label>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-gray-900">Description</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description * <span className="text-gray-400 font-normal">(max 300 chars)</span>
          </label>
          <textarea
            required
            rows={5}
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
          <p className="text-xs text-gray-400 mt-1">{description.length}/300</p>
        </div>
      </div>

      {/* Specifications */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-3">
        <h2 className="font-bold text-gray-900">Specifications</h2>
        {specs.map((s, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={s.key}
              onChange={(e) => setSpec(idx, "key", e.target.value)}
              placeholder="e.g. Processor"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              value={s.value}
              onChange={(e) => setSpec(idx, "value", e.target.value)}
              placeholder="e.g. Intel Core i7"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeSpec(idx)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpec}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Specification
        </button>
      </div>

      {/* Images */}
      <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <ImageUploader
          existingImages={existingImages}
          newFiles={newFiles}
          removeIds={removeIds}
          onRemoveExisting={handleRemoveExisting}
          onAddFiles={handleAddFiles}
          onRemoveNew={handleRemoveNew}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
