"use server";
import { z } from "zod";

import { TRAFFIC_LIST_PAGE_SIZE } from "@/shared/constants/admin/trafficView";
import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TAddPageVisit } from "@/shared/types/common";

const ValidatePageVisit = z.object({
  pageType: z.enum(["MAIN", "LIST", "PRODUCT"]),
});

export type TTrafficListItem = {
  id: string;
  time: Date | null;
  pageType: string;
  pagePath: string | null;
  productID: string | null;
  deviceResolution: string | null;
  product: {
    name: string;
    category: {
      name: string;
    };
  } | null;
};

export const addVisit = async (data: TAddPageVisit) => {
  if (process.env.NODE_ENV !== "production") return { error: "Invalid ENV!" };

  if (!ValidatePageVisit.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from("page_visits")
      .insert({
        page_type: data.pageType,
        page_path: data.pagePath,
        product_id: data.productID,
        device_resolution: data.deviceResolution,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Invalid Data!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const getTrafficReport = async (skip: number = 0) => {
  try {
    const supabase = createSupabaseServer();

    // First get the page visits
    const [listResult, countResult] = await Promise.all([
      supabase
        .from("page_visits")
        .select("*")
        .order("id", { ascending: false })
        .range(skip, skip + TRAFFIC_LIST_PAGE_SIZE - 1),
      supabase.from("page_visits").select("*", { count: "exact", head: true }),
    ]);

    if (listResult.error) return { error: listResult.error.message };
    if (countResult.error) return { error: countResult.error.message };

    // Then get product details for items that have product_id
    const list = await Promise.all(
      (listResult.data || []).map(async (item) => {
        let product = null;

        if (item.product_id) {
          try {
            const { data: productData } = await supabase
              .from("products")
              .select("name, category_id")
              .eq("id", item.product_id)
              .single();

            if (productData) {
              const { data: categoryData } = await supabase
                .from("categories")
                .select("name")
                .eq("id", productData.category_id)
                .single();

              product = {
                name: productData.name,
                category: {
                  name: categoryData?.name || "Unknown",
                },
              };
            }
          } catch (error) {
            // If product fetch fails, just set product to null
            product = null;
          }
        }

        return {
          id: item.id,
          time: item.time,
          pageType: item.page_type,
          pagePath: item.page_path,
          productID: item.product_id,
          deviceResolution: item.device_resolution,
          product,
        };
      })
    );

    const totalCount = countResult.count || 0;

    return { res: { list, totalCount } };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const deleteTraffic = async (id: string) => {
  if (!id || id === "") return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase.from("page_visits").delete().eq("id", id).select().single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can not delete Data!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
