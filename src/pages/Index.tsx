
import { Calculator } from "@/components/Calculator";
import { Calculator as CalculatorIcon, Database, LineChart, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Data Points Pricing Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Calculate your monthly costs based on your expected data usage. Adjust the slider to see how pricing scales with your needs.
          </p>
        </div>

        <div className="mb-16">
          <Calculator />
        </div>

        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            How Our Pricing Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-lightBlue dark:bg-blue-900/30 text-brand-blue mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Base Data Allocation</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Each plan comes with a set amount of data points per month. Use them however you need across all your projects.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-lightPurple dark:bg-purple-900/30 text-brand-purple mb-4">
                <CalculatorIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Usage-Based Pricing</h3>
              <p className="text-slate-600 dark:text-slate-300">
                If you exceed your plan's base allocation, you only pay for the additional data points you use - no unexpected charges.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-lightBlue dark:bg-blue-900/30 text-brand-blue mb-4">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scale Efficiently</h3>
              <p className="text-slate-600 dark:text-slate-300">
                As your usage grows, our tiered pricing ensures you get better rates per data point. Higher tiers offer more value.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200 group">
            Contact Sales for Enterprise Pricing
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Need a custom plan? Our team is ready to help with your specific requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
