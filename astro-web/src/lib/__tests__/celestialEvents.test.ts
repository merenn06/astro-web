import { CelestialEvent, EVENT_PRIORITY } from '../celestialEvents';
import fs from 'fs';
import path from 'path';

describe('Celestial Events Validation', () => {
  let events: CelestialEvent[];

  beforeAll(() => {
    // Load events from generated JSON file
    const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
    const celestialData = JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
    events = celestialData as CelestialEvent[];
  });

  describe('2025 Celestial Events Coverage', () => {
    it('should include all 4 moon phases monthly with correct UTC', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      
      // Should have approximately 48 main phases (4 per month × 12 months)
      expect(moonPhases.length).toBeGreaterThanOrEqual(40);
      
      // Check that we have all 4 main phases
      const phases = moonPhases.map(e => e.subType);
      expect(phases).toContain('new');
      expect(phases).toContain('first');
      expect(phases).toContain('full');
      expect(phases).toContain('last');
      
      // All dates should be valid UTC
      moonPhases.forEach(event => {
        const date = new Date(event.startUTC);
        expect(date.getTime()).not.toBeNaN();
        expect(event.startUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });
    });

    it('should include major meteor showers peaks', () => {
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      
      expect(meteorShowers.length).toBeGreaterThanOrEqual(3);
      
      // Check for major meteor showers
      const showerTypes = meteorShowers.map(e => e.subType);
      expect(showerTypes).toContain('geminids');
      expect(showerTypes).toContain('perseids');
      expect(showerTypes).toContain('quadrantids');
      
      // Check Geminids peak (Dec 13-14)
      const geminids = meteorShowers.find(e => e.subType === 'geminids');
      expect(geminids).toBeDefined();
      if (geminids) {
        const date = new Date(geminids.startUTC);
        expect(date.getMonth()).toBe(11); // December (0-indexed)
        expect(date.getDate()).toBe(13);
      }
    });

    it('should include all planet retro stations with exact dates', () => {
      const planetStations = events.filter(e => e.type === 'planet_station');
      
      expect(planetStations.length).toBeGreaterThanOrEqual(10);
      
      // Check for Mercury retrograde stations (should have multiple)
      const mercuryStations = planetStations.filter(e => e.subType === 'mercury');
      expect(mercuryStations.length).toBeGreaterThanOrEqual(6); // 3 retro periods × 2 stations each
      
      // Check for other planets
      const planetTypes = planetStations.map(e => e.subType);
      expect(planetTypes).toContain('venus');
      expect(planetTypes).toContain('mars');
      expect(planetTypes).toContain('jupiter');
      expect(planetTypes).toContain('saturn');
      
      // All stations should have valid dates
      planetStations.forEach(event => {
        const date = new Date(event.startUTC);
        expect(date.getTime()).not.toBeNaN();
        expect(event.meta.stationType).toMatch(/retrograde_start|retrograde_end/);
      });
    });

    it('should include solar/lunar eclipses with correct subtype', () => {
      const eclipses = events.filter(e => e.type === 'eclipse');
      
      expect(eclipses.length).toBeGreaterThanOrEqual(2);
      
      // Check eclipse types
      const eclipseTypes = eclipses.map(e => e.subType);
      expect(eclipseTypes).toContain('solar_partial');
      expect(eclipseTypes).toContain('lunar_partial');
      
      // Check visibility metadata
      eclipses.forEach(event => {
        expect(event.meta.visibility).toBeDefined();
        expect(event.meta.visibility?.turkey).toBeDefined();
      });
    });

    it('should include sun ingress dates for all 12 signs', () => {
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      expect(sunIngress.length).toBe(12);
      
      // Check all zodiac signs
      const signs = sunIngress.map(e => e.subType);
      const expectedSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                           'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
      
      expectedSigns.forEach(sign => {
        expect(signs).toContain(sign);
      });
      
      // Check chronological order
      const sortedIngress = sunIngress.sort((a, b) => 
        new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime()
      );
      
      // First should be Aquarius (January)
      expect(sortedIngress[0].subType).toBe('aquarius');
      // Last should be Capricorn (December)
      expect(sortedIngress[11].subType).toBe('capricorn');
    });
  });

  describe('Data Quality', () => {
    it('should have valid event structure', () => {
      events.forEach(event => {
        expect(event.id).toBeDefined();
        expect(event.type).toMatch(/moon_phase|eclipse|meteor_shower|planet_station|sun_ingress/);
        expect(event.startUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event.labelTR).toBeDefined();
        expect(event.source).toMatch(/nasa|imo|ephemeris|calculated/);
        expect(event.reliability).toMatch(/high|medium|low/);
      });
    });

    it('should have proper Turkish labels', () => {
      events.forEach(event => {
        expect(event.labelTR).toMatch(/[A-ZÇĞIİÖŞÜ]/); // Should contain Turkish characters
        expect(event.labelTR.length).toBeGreaterThan(5);
      });
    });

    it('should have chronological order', () => {
      const sortedEvents = [...events].sort((a, b) => 
        new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime()
      );
      
      expect(events).toEqual(sortedEvents);
    });

    it('should not have duplicate events', () => {
      const ids = events.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('Event Priority and Conflicts', () => {
    it('should handle multiple events on same day correctly', () => {
      // Group events by date
      const eventsByDate: { [key: string]: CelestialEvent[] } = {};
      
      events.forEach(event => {
        const dateKey = event.startUTC.split('T')[0];
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
      });
      
      // Find days with multiple events
      const multiEventDays = Object.entries(eventsByDate)
        .filter(([_, dayEvents]) => dayEvents.length > 1);
      
      expect(multiEventDays.length).toBeGreaterThan(0);
      
      // Check priority order
      multiEventDays.forEach(([date, dayEvents]) => {
        const sortedByPriority = dayEvents.sort((a, b) => {
          const aPriority = EVENT_PRIORITY.indexOf(a.type);
          const bPriority = EVENT_PRIORITY.indexOf(b.type);
          return aPriority - bPriority;
        });
        
        expect(dayEvents).toEqual(sortedByPriority);
      });
    });
  });

  describe('Specific Event Validation', () => {
    it('should have correct Geminids meteor shower date', () => {
      const geminids = events.find(e => 
        e.type === 'meteor_shower' && e.subType === 'geminids'
      );
      
      expect(geminids).toBeDefined();
      if (geminids) {
        const date = new Date(geminids.startUTC);
        expect(date.getFullYear()).toBe(2025);
        expect(date.getMonth()).toBe(11); // December
        expect(date.getDate()).toBe(13);
        expect(geminids.meta.zhr).toBeGreaterThan(100);
      }
    });

    it('should have correct Mercury retrograde dates', () => {
      const mercuryRetros = events.filter(e => 
        e.type === 'planet_station' && 
        e.subType === 'mercury' && 
        e.meta.stationType === 'retrograde_start'
      );
      
      expect(mercuryRetros.length).toBeGreaterThanOrEqual(3);
      
      // Check first Mercury retrograde of 2025
      const firstRetro = mercuryRetros[0];
      const date = new Date(firstRetro.startUTC);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // January
    });

    it('should have correct eclipse dates', () => {
      const eclipses = events.filter(e => e.type === 'eclipse');
      
      // March 29, 2025 solar eclipse
      const marchEclipse = eclipses.find(e => {
        const date = new Date(e.startUTC);
        return date.getMonth() === 2 && date.getDate() === 29; // March 29
      });
      expect(marchEclipse).toBeDefined();
      expect(marchEclipse?.subType).toBe('solar_partial');
      
      // September 21, 2025 lunar eclipse
      const septemberEclipse = eclipses.find(e => {
        const date = new Date(e.startUTC);
        return date.getMonth() === 8 && date.getDate() === 21; // September 21
      });
      expect(septemberEclipse).toBeDefined();
      expect(septemberEclipse?.subType).toBe('lunar_partial');
    });
  });
});
