"use server";

import { getMockShippingRates } from "./mockShippingService";

/**
 * Shipping Service - Calculate dynamic shipping rates
 * Supports multiple providers: Shippo, EasyPost, ShipEngine
 */

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartItem {
  productId: string; // Changed from number to string
  productName: string;
  price: number;
  quantity: number;
  weight?: number; // in pounds
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface ShippingRate {
  serviceName: string;
  rate: number;
  deliveryDays: number;
  provider: string;
  currency: string;
}

export interface ShippingCalculationResult {
  success: boolean;
  rates?: ShippingRate[];
  error?: string;
  defaultRate?: number;
}

// Default shipping rate as fallback
const DEFAULT_SHIPPING_RATE = 15.0;

// Estimate package weight if not provided (in pounds)
const estimateWeight = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemWeight = item.weight || 1.0; // Default 1 lb per item
    return total + itemWeight * item.quantity;
  }, 0);
};

/**
 * Calculate shipping using Shippo API
 */
const calculateShippoShipping = async (
  address: ShippingAddress,
  items: CartItem[]
): Promise<ShippingCalculationResult> => {
  try {
    const shippoApiKey = process.env.SHIPPO_API_KEY;
    if (!shippoApiKey) {
      throw new Error("Shippo API key not configured");
    }

    const weight = estimateWeight(items);

    const shipmentData = {
      address_from: {
        name: "Future Store",
        street1: "123 Business St",
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        country: "US",
      },
      address_to: {
        name: `${address.firstName} ${address.lastName}`,
        street1: address.address,
        city: address.city,
        state: address.state,
        zip: address.zipCode,
        country: address.country,
      },
      parcels: [
        {
          length: "10",
          width: "8",
          height: "6",
          distance_unit: "in",
          weight: weight.toString(),
          mass_unit: "lb",
        },
      ],
      async: false,
    };

    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ShippoToken ${shippoApiKey}`,
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      throw new Error(`Shippo API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.rates && data.rates.length > 0) {
      const rates: ShippingRate[] = data.rates.map((rate: any) => ({
        serviceName: rate.servicelevel.name,
        rate: parseFloat(rate.amount),
        deliveryDays: rate.estimated_days || 5,
        provider: rate.provider,
        currency: rate.currency,
      }));

      return {
        success: true,
        rates,
        defaultRate: rates[0].rate,
      };
    }

    throw new Error("No shipping rates available");
  } catch (error) {
    console.error("Shippo shipping calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }
};

/**
 * Calculate shipping using EasyPost API
 */
const calculateEasyPostShipping = async (
  address: ShippingAddress,
  items: CartItem[]
): Promise<ShippingCalculationResult> => {
  try {
    const easyPostApiKey = process.env.EASYPOST_API_KEY;
    if (!easyPostApiKey) {
      throw new Error("EasyPost API key not configured");
    }

    const weight = estimateWeight(items);

    const shipmentData = {
      shipment: {
        to_address: {
          name: `${address.firstName} ${address.lastName}`,
          street1: address.address,
          city: address.city,
          state: address.state,
          zip: address.zipCode,
          country: address.country,
        },
        from_address: {
          name: "Future Store",
          street1: "123 Business St",
          city: "San Francisco",
          state: "CA",
          zip: "94103",
          country: "US",
        },
        parcel: {
          length: 10,
          width: 8,
          height: 6,
          weight: weight * 16, // Convert to ounces
        },
      },
    };

    const response = await fetch("https://api.easypost.com/v2/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${easyPostApiKey}`,
      },
      body: JSON.stringify(shipmentData),
    });

    if (!response.ok) {
      throw new Error(`EasyPost API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.rates && data.rates.length > 0) {
      const rates: ShippingRate[] = data.rates.map((rate: any) => ({
        serviceName: rate.service,
        rate: parseFloat(rate.rate),
        deliveryDays: rate.delivery_days || 5,
        provider: rate.carrier,
        currency: rate.currency,
      }));

      return {
        success: true,
        rates,
        defaultRate: rates[0].rate,
      };
    }

    throw new Error("No shipping rates available");
  } catch (error) {
    console.error("EasyPost shipping calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }
};

/**
 * Calculate shipping using BlueEX API (Pakistan)
 */
const calculateBlueEXShipping = async (
  address: ShippingAddress,
  items: CartItem[]
): Promise<ShippingCalculationResult> => {
  try {
    const blueexApiKey = process.env.BLUEEX_API_KEY;
    const blueexStoreCode = process.env.BLUEEX_STORE_CODE;
    
    if (!blueexApiKey || !blueexStoreCode) {
      throw new Error("BlueEX API credentials not configured");
    }

    const weight = estimateWeight(items);
    
    // BlueEX API endpoint for rate calculation
    const requestData = {
      service_code: "blueex_express", // Standard service
      origin_city: process.env.STORE_CITY || "Karachi",
      destination_city: address.city,
      weight: Math.ceil(weight), // Weight in kg
      pieces: 1,
      cod_amount: 0, // Cash on Delivery amount if applicable
      shipper_name: process.env.STORE_NAME || "Future Store Pro",
      shipper_email: process.env.STORE_EMAIL || "store@example.com",
      shipper_phone: process.env.STORE_PHONE || "+92-XXX-XXXXXXX",
      shipper_address: process.env.STORE_ADDRESS || "Store Address",
    };

    const response = await fetch("https://api.blue-ex.com/api/rate/calculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${blueexApiKey}`,
        "Store-Code": blueexStoreCode,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`BlueEX API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "success" && data.data) {
      const rates: ShippingRate[] = [];
      
      // BlueEX Standard Service
      if (data.data.standard_rate) {
        rates.push({
          serviceName: "BlueEX Standard",
          rate: parseFloat(data.data.standard_rate),
          deliveryDays: data.data.standard_days || 3,
          provider: "BlueEX",
          currency: "PKR",
        });
      }
      
      // BlueEX Express Service
      if (data.data.express_rate) {
        rates.push({
          serviceName: "BlueEX Express",
          rate: parseFloat(data.data.express_rate),
          deliveryDays: data.data.express_days || 1,
          provider: "BlueEX",
          currency: "PKR",
        });
      }
      
      // BlueEX Overnight
      if (data.data.overnight_rate) {
        rates.push({
          serviceName: "BlueEX Overnight",
          rate: parseFloat(data.data.overnight_rate),
          deliveryDays: 1,
          provider: "BlueEX",
          currency: "PKR",
        });
      }

      if (rates.length > 0) {
        return {
          success: true,
          rates,
          defaultRate: rates[0].rate,
        };
      }
    }

    throw new Error("No BlueEX shipping rates available");
  } catch (error) {
    console.error("BlueEX shipping calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }
};

/**
 * Calculate shipping using ShipEngine API
 */
const calculateShipEngineShipping = async (
  address: ShippingAddress,
  items: CartItem[]
): Promise<ShippingCalculationResult> => {
  try {
    const shipEngineApiKey = process.env.SHIPENGINE_API_KEY;
    if (!shipEngineApiKey) {
      throw new Error("ShipEngine API key not configured");
    }

    const weight = estimateWeight(items);

    const rateData = {
      rate_options: {
        carrier_ids: [], // Leave empty to get all carriers
      },
      shipment: {
        ship_to: {
          name: `${address.firstName} ${address.lastName}`,
          address_line1: address.address,
          city_locality: address.city,
          state_province: address.state,
          postal_code: address.zipCode,
          country_code: address.country,
        },
        ship_from: {
          name: "Future Store",
          address_line1: "123 Business St",
          city_locality: "San Francisco",
          state_province: "CA",
          postal_code: "94103",
          country_code: "US",
        },
        packages: [
          {
            weight: {
              value: weight,
              unit: "pound",
            },
            dimensions: {
              length: 10,
              width: 8,
              height: 6,
              unit: "inch",
            },
          },
        ],
      },
    };

    const response = await fetch("https://api.shipengine.com/v1/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-Key": shipEngineApiKey,
      },
      body: JSON.stringify(rateData),
    });

    if (!response.ok) {
      throw new Error(`ShipEngine API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.rate_response?.rates && data.rate_response.rates.length > 0) {
      const rates: ShippingRate[] = data.rate_response.rates.map((rate: any) => ({
        serviceName: rate.service_type,
        rate: parseFloat(rate.shipping_amount.amount),
        deliveryDays: rate.delivery_days || 5,
        provider: rate.carrier_friendly_name,
        currency: rate.shipping_amount.currency,
      }));

      return {
        success: true,
        rates,
        defaultRate: rates[0].rate,
      };
    }

    throw new Error("No shipping rates available");
  } catch (error) {
    console.error("ShipEngine shipping calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }
};

/**
 * Main function to calculate shipping rates
 * Tries configured provider, uses mock data if no API key, falls back to default rate on error
 */
export async function calculateShippingRate(
  address: ShippingAddress,
  items: CartItem[]
): Promise<ShippingCalculationResult> {
  // Validate inputs
  if (!address.zipCode || !address.country) {
    return {
      success: false,
      error: "Invalid shipping address",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }

  if (!items || items.length === 0) {
    return {
      success: false,
      error: "No items in cart",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }

  // Determine which provider to use based on environment variables
  const provider = process.env.SHIPPING_PROVIDER || "shippo";

  // Check if any API key is configured
  const hasApiKey = !!(
    process.env.SHIPPO_API_KEY ||
    process.env.EASYPOST_API_KEY ||
    process.env.SHIPENGINE_API_KEY ||
    process.env.BLUEEX_API_KEY
  );

  // Use mock service if no API keys are configured (development mode)
  if (!hasApiKey) {
    try {
      const weight = estimateWeight(items);
      const mockRates = await getMockShippingRates(
        address.zipCode, 
        address.country, 
        weight,
        address.city
      );
      
      const rates: ShippingRate[] = mockRates.map(rate => ({
        serviceName: rate.serviceName,
        rate: rate.rate,
        deliveryDays: rate.deliveryDays,
        provider: rate.provider,
        currency: rate.currency,
      }));

      return {
        success: true,
        rates,
        defaultRate: rates[0].rate,
      };
    } catch (error) {
      console.error("Mock shipping service error:", error);
      return {
        success: false,
        error: "Mock shipping service unavailable",
        defaultRate: DEFAULT_SHIPPING_RATE,
      };
    }
  }

  try {
    let result: ShippingCalculationResult;

    switch (provider.toLowerCase()) {
      case "shippo":
        result = await calculateShippoShipping(address, items);
        break;
      case "easypost":
        result = await calculateEasyPostShipping(address, items);
        break;
      case "shipengine":
        result = await calculateShipEngineShipping(address, items);
        break;
      case "blueex":
        result = await calculateBlueEXShipping(address, items);
        break;
      default:
        result = {
          success: false,
          error: `Unknown shipping provider: ${provider}`,
          defaultRate: DEFAULT_SHIPPING_RATE,
        };
    }

    // If API call failed, return default rate
    if (!result.success) {
      return {
        success: false,
        error: result.error,
        defaultRate: DEFAULT_SHIPPING_RATE,
      };
    }

    return result;
  } catch (error) {
    console.error("Shipping calculation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      defaultRate: DEFAULT_SHIPPING_RATE,
    };
  }
}

/**
 * Simple shipping rate calculation (fallback or for testing)
 * Based on weight and distance
 */
export async function calculateSimpleShipping(
  address: ShippingAddress,
  items: CartItem[]
): Promise<number> {
  const weight = estimateWeight(items);
  const baseRate = 5.0;
  const perPoundRate = 2.0;
  
  // Add extra for international shipping
  const internationalFee = address.country !== "US" ? 15.0 : 0.0;
  
  return baseRate + (weight * perPoundRate) + internationalFee;
}
