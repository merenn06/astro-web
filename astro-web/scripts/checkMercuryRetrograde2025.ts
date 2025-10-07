#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { CelestialEvent } from '../src/lib/celestialEvents';

// Load current celestial events
function loadCurrentEvents(): CelestialEvent[] {
  const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
  return JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
}

// Check Mercury retrograde dates
function checkMercuryRetrograde2025() {
  console.log('🔍 Checking Mercury Retrograde Dates for 2025\n');
  
  const events = loadCurrentEvents();
  
  // Find all Mercury retrograde events
  const mercuryRetroEvents = events.filter(event => 
    event.type === 'planet_station' && 
    event.meta.planet === 'mercury'
  );
  
  console.log('Current Mercury Retrograde Events in our data:');
  console.log('==============================================');
  
  mercuryRetroEvents.forEach(event => {
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
  
  console.log('\n📅 User reported dates:');
  console.log('=======================');
  console.log('November 9-29, 2025 (Mercury Retrograde)');
  
  // Check if November 9-29 range has any Mercury retrograde events
  const novemberEvents = events.filter(event => {
    const date = new Date(event.startUTC);
    return date.getMonth() === 10 && // November (0-indexed)
           date.getDate() >= 9 && 
           date.getDate() <= 29 &&
           event.type === 'planet_station' && 
           event.meta.planet === 'mercury';
  });
  
  console.log(`\n🔍 Mercury retrograde events in November 9-29 range: ${novemberEvents.length}`);
  
  if (novemberEvents.length === 0) {
    console.log('❌ No Mercury retrograde events found in November 9-29, 2025');
    console.log('   This confirms the user\'s report that the dates are missing.');
  } else {
    novemberEvents.forEach(event => {
      const date = new Date(event.startUTC);
      console.log(`✅ Found: ${event.meta.stationType} on ${date.toLocaleDateString('tr-TR')}`);
    });
  }
  
  // Check what we have in November
  const allNovemberEvents = events.filter(event => {
    const date = new Date(event.startUTC);
    return date.getMonth() === 10; // November (0-indexed)
  });
  
  console.log('\n📊 All events in November 2025:');
  console.log('===============================');
  allNovemberEvents.forEach(event => {
    const date = new Date(event.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`${dateStr}: ${event.labelTR}`);
  });
  
  // Summary
  console.log('\n📋 Summary:');
  console.log('===========');
  console.log(`Total Mercury retrograde events in 2025: ${mercuryRetroEvents.length}`);
  console.log(`Events in November 9-29 range: ${novemberEvents.length}`);
  console.log(`Total events in November 2025: ${allNovemberEvents.length}`);
  
  if (novemberEvents.length === 0) {
    console.log('\n⚠️  ISSUE CONFIRMED: No Mercury retrograde events found in November 9-29, 2025');
    console.log('   The user is correct - these dates are missing from our data.');
    console.log('   We need to update our Mercury retrograde dates.');
  }
}

// Main execution
if (require.main === module) {
  checkMercuryRetrograde2025();
}
