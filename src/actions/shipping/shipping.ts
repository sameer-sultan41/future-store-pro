"use server";

// TCS API Configuration
const TCS_API_URL = process.env.TCS_API_URL || "https://api.tcsexpress.com";
const TCS_API_KEY = process.env.TCS_API_KEY || "";
const TCS_ACCOUNT_NUMBER = process.env.TCS_ACCOUNT_NUMBER || "";

export interface ShippingAddress {
  city: string;
  postalCode: string;
  country: string;
  state?: string;
}

export interface ShippingPackage {
  weight: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  declaredValue: number; // product price
}

export interface ShippingRate {
  carrierId: string;
  carrierName: string;
  serviceType: string;
  serviceName: string;
  cost: number;
  currency: string;
  estimatedDays: string;
  estimatedDeliveryDate?: string;
}

export interface ShippingCalculationResponse {
  success: boolean;
  rates?: ShippingRate[];
  error?: string;
}

/**
 * Calculate shipping rates from TCS API
 * This is a real-time API call to TCS Express
 */
export async function calculateTCSShippingRates(
  origin: ShippingAddress,
  destination: ShippingAddress,
  packageInfo: ShippingPackage
): Promise<ShippingCalculationResponse> {
  try {
    // TCS API Integration
    // Replace this with actual TCS API endpoint and parameters
    const response = await fetch(`${TCS_API_URL}/api/v1/shipping/rates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TCS_API_KEY}`,
        "X-Account-Number": TCS_ACCOUNT_NUMBER,
      },
      body: JSON.stringify({
        origin: {
          city: origin.city,
          postal_code: origin.postalCode,
          country: origin.country,
        },
        destination: {
          city: destination.city,
          postal_code: destination.postalCode,
          country: destination.country,
        },
        package: {
          weight: packageInfo.weight,
          dimensions: {
            length: packageInfo.length || 30,
            width: packageInfo.width || 20,
            height: packageInfo.height || 10,
          },
          declared_value: packageInfo.declaredValue,
        },
        service_types: ["standard", "express", "overnight"],
      }),
      cache: "no-store", // Always get fresh rates
    });

    if (!response.ok) {
      throw new Error(`TCS API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform TCS response to our format
    const rates: ShippingRate[] = data.rates?.map((rate: any) => ({
      carrierId: "TCS",
      carrierName: "TCS Express",
      serviceType: rate.service_type,
      serviceName: rate.service_name,
      cost: rate.total_cost,
      currency: rate.currency || "PKR",
      estimatedDays: rate.estimated_delivery_days || "3-5 business days",
      estimatedDeliveryDate: rate.estimated_delivery_date,
    })) || [];

    return {
      success: true,
      rates,
    };
  } catch (error) {
    console.error("TCS Shipping API Error:", error);
    
    // Fallback to default rates if API fails
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch shipping rates",
      rates: getFallbackShippingRates(packageInfo.declaredValue),
    };
  }
}

/**
 * Get shipping rates with multiple carriers
 * This can integrate with multiple shipping providers
 */
export async function getShippingRates(
  destination: ShippingAddress,
  packageInfo: ShippingPackage
): Promise<ShippingCalculationResponse> {
  try {
    // Default origin (your warehouse/store location)
    const origin: ShippingAddress = {
      city: process.env.WAREHOUSE_CITY || "Karachi",
      postalCode: process.env.WAREHOUSE_POSTAL_CODE || "75500",
      country: process.env.WAREHOUSE_COUNTRY || "PK",
    };

    // Call TCS API
    const tcsRates = await calculateTCSShippingRates(origin, destination, packageInfo);

    // You can add more carriers here
    // const fedexRates = await calculateFedExRates(...);
    // const dhlRates = await calculateDHLRates(...);

    if (tcsRates.success && tcsRates.rates && tcsRates.rates.length > 0) {
      return tcsRates;
    }

    // If TCS fails, return fallback rates
    return {
      success: false,
      error: "Unable to fetch live rates, showing estimated rates",
      rates: getFallbackShippingRates(packageInfo.declaredValue),
    };
  } catch (error) {
    console.error("Shipping calculation error:", error);
    return {
      success: false,
      error: "Failed to calculate shipping",
      rates: getFallbackShippingRates(packageInfo.declaredValue),
    };
  }
}

/**
 * Fallback shipping rates when API is unavailable
 * These are backup rates based on your standard pricing
 */
function getFallbackShippingRates(productPrice: number): ShippingRate[] {
  const baseRates = [
    {
      carrierId: "TCS",
      carrierName: "TCS Express",
      serviceType: "standard",
      serviceName: "Standard Delivery",
      baseCost: 250,
      freeThreshold: 5000,
      estimatedDays: "3-5 business days",
    },
    {
      carrierId: "TCS",
      carrierName: "TCS Express",
      serviceType: "express",
      serviceName: "Express Delivery",
      baseCost: 450,
      freeThreshold: 10000,
      estimatedDays: "1-2 business days",
    },
    {
      carrierId: "TCS",
      carrierName: "TCS Express",
      serviceType: "overnight",
      serviceName: "Overnight Delivery",
      baseCost: 750,
      freeThreshold: 15000,
      estimatedDays: "Next business day",
    },
  ];

  return baseRates.map((rate) => ({
    carrierId: rate.carrierId,
    carrierName: rate.carrierName,
    serviceType: rate.serviceType,
    serviceName: rate.serviceName,
    cost: productPrice >= rate.freeThreshold ? 0 : rate.baseCost,
    currency: "PKR",
    estimatedDays: rate.estimatedDays,
  }));
}

/**
 * Validate destination for shipping
 * Check if we can ship to the provided location
 */
export async function validateShippingDestination(
  destination: ShippingAddress
): Promise<{ valid: boolean; message?: string }> {
  try {
    // Call TCS API to check serviceability
    const response = await fetch(`${TCS_API_URL}/api/v1/locations/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TCS_API_KEY}`,
      },
      body: JSON.stringify({
        city: destination.city,
        postal_code: destination.postalCode,
        country: destination.country,
      }),
    });

    if (!response.ok) {
      return { valid: false, message: "Unable to validate shipping location" };
    }

    const data = await response.json();
    
    if (data.serviceable) {
      return { valid: true };
    } else {
      return { 
        valid: false, 
        message: data.message || "Shipping not available to this location" 
      };
    }
  } catch (error) {
    console.error("Location validation error:", error);
    // Default to valid if validation service is down
    return { valid: true };
  }
}

/**
 * Track shipment using TCS tracking number
 */
export async function trackShipment(trackingNumber: string) {
  try {
    const response = await fetch(
      `${TCS_API_URL}/api/v1/tracking/${trackingNumber}`,
      {
        headers: {
          "Authorization": `Bearer ${TCS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tracking information");
    }

    return await response.json();
  } catch (error) {
    console.error("Tracking error:", error);
    return { error: "Unable to fetch tracking information" };
  }
}
