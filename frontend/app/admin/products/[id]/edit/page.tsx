"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { adminGetProductById } from "@/lib/adminApi";
import type { Product } from "@/types";
import ProductForm from "@/components/admin/ProductForm";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetProductById(id)
      .then(setProduct)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading product..." />;
  if (error || !product) return <ErrorState message={error || "Product not found"} />;

  return <ProductForm product={product} />;
}
