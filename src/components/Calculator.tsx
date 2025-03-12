
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { pricingTiers, calculatePrice, calculateUnitPrice, formatNumber, type PricingTier } from "@/config/pricing";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

const MAX_DATA_POINTS = 50000000; // 50M
const DATA_POINTS_STEPS = [
  100000,    // 100K
  500000,    // 500K
  1000000,   // 1M
  5000000,   // 5M
  10000000,  // 10M
  25000000,  // 25M
  50000000,  // 50M
];

export function Calculator() {
  const [dataPointsUsage, setDataPointsUsage] = useState<number>(1000000); // Default: 1M
  const [selectedTierId, setSelectedTierId] = useState<string>("professional");
  const [inputValue, setInputValue] = useState<string>(dataPointsUsage.toString());

  // Find the best tier based on data usage
  useEffect(() => {
    const bestTier = pricingTiers.reduce((best, current) => {
      const bestPrice = calculatePrice(best, dataPointsUsage);
      const currentPrice = calculatePrice(current, dataPointsUsage);
      return currentPrice <= bestPrice ? current : best;
    }, pricingTiers[0]);
    
    setSelectedTierId(bestTier.id);
  }, [dataPointsUsage]);

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setDataPointsUsage(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
    
    const numValue = value === "" ? 0 : parseInt(value, 10);
    if (numValue <= MAX_DATA_POINTS) {
      setDataPointsUsage(numValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) === 0) {
      setInputValue("1000");
      setDataPointsUsage(1000);
    }
  };

  const selectedTier = pricingTiers.find(tier => tier.id === selectedTierId) || pricingTiers[0];
  
  // Calculate pricing information
  const calculatedPrice = calculatePrice(selectedTier, dataPointsUsage);
  const yearlyPrice = calculatedPrice * 12;
  const unitPrice = calculateUnitPrice(selectedTier, dataPointsUsage);

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid gap-8">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <DatabaseIcon className="h-5 w-5 text-brand-purple" />
                <Label htmlFor="data-points" className="font-medium">
                  Yearly Data Points Usage
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 items-center">
                <Slider
                  id="data-points"
                  min={1000}
                  max={MAX_DATA_POINTS}
                  step={1000}
                  value={[dataPointsUsage]}
                  onValueChange={handleSliderChange}
                  className="mr-4"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ({formatNumber(dataPointsUsage)})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Unit Price</h3>
                <p className="text-muted-foreground text-sm">Cost per 1,000 data points</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatCurrency(unitPrice)}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Yearly Total</h3>
                <p className="text-muted-foreground text-sm">Annual cost based on your usage</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatCurrency(yearlyPrice)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
