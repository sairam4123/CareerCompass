import React from "react";

type CircularProgressBarProps = {
  percentage: number; // Progress percentage (0 to 100)
  size?: number; // Size of the progress bar (diameter)
  strokeWidth?: number; // Width of the progress stroke
  color?: string; // Color of the progress stroke
  backgroundColor?: string; // Background circle color
};

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  size = 120,
  strokeWidth,
  color = "#4caf50",
  backgroundColor = "#e0e0e0",
}) => {
  // Dynamically calculate strokeWidth if not provided
  const calculatedStrokeWidth = strokeWidth || size * 0.1;
  const radius = (size - calculatedStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Calculate font size based on size and strokeWidth
  const fontSize = Math.min(size / 5, calculatedStrokeWidth * 2);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="circular-progress-bar"
      style={{ display: "block", margin: "auto" }}
    >
      {/* Background Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={calculatedStrokeWidth}
      />
      {/* Progress Circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={calculatedStrokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.35s" }}
      />
      {/* Percentage Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={`${fontSize}px`}
        fill="#333"
      >
        {`${Math.round(percentage)}`}
      </text>
    </svg>
  );
};

export default CircularProgressBar;
