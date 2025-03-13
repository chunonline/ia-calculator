import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatNumber } from "@/config/pricing";

const MAX_DATA_POINTS = 5000000; // 5M

// Simplified pricing function
function getPrice(points: number) {
  if (points <= 24000) return 0.4;
  if (points <= 100000) return 0.3;
  if (points <= 250000) return 0.2;
  if (points <= 700000) return 0.1;
  if (points <= 2000000) return 0.08;
  if (points <= 4000000) return 0.06;
  return 0.04;
}

export function Calculator() {
  const [points, setPoints] = useState(1000);
  const [inputValue, setInputValue] = useState("1000");

  // Get current price
  const price = getPrice(points);
  const total = points * price;

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    // Apply non-linear step sizes
    let adjustedValue = newValue;
    if (newValue <= 200000) {
      // Fine-grained control (step by 100) for 0-200K
      adjustedValue = Math.round(newValue / 100) * 100;
    } else if (newValue <= 1000000) {
      // Step by 1000 for 200K-1M
      adjustedValue = Math.round(newValue / 1000) * 1000;
    } else {
      // Step by 10000 for 1M-5M
      adjustedValue = Math.round(newValue / 10000) * 10000;
    }
    
    setPoints(adjustedValue);
    setInputValue(adjustedValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
    
    const numValue = value === "" ? 0 : parseInt(value, 10);
    if (numValue <= MAX_DATA_POINTS) {
      setPoints(numValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) === 0) {
      setInputValue("1000");
      setPoints(1000);
    }
  };

  // Debug logging
  console.log({
    points,
    price,
    total,
    inputValue
  });

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="grid gap-8">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <DatabaseIcon className="h-5 w-5 text-brand-purple" />
                <Label htmlFor="data-points" className="font-medium">
                  Yearly Data Points: {formatNumber(points)}
                </Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 items-center">
                <div className="space-y-2">
                  <Slider
                    id="data-points"
                    min={0}
                    max={MAX_DATA_POINTS}
                    step={100} // Smaller step for more precise control
                    value={[points]}
                    onValueChange={handleSliderChange}
                    className="mr-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>200K</span>
                    <span>1M</span>
                    <span>5M</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    ({formatNumber(points)})
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
                <h3 className="text-xl font-semibold">Price Per Point</h3>
                <p className="text-muted-foreground text-sm">
                  Current rate based on volume
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">Yearly Total</h3>
                <p className="text-muted-foreground text-sm">Annual cost based on your usage</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
