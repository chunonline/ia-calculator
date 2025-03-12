
import { useState } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/config/pricing";
import { formatCurrency } from "@/utils/formatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComparisonItem {
  name: string;
  price: number;
  isSelected: boolean;
}

interface DataPoint {
  dataPoints: number;
  price: number;
}

interface PriceTrendItem {
  name: string;
  isSelected: boolean;
  dataPoints: DataPoint[];
}

interface PricingChartProps {
  comparisonData: ComparisonItem[];
  priceTrends: PriceTrendItem[];
  dataPointsUsage: number;
}

export function PricingChart({ comparisonData, priceTrends, dataPointsUsage }: PricingChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  // Format the data for the line chart
  const lineChartData = priceTrends[0].dataPoints.map((point, index) => {
    const item: Record<string, any> = {
      dataPoints: point.dataPoints,
      formattedDataPoints: formatNumber(point.dataPoints),
    };

    priceTrends.forEach(tier => {
      item[tier.name] = tier.dataPoints[index].price;
    });

    return item;
  });

  // Custom tooltip for line chart
  const LineChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{formatNumber(label)} Data Points</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center justify-between gap-4"
                style={{ color: entry.color }}
              >
                <span>{entry.name}:</span>
                <span className="font-medium">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-lg font-semibold mt-1">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-muted-foreground">for {formatNumber(dataPointsUsage)} data points</p>
        </div>
      );
    }
    return null;
  };

  // Find the closest data point to the current usage
  const findClosestDataPoint = (usage: number) => {
    return priceTrends[0].dataPoints.reduce((prev, curr) => {
      return Math.abs(curr.dataPoints - usage) < Math.abs(prev.dataPoints - usage) ? curr : prev;
    }).dataPoints;
  };

  const closestDataPoint = findClosestDataPoint(dataPointsUsage);

  // Fixed color mapping function for Bar
  const getBarFillColor = (entry: any) => {
    return entry.isSelected ? "#000000" : "#555555";
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-4">
          <TabsTrigger value="current">Current Usage</TabsTrigger>
          <TabsTrigger value="trends">Price Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-0">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                  domain={[0, 'dataMax']}
                />
                <Tooltip content={<BarChartTooltip />} />
                <Bar 
                  dataKey="price" 
                  name="Monthly Price"
                  radius={[4, 4, 0, 0]}
                  fill="#000000"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-0">
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant={chartType === "line" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("line")}
                className={chartType === "line" ? "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" : ""}
              >
                Line
              </Button>
              <Button 
                variant={chartType === "bar" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("bar")}
                className={chartType === "bar" ? "bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200" : ""}
              >
                Bar
              </Button>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart
                  data={lineChartData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="formattedDataPoints" 
                    label={{ 
                      value: 'Data Points', 
                      position: 'insideBottomRight', 
                      offset: -10 
                    }} 
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                    label={{ 
                      value: 'Monthly Price', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<LineChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  {priceTrends.map((tier, index) => (
                    <Line
                      key={tier.name}
                      type="monotone"
                      dataKey={tier.name}
                      stroke={tier.isSelected ? "#000000" : "#555555"}
                      strokeWidth={tier.isSelected ? 3 : 2}
                      activeDot={{ r: 8, fill: tier.isSelected ? "#000000" : "#555555" }}
                      dot={{ r: 4 }}
                    />
                  ))}
                  {/* Reference line for current usage */}
                  <CartesianGrid
                    horizontal={false}
                    verticalPoints={[
                      lineChartData.findIndex(item => item.dataPoints === closestDataPoint)
                    ]}
                    stroke="#000000"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                  />
                </LineChart>
              ) : (
                <BarChart
                  data={lineChartData}
                  margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="formattedDataPoints" 
                    label={{ 
                      value: 'Data Points', 
                      position: 'insideBottomRight', 
                      offset: -10 
                    }} 
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                    label={{ 
                      value: 'Monthly Price', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<LineChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  {priceTrends.map((tier, index) => (
                    <Bar
                      key={tier.name}
                      dataKey={tier.name}
                      fill={tier.isSelected ? "#000000" : "#555555"}
                      opacity={tier.isSelected ? 1 : 0.8}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
