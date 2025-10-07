#!/usr/bin/env tsx

import { getMoonPhases } from '../src/lib/moonPhase';

console.log('🔍 Moon Phase Debug\n');

// Test target dates
const targetDates = [
  '2025-10-23', // New Moon
  '2025-10-30', // First Quarter  
  '2025-11-05'  // Full Moon
];

targetDates.forEach(targetDate => {
  const startDate = new Date(targetDate + 'T12:00:00.000Z');
  const phases = getMoonPhases(startDate, 1);
  
  if (phases.length > 0) {
    const phase = phases[0];
    console.log(`${targetDate}: ${phase.phaseName} (${phase.phase})`);
  } else {
    console.log(`${targetDate}: No phase found`);
  }
});

console.log('\n30-day phase distribution:');
const phases30 = getMoonPhases(new Date(), 30);
const phaseCounts = phases30.reduce((acc, phase) => {
  acc[phase.phase] = (acc[phase.phase] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

Object.entries(phaseCounts).forEach(([phase, count]) => {
  console.log(`  ${phase}: ${count} days`);
});

console.log('\nFirst 10 phases:');
phases30.slice(0, 10).forEach((phase, index) => {
  const turkeyDate = new Date(phase.date.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
  console.log(`${index + 1}. ${turkeyDate.toISOString().split('T')[0]} - ${phase.phaseName}`);
});

console.log('\n🎯 Debug Complete!');
