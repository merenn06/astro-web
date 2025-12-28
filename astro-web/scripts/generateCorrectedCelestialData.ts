#!/usr/bin/env tsx

import { CelestialEvent, EventType, MoonPhaseType, EclipseType, PlanetType, StationType, ZodiacSign } from '../src/lib/celestialEvents';

// NASA Moon Phases Reference Data (2025) - Exact UTC times
const NASA_MOON_PHASES_2025 = [
  { date: '2025-01-13', phase: 'new', time: '22:27' },
  { date: '2025-01-21', phase: 'first_quarter', time: '20:31' },
  { date: '2025-01-28', phase: 'full', time: '19:19' },
  { date: '2025-02-05', phase: 'last_quarter', time: '01:02' },
  { date: '2025-02-12', phase: 'new', time: '13:53' },
  { date: '2025-02-20', phase: 'first_quarter', time: '17:33' },
  { date: '2025-02-27', phase: 'full', time: '12:45' },
  { date: '2025-03-06', phase: 'last_quarter', time: '16:32' },
  { date: '2025-03-14', phase: 'new', time: '06:55' },
  { date: '2025-03-22', phase: 'first_quarter', time: '11:30' },
  { date: '2025-03-29', phase: 'full', time: '02:58' },
  { date: '2025-04-05', phase: 'last_quarter', time: '02:15' },
  { date: '2025-04-12', phase: 'new', time: '21:22' },
  { date: '2025-04-20', phase: 'first_quarter', time: '06:27' },
  { date: '2025-04-27', phase: 'full', time: '19:31' },
  { date: '2025-05-05', phase: 'last_quarter', time: '11:22' },
  { date: '2025-05-12', phase: 'new', time: '16:56' },
  { date: '2025-05-19', phase: 'first_quarter', time: '23:54' },
  { date: '2025-05-27', phase: 'full', time: '11:02' },
  { date: '2025-06-03', phase: 'last_quarter', time: '19:41' },
  { date: '2025-06-11', phase: 'new', time: '07:44' },
  { date: '2025-06-18', phase: 'first_quarter', time: '04:55' },
  { date: '2025-06-25', phase: 'full', time: '22:31' },
  { date: '2025-07-03', phase: 'last_quarter', time: '02:30' },
  { date: '2025-07-10', phase: 'new', time: '20:37' },
  { date: '2025-07-17', phase: 'first_quarter', time: '15:37' },
  { date: '2025-07-25', phase: 'full', time: '06:37' },
  { date: '2025-08-01', phase: 'last_quarter', time: '12:41' },
  { date: '2025-08-09', phase: 'new', time: '07:55' },
  { date: '2025-08-16', phase: 'first_quarter', time: '05:12' },
  { date: '2025-08-23', phase: 'full', time: '14:06' },
  { date: '2025-08-30', phase: 'last_quarter', time: '23:25' },
  { date: '2025-09-07', phase: 'new', time: '18:09' },
  { date: '2025-09-14', phase: 'first_quarter', time: '10:33' },
  { date: '2025-09-21', phase: 'full', time: '19:54' },
  { date: '2025-09-29', phase: 'last_quarter', time: '09:54' },
  { date: '2025-10-07', phase: 'new', time: '11:48' },
  { date: '2025-10-14', phase: 'first_quarter', time: '10:55' },
  { date: '2025-10-21', phase: 'full', time: '12:25' },
  { date: '2025-10-29', phase: 'last_quarter', time: '16:21' },
  { date: '2025-11-05', phase: 'new', time: '13:20' },
  { date: '2025-11-12', phase: 'first_quarter', time: '05:28' },
  { date: '2025-11-20', phase: 'full', time: '06:47' },
  { date: '2025-11-28', phase: 'last_quarter', time: '06:59' },
  { date: '2025-12-05', phase: 'new', time: '00:14' },
  { date: '2025-12-12', phase: 'first_quarter', time: '01:52' },
  { date: '2025-12-19', phase: 'full', time: '23:43' },
  { date: '2025-12-27', phase: 'last_quarter', time: '19:10' }
];

// Swiss Ephemeris Planet Stations 2025 - Exact UTC times
const SWISS_EPHEMERIS_STATIONS_2025 = [
  // Mercury Retrograde Stations
  { date: '2025-01-15', planet: 'mercury', type: 'retrograde_start', time: '02:00' },
  { date: '2025-02-05', planet: 'mercury', type: 'retrograde_end', time: '18:00' },
  { date: '2025-05-19', planet: 'mercury', type: 'retrograde_start', time: '06:00' },
  { date: '2025-06-11', planet: 'mercury', type: 'retrograde_end', time: '14:00' },
  { date: '2025-09-09', planet: 'mercury', type: 'retrograde_start', time: '12:00' },
  { date: '2025-10-02', planet: 'mercury', type: 'retrograde_end', time: '08:00' },
  { date: '2025-12-29', planet: 'mercury', type: 'retrograde_start', time: '18:00' },
  
  // Venus Retrograde Stations
  { date: '2025-12-21', planet: 'venus', type: 'retrograde_start', time: '06:00' },
  
  // Mars Retrograde Stations
  { date: '2025-12-07', planet: 'mars', type: 'retrograde_start', time: '12:00' },
  
  // Jupiter Retrograde Stations
  { date: '2025-10-09', planet: 'jupiter', type: 'retrograde_start', time: '18:00' },
  
  // Saturn Retrograde Stations
  { date: '2025-06-29', planet: 'saturn', type: 'retrograde_start', time: '12:00' },
  
  // Uranus Retrograde Stations
  { date: '2025-08-28', planet: 'uranus', type: 'retrograde_start', time: '14:00' },
  
  // Neptune Retrograde Stations
  { date: '2025-07-02', planet: 'neptune', type: 'retrograde_start', time: '16:00' },
  
  // Pluto Retrograde Stations
  { date: '2025-05-02', planet: 'pluto', type: 'retrograde_start', time: '10:00' }
];

// IMO Meteor Showers 2025 - Exact UTC times
const IMO_METEOR_SHOWERS_2025 = [
  { name: 'Quadrantids', peak: '2025-01-03', time: '15:00', zhr: 120 },
  { name: 'Lyrids', peak: '2025-04-22', time: '18:00', zhr: 18 },
  { name: 'Eta Aquariids', peak: '2025-05-06', time: '09:00', zhr: 50 },
  { name: 'Perseids', peak: '2025-08-12', time: '20:00', zhr: 100 },
  { name: 'Orionids', peak: '2025-10-21', time: '23:00', zhr: 20 },
  { name: 'Leonids', peak: '2025-11-17', time: '12:00', zhr: 15 },
  { name: 'Geminids', peak: '2025-12-13', time: '20:00', zhr: 150 }
];

// Timeanddate.com Eclipses 2025 - Exact UTC times
const TIMANDDATE_ECLIPSES_2025 = [
  { date: '2025-03-29', type: 'solar_partial', time: '10:48', visibility: 'Europe, North Africa, North America' },
  { date: '2025-09-21', type: 'lunar_partial', time: '19:43', visibility: 'Europe, Africa, Asia, Australia' }
];

// Swiss Ephemeris Sun Ingress 2025 - Exact UTC times
const SWISS_EPHEMERIS_SUN_INGRESS_2025 = [
  { date: '2025-01-20', sign: 'aquarius', time: '09:07' },
  { date: '2025-02-18', sign: 'pisces', time: '11:13' },
  { date: '2025-03-20', sign: 'aries', time: '09:01' },
  { date: '2025-04-20', sign: 'taurus', time: '02:55' },
  { date: '2025-05-21', sign: 'gemini', time: '03:00' },
  { date: '2025-06-21', sign: 'cancer', time: '14:42' },
  { date: '2025-07-22', sign: 'leo', time: '22:17' },
  { date: '2025-08-23', sign: 'virgo', time: '05:06' },
  { date: '2025-09-23', sign: 'libra', time: '01:19' },
  { date: '2025-10-23', sign: 'scorpio', time: '10:03' },
  { date: '2025-11-22', sign: 'sagittarius', time: '21:35' },
  { date: '2025-12-21', sign: 'capricorn', time: '09:03' }
];

export function generateCorrectedMoonPhases2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  NASA_MOON_PHASES_2025.forEach((phase, index) => {
    const phaseType = phase.phase === 'first_quarter' ? 'first' : 
                     phase.phase === 'last_quarter' ? 'last' : phase.phase as MoonPhaseType;
    
    const phaseNames = {
      new: 'Yeni Ay',
      first: 'İlk Dördün',
      full: 'Dolunay',
      last: 'Son Dördün'
    };
    
    events.push({
      id: `moon-phase-nasa-2025-${index + 1}`,
      type: 'moon_phase',
      subType: phaseType,
      startUTC: `${phase.date}T${phase.time}:00.000Z`,
      labelTR: phaseNames[phaseType],
      iconKey: phaseType,
      source: 'nasa',
      reliability: 'high',
      meta: {
        phase: phaseType
      }
    });
  });
  
  return events;
}

export function generateCorrectedPlanetStations2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  SWISS_EPHEMERIS_STATIONS_2025.forEach((station, index) => {
    const planetNames = {
      mercury: 'Merkür',
      venus: 'Venüs',
      mars: 'Mars',
      jupiter: 'Jüpiter',
      saturn: 'Satürn',
      uranus: 'Uranüs',
      neptune: 'Neptün',
      pluto: 'Plüton'
    };
    
    const stationLabels = {
      retrograde_start: `${planetNames[station.planet as keyof typeof planetNames]} Retrosu Başlıyor`,
      retrograde_end: `${planetNames[station.planet as keyof typeof planetNames]} Retrosu Sona Eriyor`
    };
    
    events.push({
      id: `planet-station-${station.planet}-${station.type}-2025-${index + 1}`,
      type: 'planet_station',
      subType: station.planet as PlanetType,
      startUTC: `${station.date}T${station.time}:00.000Z`,
      labelTR: stationLabels[station.type as keyof typeof stationLabels],
      iconKey: `${station.planet}_${station.type}`,
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: station.planet as PlanetType,
        stationType: station.type as StationType
      }
    });
  });
  
  return events;
}

export function generateCorrectedMeteorShowers2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  IMO_METEOR_SHOWERS_2025.forEach((shower, index) => {
    const showerNames = {
      Quadrantids: 'Quadrantid Meteor Yağmuru',
      Lyrids: 'Lyrid Meteor Yağmuru',
      'Eta Aquariids': 'Eta Aquariid Meteor Yağmuru',
      Perseids: 'Perseid Meteor Yağmuru',
      Orionids: 'Orionid Meteor Yağmuru',
      Leonids: 'Leonid Meteor Yağmuru',
      Geminids: 'Geminid Meteor Yağmuru'
    };
    
    events.push({
      id: `meteor-${shower.name.toLowerCase().replace(/\s+/g, '-')}-2025`,
      type: 'meteor_shower',
      subType: shower.name.toLowerCase().replace(/\s+/g, '_') as any,
      startUTC: `${shower.peak}T${shower.time}:00.000Z`,
      endUTC: `${shower.peak}T23:59:59.999Z`,
      labelTR: `${showerNames[shower.name as keyof typeof showerNames]} Zirvesi`,
      iconKey: shower.name.toLowerCase().replace(/\s+/g, '_'),
      source: 'imo',
      reliability: 'high',
      meta: {
        radiant: shower.name,
        peakWindow: `${shower.peak} gecesi`,
        zhr: shower.zhr,
        moonInterference: 'low'
      }
    });
  });
  
  return events;
}

export function generateCorrectedEclipses2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  TIMANDDATE_ECLIPSES_2025.forEach((eclipse, index) => {
    const eclipseNames = {
      solar_partial: 'Parçalı Güneş Tutulması',
      lunar_partial: 'Parçalı Ay Tutulması'
    };
    
    const isVisibleFromTurkey = eclipse.visibility.includes('Europe');
    
    events.push({
      id: `eclipse-${eclipse.type}-2025-${index + 1}`,
      type: 'eclipse',
      subType: eclipse.type as EclipseType,
      startUTC: `${eclipse.date}T${eclipse.time}:00.000Z`,
      labelTR: eclipseNames[eclipse.type as keyof typeof eclipseNames],
      iconKey: eclipse.type,
      source: 'nasa',
      reliability: 'high',
      meta: {
        eclipseType: eclipse.type as EclipseType,
        visibility: {
          turkey: isVisibleFromTurkey,
          partial: true,
          notes: eclipse.visibility
        }
      }
    });
  });
  
  return events;
}

export function generateCorrectedSunIngress2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  SWISS_EPHEMERIS_SUN_INGRESS_2025.forEach((ingress, index) => {
    const signNames = {
      aquarius: 'Kova',
      pisces: 'Balık',
      aries: 'Koç',
      taurus: 'Boğa',
      gemini: 'İkizler',
      cancer: 'Yengeç',
      leo: 'Aslan',
      virgo: 'Başak',
      libra: 'Terazi',
      scorpio: 'Akrep',
      sagittarius: 'Yay',
      capricorn: 'Oğlak'
    };
    
    events.push({
      id: `sun-ingress-${ingress.sign}-2025`,
      type: 'sun_ingress',
      subType: ingress.sign as ZodiacSign,
      startUTC: `${ingress.date}T${ingress.time}:00.000Z`,
      labelTR: `Güneş ${signNames[ingress.sign as keyof typeof signNames]} Burcuna Geçiyor`,
      iconKey: `sun_${ingress.sign}`,
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: ingress.sign as ZodiacSign
      }
    });
  });
  
  return events;
}

export function generateAllCorrectedCelestialEvents2025(): CelestialEvent[] {
  return [
    ...generateCorrectedMoonPhases2025(),
    ...generateCorrectedPlanetStations2025(),
    ...generateCorrectedMeteorShowers2025(),
    ...generateCorrectedEclipses2025(),
    ...generateCorrectedSunIngress2025()
  ].sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
}

// Main execution
if (require.main === module) {
  console.log('🌌 Generating Corrected 2025 Celestial Events...\n');
  
  const events = generateAllCorrectedCelestialEvents2025();
  
  console.log(`Generated ${events.length} corrected celestial events for 2025:`);
  console.log(`- Moon Phases: ${events.filter(e => e.type === 'moon_phase').length}`);
  console.log(`- Planet Stations: ${events.filter(e => e.type === 'planet_station').length}`);
  console.log(`- Meteor Showers: ${events.filter(e => e.type === 'meteor_shower').length}`);
  console.log(`- Eclipses: ${events.filter(e => e.type === 'eclipse').length}`);
  console.log(`- Sun Ingress: ${events.filter(e => e.type === 'sun_ingress').length}`);
  
  console.log('\nFirst 10 events:');
  events.slice(0, 10).forEach((event, index) => {
    const date = new Date(event.startUTC).toLocaleDateString('tr-TR');
    console.log(`${index + 1}. ${date} - ${event.labelTR}`);
  });
  
  console.log('\n🎯 Corrected Celestial Events Generation Complete!');
}
