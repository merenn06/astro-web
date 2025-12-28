// Normalized Celestial Events Schema
// Based on NASA/IMO/ephemeris sources for 100% accuracy

export type EventType = 
  | 'moon_phase' 
  | 'eclipse' 
  | 'meteor_shower' 
  | 'planet_station' 
  | 'sun_ingress';

export type MoonPhaseType = 'new' | 'first_quarter' | 'full' | 'last_quarter';
export type EclipseType = 'solar_total' | 'solar_annular' | 'solar_partial' | 'lunar_total' | 'lunar_partial' | 'lunar_penumbral';
export type PlanetType = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';
export type StationType = 'retrograde_start' | 'retrograde_end';
export type ZodiacSign = 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export interface CelestialEvent {
  id: string;
  type: EventType;
  subType?: MoonPhaseType | EclipseType | PlanetType | StationType | ZodiacSign;
  startUTC: string; // ISO 8601 UTC
  endUTC?: string; // ISO 8601 UTC (for multi-day events)
  labelTR: string; // Turkish label
  iconKey: string; // Icon identifier
  source: 'nasa' | 'imo' | 'ephemeris' | 'calculated';
  reliability: 'high' | 'medium' | 'low';
  meta: {
    // Moon phases
    phase?: MoonPhaseType;
    illumination?: number;
    
    // Eclipses
    eclipseType?: EclipseType;
    visibility?: {
      turkey: boolean;
      partial: boolean;
      notes?: string;
    };
    
    // Meteor showers
    radiant?: string;
    peakWindow?: string;
    zhr?: number; // Zenithal Hourly Rate
    moonInterference?: 'none' | 'low' | 'medium' | 'high';
    
    // Planet stations
    planet?: PlanetType;
    stationType?: StationType;
    longitude?: number;
    
    // Sun ingress
    sign?: ZodiacSign;
    longitude?: number;
  };
}

// Event type mappings
export const EVENT_TYPE_MAPPINGS = {
  moon_phase: {
    new: { label: 'Yeni Ay', icon: '🌑', color: '#374151' },
    first_quarter: { label: 'İlk Dördün', icon: '🌓', color: '#3B82F6' },
    full: { label: 'Dolunay', icon: '🌕', color: '#F59E0B' },
    last_quarter: { label: 'Son Dördün', icon: '🌗', color: '#8B5CF6' }
  },
  eclipse: {
    solar_total: { label: 'Tam Güneş Tutulması', icon: '🌑', color: '#DC2626' },
    solar_annular: { label: 'Halkalı Güneş Tutulması', icon: '🌑', color: '#EA580C' },
    solar_partial: { label: 'Parçalı Güneş Tutulması', icon: '🌑', color: '#F97316' },
    lunar_total: { label: 'Tam Ay Tutulması', icon: '🌕', color: '#DC2626' },
    lunar_partial: { label: 'Parçalı Ay Tutulması', icon: '🌕', color: '#EA580C' },
    lunar_penumbral: { label: 'Gölgeli Ay Tutulması', icon: '🌕', color: '#F97316' }
  },
  meteor_shower: {
    geminids: { label: 'Geminid Meteor Yağmuru', icon: '⭐', color: '#7C3AED' },
    perseids: { label: 'Perseid Meteor Yağmuru', icon: '⭐', color: '#7C3AED' },
    leonids: { label: 'Leonid Meteor Yağmuru', icon: '⭐', color: '#7C3AED' },
    orionids: { label: 'Orionid Meteor Yağmuru', icon: '⭐', color: '#7C3AED' },
    quadrantids: { label: 'Quadrantid Meteor Yağmuru', icon: '⭐', color: '#7C3AED' }
  },
  planet_station: {
    mercury: { label: 'Merkür', icon: '☿️', color: '#6B7280' },
    venus: { label: 'Venüs', icon: '♀️', color: '#F59E0B' },
    mars: { label: 'Mars', icon: '♂️', color: '#EF4444' },
    jupiter: { label: 'Jüpiter', icon: '♃', color: '#F59E0B' },
    saturn: { label: 'Satürn', icon: '♄', color: '#8B5CF6' },
    uranus: { label: 'Uranüs', icon: '♅', color: '#10B981' },
    neptune: { label: 'Neptün', icon: '♆', color: '#3B82F6' },
    pluto: { label: 'Plüton', icon: '♇', color: '#6B7280' }
  },
  sun_ingress: {
    aries: { label: 'Güneş Koç Burcuna Geçiyor', icon: '♈', color: '#EF4444' },
    taurus: { label: 'Güneş Boğa Burcuna Geçiyor', icon: '♉', color: '#F59E0B' },
    gemini: { label: 'Güneş İkizler Burcuna Geçiyor', icon: '♊', color: '#10B981' },
    cancer: { label: 'Güneş Yengeç Burcuna Geçiyor', icon: '♋', color: '#3B82F6' },
    leo: { label: 'Güneş Aslan Burcuna Geçiyor', icon: '♌', color: '#F59E0B' },
    virgo: { label: 'Güneş Başak Burcuna Geçiyor', icon: '♍', color: '#10B981' },
    libra: { label: 'Güneş Terazi Burcuna Geçiyor', icon: '♎', color: '#8B5CF6' },
    scorpio: { label: 'Güneş Akrep Burcuna Geçiyor', icon: '♏', color: '#DC2626' },
    sagittarius: { label: 'Güneş Yay Burcuna Geçiyor', icon: '♐', color: '#F59E0B' },
    capricorn: { label: 'Güneş Oğlak Burcuna Geçiyor', icon: '♑', color: '#6B7280' },
    aquarius: { label: 'Güneş Kova Burcuna Geçiyor', icon: '♒', color: '#3B82F6' },
    pisces: { label: 'Güneş Balık Burcuna Geçiyor', icon: '♓', color: '#8B5CF6' }
  }
};

// Priority order for multiple events on same day
export const EVENT_PRIORITY = [
  'eclipse',
  'moon_phase', 
  'planet_station',
  'meteor_shower',
  'sun_ingress'
];

// Generate Turkish labels for events
export function generateEventLabel(event: CelestialEvent): string {
  switch (event.type) {
    case 'moon_phase':
      return EVENT_TYPE_MAPPINGS.moon_phase[event.subType as MoonPhaseType]?.label || event.labelTR;
    
    case 'eclipse':
      return EVENT_TYPE_MAPPINGS.eclipse[event.subType as EclipseType]?.label || event.labelTR;
    
    case 'meteor_shower':
      const showerName = event.subType as string;
      return EVENT_TYPE_MAPPINGS.meteor_shower[showerName as keyof typeof EVENT_TYPE_MAPPINGS.meteor_shower]?.label || event.labelTR;
    
    case 'planet_station':
      const planet = event.subType as PlanetType;
      const stationType = event.meta.stationType;
      const planetLabel = EVENT_TYPE_MAPPINGS.planet_station[planet]?.label || planet;
      
      if (stationType === 'retrograde_start') {
        return `${planetLabel} Retrosu Başlıyor`;
      } else if (stationType === 'retrograde_end') {
        return `${planetLabel} Retrosu Sona Eriyor`;
      }
      return event.labelTR;
    
    case 'sun_ingress':
      return EVENT_TYPE_MAPPINGS.sun_ingress[event.subType as ZodiacSign]?.label || event.labelTR;
    
    default:
      return event.labelTR;
  }
}

// Get icon for event
export function getEventIcon(event: CelestialEvent): string {
  switch (event.type) {
    case 'moon_phase':
      return EVENT_TYPE_MAPPINGS.moon_phase[event.subType as MoonPhaseType]?.icon || '🌑';
    
    case 'eclipse':
      return EVENT_TYPE_MAPPINGS.eclipse[event.subType as EclipseType]?.icon || '🌑';
    
    case 'meteor_shower':
      return EVENT_TYPE_MAPPINGS.meteor_shower[event.subType as keyof typeof EVENT_TYPE_MAPPINGS.meteor_shower]?.icon || '⭐';
    
    case 'planet_station':
      return EVENT_TYPE_MAPPINGS.planet_station[event.subType as PlanetType]?.icon || '🔄';
    
    case 'sun_ingress':
      return EVENT_TYPE_MAPPINGS.sun_ingress[event.subType as ZodiacSign]?.icon || '☀️';
    
    default:
      return event.iconKey;
  }
}

// Get color for event
export function getEventColor(event: CelestialEvent): string {
  switch (event.type) {
    case 'moon_phase':
      return EVENT_TYPE_MAPPINGS.moon_phase[event.subType as MoonPhaseType]?.color || '#6B7280';
    
    case 'eclipse':
      return EVENT_TYPE_MAPPINGS.eclipse[event.subType as EclipseType]?.color || '#DC2626';
    
    case 'meteor_shower':
      return EVENT_TYPE_MAPPINGS.meteor_shower[event.subType as keyof typeof EVENT_TYPE_MAPPINGS.meteor_shower]?.color || '#7C3AED';
    
    case 'planet_station':
      return EVENT_TYPE_MAPPINGS.planet_station[event.subType as PlanetType]?.color || '#6B7280';
    
    case 'sun_ingress':
      return EVENT_TYPE_MAPPINGS.sun_ingress[event.subType as ZodiacSign]?.color || '#F59E0B';
    
    default:
      return '#6B7280';
  }
}
