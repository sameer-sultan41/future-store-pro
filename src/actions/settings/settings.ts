import { createSupabaseServer } from '@/shared/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { SettingsResponse } from './types';






    const supabase = createSupabaseServer();

export async function getSettingsData() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) throw error;

  // Adjust the path below based on your settings JSON structure
  // For example, if banners are at site.banners or site.carousel
  return data as SettingsResponse;
}







// <========> Old code <========>

// Placeholder for ISettingInput type definition
export interface ISettingInput {
  common: {
    freeShippingMinPrice: number;
    isMaintenanceMode: boolean;
    defaultTheme: string;
    defaultColor: string;
    pageSize: number;
  };
  site: {
    name: string;
    description: string;
    keywords: string;
    url: string;
    logo: string;
    slogan: string;
    author: string;
    copyright: string;
    email: string;
    address: string;
    phone: string;
  };
  carousels: Array<{
    title: string;
    buttonCaption: string;
    image: string;
    url: string;
  }>;
  availableLanguages: Array<{
    code: string;
    name: string;
  }>;
  defaultLanguage: string;
  availableCurrencies: Array<{
    name: string;
    code: string;
    symbol: string;
    convertRate: number;
  }>;
  defaultCurrency: string;
  availablePaymentMethods: Array<{
    name: string;
    commission: number;
  }>;
  defaultPaymentMethod: string;
  availableDeliveryDates: Array<{
    name: string;
    daysToDeliver: number;
    shippingPrice: number;
    freeShippingMinPrice: number;
  }>;
  defaultDeliveryDate: string;
}



const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null;
};

export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error fetching settings: ${error.message}`);
  }

  return data as ISettingInput;
};

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('hit db');
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) {
      throw new Error(`Error fetching settings: ${error.message}`);
    }

    globalForSettings.cachedSettings = data as ISettingInput;
  }

  return globalForSettings.cachedSettings as ISettingInput;
};

export const updateSetting = async (newSetting: ISettingInput) => {
  try {
    const { error } = await supabase
      .from('settings')
      .upsert(newSetting, { onConflict: 'id' });

    if (error) {
      throw new Error(`Error updating settings: ${error.message}`);
    }

    globalForSettings.cachedSettings = newSetting; // Update the cache

    return {
      success: true,
      message: 'Setting updated successfully',
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server';
  const cookiesStore = await cookies();
  cookiesStore.set('currency', newCurrency);

  return {
    success: true,
    message: 'Currency updated successfully',
  };
};
