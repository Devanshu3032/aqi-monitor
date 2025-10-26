// components/aqi-badge.tsx

import React from 'react';

// Define the mapping from OWM Index (1-5) to US AQI Range/Color
const OWM_TO_US_AQI_MAPPING = [
  // OWM Index 1: Good (US AQI 0-50). Display representative number (e.g., 35)
  { level: 1, name: 'Good', color: 'bg-green-500', text: 'text-white', usAqi: 35 },
  // OWM Index 2: Fair (US AQI 51-100). Display representative number (e.g., 75)
  { level: 2, name: 'Moderate', color: 'bg-yellow-500', text: 'text-gray-900', usAqi: 75 },
  // OWM Index 3: Moderate (US AQI 101-150). Display representative number (e.g., 125)
  { level: 3, name: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-white', usAqi: 125 },
  // OWM Index 4: Poor (US AQI 151-200). Display representative number (e.g., 175)
  { level: 4, name: 'Unhealthy', color: 'bg-red-600', text: 'text-white', usAqi: 175 },
  // OWM Index 5: Very Poor (US AQI 201+). Display representative number (e.g., 250)
  { level: 5, name: 'Very Unhealthy', color: 'bg-purple-700', text: 'text-white', usAqi: 250 },
];

interface AQIBadgeProps {
  aqi: number | null; // This is the OWM 1-5 index
  size?: 'small' | 'medium' | 'large';
}

/**
 * Converts OWM 1-5 scale to a representative US AQI value (0-500) for display.
 */
const AQIBadge: React.FC<AQIBadgeProps> = ({ aqi, size = 'medium' }) => {
  if (aqi === null || aqi < 1 || aqi > 5) {
    return (
      <div className="rounded-xl bg-gray-400 px-3 py-1 text-sm font-semibold text-white shadow-lg">
        N/A
      </div>
    );
  }

  // Find the corresponding mapping object based on the OWM index (aqi)
  const mapping = OWM_TO_US_AQI_MAPPING.find(r => r.level === aqi) || OWM_TO_US_AQI_MAPPING[0];

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-6 py-2 text-2xl font-extrabold',
  };

  return (
    <div
      className={`inline-flex flex-col items-center justify-center rounded-xl shadow-lg transition-all duration-300
        ${mapping.color} ${mapping.text} ${sizeClasses[size]}
      `}
    >
        <span className="text-sm font-light uppercase opacity-80" style={{ fontSize: size === 'large' ? '0.8rem' : '0.6rem' }}>
            {mapping.name}
        </span>
        <span className="block" style={{ fontSize: size === 'large' ? '3rem' : '1.5rem' }}>
            {mapping.usAqi} {/* Display the representative US AQI value */}
        </span>
    </div>
  );
};

export default AQIBadge;