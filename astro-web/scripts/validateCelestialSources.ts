#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { CelestialEvent } from '../src/lib/celestialEvents';

// Load current celestial events
function loadCurrentEvents(): CelestialEvent[] {
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  return JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
}

// NASA Moon Phases Reference Data (2025)
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

// Swiss Ephemeris Planet Stations 2025
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

// IMO Meteor Showers 2025
const IMO_METEOR_SHOWERS_2025 = [
  { name: 'Quadrantids', peak: '2025-01-03', time: '15:00', zhr: 120 },
  { name: 'Lyrids', peak: '2025-04-22', time: '18:00', zhr: 18 },
  { name: 'Eta Aquariids', peak: '2025-05-06', time: '09:00', zhr: 50 },
  { name: 'Perseids', peak: '2025-08-12', time: '20:00', zhr: 100 },
  { name: 'Orionids', peak: '2025-10-21', time: '23:00', zhr: 20 },
  { name: 'Leonids', peak: '2025-11-17', time: '12:00', zhr: 15 },
  { name: 'Geminids', peak: '2025-12-13', time: '20:00', zhr: 150 }
];

// Timeanddate.com Eclipses 2025
const TIMANDDATE_ECLIPSES_2025 = [
  { date: '2025-03-29', type: 'solar_partial', time: '10:48', visibility: 'Europe, North Africa, North America' },
  { date: '2025-09-21', type: 'lunar_partial', time: '19:43', visibility: 'Europe, Africa, Asia, Australia' }
];

// Swiss Ephemeris Sun Ingress 2025
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

// Validation functions
function validateMoonPhases(events: CelestialEvent[]): { valid: number; invalid: number; missing: number } {
  const moonPhases = events.filter(e => e.type === 'moon_phase');
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  
  console.log('\n🌙 Moon Phases Validation:');
  
  NASA_MOON_PHASES_2025.forEach(nasaPhase => {
    const expectedDate = new Date(`${nasaPhase.date}T${nasaPhase.time}:00.000Z`);
    const expectedPhase = nasaPhase.phase === 'first_quarter' ? 'first' : 
                         nasaPhase.phase === 'last_quarter' ? 'last' : nasaPhase.phase;
    
    const foundPhase = moonPhases.find(phase => {
      const phaseDate = new Date(phase.startUTC);
      const dateMatch = phaseDate.toISOString().split('T')[0] === nasaPhase.date;
      const phaseMatch = phase.subType === expectedPhase;
      return dateMatch && phaseMatch;
    });
    
    if (foundPhase) {
      const foundDate = new Date(foundPhase.startUTC);
      const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
      
      if (timeDiff <= 24) { // Within 24 hours
        valid++;
        console.log(`✅ ${nasaPhase.date} ${expectedPhase}: Found (${timeDiff.toFixed(1)}h diff)`);
      } else {
        invalid++;
        console.log(`❌ ${nasaPhase.date} ${expectedPhase}: Time mismatch (${timeDiff.toFixed(1)}h diff)`);
      }
    } else {
      missing++;
      console.log(`❌ ${nasaPhase.date} ${expectedPhase}: Missing`);
    }
  });
  
  return { valid, invalid, missing };
}

function validatePlanetStations(events: CelestialEvent[]): { valid: number; invalid: number; missing: number } {
  const stations = events.filter(e => e.type === 'planet_station');
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  
  console.log('\n🔄 Planet Stations Validation:');
  
  SWISS_EPHEMERIS_STATIONS_2025.forEach(ephemerisStation => {
    const expectedDate = new Date(`${ephemerisStation.date}T${ephemerisStation.time}:00.000Z`);
    
    const foundStation = stations.find(station => {
      const stationDate = new Date(station.startUTC);
      const dateMatch = stationDate.toISOString().split('T')[0] === ephemerisStation.date;
      const planetMatch = station.meta.planet === ephemerisStation.planet;
      const typeMatch = station.meta.stationType === ephemerisStation.type;
      return dateMatch && planetMatch && typeMatch;
    });
    
    if (foundStation) {
      const foundDate = new Date(foundStation.startUTC);
      const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
      
      if (timeDiff <= 24) {
        valid++;
        console.log(`✅ ${ephemerisStation.date} ${ephemerisStation.planet} ${ephemerisStation.type}: Found (${timeDiff.toFixed(1)}h diff)`);
      } else {
        invalid++;
        console.log(`❌ ${ephemerisStation.date} ${ephemerisStation.planet} ${ephemerisStation.type}: Time mismatch (${timeDiff.toFixed(1)}h diff)`);
      }
    } else {
      missing++;
      console.log(`❌ ${ephemerisStation.date} ${ephemerisStation.planet} ${ephemerisStation.type}: Missing`);
    }
  });
  
  return { valid, invalid, missing };
}

function validateMeteorShowers(events: CelestialEvent[]): { valid: number; invalid: number; missing: number } {
  const meteorShowers = events.filter(e => e.type === 'meteor_shower');
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  
  console.log('\n⭐ Meteor Showers Validation:');
  
  IMO_METEOR_SHOWERS_2025.forEach(imoShower => {
    const expectedDate = new Date(`${imoShower.peak}T${imoShower.time}:00.000Z`);
    
    const foundShower = meteorShowers.find(shower => {
      const showerDate = new Date(shower.startUTC);
      const dateMatch = showerDate.toISOString().split('T')[0] === imoShower.peak;
      return dateMatch;
    });
    
    if (foundShower) {
      const foundDate = new Date(foundShower.startUTC);
      const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
      
      if (timeDiff <= 24) {
        valid++;
        console.log(`✅ ${imoShower.name} ${imoShower.peak}: Found (${timeDiff.toFixed(1)}h diff)`);
      } else {
        invalid++;
        console.log(`❌ ${imoShower.name} ${imoShower.peak}: Time mismatch (${timeDiff.toFixed(1)}h diff)`);
      }
    } else {
      missing++;
      console.log(`❌ ${imoShower.name} ${imoShower.peak}: Missing`);
    }
  });
  
  return { valid, invalid, missing };
}

function validateEclipses(events: CelestialEvent[]): { valid: number; invalid: number; missing: number } {
  const eclipses = events.filter(e => e.type === 'eclipse');
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  
  console.log('\n🌑 Eclipses Validation:');
  
  TIMANDDATE_ECLIPSES_2025.forEach(timeanddateEclipse => {
    const expectedDate = new Date(`${timeanddateEclipse.date}T${timeanddateEclipse.time}:00.000Z`);
    
    const foundEclipse = eclipses.find(eclipse => {
      const eclipseDate = new Date(eclipse.startUTC);
      const dateMatch = eclipseDate.toISOString().split('T')[0] === timeanddateEclipse.date;
      const typeMatch = eclipse.subType === timeanddateEclipse.type;
      return dateMatch && typeMatch;
    });
    
    if (foundEclipse) {
      const foundDate = new Date(foundEclipse.startUTC);
      const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
      
      if (timeDiff <= 24) {
        valid++;
        console.log(`✅ ${timeanddateEclipse.date} ${timeanddateEclipse.type}: Found (${timeDiff.toFixed(1)}h diff)`);
      } else {
        invalid++;
        console.log(`❌ ${timeanddateEclipse.date} ${timeanddateEclipse.type}: Time mismatch (${timeDiff.toFixed(1)}h diff)`);
      }
    } else {
      missing++;
      console.log(`❌ ${timeanddateEclipse.date} ${timeanddateEclipse.type}: Missing`);
    }
  });
  
  return { valid, invalid, missing };
}

function validateSunIngress(events: CelestialEvent[]): { valid: number; invalid: number; missing: number } {
  const sunIngress = events.filter(e => e.type === 'sun_ingress');
  let valid = 0;
  let invalid = 0;
  let missing = 0;
  
  console.log('\n☀️ Sun Ingress Validation:');
  
  SWISS_EPHEMERIS_SUN_INGRESS_2025.forEach(ephemerisIngress => {
    const expectedDate = new Date(`${ephemerisIngress.date}T${ephemerisIngress.time}:00.000Z`);
    
    const foundIngress = sunIngress.find(ingress => {
      const ingressDate = new Date(ingress.startUTC);
      const dateMatch = ingressDate.toISOString().split('T')[0] === ephemerisIngress.date;
      const signMatch = ingress.subType === ephemerisIngress.sign;
      return dateMatch && signMatch;
    });
    
    if (foundIngress) {
      const foundDate = new Date(foundIngress.startUTC);
      const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
      
      if (timeDiff <= 24) {
        valid++;
        console.log(`✅ ${ephemerisIngress.date} ${ephemerisIngress.sign}: Found (${timeDiff.toFixed(1)}h diff)`);
      } else {
        invalid++;
        console.log(`❌ ${ephemerisIngress.date} ${ephemerisIngress.sign}: Time mismatch (${timeDiff.toFixed(1)}h diff)`);
      }
    } else {
      missing++;
      console.log(`❌ ${ephemerisIngress.date} ${ephemerisIngress.sign}: Missing`);
    }
  });
  
  return { valid, invalid, missing };
}

// Main validation function
function validateAllCelestialEvents() {
  console.log('🔍 Celestial Events Source Validation\n');
  console.log('Comparing against:');
  console.log('- NASA Moon Phases');
  console.log('- Swiss Ephemeris Planet Stations');
  console.log('- IMO Meteor Showers');
  console.log('- Timeanddate.com Eclipses');
  console.log('- Swiss Ephemeris Sun Ingress');
  
  const events = loadCurrentEvents();
  
  const moonResults = validateMoonPhases(events);
  const stationResults = validatePlanetStations(events);
  const meteorResults = validateMeteorShowers(events);
  const eclipseResults = validateEclipses(events);
  const ingressResults = validateSunIngress(events);
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log('====================');
  
  const totalValid = moonResults.valid + stationResults.valid + meteorResults.valid + eclipseResults.valid + ingressResults.valid;
  const totalInvalid = moonResults.invalid + stationResults.invalid + meteorResults.invalid + eclipseResults.invalid + ingressResults.invalid;
  const totalMissing = moonResults.missing + stationResults.missing + meteorResults.missing + eclipseResults.missing + ingressResults.missing;
  const totalExpected = NASA_MOON_PHASES_2025.length + SWISS_EPHEMERIS_STATIONS_2025.length + IMO_METEOR_SHOWERS_2025.length + TIMANDDATE_ECLIPSES_2025.length + SWISS_EPHEMERIS_SUN_INGRESS_2025.length;
  
  console.log(`🌙 Moon Phases: ${moonResults.valid}/${NASA_MOON_PHASES_2025.length} valid, ${moonResults.invalid} invalid, ${moonResults.missing} missing`);
  console.log(`🔄 Planet Stations: ${stationResults.valid}/${SWISS_EPHEMERIS_STATIONS_2025.length} valid, ${stationResults.invalid} invalid, ${stationResults.missing} missing`);
  console.log(`⭐ Meteor Showers: ${meteorResults.valid}/${IMO_METEOR_SHOWERS_2025.length} valid, ${meteorResults.invalid} invalid, ${meteorResults.missing} missing`);
  console.log(`🌑 Eclipses: ${eclipseResults.valid}/${TIMANDDATE_ECLIPSES_2025.length} valid, ${eclipseResults.invalid} invalid, ${eclipseResults.missing} missing`);
  console.log(`☀️ Sun Ingress: ${ingressResults.valid}/${SWISS_EPHEMERIS_SUN_INGRESS_2025.length} valid, ${ingressResults.invalid} invalid, ${ingressResults.missing} missing`);
  
  console.log(`\n🎯 Overall: ${totalValid}/${totalExpected} valid (${((totalValid/totalExpected)*100).toFixed(1)}%)`);
  console.log(`❌ Issues: ${totalInvalid + totalMissing} total (${totalInvalid} invalid, ${totalMissing} missing)`);
  
  if (totalInvalid + totalMissing === 0) {
    console.log('\n🎉 All celestial events validated successfully!');
  } else {
    console.log('\n⚠️  Some events need correction or are missing.');
  }
}

// Main execution
if (require.main === module) {
  validateAllCelestialEvents();
}
