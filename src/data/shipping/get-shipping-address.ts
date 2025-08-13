import { eq } from "drizzle-orm";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";

export const getShippingAddress = async (sessionUserId: string) => {
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, sessionUserId),
  });

  return shippingAddresses;
};
