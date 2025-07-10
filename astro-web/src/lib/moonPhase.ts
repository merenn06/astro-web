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
  
  // Synodic month (lunar month) in days
  const synodic = 29.530588853;
  
  // Reference new moon: January 6, 2000 18:14 UTC
  const ref = new Date(Date.UTC(2000, 0, 6, 18, 14));
  
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    
    // Calculate lunar phase
    const lunations = (d.getTime() - ref.getTime()) / 86400000 / synodic;
    const phase = lunations - Math.floor(lunations);
    
    let p: Phase | null = null;
    
    // Determine phase based on lunar cycle position
    if (phase < 0.05 || phase > 0.95) {
      p = "new";
    } else if (phase < 0.30) {
      p = "first";
    } else if (phase < 0.55) {
      p = "full";
    } else if (phase < 0.80) {
      p = "last";
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
  const phases = getMoonPhases(new Date(), 30);
  return phases.length > 0 ? phases[0] : null;
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