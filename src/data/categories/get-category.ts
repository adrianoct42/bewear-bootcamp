import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

interface CategoryDTO {
  id: string;
  name: string;
  createdAt: Date;
  slug: string;
}

type DbProductCategory = typeof categoryTable.$inferSelect;

function toCategoryDTO(category: DbProductCategory): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    createdAt: category.createdAt,
  };
}

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const categories = await db.query.categoryTable.findMany({});

  return categories.map(toCategoryDTO);
};

export const getCategoryFromSlug = async (slug: string) => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });

  return category;
};
