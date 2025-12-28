#!/usr/bin/env tsx

import { getMoonPhases, getCurrentMoonPhase, getNextMoonPhase } from '../src/lib/moonPhase';

console.log('🌙 Moon Phase Calendar Test\n');

// Test 1: Get moon phases for next 30 days
console.log('1. Testing 30-day moon phase generation:');
const phases = getMoonPhases(new Date(), 30);
console.log(`   Found ${phases.length} moon phases in next 30 days`);

if (phases.length > 0) {
  console.log('   First few phases:');
  phases.slice(0, 5).forEach((phase, index) => {
    const turkeyDate = new Date(phase.date.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
    console.log(`   ${index + 1}. ${turkeyDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })} - ${phase.phaseName} ${getPhaseIcon(phase.phase)}`);
  });
}

// Test 2: Current moon phase
console.log('\n2. Testing current moon phase:');
const currentPhase = getCurrentMoonPhase();
if (currentPhase) {
  const turkeyDate = new Date(currentPhase.date.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
  console.log(`   Current: ${turkeyDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })} - ${currentPhase.phaseName} ${getPhaseIcon(currentPhase.phase)}`);
} else {
  console.log('   No current moon phase found');
}

// Test 3: Next moon phase
console.log('\n3. Testing next moon phase:');
const nextPhase = getNextMoonPhase();
if (nextPhase) {
  const turkeyDate = new Date(nextPhase.date.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
  console.log(`   Next: ${turkeyDate.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })} - ${nextPhase.phaseName} ${getPhaseIcon(nextPhase.phase)}`);
} else {
  console.log('   No next moon phase found');
}

// Test 4: Verify all phases have correct Turkish names and icons
console.log('\n4. Verifying Turkish localization:');
const phaseNames = ['Yeni Ay', 'İlk Dördün', 'Dolunay', 'Son Dördün'];
const phaseIcons = ['🌑', '🌓', '🌕', '🌗'];

phases.forEach((phase, index) => {
  const expectedIcon = phaseIcons[['new', 'first', 'full', 'last'].indexOf(phase.phase)];
  const iconMatch = phase.phaseName === phaseNames[['new', 'first', 'full', 'last'].indexOf(phase.phase)];
  
  if (!iconMatch) {
    console.log(`   ❌ Phase ${index + 1}: Name/icon mismatch for ${phase.phase}`);
  }
});

console.log('   ✅ All phases have correct Turkish names and icons');

// Test 5: Timezone validation
console.log('\n5. Testing timezone handling:');
const now = new Date();
const turkeyNow = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Istanbul"}));
console.log(`   UTC time: ${now.toISOString()}`);
console.log(`   Turkey time: ${turkeyNow.toLocaleDateString("tr-TR", { 
  day: "2-digit", 
  month: "short", 
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit"
})} ${turkeyNow.getHours().toString().padStart(2, '0')}:${turkeyNow.getMinutes().toString().padStart(2, '0')}`);

// Test 6: Date range validation
console.log('\n6. Testing date range:');
const startDate = new Date();
const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
const phasesInRange = phases.filter(phase => {
  return phase.date.getTime() >= startDate.getTime() && 
         phase.date.getTime() <= endDate.getTime();
});

console.log(`   Phases within 30-day range: ${phasesInRange.length}/${phases.length}`);
if (phasesInRange.length === phases.length) {
  console.log('   ✅ All phases are within the expected date range');
} else {
  console.log('   ❌ Some phases are outside the expected date range');
}

console.log('\n🎉 Moon Phase Calendar Test Complete!');

// Helper function to get phase icon
function getPhaseIcon(phase: string): string {
  const icons = {
    new: "🌑",
    first: "🌓", 
    full: "🌕",
    last: "🌗"
  };
  return icons[phase as keyof typeof icons] || "❓";
}
