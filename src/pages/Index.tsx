
import { Calculator } from "@/components/Calculator";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            Data Points Pricing Calculator
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Calculate your yearly costs based on your expected data usage. Adjust the slider to see how pricing scales with your needs.
          </p>
        </div>

        <div className="mb-16">
          <Calculator />
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-md shadow-md hover:bg-gray-800 transition-all duration-200 group dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Contact Sales for Enterprise Pricing
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Need a custom plan? Our team is ready to help with your specific requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
