
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingTier, formatNumber } from "@/config/pricing";
import { formatCurrency } from "@/utils/formatCurrency";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  tier: PricingTier;
  isSelected: boolean;
  onSelect: (tierId: string) => void;
  calculatedPrice: number;
  dataPointsUsage: number;
}

export function PricingCard({ tier, isSelected, onSelect, calculatedPrice, dataPointsUsage }: PricingCardProps) {
  const isExceeded = dataPointsUsage > tier.dataPointsIncluded;
  
  return (
    <Card className={cn(
      "w-full transition-all duration-200",
      isSelected ? "border-black ring-2 ring-black dark:ring-white dark:border-white shadow-lg scale-105" : "hover:shadow-md",
      tier.isPopular ? "relative" : ""
    )}>
      {tier.isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-black text-white dark:bg-white dark:text-black text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription className="h-12">{tier.description}</CardDescription>
        <div className="mt-4">
          <div className="flex items-end">
            <span className="text-4xl font-bold">
              {formatCurrency(calculatedPrice)}
            </span>
            <span className="text-muted-foreground ml-2">/month</span>
          </div>
          {isExceeded && (
            <div className="text-sm mt-1 text-muted-foreground">
              Base: {formatCurrency(tier.basePrice)} + Usage: {formatCurrency(calculatedPrice - tier.basePrice)}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <span className={cn(
              "inline-block rounded-full px-2 py-1 text-xs font-medium",
              isExceeded 
                ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white" 
                : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
            )}>
              Using {formatNumber(dataPointsUsage)} of {formatNumber(tier.dataPointsIncluded)} data points
            </span>
          </div>
          <ul className="space-y-2">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-black dark:text-white mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={isSelected ? "default" : "outline"} 
          className={cn(
            "w-full", 
            isSelected && "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          )}
          onClick={() => onSelect(tier.id)}
        >
          {isSelected ? "Selected" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
