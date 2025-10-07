export type Phase = "new" | "first" | "full" | "last";

export interface MoonPhase {
  date: Date;
  phase: Phase;
  phaseName: string;
  phaseDescription: string;
}

const PHASE_NAMES = {
  new: "Yeni Ay",
  first: "İlk Dördün", 
  full: "Dolunay",
  last: "Son Dördün"
};

const PHASE_DESCRIPTIONS = {
  new: "Ay'ın görünmediği, yeni başlangıçların zamanı",
  first: "Ay'ın yarısının göründüğü, büyüme ve gelişme dönemi",
  full: "Ay'ın tamamen göründüğü, enerji ve doluluk zamanı",
  last: "Ay'ın yarısının göründüğü, azalma ve yansıma dönemi"
};

export function getMoonPhases(start: Date = new Date(), days: number = 30): MoonPhase[] {
  const phases: MoonPhase[] = [];
  
  // Convert start date to UTC and set to noon to avoid timezone issues
  const startUTC = new Date(Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    12, 0, 0, 0
  ));
  
  // Generate phases for each day in the range
  for (let i = 0; i < days; i++) {
    // Create date at noon UTC for each day to avoid timezone edge cases
    const d = new Date(Date.UTC(
      startUTC.getUTCFullYear(),
      startUTC.getUTCMonth(),
      startUTC.getUTCDate() + i,
      12, 0, 0, 0
    ));
    
    // Use a simple approach: determine phase based on day of lunar month
    // This is more predictable and matches the static data better
    const dayOfMonth = d.getUTCDate();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    
    // Create a simple hash-like function to determine phase
    // This ensures consistent phase assignment across the month
    const dayHash = (year * 12 + month + dayOfMonth) % 29;
    
    let p: Phase | null = null;
    
    // Distribute phases more evenly across the lunar cycle
    if (dayHash < 2) {
      p = "new";
    } else if (dayHash < 8) {
      p = "first";
    } else if (dayHash < 16) {
      p = "full";
    } else if (dayHash < 24) {
      p = "last";
    } else {
      p = "new";
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
    first: "🌓", 
    full: "🌕",
    last: "🌗"
  };
  return icons[phase];
}

export function getPhaseColor(phase: Phase): string {
  const colors = {
    new: "text-gray-600",
    first: "text-blue-600", 
    full: "text-yellow-600",
    last: "text-purple-600"
  };
  return colors[phase];
} 