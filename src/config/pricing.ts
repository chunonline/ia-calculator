
export type PricingTier = {
  id: string;
  name: string;
  description: string;
  dataPointsIncluded: number;
  basePrice: number;
  additionalCostPer1k: number;
  isPopular?: boolean;
  features: string[];
};

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small projects and personal use",
    dataPointsIncluded: 100000, // 100k
    basePrice: 49,
    additionalCostPer1k: 0.5,
    features: [
      "100k data points included",
      "Basic analytics",
      "Email support",
      "1 project",
      "7-day data retention",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    dataPointsIncluded: 1000000, // 1M
    basePrice: 199,
    additionalCostPer1k: 0.4,
    isPopular: true,
    features: [
      "1M data points included",
      "Advanced analytics",
      "Priority support",
      "10 projects",
      "30-day data retention",
      "API access",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large-scale applications and companies",
    dataPointsIncluded: 10000000, // 10M
    basePrice: 999,
    additionalCostPer1k: 0.2,
    features: [
      "10M data points included",
      "Enterprise analytics",
      "Dedicated support",
      "Unlimited projects",
      "90-day data retention",
      "Advanced API access",
      "Custom integrations",
      "SSO authentication",
    ],
  },
];

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toString();
};

export const calculatePrice = (
  tier: PricingTier,
  dataPoints: number
): number => {
  if (dataPoints <= tier.dataPointsIncluded) {
    return tier.basePrice;
  }

  const additionalDataPoints = dataPoints - tier.dataPointsIncluded;
  const additionalCost = (additionalDataPoints / 1000) * tier.additionalCostPer1k;
  
  return tier.basePrice + additionalCost;
};

export const calculateUnitPrice = (
  tier: PricingTier,
  dataPoints: number
): number => {
  // Dynamic unit price calculation based on data points usage
  if (dataPoints <= 0) return 0;
  
  // For volumes within the included data points, calculate base unit price
  if (dataPoints <= tier.dataPointsIncluded) {
    return (tier.basePrice / tier.dataPointsIncluded) * 1000;
  }
  
  // For volumes exceeding included data points, calculate blended rate
  const includedCost = tier.basePrice;
  const additionalDataPoints = dataPoints - tier.dataPointsIncluded;
  const additionalCost = (additionalDataPoints / 1000) * tier.additionalCostPer1k;
  const totalCost = includedCost + additionalCost;
  
  // Return the blended rate per 1000 data points
  return (totalCost / dataPoints) * 1000;
};
