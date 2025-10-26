interface AQIBadgeProps {
  aqi: number
  size?: "small" | "medium" | "large"
}

export default function AQIBadge({ aqi, size = "medium" }: AQIBadgeProps) {
  const getAQILevel = (value: number) => {
    if (value <= 50) return { label: "Good", color: "bg-green-500", textColor: "text-white" }
    if (value <= 100) return { label: "Moderate", color: "bg-yellow-500", textColor: "text-white" }
    if (value <= 150)
      return { label: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-white" }
    if (value <= 200) return { label: "Unhealthy", color: "bg-red-500", textColor: "text-white" }
    if (value <= 300) return { label: "Very Unhealthy", color: "bg-purple-600", textColor: "text-white" }
    return { label: "Hazardous", color: "bg-red-900", textColor: "text-white" }
  }

  const level = getAQILevel(aqi)

  const sizeClasses = {
    small: "w-16 h-16 text-sm",
    medium: "w-24 h-24 text-lg",
    large: "w-32 h-32 text-3xl",
  }

  return (
    <div
      className={`${sizeClasses[size]} ${level.color} ${level.textColor} rounded-full flex flex-col items-center justify-center font-bold shadow-lg`}
    >
      <div>{aqi}</div>
      <div className="text-xs mt-1 text-center px-2">{level.label}</div>
    </div>
  )
}
