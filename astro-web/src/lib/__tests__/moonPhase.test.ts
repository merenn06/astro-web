import { getMoonPhases, getCurrentMoonPhase, getNextMoonPhase, getPhaseIcon, getPhaseColor, Phase } from '../moonPhase';

describe('Moon Phase Calculations', () => {
  it('should return moon phases for the next 30 days', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    expect(phases).toBeInstanceOf(Array);
    expect(phases.length).toBeGreaterThan(0);
    expect(phases.length).toBeLessThanOrEqual(30);
    
    // Check that all phases have required properties
    phases.forEach(phase => {
      expect(phase).toHaveProperty('date');
      expect(phase).toHaveProperty('phase');
      expect(phase).toHaveProperty('phaseName');
      expect(phase).toHaveProperty('phaseDescription');
      expect(phase.date).toBeInstanceOf(Date);
      expect(['new', 'waxing_crescent', 'first', 'waxing_gibbous', 'full', 'waning_gibbous', 'last', 'waning_crescent']).toContain(phase.phase);
    });
  });

  it('should return phases within the specified date range', () => {
    const startDate = new Date('2024-01-01');
    const phases = getMoonPhases(startDate, 10);
    
    expect(phases.length).toBeLessThanOrEqual(10);
    
    phases.forEach(phase => {
      expect(phase.date.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
      expect(phase.date.getTime()).toBeLessThanOrEqual(
        new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000).getTime()
      );
    });
  });

  it('should return correct phase names in Turkish', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    const phaseNames = {
      new: 'Yeni Ay',
      waxing_crescent: 'Büyüyen Hilal',
      first: 'İlk Dördün',
      waxing_gibbous: 'Büyüyen Şişkin Ay',
      full: 'Dolunay',
      waning_gibbous: 'Azalan Şişkin Ay',
      last: 'Son Dördün',
      waning_crescent: 'Azalan Hilal'
    };
    
    phases.forEach(phase => {
      expect(phase.phaseName).toBe(phaseNames[phase.phase]);
    });
  });

  it('should return correct phase descriptions', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    phases.forEach(phase => {
      expect(phase.phaseDescription).toBeTruthy();
      expect(typeof phase.phaseDescription).toBe('string');
      expect(phase.phaseDescription.length).toBeGreaterThan(0);
    });
  });

  it('should return correct phase icons', () => {
    const icons = {
      new: '🌑',
      waxing_crescent: '🌒',
      first: '🌓',
      waxing_gibbous: '🌔',
      full: '🌕',
      waning_gibbous: '🌖',
      last: '🌗',
      waning_crescent: '🌘'
    };
    
    Object.entries(icons).forEach(([phase, expectedIcon]) => {
      expect(getPhaseIcon(phase as Phase)).toBe(expectedIcon);
    });
  });

  it('should return correct phase colors', () => {
    const colors = {
      new: 'text-gray-600',
      waxing_crescent: 'text-blue-500',
      first: 'text-blue-600',
      waxing_gibbous: 'text-green-600',
      full: 'text-yellow-600',
      waning_gibbous: 'text-orange-600',
      last: 'text-purple-600',
      waning_crescent: 'text-indigo-600'
    };
    
    Object.entries(colors).forEach(([phase, expectedColor]) => {
      expect(getPhaseColor(phase as Phase)).toBe(expectedColor);
    });
  });

  it('should return current moon phase', () => {
    const currentPhase = getCurrentMoonPhase();
    
    if (currentPhase) {
      expect(currentPhase).toHaveProperty('date');
      expect(currentPhase).toHaveProperty('phase');
      expect(currentPhase).toHaveProperty('phaseName');
      expect(currentPhase).toHaveProperty('phaseDescription');
    }
  });

  it('should return next moon phase', () => {
    const nextPhase = getNextMoonPhase();
    
    if (nextPhase) {
      expect(nextPhase).toHaveProperty('date');
      expect(nextPhase).toHaveProperty('phase');
      expect(nextPhase).toHaveProperty('phaseName');
      expect(nextPhase).toHaveProperty('phaseDescription');
      expect(nextPhase.date.getTime()).toBeGreaterThanOrEqual(new Date().getTime());
    }
  });

  it('should handle different start dates correctly', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-06-15');
    
    const phases1 = getMoonPhases(date1, 5);
    const phases2 = getMoonPhases(date2, 5);
    
    expect(phases1.length).toBeLessThanOrEqual(5);
    expect(phases2.length).toBeLessThanOrEqual(5);
    
    // Phases should be different for different dates
    if (phases1.length > 0 && phases2.length > 0) {
      expect(phases1[0].date.getTime()).not.toBe(phases2[0].date.getTime());
    }
  });

  it('should return phases in chronological order', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    for (let i = 1; i < phases.length; i++) {
      expect(phases[i].date.getTime()).toBeGreaterThan(phases[i-1].date.getTime());
    }
  });

  it('should handle edge cases', () => {
    // Test with 0 days
    const phases0 = getMoonPhases(new Date(), 0);
    expect(phases0).toEqual([]);
    
    // Test with negative days
    const phasesNegative = getMoonPhases(new Date(), -5);
    expect(phasesNegative).toEqual([]);
    
    // Test with very large number of days
    const phasesLarge = getMoonPhases(new Date(), 1000);
    expect(phasesLarge.length).toBeLessThanOrEqual(1000);
  });

  it('should anchor key phases on 2025-10-23/30 and 2025-11-05', () => {
    const startDate = new Date('2025-10-23T12:00:00.000Z');
    const phases = getMoonPhases(startDate, 20);
    
    // Check for New Moon on Oct 23
    const oct23 = phases.find(p => p.date.toISOString().startsWith('2025-10-23'));
    expect(oct23?.phase).toBe('new');
    
    // Check for First Quarter on Oct 30
    const oct30 = phases.find(p => p.date.toISOString().startsWith('2025-10-30'));
    expect(oct30?.phase).toBe('first');
    
    // Check for Full Moon on Nov 5
    const nov5 = phases.find(p => p.date.toISOString().startsWith('2025-11-05'));
    expect(nov5?.phase).toBe('full');
  });

  it('should not show the same major phase more than 3 consecutive days', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    let consecutiveCount = 1;
    let lastPhase = phases[0]?.phase;
    
    for (let i = 1; i < phases.length; i++) {
      if (phases[i].phase === lastPhase && 
          ['new', 'first', 'full', 'last'].includes(phases[i].phase)) {
        consecutiveCount++;
        expect(consecutiveCount).toBeLessThanOrEqual(3);
      } else {
        consecutiveCount = 1;
        lastPhase = phases[i].phase;
      }
    }
  });

  it('should label transitional days as crescent/gibbous accordingly', () => {
    const phases = getMoonPhases(new Date(), 30);
    
    // Check for transitional phases
    const transitionalPhases = phases.filter(p => 
      ['waxing_crescent', 'waxing_gibbous', 'waning_gibbous', 'waning_crescent'].includes(p.phase)
    );
    
    expect(transitionalPhases.length).toBeGreaterThan(0);
    
    // Verify transitional phase names
    transitionalPhases.forEach(phase => {
      expect(phase.phaseName).toMatch(/Hilal|Şişkin Ay/);
    });
  });

  it('should return exactly 30 items for 30-day window', () => {
    const phases = getMoonPhases(new Date(), 30);
    expect(phases).toHaveLength(30);
  });
}); 