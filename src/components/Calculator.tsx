
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PricingCard } from "./PricingCard";
import { pricingTiers, calculatePrice, formatNumber, type PricingTier } from "@/config/pricing";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingChart } from "./PricingChart";

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
  
  // Generate price comparison data for the chart
  const comparisonData = pricingTiers.map(tier => {
    return {
      name: tier.name,
      price: calculatePrice(tier, dataPointsUsage),
      isSelected: tier.id === selectedTierId,
    };
  });

  // Get tier prices at different data point levels for the chart
  const getTierPricesAtDifferentLevels = () => {
    return pricingTiers.map(tier => {
      return {
        name: tier.name,
        isSelected: tier.id === selectedTierId,
        dataPoints: DATA_POINTS_STEPS.map(dataPoints => ({
          dataPoints,
          price: calculatePrice(tier, dataPoints)
        }))
      };
    });
  };
  
  const priceTrends = getTierPricesAtDifferentLevels();

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid gap-8">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <DatabaseIcon className="h-5 w-5 text-brand-purple" />
                <Label htmlFor="data-points" className="font-medium">
                  Monthly Data Points Usage
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

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  isSelected={selectedTierId === tier.id}
                  onSelect={setSelectedTierId}
                  calculatedPrice={calculatePrice(tier, dataPointsUsage)}
                  dataPointsUsage={dataPointsUsage}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-0">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <PricingChart 
                  comparisonData={comparisonData} 
                  priceTrends={priceTrends} 
                  dataPointsUsage={dataPointsUsage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
