import type { BookingStep } from "@/pages/home";
import { Check } from "lucide-react";

interface ProgressStepsProps {
  currentStep: BookingStep;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { key: "search", label: "Search" },
    { key: "select", label: "Choose flights" },
    { key: "passenger", label: "Passenger details" },
    { key: "payment", label: "Payment" },
    { key: "confirmation", label: "Confirmation" },
  ];

  const getStepIndex = (step: BookingStep) => {
    if (step === "search") return 0;
    if (step === "select") return 1;
    if (step === "passenger") return 2;
    if (step === "payment") return 3;
    if (step === "confirmation") return 4;
    return 0;
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-8 max-w-2xl w-full">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStepIndex > index
                        ? "bg-green-500 text-white"
                        : currentStepIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStepIndex > index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center ${
                      currentStepIndex >= index ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4 mt-[-20px]">
                    <div className={`h-px transition-colors ${currentStepIndex > index ? "bg-green-500" : "bg-gray-300"}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
