"use server";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";

export const getCategorySpecs = async (categoryID: string) => {
  if (!categoryID || categoryID === "") return { error: "Invalid Category ID" };

  const specifications: { id: string; title: string; specs: string[] }[] = [];
  let shouldRepeat = true;
  let catIdToSearch: string | null = categoryID;

  const getSpecsAndParentID = async (catID: string) => {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('categories')
      .select(`
        parent_id,
        category_spec_groups (
          spec_groups (
            id,
            title,
            specs
          )
        )
      `)
      .eq('id', catID)
      .single();

    if (error) return null;
    return result;
  };

  const getSpecGroup = async () => {
    if (catIdToSearch) {
      const result = await getSpecsAndParentID(catIdToSearch);
      if (!result) return false;
      if (result.category_spec_groups && result.category_spec_groups.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result.category_spec_groups.forEach((item: any) => specifications.unshift(item.spec_groups));
      }
      if (!result.parent_id) return false;
      catIdToSearch = result.parent_id;
      return true;
    }
    return false;
  };

  try {
    do {
      shouldRepeat = await getSpecGroup();
    } while (shouldRepeat);

    return { res: specifications };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
