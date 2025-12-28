#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { generateAllCelestialEvents2025 } from './generateCelestialData';
import { CelestialEvent } from '../src/lib/celestialEvents';

// Convert CelestialEvent to legacy format for compatibility
function convertToLegacyFormat(events: CelestialEvent[]): any[] {
  return events.map(event => {
    const date = new Date(event.startUTC);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Determine legacy type and emoji
    let legacyType = '';
    let emoji = '';
    let description = event.labelTR;
    
    switch (event.type) {
      case 'moon_phase':
        legacyType = event.subType === 'new' ? 'Yeni Ay' : 
                    event.subType === 'first_quarter' ? 'İlk Dördün' :
                    event.subType === 'full' ? 'Dolunay' : 'Son Dördün';
        emoji = event.subType === 'new' ? '🌑' : 
                event.subType === 'first_quarter' ? '🌓' :
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
      description: description
    };
  });
}

// Save data to JSON files
function saveCelestialData() {
  console.log('💾 Saving Celestial Events to JSON files...\n');
  
  const events = generateAllCelestialEvents2025();
  
  // Group events by year and month
  const eventsByMonth: { [key: string]: CelestialEvent[] } = {};
  
  events.forEach(event => {
    const date = new Date(event.startUTC);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month}`;
    
    if (!eventsByMonth[key]) {
      eventsByMonth[key] = [];
    }
    eventsByMonth[key].push(event);
  });
  
  // Save moon phases
  const moonPhases = events.filter(e => e.type === 'moon_phase');
  const moonPhasesLegacy = convertToLegacyFormat(moonPhases);
  
  const moonPhasesPath = path.join(process.cwd(), 'data', 'moonPhases2025.json');
  fs.writeFileSync(moonPhasesPath, JSON.stringify(moonPhasesLegacy, null, 2));
  console.log(`✅ Saved ${moonPhases.length} moon phases to moonPhases2025.json`);
  
  // Save astronomical events
  const astronomical = events.filter(e => e.type !== 'moon_phase');
  const astronomicalLegacy = convertToLegacyFormat(astronomical);
  
  const astronomicalPath = path.join(process.cwd(), 'data', 'astronomicalEvents2025.json');
  fs.writeFileSync(astronomicalPath, JSON.stringify(astronomicalLegacy, null, 2));
  console.log(`✅ Saved ${astronomical.length} astronomical events to astronomicalEvents2025.json`);
  
  // Save full celestial events (new format)
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  fs.writeFileSync(celestialPath, JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} celestial events to celestialEvents2025.json`);
  
  // Show summary by month
  console.log('\n📅 Events by month:');
  Object.keys(eventsByMonth).sort().forEach(key => {
    const [year, month] = key.split('-');
    const monthEvents = eventsByMonth[key];
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('tr-TR', { month: 'long' });
    console.log(`  ${monthName} ${year}: ${monthEvents.length} events`);
  });
  
  console.log('\n🎯 Data saving complete!');
}

// Main execution
if (require.main === module) {
  saveCelestialData();
}
