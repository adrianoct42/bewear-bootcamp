import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, productTable, productVariantTable } from "@/db/schema";

// Tipos do banco inferidos pelo Drizzle
type DbProduct = typeof productTable.$inferSelect;
type DbProductVariant = typeof productVariantTable.$inferSelect;
type DbCategory = typeof categoryTable.$inferSelect;

type DbProductWithVariants = DbProduct & {
  variants: DbProductVariant[];
};

type DbProductVariantWithProduct = DbProductVariant & {
  product: DbProduct & {
    variants: DbProductVariant[];
  };
};

export interface ProductDTO {
  id: string;
  name: string;
  createdAt: Date;
  description: string;
  slug: string;
  categoryId: string;
  variants: ProductVariantDTO[];
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
  productId: string;
  color: string;
  priceInCents: number;
  imageUrl: string;
}

export interface ProductVariantWithProductDTO extends ProductVariantDTO {
  product: ProductDTO;
}

function toProductDTO(product: DbProductWithVariants): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    createdAt: product.createdAt,
    description: product.description,
    slug: product.slug,
    categoryId: product.categoryId,
    variants: product.variants.map(toProductVariantDTO),
  };
}

function toProductVariantDTO(variant: DbProductVariant): ProductVariantDTO {
  return {
    id: variant.id,
    name: variant.name,
    createdAt: variant.createdAt,
    slug: variant.slug,
    productId: variant.productId,
    color: variant.color,
    priceInCents: variant.priceInCents,
    imageUrl: variant.imageUrl,
  };
}

function toProductVariantWithProductDTO(
  variant: DbProductVariantWithProduct,
): ProductVariantWithProductDTO {
  return {
    ...toProductVariantDTO(variant),
    product: toProductDTO({
      ...variant.product,
      variants: variant.product.variants,
    }),
  };
}

// Consultas
export const getProducts = async (): Promise<ProductDTO[]> => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  return products.map(toProductDTO);
};

export const getNewlyCreatedProducts = async (): Promise<ProductDTO[]> => {
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });

  return newlyCreatedProducts.map(toProductDTO);
};

export const getProductVariantsWithProducts = async (
  slug: string,
): Promise<ProductVariantWithProductDTO | null> => {
  const variant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: {
          variants: true,
        },
      },
    },
  });

  if (!variant) return null;

  return toProductVariantWithProductDTO(variant);
};

export const getProductsWithCategory = async (category: DbCategory) => {
  const products = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, category.id),
    with: {
      variants: true,
    },
  });

  return products;
};

export const getLikelyProducts = async (
  productVariant: ProductVariantWithProductDTO,
) => {
  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  return likelyProducts;
};
