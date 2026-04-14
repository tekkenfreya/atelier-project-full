"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { resolveExtract, type ResolvedExtract, type DbExtractRow } from "@/lib/extracts";
import type { CustomerOrder, QuizResult } from "../lib/types";

interface AccountData {
  quizResults: QuizResult[];
  orders: CustomerOrder[];
  extracts: ResolvedExtract[];
  extractsByCategory: Record<string, ResolvedExtract[]>;
  loading: boolean;
}

export function useAccountData(userId: string | null): AccountData & { refetch: () => Promise<void> } {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [extracts, setExtracts] = useState<ResolvedExtract[]>([]);
  const [extractsByCategory, setExtractsByCategory] = useState<Record<string, ResolvedExtract[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [quizResponse, ordersResponse] = await Promise.all([
        supabase
          .from("quiz_results")
          .select("id, skin_type, concerns, recommended_serum, recommended_cleanser, recommended_moisturizer, fragrance_choice, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("customer_orders")
          .select("id, items, subscription_plan, total, status, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (quizResponse.data) {
        setQuizResults(quizResponse.data as QuizResult[]);
        const latest = quizResponse.data[0] as QuizResult | undefined;
        if (latest) {
          const productNames = [
            latest.recommended_cleanser,
            latest.recommended_serum,
            latest.recommended_moisturizer,
          ].filter(Boolean) as string[];

          if (productNames.length > 0) {
            const { data: products } = await supabase
              .from("products")
              .select("id, name")
              .in("name", productNames);

            if (products && products.length > 0) {
              const productIdToName: Record<string, string> = {};
              products.forEach((p: { id: string; name: string }) => {
                productIdToName[p.id] = p.name;
              });
              const productIds = products.map((p: { id: string }) => p.id);

              const { data: pivots } = await supabase
                .from("product_ingredients")
                .select("product_id, ingredient_id")
                .in("product_id", productIds);

              if (pivots && pivots.length > 0) {
                const ingredientIds = Array.from(
                  new Set(pivots.map((pi: { ingredient_id: string }) => pi.ingredient_id))
                );
                const { data: ingredients } = await supabase
                  .from("ingredients")
                  .select("id, name, function, landscape_url, country_of_origin, origin_description, country_landscapes")
                  .in("id", ingredientIds)
                  .ilike("function", "%extract%");

                if (ingredients) {
                  const extractById: Record<string, ResolvedExtract> = {};
                  (ingredients as (DbExtractRow & { id: string })[]).forEach((ing) => {
                    const resolved = resolveExtract(ing);
                    if (resolved) extractById[ing.id] = resolved;
                  });

                  const allResolved = Object.values(extractById);

                  const nameToCategory: Record<string, string> = {};
                  if (latest.recommended_cleanser) nameToCategory[latest.recommended_cleanser] = "Cleanser";
                  if (latest.recommended_serum) nameToCategory[latest.recommended_serum] = "Serum";
                  if (latest.recommended_moisturizer) nameToCategory[latest.recommended_moisturizer] = "Moisturizer";

                  const byCategory: Record<string, ResolvedExtract[]> = {};
                  (pivots as { product_id: string; ingredient_id: string }[]).forEach((pi) => {
                    const productName = productIdToName[pi.product_id];
                    const category = nameToCategory[productName];
                    const ext = extractById[pi.ingredient_id];
                    if (!category || !ext) return;
                    if (!byCategory[category]) byCategory[category] = [];
                    if (!byCategory[category].some((e) => e.ingredientName === ext.ingredientName)) {
                      byCategory[category].push(ext);
                    }
                  });

                  setExtractsByCategory(byCategory);
                  setExtracts(allResolved);
                }
              }
            }
          }
        }
      }
      if (ordersResponse.data) {
        setOrders(ordersResponse.data as CustomerOrder[]);
      }
    } catch {
      // non-critical
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { quizResults, orders, extracts, extractsByCategory, loading, refetch: fetchData };
}
