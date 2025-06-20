import type { BookingStep } from "@/pages/home";

interface ProgressStepsProps {
  currentStep: BookingStep;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const steps = [
    { key: "search", label: "Search", number: 1 },
    { key: "select", label: "Select", number: 2 },
    { key: "passenger", label: "Payment", number: 3 },
  ];

  const getStepIndex = (step: BookingStep) => {
    if (step === "search") return 0;
    if (step === "select") return 1;
    if (step === "passenger" || step === "confirmation") return 2;
    return 0;
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStepIndex >= index
                      ? "bg-primary text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStepIndex >= index ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-300 ml-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
