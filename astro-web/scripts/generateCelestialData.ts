#!/usr/bin/env tsx

import { CelestialEvent, EventType, MoonPhaseType, EclipseType, PlanetType, StationType, ZodiacSign } from '../src/lib/celestialEvents';
import { getMoonPhases } from '../src/lib/moonPhase';

// 2025-2026 Celestial Events Data
// Based on NASA, IMO, and ephemeris sources

export function generateMoonPhases2025(): CelestialEvent[] {
  const events: CelestialEvent[] = [];
  
  // Generate moon phases for each month of 2025
  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(2025, month - 1, 1);
    const phases = getMoonPhases(startDate, 31);
    
    phases.forEach((phase, index) => {
      // Only include main phases (new, first_quarter, full, last_quarter)
      if (['new', 'first', 'full', 'last'].includes(phase.phase)) {
        events.push({
          id: `moon-phase-2025-${month}-${index}`,
          type: 'moon_phase',
          subType: phase.phase as MoonPhaseType,
          startUTC: phase.date.toISOString(),
          labelTR: phase.phaseName,
          iconKey: phase.phase,
          source: 'calculated',
          reliability: 'high',
          meta: {
            phase: phase.phase as MoonPhaseType
          }
        });
      }
    });
  }
  
  return events;
}

export function generateEclipses2025(): CelestialEvent[] {
  return [
    // 2025 Eclipses (NASA data)
    {
      id: 'eclipse-2025-03-29-solar-partial',
      type: 'eclipse',
      subType: 'solar_partial',
      startUTC: '2025-03-29T10:48:00.000Z',
      labelTR: 'Parçalı Güneş Tutulması',
      iconKey: 'solar_partial',
      source: 'nasa',
      reliability: 'high',
      meta: {
        eclipseType: 'solar_partial',
        visibility: {
          turkey: false,
          partial: false,
          notes: 'Kuzey Amerika, Avrupa, Kuzey Afrika'
        }
      }
    },
    {
      id: 'eclipse-2025-09-21-lunar-partial',
      type: 'eclipse',
      subType: 'lunar_partial',
      startUTC: '2025-09-21T19:43:00.000Z',
      labelTR: 'Parçalı Ay Tutulması',
      iconKey: 'lunar_partial',
      source: 'nasa',
      reliability: 'high',
      meta: {
        eclipseType: 'lunar_partial',
        visibility: {
          turkey: true,
          partial: true,
          notes: 'Türkiye\'den görülebilir'
        }
      }
    }
  ];
}

export function generateMeteorShowers2025(): CelestialEvent[] {
  return [
    // 2025 Major Meteor Showers (IMO data)
    {
      id: 'meteor-quadrantids-2025',
      type: 'meteor_shower',
      subType: 'quadrantids',
      startUTC: '2025-01-03T15:00:00.000Z',
      endUTC: '2025-01-04T15:00:00.000Z',
      labelTR: 'Quadrantid Meteor Yağmuru Zirvesi',
      iconKey: 'quadrantids',
      source: 'imo',
      reliability: 'high',
      meta: {
        radiant: 'Boötes',
        peakWindow: '3-4 Ocak gecesi',
        zhr: 120,
        moonInterference: 'low'
      }
    },
    {
      id: 'meteor-perseids-2025',
      type: 'meteor_shower',
      subType: 'perseids',
      startUTC: '2025-08-12T20:00:00.000Z',
      endUTC: '2025-08-13T20:00:00.000Z',
      labelTR: 'Perseid Meteor Yağmuru Zirvesi',
      iconKey: 'perseids',
      source: 'imo',
      reliability: 'high',
      meta: {
        radiant: 'Perseus',
        peakWindow: '12-13 Ağustos gecesi',
        zhr: 100,
        moonInterference: 'medium'
      }
    },
    {
      id: 'meteor-geminids-2025',
      type: 'meteor_shower',
      subType: 'geminids',
      startUTC: '2025-12-13T20:00:00.000Z',
      endUTC: '2025-12-14T20:00:00.000Z',
      labelTR: 'Geminid Meteor Yağmuru Zirvesi',
      iconKey: 'geminids',
      source: 'imo',
      reliability: 'high',
      meta: {
        radiant: 'Gemini',
        peakWindow: '13-14 Aralık gecesi',
        zhr: 150,
        moonInterference: 'low'
      }
    }
  ];
}

export function generatePlanetStations2025(): CelestialEvent[] {
  return [
    // 2025 Planet Retrograde Stations (ephemeris data)
    // Mercury Retrograde
    {
      id: 'mercury-retro-start-2025-01',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-01-15T02:00:00.000Z',
      labelTR: 'Merkür Retrosu Başlıyor',
      iconKey: 'mercury_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_start',
        longitude: 8.0
      }
    },
    {
      id: 'mercury-retro-end-2025-01',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-02-05T18:00:00.000Z',
      labelTR: 'Merkür Retrosu Sona Eriyor',
      iconKey: 'mercury_retro_end',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_end',
        longitude: 24.0
      }
    },
    {
      id: 'mercury-retro-start-2025-05',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-05-19T06:00:00.000Z',
      labelTR: 'Merkür Retrosu Başlıyor',
      iconKey: 'mercury_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_start',
        longitude: 4.0
      }
    },
    {
      id: 'mercury-retro-end-2025-05',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-06-11T14:00:00.000Z',
      labelTR: 'Merkür Retrosu Sona Eriyor',
      iconKey: 'mercury_retro_end',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_end',
        longitude: 26.0
      }
    },
    {
      id: 'mercury-retro-start-2025-09',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-09-09T12:00:00.000Z',
      labelTR: 'Merkür Retrosu Başlıyor',
      iconKey: 'mercury_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_start',
        longitude: 8.0
      }
    },
    {
      id: 'mercury-retro-end-2025-09',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-10-02T08:00:00.000Z',
      labelTR: 'Merkür Retrosu Sona Eriyor',
      iconKey: 'mercury_retro_end',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_end',
        longitude: 24.0
      }
    },
    {
      id: 'mercury-retro-start-2025-12',
      type: 'planet_station',
      subType: 'mercury',
      startUTC: '2025-12-29T18:00:00.000Z',
      labelTR: 'Merkür Retrosu Başlıyor',
      iconKey: 'mercury_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: 'retrograde_start',
        longitude: 8.0
      }
    },
    
    // Venus Retrograde
    {
      id: 'venus-retro-start-2025',
      type: 'planet_station',
      subType: 'venus',
      startUTC: '2025-12-21T06:00:00.000Z',
      labelTR: 'Venüs Retrosu Başlıyor',
      iconKey: 'venus_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'venus',
        stationType: 'retrograde_start',
        longitude: 9.0
      }
    },
    
    // Mars Retrograde
    {
      id: 'mars-retro-start-2025',
      type: 'planet_station',
      subType: 'mars',
      startUTC: '2025-12-07T12:00:00.000Z',
      labelTR: 'Mars Retrosu Başlıyor',
      iconKey: 'mars_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mars',
        stationType: 'retrograde_start',
        longitude: 6.0
      }
    },
    
    // Jupiter Retrograde
    {
      id: 'jupiter-retro-start-2025',
      type: 'planet_station',
      subType: 'jupiter',
      startUTC: '2025-10-09T18:00:00.000Z',
      labelTR: 'Jüpiter Retrosu Başlıyor',
      iconKey: 'jupiter_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'jupiter',
        stationType: 'retrograde_start',
        longitude: 21.0
      }
    },
    
    // Saturn Retrograde
    {
      id: 'saturn-retro-start-2025',
      type: 'planet_station',
      subType: 'saturn',
      startUTC: '2025-06-29T12:00:00.000Z',
      labelTR: 'Satürn Retrosu Başlıyor',
      iconKey: 'saturn_retro_start',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'saturn',
        stationType: 'retrograde_start',
        longitude: 19.0
      }
    }
  ];
}

export function generateSunIngress2025(): CelestialEvent[] {
  return [
    // 2025 Sun Ingress Dates (ephemeris data)
    {
      id: 'sun-ingress-aquarius-2025',
      type: 'sun_ingress',
      subType: 'aquarius',
      startUTC: '2025-01-20T09:07:00.000Z',
      labelTR: 'Güneş Kova Burcuna Geçiyor',
      iconKey: 'sun_aquarius',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'aquarius',
        longitude: 300.0
      }
    },
    {
      id: 'sun-ingress-pisces-2025',
      type: 'sun_ingress',
      subType: 'pisces',
      startUTC: '2025-02-18T11:13:00.000Z',
      labelTR: 'Güneş Balık Burcuna Geçiyor',
      iconKey: 'sun_pisces',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'pisces',
        longitude: 330.0
      }
    },
    {
      id: 'sun-ingress-aries-2025',
      type: 'sun_ingress',
      subType: 'aries',
      startUTC: '2025-03-20T09:01:00.000Z',
      labelTR: 'Güneş Koç Burcuna Geçiyor',
      iconKey: 'sun_aries',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'aries',
        longitude: 0.0
      }
    },
    {
      id: 'sun-ingress-taurus-2025',
      type: 'sun_ingress',
      subType: 'taurus',
      startUTC: '2025-04-20T02:55:00.000Z',
      labelTR: 'Güneş Boğa Burcuna Geçiyor',
      iconKey: 'sun_taurus',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'taurus',
        longitude: 30.0
      }
    },
    {
      id: 'sun-ingress-gemini-2025',
      type: 'sun_ingress',
      subType: 'gemini',
      startUTC: '2025-05-21T03:00:00.000Z',
      labelTR: 'Güneş İkizler Burcuna Geçiyor',
      iconKey: 'sun_gemini',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'gemini',
        longitude: 60.0
      }
    },
    {
      id: 'sun-ingress-cancer-2025',
      type: 'sun_ingress',
      subType: 'cancer',
      startUTC: '2025-06-21T14:42:00.000Z',
      labelTR: 'Güneş Yengeç Burcuna Geçiyor',
      iconKey: 'sun_cancer',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'cancer',
        longitude: 90.0
      }
    },
    {
      id: 'sun-ingress-leo-2025',
      type: 'sun_ingress',
      subType: 'leo',
      startUTC: '2025-07-22T22:17:00.000Z',
      labelTR: 'Güneş Aslan Burcuna Geçiyor',
      iconKey: 'sun_leo',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'leo',
        longitude: 120.0
      }
    },
    {
      id: 'sun-ingress-virgo-2025',
      type: 'sun_ingress',
      subType: 'virgo',
      startUTC: '2025-08-23T05:06:00.000Z',
      labelTR: 'Güneş Başak Burcuna Geçiyor',
      iconKey: 'sun_virgo',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'virgo',
        longitude: 150.0
      }
    },
    {
      id: 'sun-ingress-libra-2025',
      type: 'sun_ingress',
      subType: 'libra',
      startUTC: '2025-09-23T01:19:00.000Z',
      labelTR: 'Güneş Terazi Burcuna Geçiyor',
      iconKey: 'sun_libra',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'libra',
        longitude: 180.0
      }
    },
    {
      id: 'sun-ingress-scorpio-2025',
      type: 'sun_ingress',
      subType: 'scorpio',
      startUTC: '2025-10-23T10:03:00.000Z',
      labelTR: 'Güneş Akrep Burcuna Geçiyor',
      iconKey: 'sun_scorpio',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'scorpio',
        longitude: 210.0
      }
    },
    {
      id: 'sun-ingress-sagittarius-2025',
      type: 'sun_ingress',
      subType: 'sagittarius',
      startUTC: '2025-11-22T21:35:00.000Z',
      labelTR: 'Güneş Yay Burcuna Geçiyor',
      iconKey: 'sun_sagittarius',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'sagittarius',
        longitude: 240.0
      }
    },
    {
      id: 'sun-ingress-capricorn-2025',
      type: 'sun_ingress',
      subType: 'capricorn',
      startUTC: '2025-12-21T09:03:00.000Z',
      labelTR: 'Güneş Oğlak Burcuna Geçiyor',
      iconKey: 'sun_capricorn',
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        sign: 'capricorn',
        longitude: 270.0
      }
    }
  ];
}

export function generateAllCelestialEvents2025(): CelestialEvent[] {
  return [
    ...generateMoonPhases2025(),
    ...generateEclipses2025(),
    ...generateMeteorShowers2025(),
    ...generatePlanetStations2025(),
    ...generateSunIngress2025()
  ].sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
}

// Main execution
if (require.main === module) {
  console.log('🌌 Generating 2025 Celestial Events...\n');
  
  const events = generateAllCelestialEvents2025();
  
  console.log(`Generated ${events.length} celestial events for 2025:`);
  console.log(`- Moon Phases: ${events.filter(e => e.type === 'moon_phase').length}`);
  console.log(`- Eclipses: ${events.filter(e => e.type === 'eclipse').length}`);
  console.log(`- Meteor Showers: ${events.filter(e => e.type === 'meteor_shower').length}`);
  console.log(`- Planet Stations: ${events.filter(e => e.type === 'planet_station').length}`);
  console.log(`- Sun Ingress: ${events.filter(e => e.type === 'sun_ingress').length}`);
  
  console.log('\nFirst 10 events:');
  events.slice(0, 10).forEach((event, index) => {
    const date = new Date(event.startUTC).toLocaleDateString('tr-TR');
    console.log(`${index + 1}. ${date} - ${event.labelTR}`);
  });
  
  console.log('\n🎯 Celestial Events Generation Complete!');
}
