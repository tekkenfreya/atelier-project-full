import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CompactItem {
  pid: string;
  n: string;
  c: string;
  p: number;
  s: string | null;
  f: string | null;
}

interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  price: number;
  skinType?: string;
  fragranceOption?: string;
}

function parseItems(raw: string | undefined | null): OrderItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CompactItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((i) => ({
      productId: i.pid,
      productName: i.n,
      category: i.c,
      price: i.p,
      skinType: i.s ?? undefined,
      fragranceOption: i.f ?? undefined,
    }));
  } catch {
    return [];
  }
}

async function getDefaultIssuerId(): Promise<string | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("gtin_issuers")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data.id as string;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const items = parseItems(meta.items);
  const plan = (meta.plan as string) || "one-time";
  const userId = meta.userId || null;
  const customerName = meta.customerName || session.customer_details?.name || null;

  if (items.length === 0) {
    console.error("[stripe-webhook] checkout.session.completed with no items metadata", session.id);
    return;
  }

  const shipping = session.collected_information?.shipping_details;
  const customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
  const totalEuros = session.amount_total != null ? session.amount_total / 100 : null;

  // Idempotency check: did a webhook already create this order?
  const { data: existing } = await getSupabaseAdmin()
    .from("customer_orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  let orderId: string;

  if (existing) {
    orderId = existing.id as string;
    console.log("[stripe-webhook] order already exists for session", session.id, "→", orderId);
  } else {
    const { data: inserted, error: insertErr } = await getSupabaseAdmin()
      .from("customer_orders")
      .insert({
        user_id: userId || null,
        items,
        subscription_plan: plan,
        total: totalEuros,
        status: "paid",
        shipping_name: shipping?.name ?? customerName,
        shipping_email: customerEmail,
        shipping_address: shipping?.address?.line1 ?? null,
        shipping_city: shipping?.address?.city ?? null,
        shipping_country: shipping?.address?.country ?? null,
        shipping_postal_code: shipping?.address?.postal_code ?? null,
        stripe_session_id: session.id,
      })
      .select("id")
      .single();

    if (insertErr || !inserted) {
      console.error("[stripe-webhook] insert customer_orders failed", insertErr);
      throw insertErr ?? new Error("insert failed");
    }
    orderId = inserted.id as string;
    console.log("[stripe-webhook] created order", orderId, "for session", session.id);
  }

  // Auto-fulfill: reserve GTINs + compose product records atomically
  const issuerId = await getDefaultIssuerId();
  if (!issuerId) {
    console.warn("[stripe-webhook] no GTIN issuer configured — order created but not fulfilled", orderId);
    return;
  }

  const { error: fulfillErr } = await getSupabaseAdmin().rpc("fulfill_order_with_barcodes", {
    p_order_id: orderId,
    p_issuer_id: issuerId,
  });

  if (fulfillErr) {
    console.error("[stripe-webhook] fulfill_order_with_barcodes failed", fulfillErr);
    // Not throwing — order exists; admin can retry from fulfillment-studio
    return;
  }

  console.log("[stripe-webhook] fulfilled order", orderId);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json({ error: "missing stripe-signature header" }, { status: 400 });
  }
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "webhook secret not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "invalid signature";
    console.error("[stripe-webhook] signature verification failed:", msg);
    return NextResponse.json({ error: `signature verification failed: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        // quiet — other events we don't care about yet
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "handler failed";
    console.error("[stripe-webhook] handler error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
