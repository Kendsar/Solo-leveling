interface MuscleVisualizationProps {
  highlightedMuscles: string[];
}

export function MuscleVisualization({ highlightedMuscles }: MuscleVisualizationProps) {
  const isHighlighted = (muscleId: string) => highlightedMuscles.includes(muscleId);

  return (
    <div className="flex justify-center items-center p-4">
      <svg
        width="200"
        height="400"
        viewBox="0 0 200 400"
        className="drop-shadow-lg"
      >
        {/* Head */}
        <ellipse cx="100" cy="30" rx="20" ry="25" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />

        {/* Neck */}
        <rect x="90" y="50" width="20" height="15" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />

        {/* Shoulders */}
        <ellipse
          cx="70"
          cy="75"
          rx="18"
          ry="12"
          fill={isHighlighted('shoulders') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <ellipse
          cx="130"
          cy="75"
          rx="18"
          ry="12"
          fill={isHighlighted('shoulders') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Chest */}
        <path
          d="M75 90 Q95 100 100 80 Q105 100 125 90 L120 130 Q100 140 80 130 Z"
          fill={isHighlighted('chest') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Abs */}
        <rect
          x="85"
          y="120"
          width="30"
          height="15"
          rx="3"
          fill={isHighlighted('abs') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <rect
          x="85"
          y="138"
          width="30"
          height="15"
          rx="3"
          fill={isHighlighted('abs') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <rect
          x="85"
          y="156"
          width="30"
          height="15"
          rx="3"
          fill={isHighlighted('abs') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Obliques */}
        <path
          d="M 78 120 L 70 130 L 72 170 L 82 170 Z"
          fill={isHighlighted('obliques') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="1"
          className="transition-colors duration-300"
        />
        <path
          d="M 122 120 L 130 130 L 128 170 L 118 170 Z"
          fill={isHighlighted('obliques') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="1"
          className="transition-colors duration-300"
        />

        {/* Biceps */}
        <ellipse
          cx="58"
          cy="110"
          rx="10"
          ry="20"
          fill={isHighlighted('biceps') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <ellipse
          cx="142"
          cy="110"
          rx="10"
          ry="20"
          fill={isHighlighted('biceps') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Forearms */}
        <rect
          x="50"
          y="135"
          width="12"
          height="35"
          rx="6"
          fill={isHighlighted('forearms') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="1"
          className="transition-colors duration-300"
        />
        <rect
          x="138"
          y="135"
          width="12"
          height="35"
          rx="6"
          fill={isHighlighted('forearms') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="1"
          className="transition-colors duration-300"
        />

        {/* Quads */}
        <rect
          x="75"
          y="180"
          width="18"
          height="70"
          rx="9"
          fill={isHighlighted('quads') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <rect
          x="107"
          y="180"
          width="18"
          height="70"
          rx="9"
          fill={isHighlighted('quads') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Calves */}
        <ellipse
          cx="84"
          cy="280"
          rx="8"
          ry="30"
          fill={isHighlighted('calves') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />
        <ellipse
          cx="116"
          cy="280"
          rx="8"
          ry="30"
          fill={isHighlighted('calves') ? '#ef4444' : '#d1d5db'}
          stroke="#9ca3af"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Back view elements (simplified - shown as outlines behind) */}
        {/* Traps */}
        <path
          d="M 85 68 L 100 65 L 115 68 L 115 80 L 100 78 L 85 80 Z"
          fill={isHighlighted('traps') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.6"
          className="transition-colors duration-300"
        />

        {/* Lats */}
        <path
          d="M 78 90 L 70 100 L 75 135 L 85 125 Z"
          fill={isHighlighted('lats') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <path
          d="M 122 90 L 130 100 L 125 135 L 115 125 Z"
          fill={isHighlighted('lats') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />

        {/* Lower Back */}
        <rect
          x="85"
          y="135"
          width="30"
          height="35"
          rx="3"
          fill={isHighlighted('lower-back') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.4"
          className="transition-colors duration-300"
        />

        {/* Glutes */}
        <ellipse
          cx="88"
          cy="175"
          rx="10"
          ry="12"
          fill={isHighlighted('glutes') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <ellipse
          cx="112"
          cy="175"
          rx="10"
          ry="12"
          fill={isHighlighted('glutes') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />

        {/* Hamstrings */}
        <rect
          x="77"
          y="195"
          width="14"
          height="50"
          rx="7"
          fill={isHighlighted('hamstrings') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <rect
          x="109"
          y="195"
          width="14"
          height="50"
          rx="7"
          fill={isHighlighted('hamstrings') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />

        {/* Triceps (back of arm) */}
        <ellipse
          cx="60"
          cy="105"
          rx="6"
          ry="15"
          fill={isHighlighted('triceps') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <ellipse
          cx="140"
          cy="105"
          rx="6"
          ry="15"
          fill={isHighlighted('triceps') ? '#ef4444' : '#e5e7eb'}
          stroke="#9ca3af"
          strokeWidth="1"
          opacity="0.5"
          className="transition-colors duration-300"
        />
      </svg>
    </div>
  );
}
