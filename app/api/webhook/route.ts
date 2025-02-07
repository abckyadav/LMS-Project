import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse(`webhook Error:${error}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const courseId = session?.metadata?.courseId;
  const userId = session?.metadata?.userId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new NextResponse(`Webhook Error:Missing metadata`, {
        status: 400,
      });
    }

    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
      },
    });
  } else {
    return new NextResponse(
      `Webhook Error:Invalid/Unhandled event type ${event.type}`,
      {
        status: 200,
      }
    );
  }

  return new NextResponse(null, { status: 200 });
}
