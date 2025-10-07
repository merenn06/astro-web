#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { generateAllCorrectedCelestialEvents2025 } from './generateCorrectedCelestialData';
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
      description: description
    };
  });
}

// Save corrected data to JSON files
function saveCorrectedCelestialData() {
  console.log('💾 Saving Corrected Celestial Events to JSON files...\n');
  
  const events = generateAllCorrectedCelestialEvents2025();
  
  // Group events by type for legacy format
  const moonPhases = events.filter(e => e.type === 'moon_phase');
  const astronomical = events.filter(e => e.type !== 'moon_phase');
  
  // Save moon phases
  const moonPhasesLegacy = convertToLegacyFormat(moonPhases);
  const moonPhasesPath = path.join(process.cwd(), 'data', 'moonPhases2025.json');
  fs.writeFileSync(moonPhasesPath, JSON.stringify(moonPhasesLegacy, null, 2));
  console.log(`✅ Saved ${moonPhases.length} corrected moon phases to moonPhases2025.json`);
  
  // Save astronomical events
  const astronomicalLegacy = convertToLegacyFormat(astronomical);
  const astronomicalPath = path.join(process.cwd(), 'data', 'astronomicalEvents2025.json');
  fs.writeFileSync(astronomicalPath, JSON.stringify(astronomicalLegacy, null, 2));
  console.log(`✅ Saved ${astronomical.length} corrected astronomical events to astronomicalEvents2025.json`);
  
  // Save full celestial events (new format)
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  fs.writeFileSync(celestialPath, JSON.stringify(events, null, 2));
  console.log(`✅ Saved ${events.length} corrected celestial events to celestialEvents2025.json`);
  
  // Show summary by type
  console.log('\n📊 Events by type:');
  const typeCounts = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} events`);
  });
  
  // Show summary by month
  console.log('\n📅 Events by month:');
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
  
  Object.keys(eventsByMonth).sort().forEach(key => {
    const [year, month] = key.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('tr-TR', { month: 'long' });
    console.log(`  ${monthName} ${year}: ${eventsByMonth[key].length} events`);
  });
  
  console.log('\n🎯 Corrected data saving complete!');
}

// Main execution
if (require.main === module) {
  saveCorrectedCelestialData();
}
