import { supabase } from "./supabase";
import type { Symbology } from "./gtin";

export interface Issuer {
  id: string;
  company_prefix: string;
  brand: string;
  symbology: Symbology;
  next_ref: number;
  pool_batch_size: number;
  pool_low_threshold: number;
  gs1_verified: boolean;
  created_at: string;
}

export interface PoolEntry {
  gtin: string;
  issuer_id: string;
  symbology: Symbology;
  status: "available" | "reserved" | "used" | "activated" | "voided";
  order_id: string | null;
  reserved_at: string | null;
  used_at: string | null;
  activated_at: string | null;
  voided_at: string | null;
  voided_reason: string | null;
  created_at: string;
}

export interface ProductRecord {
  id: string;
  gtin: string;
  order_id: string | null;
  name: string;
  net_content: string | null;
  variant: string | null;
  inci: string | null;
  eu_fields: Record<string, unknown>;
  composed_at: string;
  composed_by: string | null;
}

export interface PoolStats {
  available: number;
  reserved: number;
  used: number;
  activated: number;
  voided: number;
  total: number;
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
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Issuer[];
}

export async function configureIssuer(input: {
  companyPrefix: string;
  brand: string;
  symbology: Symbology;
  initialBatchSize?: number;
}): Promise<string> {
  const { data, error } = await supabase.rpc("configure_issuer", {
    p_company_prefix: input.companyPrefix,
    p_brand: input.brand,
    p_symbology: input.symbology,
    p_initial_batch_size: input.initialBatchSize ?? 100,
  });
  if (error) throw error;
  return data as string;
}

export async function reserveGtinForOrder(
  issuerId: string,
  orderId: string | null,
): Promise<string> {
  const { data, error } = await supabase.rpc("reserve_gtin_for_order", {
    p_issuer_id: issuerId,
    p_order_id: orderId,
  });
  if (error) throw error;
  return data as string;
}

export async function composeProductRecord(input: {
  gtin: string;
  name: string;
  netContent?: string | null;
  variant?: string | null;
  inci?: string | null;
  euFields?: Record<string, unknown>;
}): Promise<string> {
  const { data, error } = await supabase.rpc("compose_product_record", {
    p_gtin: input.gtin,
    p_name: input.name,
    p_net_content: input.netContent ?? null,
    p_variant: input.variant ?? null,
    p_inci: input.inci ?? null,
    p_eu_fields: input.euFields ?? {},
  });
  if (error) throw error;
  return data as string;
}

export async function markGtinUsed(gtin: string): Promise<void> {
  const { error } = await supabase.rpc("mark_gtin_used", { p_gtin: gtin });
  if (error) throw error;
}

export async function voidGtin(gtin: string, reason: string): Promise<void> {
  const { error } = await supabase.rpc("void_gtin", {
    p_gtin: gtin,
    p_reason: reason,
  });
  if (error) throw error;
}

export async function resetIssuer(issuerId: string): Promise<number> {
  const { data, error } = await supabase.rpc("reset_issuer", {
    p_issuer_id: issuerId,
  });
  if (error) throw error;
  return data as number;
}

export async function replenishPool(
  issuerId: string,
  count?: number,
): Promise<number> {
  const { data, error } = await supabase.rpc("replenish_pool", {
    p_issuer_id: issuerId,
    p_count: count ?? null,
  });
  if (error) throw error;
  return data as number;
}

export async function listPool(
  issuerId: string,
  opts?: { status?: PoolEntry["status"]; limit?: number },
): Promise<PoolEntry[]> {
  let q = supabase
    .from("gtin_pool")
    .select("*")
    .eq("issuer_id", issuerId)
    .order("created_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PoolEntry[];
}

export async function getPoolStats(issuerId: string): Promise<PoolStats> {
  const { data, error } = await supabase
    .from("gtin_pool")
    .select("status")
    .eq("issuer_id", issuerId);
  if (error) throw error;
  const stats: PoolStats = {
    available: 0,
    reserved: 0,
    used: 0,
    activated: 0,
    voided: 0,
    total: 0,
  };
  for (const row of data ?? []) {
    const s = (row as { status: PoolEntry["status"] }).status;
    stats[s]++;
    stats.total++;
  }
  return stats;
}

export async function listProductRecords(
  issuerId: string,
): Promise<Array<PoolEntry & { record: ProductRecord | null }>> {
  const { data: pool, error: poolErr } = await supabase
    .from("gtin_pool")
    .select("*")
    .eq("issuer_id", issuerId)
    .order("created_at", { ascending: false });
  if (poolErr) throw poolErr;

  const gtins = (pool ?? []).map((p) => p.gtin);
  if (gtins.length === 0) return [];

  const { data: records } = await supabase
    .from("gtin_product_records")
    .select("*")
    .in("gtin", gtins);

  const byGtin = new Map<string, ProductRecord>();
  for (const r of records ?? []) byGtin.set(r.gtin, r as ProductRecord);

  return (pool ?? []).map((p) => ({
    ...(p as PoolEntry),
    record: byGtin.get(p.gtin) ?? null,
  }));
}
