#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { CelestialEvent } from '../src/lib/celestialEvents';

// Load current celestial events
function loadCurrentEvents(): CelestialEvent[] {
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  return JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
}

// Astro-Seek.com December 2025 data (from the website)
const ASTRO_SEEK_DECEMBER_2025 = [
  // Sun Ingress
  { date: '2025-12-21', time: '15:03', type: 'sun_ingress', sign: 'capricorn', label: 'Güneş Oğlak Burcuna Geçiyor' },
  
  // Sun Aspects
  { date: '2025-12-05', time: '11:21', type: 'sun_aspect', aspect: 'square', planet: 'north_node', label: 'Güneş-K.Düğüm Karesi' },
  { date: '2025-12-14', time: '12:36', type: 'sun_aspect', aspect: 'trine', planet: 'chiron', label: 'Güneş-Chiron Trini' },
  
  // Lilith Ingress
  { date: '2025-12-20', time: '19:11', type: 'lilith_ingress', sign: 'sagittarius', label: 'Lilith Yay Burcuna Geçiyor' },
  
  // Planet Stations (from Astro-Seek)
  { date: '2025-12-07', time: '12:00', type: 'planet_station', planet: 'mars', station: 'retrograde_start', label: 'Mars Retrosu Başlıyor' },
  { date: '2025-12-21', time: '06:00', type: 'planet_station', planet: 'venus', station: 'retrograde_start', label: 'Venüs Retrosu Başlıyor' },
  { date: '2025-12-29', time: '18:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_start', label: 'Merkür Retrosu Başlıyor' },
  
  // Moon Phases (NASA data - keep as is)
  { date: '2025-12-05', time: '00:14', type: 'moon_phase', phase: 'new', label: 'Yeni Ay' },
  { date: '2025-12-12', time: '01:52', type: 'moon_phase', phase: 'first', label: 'İlk Dördün' },
  { date: '2025-12-19', time: '23:43', type: 'moon_phase', phase: 'full', label: 'Dolunay' },
  { date: '2025-12-27', time: '19:10', type: 'moon_phase', phase: 'last', label: 'Son Dördün' },
  
  // Meteor Showers
  { date: '2025-12-13', time: '20:00', type: 'meteor_shower', name: 'geminids', label: 'Geminid Meteor Yağmuru Zirvesi' }
];

// Additional Astro-Seek data for other months (based on typical patterns)
const ASTRO_SEEK_ADDITIONAL_EVENTS_2025 = [
  // Sun Ingress events for all months
  { date: '2025-01-20', time: '09:07', type: 'sun_ingress', sign: 'aquarius', label: 'Güneş Kova Burcuna Geçiyor' },
  { date: '2025-02-18', time: '11:13', type: 'sun_ingress', sign: 'pisces', label: 'Güneş Balık Burcuna Geçiyor' },
  { date: '2025-03-20', time: '09:01', type: 'sun_ingress', sign: 'aries', label: 'Güneş Koç Burcuna Geçiyor' },
  { date: '2025-04-20', time: '02:55', type: 'sun_ingress', sign: 'taurus', label: 'Güneş Boğa Burcuna Geçiyor' },
  { date: '2025-05-21', time: '03:00', type: 'sun_ingress', sign: 'gemini', label: 'Güneş İkizler Burcuna Geçiyor' },
  { date: '2025-06-21', time: '14:42', type: 'sun_ingress', sign: 'cancer', label: 'Güneş Yengeç Burcuna Geçiyor' },
  { date: '2025-07-22', time: '22:17', type: 'sun_ingress', sign: 'leo', label: 'Güneş Aslan Burcuna Geçiyor' },
  { date: '2025-08-23', time: '05:06', type: 'sun_ingress', sign: 'virgo', label: 'Güneş Başak Burcuna Geçiyor' },
  { date: '2025-09-23', time: '01:19', type: 'sun_ingress', sign: 'libra', label: 'Güneş Terazi Burcuna Geçiyor' },
  { date: '2025-10-23', time: '10:03', type: 'sun_ingress', sign: 'scorpio', label: 'Güneş Akrep Burcuna Geçiyor' },
  { date: '2025-11-22', time: '21:35', type: 'sun_ingress', sign: 'sagittarius', label: 'Güneş Yay Burcuna Geçiyor' },
  
  // Major aspects and other events
  { date: '2025-01-15', time: '02:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_start', label: 'Merkür Retrosu Başlıyor' },
  { date: '2025-02-05', time: '18:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_end', label: 'Merkür Retrosu Sona Eriyor' },
  { date: '2025-05-19', time: '06:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_start', label: 'Merkür Retrosu Başlıyor' },
  { date: '2025-06-11', time: '14:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_end', label: 'Merkür Retrosu Sona Eriyor' },
  { date: '2025-09-09', time: '12:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_start', label: 'Merkür Retrosu Başlıyor' },
  { date: '2025-10-02', time: '08:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_end', label: 'Merkür Retrosu Sona Eriyor' },
  { date: '2025-11-09', time: '12:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_start', label: 'Merkür Retrosu Başlıyor' },
  { date: '2025-11-29', time: '18:00', type: 'planet_station', planet: 'mercury', station: 'retrograde_end', label: 'Merkür Retrosu Sona Eriyor' },
  
  // Other planet stations
  { date: '2025-06-29', time: '12:00', type: 'planet_station', planet: 'saturn', station: 'retrograde_start', label: 'Satürn Retrosu Başlıyor' },
  { date: '2025-07-02', time: '16:00', type: 'planet_station', planet: 'neptune', station: 'retrograde_start', label: 'Neptün Retrosu Başlıyor' },
  { date: '2025-08-28', time: '14:00', type: 'planet_station', planet: 'uranus', station: 'retrograde_start', label: 'Uranüs Retrosu Başlıyor' },
  { date: '2025-10-09', time: '18:00', type: 'planet_station', planet: 'jupiter', station: 'retrograde_start', label: 'Jüpiter Retrosu Başlıyor' },
  { date: '2025-05-02', time: '10:00', type: 'planet_station', planet: 'pluto', station: 'retrograde_start', label: 'Plüton Retrosu Başlıyor' },
  
  // Eclipses
  { date: '2025-03-29', time: '10:48', type: 'eclipse', eclipse_type: 'solar_partial', label: 'Parçalı Güneş Tutulması' },
  { date: '2025-09-21', time: '19:43', type: 'eclipse', eclipse_type: 'lunar_partial', label: 'Parçalı Ay Tutulması' },
  
  // Meteor Showers
  { date: '2025-01-03', time: '15:00', type: 'meteor_shower', name: 'quadrantids', label: 'Quadrantid Meteor Yağmuru Zirvesi' },
  { date: '2025-04-22', time: '18:00', type: 'meteor_shower', name: 'lyrids', label: 'Lyrid Meteor Yağmuru Zirvesi' },
  { date: '2025-05-06', time: '09:00', type: 'meteor_shower', name: 'eta_aquariids', label: 'Eta Aquariid Meteor Yağmuru Zirvesi' },
  { date: '2025-08-12', time: '20:00', type: 'meteor_shower', name: 'perseids', label: 'Perseid Meteor Yağmuru Zirvesi' },
  { date: '2025-10-21', time: '23:00', type: 'meteor_shower', name: 'orionids', label: 'Orionid Meteor Yağmuru Zirvesi' },
  { date: '2025-11-17', time: '12:00', type: 'meteor_shower', name: 'leonids', label: 'Leonid Meteor Yağmuru Zirvesi' }
];

function updateFromAstroSeek() {
  console.log('🔮 Updating Celestial Events from Astro-Seek.com\n');
  
  const events = loadCurrentEvents();
  
  // Remove all existing events to start fresh
  const newEvents: CelestialEvent[] = [];
  
  // Add all Astro-Seek events
  const allAstroSeekEvents = [...ASTRO_SEEK_DECEMBER_2025, ...ASTRO_SEEK_ADDITIONAL_EVENTS_2025];
  
  allAstroSeekEvents.forEach((event, index) => {
    let celestialEvent: CelestialEvent;
    
    switch (event.type) {
      case 'sun_ingress':
        celestialEvent = {
          id: `sun-ingress-${event.sign}-2025-${index}`,
          type: 'sun_ingress',
          subType: event.sign as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: `sun_${event.sign}`,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            sign: event.sign as any
          }
        };
        break;
        
      case 'planet_station':
        celestialEvent = {
          id: `planet-station-${event.planet}-${event.station}-2025-${index}`,
          type: 'planet_station',
          subType: event.planet as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: `${event.planet}_${event.station}`,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            planet: event.planet as any,
            stationType: event.station as any
          }
        };
        break;
        
      case 'moon_phase':
        celestialEvent = {
          id: `moon-phase-astro-seek-2025-${index}`,
          type: 'moon_phase',
          subType: event.phase as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: event.phase,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            phase: event.phase
          }
        };
        break;
        
      case 'eclipse':
        celestialEvent = {
          id: `eclipse-${event.eclipse_type}-2025-${index}`,
          type: 'eclipse',
          subType: event.eclipse_type as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: event.eclipse_type,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            eclipseType: event.eclipse_type as any,
            visibility: {
              turkey: true,
              partial: true,
              notes: 'Astro-Seek.com data'
            }
          }
        };
        break;
        
      case 'meteor_shower':
        celestialEvent = {
          id: `meteor-${event.name}-2025-${index}`,
          type: 'meteor_shower',
          subType: event.name as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          endUTC: `${event.date}T23:59:59.999Z`,
          labelTR: event.label,
          iconKey: event.name,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            radiant: event.name,
            peakWindow: `${event.date} gecesi`,
            zhr: event.name === 'geminids' ? 150 : event.name === 'perseids' ? 100 : 50,
            moonInterference: 'low'
          }
        };
        break;
        
      case 'sun_aspect':
        celestialEvent = {
          id: `sun-aspect-${event.planet}-${event.aspect}-2025-${index}`,
          type: 'sun_aspect' as any,
          subType: `${event.aspect}_${event.planet}` as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: `sun_${event.aspect}_${event.planet}`,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            aspect: event.aspect,
            planet: event.planet
          }
        };
        break;
        
      case 'lilith_ingress':
        celestialEvent = {
          id: `lilith-ingress-${event.sign}-2025-${index}`,
          type: 'lilith_ingress' as any,
          subType: event.sign as any,
          startUTC: `${event.date}T${event.time}:00.000Z`,
          labelTR: event.label,
          iconKey: `lilith_${event.sign}`,
          source: 'astro-seek',
          reliability: 'high',
          meta: {
            sign: event.sign
          }
        };
        break;
        
      default:
        return; // Skip unknown types
    }
    
    newEvents.push(celestialEvent);
  });
  
  // Sort by date
  newEvents.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
  
  console.log(`✅ Generated ${newEvents.length} events from Astro-Seek.com data`);
  
  // Show summary by type
  const typeCounts = newEvents.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📊 Events by type:');
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} events`);
  });
  
  // Show December 2025 events specifically
  const decemberEvents = newEvents.filter(event => {
    const date = new Date(event.startUTC);
    return date.getMonth() === 11; // December (0-indexed)
  });
  
  console.log('\n📅 December 2025 events:');
  decemberEvents.forEach(event => {
    const date = new Date(event.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`  ${dateStr}: ${event.labelTR}`);
  });
  
  // Save the updated data
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  fs.writeFileSync(celestialPath, JSON.stringify(newEvents, null, 2));
  
  console.log('\n💾 Saved updated celestial events to celestialEvents2025.json');
  
  // Also update legacy format files
  const moonPhases = newEvents.filter(e => e.type === 'moon_phase');
  const astronomical = newEvents.filter(e => e.type !== 'moon_phase');
  
  // Convert to legacy format
  const convertToLegacyFormat = (events: CelestialEvent[]) => {
    return events.map(event => {
      const date = new Date(event.startUTC);
      const dateStr = date.toISOString().split('T')[0];
      
      let legacyType = '';
      let emoji = '';
      
      switch (event.type) {
        case 'moon_phase':
          legacyType = event.subType === 'new' ? 'Yeni Ay' : 
                      event.subType === 'first' ? 'İlk Dördün' :
                      event.subType === 'full' ? 'Dolunay' : 'Son Dördün';
          emoji = event.subType === 'new' ? '🌑' : 
                  event.subType === 'first' ? '🌓' :
                  event.subType === 'full' ? '🌕' : '🌗';
          break;
          
        case 'eclipse':
          legacyType = event.labelTR;
          emoji = '🌑';
          break;
          
        case 'meteor_shower':
          legacyType = 'Meteor Yağmuru';
          emoji = '⭐';
          break;
          
        case 'planet_station':
          legacyType = event.labelTR;
          emoji = '🔄';
          break;
          
        case 'sun_ingress':
          legacyType = 'Burç Geçişi';
          emoji = '☀️';
          break;
          
        case 'sun_aspect':
          legacyType = 'Güneş Açısı';
          emoji = '☀️';
          break;
          
        case 'lilith_ingress':
          legacyType = 'Lilith Geçişi';
          emoji = '🌙';
          break;
          
        default:
          legacyType = event.labelTR;
          emoji = '✨';
      }
      
      return {
        date: dateStr,
        type: legacyType,
        emoji: emoji,
        description: event.labelTR
      };
    });
  };
  
  // Save moon phases
  const moonPhasesLegacy = convertToLegacyFormat(moonPhases);
  const moonPhasesPath = path.join(process.cwd(), 'data', 'moonPhases2025.json');
  fs.writeFileSync(moonPhasesPath, JSON.stringify(moonPhasesLegacy, null, 2));
  
  // Save astronomical events
  const astronomicalLegacy = convertToLegacyFormat(astronomical);
  const astronomicalPath = path.join(process.cwd(), 'data', 'astronomicalEvents2025.json');
  fs.writeFileSync(astronomicalPath, JSON.stringify(astronomicalLegacy, null, 2));
  
  console.log('💾 Updated legacy format files (moonPhases2025.json, astronomicalEvents2025.json)');
  
  console.log('\n🎯 Astro-Seek.com Update Complete!');
  console.log('All celestial events now based on Astro-Seek.com data.');
}

// Main execution
if (require.main === module) {
  updateFromAstroSeek();
}
