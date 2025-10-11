import React from "react";

interface Spec {
  icon: React.ReactNode; // Or a string for an icon name
  label: string;
  value: string | number;
}

interface VehicleSpecsProps {
  specs: Spec[];
}

export default function VehicleSpecs({ specs }: VehicleSpecsProps) {
  return (
    <div className="flex justify-start gap-8 border-t border-b py-6 mt-8">
      {specs.map((spec, index) => (
        <div key={index} className="flex flex-col items-center gap-2 text-gray-700">
          <div className="w-8 h-8 text-indigo-600">
            {spec.icon}
          </div>
          <span className="text-sm font-semibold">{spec.label}</span>
          <span className="text-xs">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}
