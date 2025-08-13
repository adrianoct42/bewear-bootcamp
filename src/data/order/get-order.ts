import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  orderItemTable,
  orderTable,
  productTable,
  productVariantTable,
} from "@/db/schema";

// Tipos inferidos direto do Drizzle
type DbOrder = typeof orderTable.$inferSelect;
type DbOrderItem = typeof orderItemTable.$inferSelect;
type DbProductVariant = typeof productVariantTable.$inferSelect;
type DbProduct = typeof productTable.$inferSelect;

// Entidades compostas do retorno
export type ProductDTO = DbProduct;

export interface ProductVariantDTO extends DbProductVariant {
  product: ProductDTO;
}

export interface OrderItemDTO extends DbOrderItem {
  productVariant: ProductVariantDTO;
}

export interface OrderDTO extends DbOrder {
  items: OrderItemDTO[];
}

export const getOrdersByUser = async (userId: string): Promise<OrderDTO[]> => {
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, userId),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  return orders;
};
