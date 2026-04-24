import { supabase } from "./supabase";

export interface Issuer {
  id: string;
  company_prefix: string;
  brand: string;
  symbology: "ean13" | "upca" | "itf14";
}

export interface OrderItem {
  productId?: string;
  productName?: string;
  category?: string;
  skinType?: string;
  fragranceOption?: string;
  price?: number;
  quantity?: number;
}

export interface CustomerOrder {
  id: string;
  user_id: string;
  items: OrderItem[];
  subscription_plan: string | null;
  total: number | null;
  status: string | null;
  shipping_name: string | null;
  shipping_email: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_country: string | null;
  shipping_postal_code: string | null;
  printed_at: string | null;
  fulfilled_at: string | null;
  next_shipment_at: string | null;
  created_at: string;
}

export interface FulfilledItem {
  item_ref: string;
  gtin: string;
  category: string;
  name: string;
  net_content: string | null;
  variant: string | null;
  inci: string | null;
  eu_fields: Record<string, unknown>;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return !!data;
}

export async function listIssuers(): Promise<Issuer[]> {
  const { data, error } = await supabase
    .from("gtin_issuers")
    .select("id, company_prefix, brand, symbology")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Issuer[];
}

export async function listOrders(): Promise<CustomerOrder[]> {
  const { data, error } = await supabase
    .from("customer_orders")
    .select(
      "id, user_id, items, subscription_plan, total, status, shipping_name, shipping_email, shipping_address, shipping_city, shipping_country, shipping_postal_code, printed_at, fulfilled_at, next_shipment_at, created_at",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CustomerOrder[];
}

export async function listOrderGtins(orderId: string): Promise<FulfilledItem[]> {
  const { data: pool, error: poolErr } = await supabase
    .from("gtin_pool")
    .select("gtin, item_ref, status")
    .eq("order_id", orderId)
    .neq("status", "voided")
    .order("item_ref");
  if (poolErr) throw poolErr;
  if (!pool || pool.length === 0) return [];

  const gtins = pool.map((p) => p.gtin);
  const { data: records } = await supabase
    .from("gtin_product_records")
    .select("gtin, item_ref, name, net_content, variant, inci, eu_fields")
    .in("gtin", gtins);

  const byGtin = new Map<
    string,
    {
      name: string;
      net_content: string | null;
      variant: string | null;
      inci: string | null;
      eu_fields: Record<string, unknown>;
    }
  >();
  for (const r of records ?? []) {
    byGtin.set(r.gtin, {
      name: r.name,
      net_content: r.net_content,
      variant: r.variant,
      inci: r.inci,
      eu_fields: (r.eu_fields ?? {}) as Record<string, unknown>,
    });
  }

  return pool.map((p) => {
    const rec = byGtin.get(p.gtin);
    return {
      item_ref: p.item_ref ?? "",
      gtin: p.gtin,
      category: (rec?.eu_fields as { category?: string } | undefined)?.category ?? "",
      name: rec?.name ?? "",
      net_content: rec?.net_content ?? null,
      variant: rec?.variant ?? null,
      inci: rec?.inci ?? null,
      eu_fields: rec?.eu_fields ?? {},
    };
  });
}

export async function fulfillOrder(
  orderId: string,
  issuerId: string,
): Promise<FulfilledItem[]> {
  const { data, error } = await supabase.rpc("fulfill_order_with_barcodes", {
    p_order_id: orderId,
    p_issuer_id: issuerId,
  });
  if (error) throw error;
  return (data ?? []) as FulfilledItem[];
}

export async function markOrderPrinted(orderId: string): Promise<void> {
  const { error } = await supabase
    .from("customer_orders")
    .update({ printed_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}
