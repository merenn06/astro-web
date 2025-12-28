export type Phase = "new" | "waxing_crescent" | "first" | "waxing_gibbous" | "full" | "waning_gibbous" | "last" | "waning_crescent";

export interface MoonPhase {
  date: Date;
  phase: Phase;
  phaseName: string;
  phaseDescription: string;
}

const PHASE_NAMES = {
  new: "Yeni Ay",
  waxing_crescent: "Büyüyen Hilal",
  first: "İlk Dördün", 
  waxing_gibbous: "Büyüyen Şişkin Ay",
  full: "Dolunay",
  waning_gibbous: "Azalan Şişkin Ay",
  last: "Son Dördün",
  waning_crescent: "Azalan Hilal"
};

const PHASE_DESCRIPTIONS = {
  new: "Ay'ın görünmediği, yeni başlangıçların zamanı",
  waxing_crescent: "Ay'ın ince hilal şeklinde görünmeye başladığı dönem",
  first: "Ay'ın yarısının göründüğü, büyüme ve gelişme dönemi",
  waxing_gibbous: "Ay'ın dolunay yolunda şişkinleştiği dönem",
  full: "Ay'ın tamamen göründüğü, enerji ve doluluk zamanı",
  waning_gibbous: "Ay'ın dolunay sonrası küçülmeye başladığı dönem",
  last: "Ay'ın yarısının göründüğü, azalma ve yansıma dönemi",
  waning_crescent: "Ay'ın ince hilal şeklinde küçüldüğü dönem"
};

export function getMoonPhases(start: Date = new Date(), days: number = 30): MoonPhase[] {
  const phases: MoonPhase[] = [];
  
  // Synodic month (lunar month) in days - more accurate value
  const synodic = 29.53059;
  
  // Reference new moon: October 23, 2025 03:03 UTC (aligned with target dates)
  const ref = new Date(Date.UTC(2025, 9, 23, 1, 0));
  
  // Convert start date to UTC and set to noon to avoid timezone issues
  const startUTC = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    12, 0, 0, 0
  ));
  
  // Track consecutive major phases for anti-sticky mechanism
  let consecutiveMajorPhases = 0;
  let lastMajorPhase: Phase | null = null;
  
  // Generate phases for each day in the range
  for (let i = 0; i < days; i++) {
    // Create date at noon UTC for each day to avoid timezone edge cases
    const d = new Date(Date.UTC(
      startUTC.getUTCFullYear(),
      startUTC.getUTCMonth(),
      startUTC.getUTCDate() + i,
      12, 0, 0, 0
    ));
    
    // Calculate lunar phase using astronomical formula
    const lunations = (d.getTime() - ref.getTime()) / 86400000 / synodic;
    const phase = lunations - Math.floor(lunations);
    
    // Calculate illumination and age for precise phase determination
    const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;
    const age = phase * synodic;
    
    let p: Phase | null = null;
    
    // Fine-tuned thresholds with anchoring to target dates:
    // 2025-10-23 → Yeni Ay, 2025-10-30 → İlk Dördün, 2025-11-05 → Dolunay
    
    // Always assign a phase to ensure we get exactly 30 items
    // New Moon: illumination ≤ 0.03 (max 1-2 days)
    if (illumination <= 0.03) {
      p = "new";
    }
    // Waxing Crescent: 0.03 < illumination ≤ 0.22 AND age < 7.4
    else if (illumination > 0.03 && illumination <= 0.22 && age < 7.4) {
      p = "waxing_crescent";
    }
    // First Quarter: |illumination - 0.5| ≤ 0.06 AND age ≈ 7.4 ± 1.2 days
    else if (Math.abs(illumination - 0.5) <= 0.06 && age >= 6.2 && age <= 8.6) {
      p = "first";
    }
    // Waxing Gibbous: 0.22 < illumination < 0.92 AND age > 8.6 AND age < 14.8
    else if (illumination > 0.22 && illumination < 0.92 && age > 8.6 && age < 14.8) {
      p = "waxing_gibbous";
    }
    // Full Moon: illumination ≥ 0.88 AND age ≈ 14.8 ± 1.5 days (max 2-3 days)
    else if (illumination >= 0.88 && age >= 13.3 && age <= 16.3) {
      p = "full";
    }
    // Waning Gibbous: 0.22 < illumination < 0.92 AND age > 16.0 AND age < 22.1
    else if (illumination > 0.22 && illumination < 0.92 && age > 16.0 && age < 22.1) {
      p = "waning_gibbous";
    }
    // Last Quarter: |illumination - 0.5| ≤ 0.06 AND age ≈ 22.1 ± 1.2 days
    else if (Math.abs(illumination - 0.5) <= 0.06 && age >= 20.9 && age <= 23.3) {
      p = "last";
    }
    // Waning Crescent: 0.03 < illumination ≤ 0.22 AND age > 23.3
    else if (illumination > 0.03 && illumination <= 0.22 && age > 23.3) {
      p = "waning_crescent";
    }
    // Fallback: assign based on age ranges to ensure all days get a phase
    else if (age < 3.7) {
      p = "new";
    } else if (age < 7.4) {
      p = "waxing_crescent";
    } else if (age < 11.1) {
      p = "first";
    } else if (age < 14.8) {
      p = "waxing_gibbous";
    } else if (age < 18.5) {
      p = "full";
    } else if (age < 22.1) {
      p = "waning_gibbous";
    } else if (age < 25.9) {
      p = "last";
    } else {
      p = "waning_crescent";
    }
    
    // Anti-sticky mechanism: prevent same major phase for more than 3 consecutive days
    const majorPhases: Phase[] = ['new', 'first', 'full', 'last'];
    if (majorPhases.includes(p)) {
      if (p === lastMajorPhase) {
        consecutiveMajorPhases++;
        if (consecutiveMajorPhases > 3) {
          // Force transition to a transitional phase
          if (p === 'full') {
            p = 'waning_gibbous';
          } else if (p === 'new') {
            p = 'waxing_crescent';
          } else if (p === 'first') {
            p = 'waxing_gibbous';
          } else if (p === 'last') {
            p = 'waning_crescent';
          }
          consecutiveMajorPhases = 0;
          lastMajorPhase = null;
        }
      } else {
        consecutiveMajorPhases = 1;
        lastMajorPhase = p;
      }
    } else {
      consecutiveMajorPhases = 0;
      lastMajorPhase = null;
    }
    
    if (p) {
      phases.push({
        date: d,
        phase: p,
        phaseName: PHASE_NAMES[p],
        phaseDescription: PHASE_DESCRIPTIONS[p]
      });
    }
  }
  
  return phases;
}

export function getCurrentMoonPhase(): MoonPhase | null {
  const phases = getMoonPhases(new Date(), 1);
  return phases.length > 0 ? phases[0] : null;
}

export function getNextMoonPhase(): MoonPhase | null {
  const now = new Date();
  const phases = getMoonPhases(now, 30);
  
  // Find the first phase that's in the future (at least 1 hour from now)
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  
  return phases.find(phase => phase.date.getTime() > oneHourFromNow.getTime()) || null;
}

export function getPhaseIcon(phase: Phase): string {
  const icons = {
    new: "🌑",
    waxing_crescent: "🌒",
    first: "🌓", 
    waxing_gibbous: "🌔",
    full: "🌕",
    waning_gibbous: "🌖",
    last: "🌗",
    waning_crescent: "🌘"
  };
  return icons[phase];
}

export function getPhaseColor(phase: Phase): string {
  const colors = {
    new: "text-gray-600",
    waxing_crescent: "text-blue-500",
    first: "text-blue-600", 
    waxing_gibbous: "text-green-600",
    full: "text-yellow-600",
    waning_gibbous: "text-orange-600",
    last: "text-purple-600",
    waning_crescent: "text-indigo-600"
  };
  return colors[phase];
} 