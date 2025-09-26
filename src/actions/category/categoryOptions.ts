"use server";

import { z } from "zod";

import { createSupabaseServer } from "@/shared/lib/supabaseClient";
import { TOptionSet, TSingleOption, TSingleSpec, TSpecGroup } from "@/shared/types/common";

const AddOptionSet = z.object({
  name: z.string().min(3),
  type: z.enum(["COLOR", "TEXT"]),
});

const SingleOption = z.object({
  optionSetID: z.string().min(6),
  name: z.string().min(3),
  value: z.string().min(3),
});

const AddSpecGroup = z.object({
  title: z.string().min(3),
});

const SingleSpec = z.object({
  specGroupID: z.string().min(6),
  value: z.string().min(3),
});

export const getOptionSetByCatID = async (categoryID: string) => {
  if (!categoryID || categoryID === "") return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('option_sets')
      .select(`
        *,
        category_option_sets!inner (
          category_id
        )
      `)
      .eq('category_option_sets.category_id', categoryID);

    if (error) return { error: error.message };
    if (!result) return { error: "Not Found!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const addOptionSet = async (data: TOptionSet) => {
  if (!AddOptionSet.safeParse(data).success) return { error: "Invalid Data" };

  try {
    const supabase = createSupabaseServer();
    
    // First create the option set
    const { data: optionSet, error: optionError } = await supabase
      .from('option_sets')
      .insert({
        name: data.name,
        type: data.type,
        options: [],
      })
      .select()
      .single();

    if (optionError) return { error: optionError.message };
    if (!optionSet) return { error: "failed" };

    // Then link it to the category
    const { data: linkResult, error: linkError } = await supabase
      .from('category_option_sets')
      .insert({
        option_id: optionSet.id,
        category_id: data.id,
      })
      .select()
      .single();

    if (linkError) return { error: linkError.message };
    if (!linkResult) return { error: "failed" };
    
    return { res: optionSet };
  } catch (error) {
    return { res: JSON.stringify(error) };
  }
};

export const deleteOptionSet = async (id: string) => {
  if (!id || id === "") return { error: "Invalid Data" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('option_sets')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "failed" };
    return { res: result };
  } catch (error) {
    return { res: JSON.stringify(error) };
  }
};

// ------------------------- SINGLE OPTION -------------------------
export const addSingleOption = async (data: TSingleOption) => {
  if (!SingleOption.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    
    // First get current options
    const { data: currentOptionSet, error: fetchError } = await supabase
      .from('option_sets')
      .select('options')
      .eq('id', data.optionSetID)
      .single();

    if (fetchError) return { error: fetchError.message };
    if (!currentOptionSet) return { error: "Option set not found!" };

    // Add new option to the array
    const updatedOptions = [...(currentOptionSet.options || []), { name: data.name, value: data.value }];

    const { data: result, error } = await supabase
      .from('option_sets')
      .update({
        options: updatedOptions,
      })
      .eq('id', data.optionSetID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Insert!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
export const deleteSingleOption = async (data: TSingleOption) => {
  if (!SingleOption.safeParse(data).success) return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    
    // First get current options
    const { data: currentOptionSet, error: fetchError } = await supabase
      .from('option_sets')
      .select('options')
      .eq('id', data.optionSetID)
      .single();

    if (fetchError) return { error: fetchError.message };
    if (!currentOptionSet) return { error: "Option set not found!" };

    // Filter out the option to delete
    const updatedOptions = (currentOptionSet.options || []).filter(
      (option: { name: string; value: string }) => !(option.name === data.name && option.value === data.value)
    );

    const { data: result, error } = await supabase
      .from('option_sets')
      .update({
        options: updatedOptions,
      })
      .eq('id', data.optionSetID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Delete!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

// ------------------------- SPECIFICATIONS -------------------------

export const getSpecGroupByCatID = async (categoryID: string) => {
  if (!categoryID || categoryID === "") return { error: "Invalid Data!" };

  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('spec_groups')
      .select(`
        *,
        category_spec_groups!inner (
          category_id
        )
      `)
      .eq('category_spec_groups.category_id', categoryID);

    if (error) return { error: error.message };
    if (!result) return { error: "Not Found!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};

export const addSpecGroup = async (data: TSpecGroup) => {
  if (!AddSpecGroup.safeParse(data).success) return { error: "Invalid Data" };

  try {
    const supabase = createSupabaseServer();
    
    // First create the spec group
    const { data: specGroup, error: specError } = await supabase
      .from('spec_groups')
      .insert({
        title: data.title,
        specs: [],
      })
      .select()
      .single();

    if (specError) return { error: specError.message };
    if (!specGroup) return { error: "failed" };

    // Then link it to the category
    const { data: linkResult, error: linkError } = await supabase
      .from('category_spec_groups')
      .insert({
        spec_group_id: specGroup.id,
        category_id: data.id,
      })
      .select()
      .single();

    if (linkError) return { error: linkError.message };
    if (!linkResult) return { error: "failed" };
    
    return { res: specGroup };
  } catch (error) {
    return { res: JSON.stringify(error) };
  }
};
export const deleteSpecGroup = async (id: string) => {
  if (!id || id === "") return { error: "Invalid Data" };
  try {
    const supabase = createSupabaseServer();
    const { data: result, error } = await supabase
      .from('spec_groups')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "failed" };
    return { res: result };
  } catch (error) {
    return { res: JSON.stringify(error) };
  }
};

// ------------------------- SINGLE SPEC -------------------------
export const addSingleSpec = async (data: TSingleSpec) => {
  if (!SingleSpec.safeParse(data).success) return { error: "Invalid Data!" };
  try {
    const supabase = createSupabaseServer();
    
    // First get current specs
    const { data: currentSpecGroup, error: fetchError } = await supabase
      .from('spec_groups')
      .select('specs')
      .eq('id', data.specGroupID)
      .single();

    if (fetchError) return { error: fetchError.message };
    if (!currentSpecGroup) return { error: "Spec group not found!" };

    // Add new spec to the array
    const updatedSpecs = [...(currentSpecGroup.specs || []), data.value];

    const { data: result, error } = await supabase
      .from('spec_groups')
      .update({
        specs: updatedSpecs,
      })
      .eq('id', data.specGroupID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Insert!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
export const deleteSingleSpec = async (data: TSingleSpec) => {
  if (!SingleSpec.safeParse(data).success) return { error: "Invalid Data!" };
  try {
    const supabase = createSupabaseServer();
    
    // First get current specs
    const { data: specsList, error: fetchError } = await supabase
      .from('spec_groups')
      .select('specs')
      .eq('id', data.specGroupID)
      .single();

    if (fetchError) return { error: fetchError.message };
    if (!specsList || !specsList.specs) return { error: "Can't find Item!" };

    // Filter out the spec to delete
    const filteredList = specsList.specs.filter((spec: string) => spec !== data.value);

    const { data: result, error } = await supabase
      .from('spec_groups')
      .update({
        specs: filteredList,
      })
      .eq('id', data.specGroupID)
      .select()
      .single();

    if (error) return { error: error.message };
    if (!result) return { error: "Can't Delete!" };
    return { res: result };
  } catch (error) {
    return { error: JSON.stringify(error) };
  }
};
