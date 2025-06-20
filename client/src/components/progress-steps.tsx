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
    { key: "confirmation", label: "Confirmation" },
  ];

  const getStepIndex = (step: BookingStep) => {
    if (step === "search") return 0;
    if (step === "select") return 1;
    if (step === "passenger") return 2;
    if (step === "confirmation") return 3;
    return 0;
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="mb-8 bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStepIndex > index
                      ? "bg-green-500 text-white"
                      : currentStepIndex === index
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStepIndex > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium ${
                    currentStepIndex >= index ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={`h-px ${currentStepIndex > index ? "bg-green-500" : "bg-gray-200"}`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
