import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
  console.log("📩 Webhook Stripe recebido");

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      "❌ Variáveis de ambiente STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET ausentes",
    );
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    console.error("❌ Assinatura do Stripe ausente no header");
    return NextResponse.error();
  }

  let text: string;
  try {
    text = await request.text();
  } catch (err) {
    console.error("❌ Erro ao ler body do webhook:", err);
    return NextResponse.error();
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`✅ Evento Stripe recebido: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      console.log("💳 Checkout session completed detectado");

      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      console.log("🆔 OrderId recebido no metadata:", orderId);

      if (!orderId) {
        console.error("❌ Nenhum orderId presente no metadata");
        return NextResponse.error();
      }

      const result = await db
        .update(orderTable)
        .set({ status: "paid" })
        .where(eq(orderTable.id, orderId as string));

      console.log("📦 Resultado do update:", result);

      console.log(`✅ Pedido ${orderId} atualizado para "paid"`);
    }
  } catch (err) {
    console.error("❌ Erro no processamento do webhook:", err);
    return NextResponse.error();
  }

  // TODO: Limpar o carrinho se necessário
  return NextResponse.json({ received: true });
};
