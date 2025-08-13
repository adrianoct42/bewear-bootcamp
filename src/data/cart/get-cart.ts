import { eq } from "drizzle-orm";

import { db } from "@/db";
import { cartTable } from "@/db/schema";

export const getCartByUserId = async (sessionUserId: string) => {
  const cart = await db.query.cartTable.findFirst({
    where: eq(cartTable.userId, sessionUserId),
    with: {
      shippingAddress: true,
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

  return cart;
};
