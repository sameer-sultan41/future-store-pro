/**
 * Mock Shipping Service for Development/Testing
 * Use this when you don't have API keys configured
 */

export interface MockShippingRate {
  serviceName: string;
  rate: number;
  deliveryDays: number;
  provider: string;
  currency: string;
}

/**
 * Generate mock shipping rates based on address and cart
 * This simulates what a real API would return
 */
export async function getMockShippingRates(
  zipCode: string,
  country: string,
  totalWeight: number,
  city?: string
): Promise<MockShippingRate[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check if this is Pakistan (for BlueEX simulation)
  const isPakistan = country === "PK" || country === "Pakistan";
  const isInternational = country !== "US" && !isPakistan;
  
  let rates: MockShippingRate[] = [];

  if (isPakistan) {
    // BlueEX rates for Pakistan (in PKR)
    const baseRate = 150; // Base rate in PKR
    const weightMultiplier = totalWeight * 50; // PKR per kg
    
    // Major cities get better rates
    const majorCities = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"];
    const isMajorCity = majorCities.some(city => 
      (city || "").toLowerCase().includes(city.toLowerCase())
    );
    
    const cityMultiplier = isMajorCity ? 1.0 : 1.3;

    rates = [
      {
        serviceName: "BlueEX Standard",
        rate: (baseRate + weightMultiplier) * cityMultiplier,
        deliveryDays: isMajorCity ? 2 : 3,
        provider: "BlueEX",
        currency: "PKR",
      },
      {
        serviceName: "BlueEX Express",
        rate: (baseRate + weightMultiplier) * 1.4 * cityMultiplier,
        deliveryDays: 1,
        provider: "BlueEX",
        currency: "PKR",
      },
      {
        serviceName: "BlueEX Overnight",
        rate: (baseRate + weightMultiplier) * 1.8 * cityMultiplier,
        deliveryDays: 1,
        provider: "BlueEX",
        currency: "PKR",
      },
    ];
  } else {
    // International or US rates (in USD)
    const baseRate = isInternational ? 25 : 10;
    const weightMultiplier = totalWeight * 2;

    rates = [
      {
        serviceName: "Standard Shipping",
        rate: baseRate + weightMultiplier,
        deliveryDays: isInternational ? 10 : 5,
        provider: "USPS",
        currency: "USD",
      },
      {
        serviceName: "Express Shipping",
        rate: (baseRate + weightMultiplier) * 1.5,
        deliveryDays: isInternational ? 5 : 2,
        provider: "FedEx",
        currency: "USD",
      },
      {
        serviceName: "Priority Overnight",
        rate: (baseRate + weightMultiplier) * 2.5,
        deliveryDays: 1,
        provider: "UPS",
        currency: "USD",
      },
    ];

    // Add economy option for domestic
    if (!isInternational) {
      rates.push({
        serviceName: "Economy Shipping",
        rate: baseRate + weightMultiplier - 3,
        deliveryDays: 7,
        provider: "USPS",
        currency: "USD",
      });
    }
  }

  return rates.sort((a, b) => a.rate - b.rate);
}
