import { useState } from 'react';
import { motion } from 'motion/react';

// ─────────────────────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────────────────────

export interface MuscleVisualizationProps {
  highlightedMuscles: string[];
  view?: 'front' | 'back';
  gender?: 'male' | 'female';
  onMuscleClick?: (muscleId: string) => void;
}

type MuscleView = 'front' | 'back' | 'both';

interface MuscleDef {
  id: string;
  label: string;
  view: MuscleView;
  paths: {
    male: string;
    female: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Muscle Path Definitions
// ViewBox: 0 0 200 440 — male/female differ only in hips, waist & shoulder width
// ─────────────────────────────────────────────────────────────────────────────

const MUSCLES: MuscleDef[] = [
  // ── FRONT ──────────────────────────────────────────────────────────────────

  // Anterior Deltoids (shoulders)
  {
    id: 'shoulders',
    label: 'Shoulders',
    view: 'front',
    paths: {
      male:   'M 58,82 C 48,78 42,86 44,96 C 46,104 55,108 64,104 C 70,101 72,94 68,88 Z ' +
              'M 142,82 C 152,78 158,86 156,96 C 154,104 145,108 136,104 C 130,101 128,94 132,88 Z',
      female: 'M 62,82 C 53,78 47,86 49,96 C 51,104 59,108 67,104 C 72,101 74,95 71,89 Z ' +
              'M 138,82 C 147,78 153,86 151,96 C 149,104 141,108 133,104 C 128,101 126,95 129,89 Z',
    },
  },

  // Chest — left pec + right pec
  {
    id: 'chest',
    label: 'Chest',
    view: 'front',
    paths: {
      male:   'M 68,90 C 66,96 66,110 72,120 C 79,130 92,132 98,126 C 98,114 96,98 92,90 C 84,86 72,86 68,90 Z ' +
              'M 132,90 C 134,96 134,110 128,120 C 121,130 108,132 102,126 C 102,114 104,98 108,90 C 116,86 128,86 132,90 Z',
      female: 'M 70,92 C 68,98 68,110 74,118 C 80,127 92,128 98,122 C 98,112 96,98 93,91 C 85,87 73,88 70,92 Z ' +
              'M 130,92 C 132,98 132,110 126,118 C 120,127 108,128 102,122 C 102,112 104,98 107,91 C 115,87 127,88 130,92 Z',
    },
  },

  // Biceps
  {
    id: 'biceps',
    label: 'Biceps',
    view: 'front',
    paths: {
      male:   'M 52,100 C 46,104 44,118 46,130 C 48,140 56,144 62,140 C 68,136 68,122 64,110 C 62,104 56,98 52,100 Z ' +
              'M 148,100 C 154,104 156,118 154,130 C 152,140 144,144 138,140 C 132,136 132,122 136,110 C 138,104 144,98 148,100 Z',
      female: 'M 55,100 C 50,104 48,117 50,128 C 52,137 59,141 64,138 C 69,134 69,121 66,110 C 64,104 58,98 55,100 Z ' +
              'M 145,100 C 150,104 152,117 150,128 C 148,137 141,141 136,138 C 131,134 131,121 134,110 C 136,104 142,98 145,100 Z',
    },
  },

  // Forearms
  {
    id: 'forearms',
    label: 'Forearms',
    view: 'front',
    paths: {
      male:   'M 48,142 C 44,148 43,162 45,174 C 47,182 54,186 59,183 C 64,180 65,166 63,154 C 61,146 54,140 48,142 Z ' +
              'M 152,142 C 156,148 157,162 155,174 C 153,182 146,186 141,183 C 136,180 135,166 137,154 C 139,146 146,140 152,142 Z',
      female: 'M 50,140 C 46,146 45,159 47,170 C 49,177 55,181 60,178 C 64,175 65,162 63,151 C 61,144 54,138 50,140 Z ' +
              'M 150,140 C 154,146 155,159 153,170 C 151,177 145,181 140,178 C 136,175 135,162 137,151 C 139,144 146,138 150,140 Z',
    },
  },

  // Abs — 6 segments (3 rows × 2 cols)
  {
    id: 'abs',
    label: 'Abs',
    view: 'front',
    paths: {
      male:   'M 87,128 C 85,130 85,138 87,140 C 90,142 97,142 99,140 C 101,138 101,130 99,128 C 96,126 89,126 87,128 Z ' +
              'M 101,128 C 99,130 99,138 101,140 C 104,142 111,142 113,140 C 115,138 115,130 113,128 C 110,126 103,126 101,128 Z ' +
              'M 86,143 C 84,145 84,153 86,155 C 89,157 97,157 99,155 C 101,153 101,145 99,143 C 96,141 88,141 86,143 Z ' +
              'M 101,143 C 99,145 99,153 101,155 C 104,157 112,157 114,155 C 116,153 116,145 114,143 C 111,141 103,141 101,143 Z ' +
              'M 87,158 C 85,160 85,168 87,170 C 90,172 97,172 99,170 C 101,168 101,160 99,158 C 96,156 89,156 87,158 Z ' +
              'M 101,158 C 99,160 99,168 101,170 C 104,172 111,172 113,170 C 115,168 115,160 113,158 C 110,156 103,156 101,158 Z',
      female: 'M 88,126 C 86,128 86,136 88,138 C 91,140 97,140 99,138 C 101,136 101,128 99,126 C 96,124 90,124 88,126 Z ' +
              'M 101,126 C 99,128 99,136 101,138 C 104,140 110,140 112,138 C 114,136 114,128 112,126 C 109,124 103,124 101,126 Z ' +
              'M 87,141 C 85,143 85,151 87,153 C 90,155 97,155 99,153 C 101,151 101,143 99,141 C 96,139 89,139 87,141 Z ' +
              'M 101,141 C 99,143 99,151 101,153 C 104,155 111,155 113,153 C 115,151 115,143 113,141 C 110,139 103,139 101,141 Z ' +
              'M 88,156 C 86,158 86,166 88,168 C 91,170 97,170 99,168 C 101,166 101,158 99,156 C 96,154 90,154 88,156 Z ' +
              'M 101,156 C 99,158 99,166 101,168 C 104,170 110,170 112,168 C 114,166 114,158 112,156 C 109,154 103,154 101,156 Z',
    },
  },

  // Obliques
  {
    id: 'obliques',
    label: 'Obliques',
    view: 'front',
    paths: {
      male:   'M 82,126 C 78,130 74,144 74,158 C 74,166 78,172 83,170 C 86,168 87,160 86,148 C 86,138 84,128 82,126 Z ' +
              'M 118,126 C 122,130 126,144 126,158 C 126,166 122,172 117,170 C 114,168 113,160 114,148 C 114,138 116,128 118,126 Z',
      female: 'M 83,124 C 79,128 75,140 74,154 C 73,164 77,172 83,172 C 87,170 89,160 88,148 C 87,136 85,126 83,124 Z ' +
              'M 117,124 C 121,128 125,140 126,154 C 127,164 123,172 117,172 C 113,170 111,160 112,148 C 113,136 115,126 117,124 Z',
    },
  },

  // Quads — rectus femoris + sweep
  {
    id: 'quads',
    label: 'Quads',
    view: 'front',
    paths: {
      male:   'M 74,190 C 68,196 65,218 66,238 C 67,252 73,260 80,258 C 87,256 90,244 89,228 C 88,212 82,192 74,190 Z ' +
              'M 83,190 C 80,196 80,218 82,236 C 84,248 90,254 95,250 C 99,246 98,228 95,212 C 93,200 88,188 83,190 Z ' +
              'M 117,190 C 120,196 120,218 118,236 C 116,248 110,254 105,250 C 101,246 102,228 105,212 C 107,200 112,188 117,190 Z ' +
              'M 126,190 C 132,196 135,218 134,238 C 133,252 127,260 120,258 C 113,256 110,244 111,228 C 112,212 118,192 126,190 Z',
      female: 'M 76,192 C 71,198 68,218 69,236 C 70,250 76,258 82,256 C 88,254 91,243 90,228 C 89,213 83,194 76,192 Z ' +
              'M 85,191 C 82,197 82,218 84,235 C 86,247 91,252 96,248 C 100,244 99,227 96,212 C 94,201 89,189 85,191 Z ' +
              'M 115,191 C 118,197 118,218 116,235 C 114,247 109,252 104,248 C 100,244 101,227 104,212 C 106,201 111,189 115,191 Z ' +
              'M 124,192 C 129,198 132,218 131,236 C 130,250 124,258 118,256 C 112,254 109,243 110,228 C 111,213 117,194 124,192 Z',
    },
  },

  // Calves
  {
    id: 'calves',
    label: 'Calves',
    view: 'front',
    paths: {
      male:   'M 70,270 C 65,278 64,300 66,316 C 68,328 75,334 81,330 C 87,326 88,308 86,294 C 84,280 76,266 70,270 Z ' +
              'M 130,270 C 135,278 136,300 134,316 C 132,328 125,334 119,330 C 113,326 112,308 114,294 C 116,280 124,266 130,270 Z',
      female: 'M 72,268 C 67,276 66,297 68,312 C 70,323 76,329 82,325 C 87,321 88,304 86,290 C 84,277 78,264 72,268 Z ' +
              'M 128,268 C 133,276 134,297 132,312 C 130,323 124,329 118,325 C 113,321 112,304 114,290 C 116,277 122,264 128,268 Z',
    },
  },

  // ── BACK ───────────────────────────────────────────────────────────────────

  // Traps
  {
    id: 'traps',
    label: 'Traps',
    view: 'back',
    paths: {
      male:   'M 80,80 C 80,72 86,68 100,66 C 114,68 120,72 120,80 C 120,90 116,98 108,102 C 104,104 100,104 100,104 C 100,104 96,104 92,102 C 84,98 80,90 80,80 Z',
      female: 'M 82,80 C 82,73 88,69 100,67 C 112,69 118,73 118,80 C 118,89 114,97 107,101 C 103,103 100,103 100,103 C 100,103 97,103 93,101 C 86,97 82,89 82,80 Z',
    },
  },

  // Lats
  {
    id: 'lats',
    label: 'Lats',
    view: 'back',
    paths: {
      male:   'M 68,98 C 62,104 58,118 60,136 C 62,148 70,156 80,152 C 88,148 90,136 88,122 C 86,108 78,94 68,98 Z ' +
              'M 132,98 C 138,104 142,118 140,136 C 138,148 130,156 120,152 C 112,148 110,136 112,122 C 114,108 122,94 132,98 Z',
      female: 'M 70,98 C 65,104 61,117 63,134 C 65,146 72,153 81,149 C 88,146 89,134 87,121 C 85,108 77,95 70,98 Z ' +
              'M 130,98 C 135,104 139,117 137,134 C 135,146 128,153 119,149 C 112,146 111,134 113,121 C 115,108 123,95 130,98 Z',
    },
  },

  // Triceps (back view)
  {
    id: 'triceps',
    label: 'Triceps',
    view: 'back',
    paths: {
      male:   'M 54,98 C 48,104 46,120 48,132 C 50,142 58,146 64,142 C 70,138 70,124 66,112 C 63,104 58,96 54,98 Z ' +
              'M 146,98 C 152,104 154,120 152,132 C 150,142 142,146 136,142 C 130,138 130,124 134,112 C 137,104 142,96 146,98 Z',
      female: 'M 56,98 C 51,103 49,118 51,129 C 53,138 60,142 65,138 C 70,134 70,121 67,110 C 65,103 60,96 56,98 Z ' +
              'M 144,98 C 149,103 151,118 149,129 C 147,138 140,142 135,138 C 130,134 130,121 133,110 C 135,103 140,96 144,98 Z',
    },
  },

  // Lower Back (erectors)
  {
    id: 'lower-back',
    label: 'Lower Back',
    view: 'back',
    paths: {
      male:   'M 88,142 C 86,148 85,162 86,174 C 87,182 92,186 96,184 C 99,182 100,172 100,162 L 100,142 C 96,138 90,138 88,142 Z ' +
              'M 112,142 C 114,148 115,162 114,174 C 113,182 108,186 104,184 C 101,182 100,172 100,162 L 100,142 C 104,138 110,138 112,142 Z',
      female: 'M 89,140 C 87,146 86,160 87,172 C 88,180 93,184 97,182 C 100,180 100,170 100,160 L 100,140 C 96,136 91,136 89,140 Z ' +
              'M 111,140 C 113,146 114,160 113,172 C 112,180 107,184 103,182 C 100,180 100,170 100,160 L 100,140 C 104,136 109,136 111,140 Z',
    },
  },

  // Glutes
  {
    id: 'glutes',
    label: 'Glutes',
    view: 'back',
    paths: {
      male:   'M 76,182 C 70,188 68,202 70,214 C 72,224 80,230 90,226 C 98,222 100,212 100,202 C 98,190 88,178 76,182 Z ' +
              'M 124,182 C 130,188 132,202 130,214 C 128,224 120,230 110,226 C 102,222 100,212 100,202 C 102,190 112,178 124,182 Z',
      female: 'M 72,180 C 65,186 62,202 65,216 C 68,228 78,234 90,229 C 98,224 100,213 100,202 C 98,188 86,175 72,180 Z ' +
              'M 128,180 C 135,186 138,202 135,216 C 132,228 122,234 110,229 C 102,224 100,213 100,202 C 102,188 114,175 128,180 Z',
    },
  },

  // Hamstrings
  {
    id: 'hamstrings',
    label: 'Hamstrings',
    view: 'back',
    paths: {
      male:   'M 72,232 C 67,240 64,262 66,280 C 68,294 76,300 83,296 C 90,292 92,274 90,258 C 88,244 80,228 72,232 Z ' +
              'M 128,232 C 133,240 136,262 134,280 C 132,294 124,300 117,296 C 110,292 108,274 110,258 C 112,244 120,228 128,232 Z',
      female: 'M 74,230 C 69,238 66,260 68,278 C 70,291 77,297 84,293 C 90,289 91,272 89,257 C 87,243 81,226 74,230 Z ' +
              'M 126,230 C 131,238 134,260 132,278 C 130,291 123,297 116,293 C 110,289 109,272 111,257 C 113,243 119,226 126,230 Z',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Body Silhouette Paths
// ─────────────────────────────────────────────────────────────────────────────

const BODY_OUTLINES = {
  front: {
    male: `
      M 100,10 C 86,10 78,20 78,32 C 78,44 86,54 100,56 C 114,54 122,44 122,32 C 122,20 114,10 100,10 Z
      M 96,56 C 92,58 88,60 88,62 L 84,70 L 66,82 C 54,90 48,102 48,116 L 48,178 C 48,180 50,182 52,182
      L 66,182 L 68,260 L 65,280 L 62,330 C 62,334 65,338 69,338 L 83,338 C 87,338 90,334 89,330 L 87,284 L 88,262
      L 95,190 L 100,190 L 105,190 L 112,262 L 113,284 L 111,330 C 110,334 113,338 117,338 L 131,338 C 135,338 138,334 138,330
      L 135,280 L 132,260 L 134,182 L 148,182 C 150,182 152,180 152,178 L 152,116
      C 152,102 146,90 134,82 L 116,70 L 112,62 C 112,60 108,58 104,56 Z
    `,
    female: `
      M 100,10 C 87,10 79,20 79,32 C 79,44 87,54 100,56 C 113,54 121,44 121,32 C 121,20 113,10 100,10 Z
      M 96,56 C 92,58 89,60 89,62 L 85,70 L 68,82 C 57,90 51,102 51,116 L 51,172
      C 51,178 56,184 62,184 L 66,184 C 64,194 62,208 63,222 C 64,238 74,248 80,248
      L 80,264 L 78,284 L 75,330 C 75,334 78,338 82,338 L 94,338 C 98,338 101,334 100,330 L 100,192
      L 100,192 L 100,330 C 99,334 102,338 106,338 L 118,338 C 122,338 125,334 125,330
      L 122,284 L 120,264 L 120,248 C 126,248 136,238 137,222 C 138,208 136,194 134,184
      L 138,184 C 144,184 149,178 149,172 L 149,116 C 149,102 143,90 132,82 L 115,70 L 111,62 C 111,60 108,58 104,56 Z
    `,
  },
  back: {
    male: `
      M 100,10 C 86,10 78,20 78,32 C 78,44 86,54 100,56 C 114,54 122,44 122,32 C 122,20 114,10 100,10 Z
      M 96,56 C 92,58 88,60 88,62 L 84,70 L 66,82 C 54,90 48,102 48,116 L 48,178 C 48,180 50,182 52,182
      L 66,182 L 68,260 L 65,280 L 62,330 C 62,334 65,338 69,338 L 83,338 C 87,338 90,334 89,330 L 87,284 L 88,262
      L 95,190 L 100,190 L 105,190 L 112,262 L 113,284 L 111,330 C 110,334 113,338 117,338 L 131,338 C 135,338 138,334 138,330
      L 135,280 L 132,260 L 134,182 L 148,182 C 150,182 152,180 152,178 L 152,116
      C 152,102 146,90 134,82 L 116,70 L 112,62 C 112,60 108,58 104,56 Z
    `,
    female: `
      M 100,10 C 87,10 79,20 79,32 C 79,44 87,54 100,56 C 113,54 121,44 121,32 C 121,20 113,10 100,10 Z
      M 96,56 C 92,58 89,60 89,62 L 85,70 L 68,82 C 57,90 51,102 51,116 L 51,172
      C 51,178 56,184 62,184 L 66,184 C 64,194 62,208 63,222 C 64,238 74,248 80,248
      L 80,264 L 78,284 L 75,330 C 75,334 78,338 82,338 L 94,338 C 98,338 101,334 100,330 L 100,192
      L 100,192 L 100,330 C 99,334 102,338 106,338 L 118,338 C 122,338 125,334 125,330
      L 122,284 L 120,264 L 120,248 C 126,248 136,238 137,222 C 138,208 136,194 134,184
      L 138,184 C 144,184 149,178 149,172 L 149,116 C 149,102 143,90 132,82 L 115,70 L 111,62 C 111,60 108,58 104,56 Z
    `,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function MuscleVisualization({
  highlightedMuscles,
  view = 'front',
  gender = 'male',
  onMuscleClick,
}: MuscleVisualizationProps) {
  const [internalView, setInternalView] = useState<'front' | 'back'>(view);
  const [internalGender, setInternalGender] = useState<'male' | 'female'>(gender);
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const isActive = (id: string) =>
    highlightedMuscles.includes(id) || hoveredMuscle === id;

  const visibleMuscles = MUSCLES.filter(
    (m) => m.view === internalView || m.view === 'both'
  );

  return (
    <div className="flex flex-col items-center gap-3 select-none">

      {/* ── Controls ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2 w-full justify-center flex-wrap">
        {/* View Toggle */}
        <div className="flex rounded-lg border border-cyan-500/20 overflow-hidden text-[10px] uppercase tracking-widest">
          {(['front', 'back'] as const).map((v, i) => (
            <button
              key={v}
              onClick={() => setInternalView(v)}
              className={`px-3 py-1.5 transition-all duration-200 ${
                i > 0 ? 'border-l border-cyan-500/20' : ''
              } ${
                internalView === v
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-cyan-500/40 hover:text-cyan-400/70 bg-transparent'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Gender Toggle */}
        <div className="flex rounded-lg border border-cyan-500/20 overflow-hidden text-[10px] uppercase tracking-widest">
          {(['male', 'female'] as const).map((g, i) => (
            <button
              key={g}
              onClick={() => setInternalGender(g)}
              className={`px-3 py-1.5 transition-all duration-200 ${
                i > 0 ? 'border-l border-cyan-500/20' : ''
              } ${
                internalGender === g
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'text-cyan-500/40 hover:text-cyan-400/70 bg-transparent'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── SVG Body ──────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[220px]">
        {highlightedMuscles.length > 0 && (
          <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
        )}

        <motion.svg
          key={`${internalView}-${internalGender}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          viewBox="0 0 200 350"
          style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }}
          overflow="visible"
        >
          <defs>
            <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="muscleHover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.5" />
            </linearGradient>
            <filter id="muscleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Body silhouette */}
          <path
            d={BODY_OUTLINES[internalView][internalGender]}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1"
            opacity="0.9"
          />

          {/* Muscle regions */}
          {visibleMuscles.map((muscle) => {
            const active = isActive(muscle.id);
            const hovered = hoveredMuscle === muscle.id;
            return (
              <g
                key={muscle.id}
                onClick={() => onMuscleClick?.(muscle.id)}
                onMouseEnter={() => setHoveredMuscle(muscle.id)}
                onMouseLeave={() => setHoveredMuscle(null)}
                style={{ cursor: onMuscleClick ? 'pointer' : 'default' }}
              >
                <path
                  d={muscle.paths[internalGender]}
                  fill={
                    active ? 'url(#muscleHighlight)' :
                    hovered ? 'url(#muscleHover)' : '#334155'
                  }
                  stroke={active ? '#22d3ee' : hovered ? '#67e8f9' : '#475569'}
                  strokeWidth={active ? 0.8 : 0.5}
                  opacity={active ? 1 : hovered ? 0.8 : 0.55}
                  filter={active ? 'url(#muscleGlow)' : undefined}
                  style={{ transition: 'fill 0.35s ease, opacity 0.35s ease, stroke 0.35s ease' }}
                />
                {active && (
                  <path
                    d={muscle.paths[internalGender]}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    opacity="0.3"
                    style={{ filter: 'blur(3px)' }}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* Outline stroke on top */}
          <path
            d={BODY_OUTLINES[internalView][internalGender]}
            fill="none"
            stroke="#475569"
            strokeWidth="0.8"
            opacity="0.5"
            pointerEvents="none"
          />
        </motion.svg>
      </div>

      {/* ── Active Muscle Legend ───────────────────────────────────────────── */}
      {highlightedMuscles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-1.5 justify-center max-w-[220px]"
        >
          {highlightedMuscles.map((id) => {
            const def = MUSCLES.find((m) => m.id === id);
            if (!def) return null;
            return (
              <span
                key={id}
                className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono"
              >
                {def.label}
              </span>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
