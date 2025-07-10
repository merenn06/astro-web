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
      expect(['new', 'first', 'full', 'last']).toContain(phase.phase);
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
      first: 'İlk Dördün',
      full: 'Dolunay',
      last: 'Son Dördün'
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
      first: '🌓',
      full: '🌕',
      last: '🌗'
    };
    
    Object.entries(icons).forEach(([phase, expectedIcon]) => {
      expect(getPhaseIcon(phase as Phase)).toBe(expectedIcon);
    });
  });

  it('should return correct phase colors', () => {
    const colors = {
      new: 'text-gray-600',
      first: 'text-blue-600',
      full: 'text-yellow-600',
      last: 'text-purple-600'
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
}); 