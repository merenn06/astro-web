#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { CelestialEvent } from '../src/lib/celestialEvents';

// Load current celestial events
function loadCurrentEvents(): CelestialEvent[] {
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  return JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
}

// Correct Mercury retrograde dates for 2025
// Based on user feedback: November 9-29, 2025
const CORRECT_MERCURY_RETROGRADE_2025 = [
  // First retrograde: January 15 - February 5, 2025 (keep as is)
  { date: '2025-01-15', type: 'retrograde_start', time: '02:00' },
  { date: '2025-02-05', type: 'retrograde_end', time: '18:00' },
  
  // Second retrograde: May 19 - June 11, 2025 (keep as is)
  { date: '2025-05-19', type: 'retrograde_start', time: '06:00' },
  { date: '2025-06-11', type: 'retrograde_end', time: '14:00' },
  
  // Third retrograde: September 9 - October 2, 2025 (keep as is)
  { date: '2025-09-09', type: 'retrograde_start', time: '12:00' },
  { date: '2025-10-02', type: 'retrograde_end', time: '08:00' },
  
  // Fourth retrograde: November 9 - November 29, 2025 (CORRECTED)
  { date: '2025-11-09', type: 'retrograde_start', time: '12:00' },
  { date: '2025-11-29', type: 'retrograde_end', time: '18:00' },
  
  // Fifth retrograde: December 29, 2025 (keep as is - starts in 2025, ends in 2026)
  { date: '2025-12-29', type: 'retrograde_start', time: '18:00' }
];

function fixMercuryRetrograde2025() {
  console.log('🔧 Fixing Mercury Retrograde Dates for 2025\n');
  
  const events = loadCurrentEvents();
  
  // Remove all existing Mercury retrograde events
  const filteredEvents = events.filter(event => 
    !(event.type === 'planet_station' && event.meta.planet === 'mercury')
  );
  
  console.log(`Removed ${events.length - filteredEvents.length} existing Mercury retrograde events`);
  
  // Add corrected Mercury retrograde events
  const newMercuryEvents: CelestialEvent[] = [];
  
  CORRECT_MERCURY_RETROGRADE_2025.forEach((retro, index) => {
    const planetNames = {
      mercury: 'Merkür'
    };
    
    const stationLabels = {
      retrograde_start: `${planetNames.mercury} Retrosu Başlıyor`,
      retrograde_end: `${planetNames.mercury} Retrosu Sona Eriyor`
    };
    
    newMercuryEvents.push({
      id: `planet-station-mercury-${retro.type}-2025-${index + 1}`,
      type: 'planet_station',
      subType: 'mercury',
      startUTC: `${retro.date}T${retro.time}:00.000Z`,
      labelTR: stationLabels[retro.type as keyof typeof stationLabels],
      iconKey: `mercury_${retro.type}`,
      source: 'ephemeris',
      reliability: 'high',
      meta: {
        planet: 'mercury',
        stationType: retro.type as 'retrograde_start' | 'retrograde_end'
      }
    });
  });
  
  // Combine all events
  const allEvents = [...filteredEvents, ...newMercuryEvents];
  
  // Sort by date
  allEvents.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());
  
  console.log(`Added ${newMercuryEvents.length} corrected Mercury retrograde events`);
  
  // Show the corrected Mercury retrograde events
  console.log('\n✅ Corrected Mercury Retrograde Events:');
  console.log('=====================================');
  newMercuryEvents.forEach(event => {
    const date = new Date(event.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`${event.meta.stationType}: ${dateStr} (${event.startUTC})`);
  });
  
  // Save the corrected data
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  fs.writeFileSync(celestialPath, JSON.stringify(allEvents, null, 2));
  
  console.log('\n💾 Saved corrected celestial events to celestialEvents2025.json');
  
  // Also update legacy format files
  const moonPhases = allEvents.filter(e => e.type === 'moon_phase');
  const astronomical = allEvents.filter(e => e.type !== 'moon_phase');
  
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
  
  console.log('\n🎯 Mercury Retrograde Fix Complete!');
  console.log('Now November 9-29, 2025 should show Mercury retrograde events.');
}

// Main execution
if (require.main === module) {
  fixMercuryRetrograde2025();
}
