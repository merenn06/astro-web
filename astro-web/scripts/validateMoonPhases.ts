#!/usr/bin/env tsx

import { getMoonPhases } from '../src/lib/moonPhase';

console.log('🔍 Moon Phase Validation\n');

// Known moon phases for October 2025 (from astronomical data)
const knownPhases = [
  { date: '2025-10-07', phase: 'full', name: 'Dolunay' },
  { date: '2025-10-15', phase: 'last', name: 'Son Dördün' },
  { date: '2025-10-22', phase: 'new', name: 'Yeni Ay' },
  { date: '2025-10-29', phase: 'first', name: 'İlk Dördün' },
];

console.log('Validating against known moon phases for October 2025:');
console.log('');

let allCorrect = true;

knownPhases.forEach(known => {
  const testDate = new Date(known.date + 'T12:00:00.000Z');
  const phases = getMoonPhases(testDate, 1);
  
  if (phases.length > 0) {
    const calculated = phases[0];
    const calculatedDate = calculated.date.toISOString().split('T')[0];
    const isCorrect = calculatedDate === known.date && calculated.phase === known.phase;
    
    console.log(`${known.date} (${known.name}):`);
    console.log(`  Expected: ${known.phase} (${known.name})`);
    console.log(`  Calculated: ${calculated.phase} (${calculated.phaseName}) on ${calculatedDate}`);
    console.log(`  Status: ${isCorrect ? '✅ Correct' : '❌ Incorrect'}`);
    
    if (!isCorrect) {
      allCorrect = false;
    }
  } else {
    console.log(`${known.date} (${known.name}): ❌ No phase calculated`);
    allCorrect = false;
  }
  console.log('');
});

console.log(`Overall validation: ${allCorrect ? '✅ All phases correct' : '❌ Some phases incorrect'}`);

// Test 30-day range
console.log('\nTesting 30-day range:');
const startDate = new Date('2025-10-01T12:00:00.000Z');
const phases30 = getMoonPhases(startDate, 30);
console.log(`Generated ${phases30.length} phases for 30 days`);

// Count phase types
const phaseCounts = phases30.reduce((acc, phase) => {
  acc[phase.phase] = (acc[phase.phase] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('Phase distribution:');
Object.entries(phaseCounts).forEach(([phase, count]) => {
  console.log(`  ${phase}: ${count} days`);
});

console.log('\n🎯 Validation Complete!');
