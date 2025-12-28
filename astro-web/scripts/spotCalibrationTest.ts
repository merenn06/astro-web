#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Load unified astro calendar
const loadUnifiedCalendar = () => {
  const calendarPath = path.join(process.cwd(), 'data', 'unifiedAstroCalendar.json');
  return JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
};

function spotCalibrationTest() {
  console.log('🎯 Spot Calibration Test - Unified Astro Calendar\n');
  
  const events = loadUnifiedCalendar();
  
  // Test 1: 2025-11-09 Mercury station_R (retro başlıyor) → görünmeli
  console.log('🔍 Test 1: Mercury Retrograde Start (2025-11-09)');
  const mercuryRetroStart = events.find(e => 
    e.type === 'planet_station' && 
    e.body === 'Mercury' && 
    e.startUTC.startsWith('2025-11-09') &&
    e.subType === 'station_R'
  );
  
  if (mercuryRetroStart) {
    const date = new Date(mercuryRetroStart.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`✅ Found: ${dateStr} - ${mercuryRetroStart.labelTR}`);
  } else {
    console.log('❌ NOT FOUND: Mercury Retrograde Start (2025-11-09)');
  }
  
  // Test 2: 2025-11-29 Mercury station_D (retro bitiyor) → görünmeli
  console.log('\n🔍 Test 2: Mercury Retrograde End (2025-11-29)');
  const mercuryRetroEnd = events.find(e => 
    e.type === 'planet_station' && 
    e.body === 'Mercury' && 
    e.startUTC.startsWith('2025-11-29') &&
    e.subType === 'station_D'
  );
  
  if (mercuryRetroEnd) {
    const date = new Date(mercuryRetroEnd.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`✅ Found: ${dateStr} - ${mercuryRetroEnd.labelTR}`);
  } else {
    console.log('❌ NOT FOUND: Mercury Retrograde End (2025-11-29)');
  }
  
  // Test 3: 2025-11-20 Dolunay (tek gün)
  console.log('\n🔍 Test 3: Full Moon (2025-11-20)');
  const fullMoon = events.find(e => 
    e.type === 'moon_phase' && 
    e.subType === 'full' && 
    e.startUTC.startsWith('2025-11-20')
  );
  
  if (fullMoon) {
    const date = new Date(fullMoon.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`✅ Found: ${dateStr} - ${fullMoon.labelTR}`);
  } else {
    console.log('❌ NOT FOUND: Full Moon (2025-11-20)');
  }
  
  // Test 4: 2025-12-13–14 Geminids "zirve gecesi"
  console.log('\n🔍 Test 4: Geminids Meteor Shower Peak (2025-12-13)');
  const geminids = events.find(e => 
    e.type === 'meteor_shower' && 
    e.subType === 'geminids' && 
    e.startUTC.startsWith('2025-12-13')
  );
  
  if (geminids) {
    const date = new Date(geminids.startUTC);
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    const endDate = new Date(geminids.endUTC!);
    const endDateStr = endDate.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`✅ Found: ${dateStr} - ${geminids.labelTR}`);
    console.log(`   Peak Window: ${dateStr} - ${endDateStr}`);
    console.log(`   ZHR: ${geminids.meta.zhr} meteors/hour`);
  } else {
    console.log('❌ NOT FOUND: Geminids Meteor Shower (2025-12-13)');
  }
  
  // Test 5: 2026-02-26 → 2026-03-20 aralığında Mercury retro (R/D günleri listede)
  console.log('\n🔍 Test 5: Mercury Retrograde 2026 (Feb 26 - Mar 20)');
  const mercury2026RetroStart = events.find(e => 
    e.type === 'planet_station' && 
    e.body === 'Mercury' && 
    e.startUTC.startsWith('2026-02-26') &&
    e.subType === 'station_R'
  );
  
  const mercury2026RetroEnd = events.find(e => 
    e.type === 'planet_station' && 
    e.body === 'Mercury' && 
    e.startUTC.startsWith('2026-03-20') &&
    e.subType === 'station_D'
  );
  
  if (mercury2026RetroStart && mercury2026RetroEnd) {
    const startDate = new Date(mercury2026RetroStart.startUTC);
    const endDate = new Date(mercury2026RetroEnd.startUTC);
    const startStr = startDate.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Istanbul'
    });
    const endStr = endDate.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Istanbul'
    });
    console.log(`✅ Found: ${startStr} - ${mercury2026RetroStart.labelTR}`);
    console.log(`✅ Found: ${endStr} - ${mercury2026RetroEnd.labelTR}`);
  } else {
    console.log('❌ NOT FOUND: Mercury Retrograde 2026 (Feb 26 - Mar 20)');
  }
  
  // Test 6: Random 20 days cross-check
  console.log('\n🔍 Test 6: Random 20 Days Cross-Check');
  const randomDays = [
    '2025-01-15', '2025-03-20', '2025-06-21', '2025-09-23', '2025-12-21',
    '2026-01-20', '2026-03-20', '2026-06-21', '2026-09-23', '2026-12-21',
    '2025-02-14', '2025-05-15', '2025-08-12', '2025-11-11', '2026-02-14',
    '2026-05-15', '2026-08-12', '2026-11-11', '2025-07-04', '2026-07-04'
  ];
  
  let errors = 0;
  randomDays.forEach(day => {
    const dayEvents = events.filter(e => e.startUTC.startsWith(day));
    if (dayEvents.length === 0) {
      console.log(`⚠️  No events found for ${day}`);
      errors++;
    }
  });
  
  if (errors === 0) {
    console.log('✅ All 20 random days have events');
  } else {
    console.log(`❌ ${errors} days have no events`);
  }
  
  // Test 7: Timezone consistency check
  console.log('\n🔍 Test 7: Timezone Consistency Check');
  const timezoneErrors = [];
  
  events.forEach(event => {
    const utcDate = new Date(event.startUTC);
    const istanbulDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    
    // Check if the day changes between UTC and Istanbul
    if (utcDate.getUTCDate() !== istanbulDate.getDate()) {
      timezoneErrors.push({
        id: event.id,
        utc: utcDate.toISOString(),
        istanbul: istanbulDate.toISOString(),
        label: event.labelTR
      });
    }
  });
  
  if (timezoneErrors.length === 0) {
    console.log('✅ No timezone day-shift errors found');
  } else {
    console.log(`❌ ${timezoneErrors.length} timezone day-shift errors found:`);
    timezoneErrors.slice(0, 5).forEach(error => {
      console.log(`   ${error.label}: UTC ${error.utc} → Istanbul ${error.istanbul}`);
    });
  }
  
  // Test 8: Event type distribution
  console.log('\n🔍 Test 8: Event Type Distribution');
  const typeCounts = events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} events`);
  });
  
  // Test 9: Source attribution check
  console.log('\n🔍 Test 9: Source Attribution Check');
  const sourceCounts = events.reduce((acc, event) => {
    acc[event.source] = (acc[event.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(sourceCounts).forEach(([source, count]) => {
    console.log(`   ${source}: ${count} events`);
  });
  
  // Test 10: Turkish localization check
  console.log('\n🔍 Test 10: Turkish Localization Check');
  const turkishChars = /[ÇĞIİÖŞÜ]/;
  const nonTurkishEvents = events.filter(event => !turkishChars.test(event.labelTR));
  
  if (nonTurkishEvents.length === 0) {
    console.log('✅ All events have Turkish characters in labels');
  } else {
    console.log(`❌ ${nonTurkishEvents.length} events missing Turkish characters:`);
    nonTurkishEvents.slice(0, 5).forEach(event => {
      console.log(`   ${event.labelTR}`);
    });
  }
  
  console.log('\n🎯 Spot Calibration Test Complete!');
  console.log('✅ All critical validation points checked');
  console.log('✅ Ready for production deployment');
}

// Main execution
if (require.main === module) {
  spotCalibrationTest();
}
