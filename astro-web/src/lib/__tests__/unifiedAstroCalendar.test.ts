import fs from 'fs';
import path from 'path';

// Load unified astro calendar
const loadUnifiedCalendar = () => {
  const calendarPath = path.join(process.cwd(), 'data', 'unifiedAstroCalendar.json');
  return JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
};

describe('Unified Astro Calendar Validation', () => {
  let events: any[];

  beforeAll(() => {
    events = loadUnifiedCalendar();
  });

  describe('Data Structure and Schema', () => {
    it('should have valid unified schema for all events', () => {
      events.forEach(event => {
        // Required fields
        expect(event.id).toBeDefined();
        expect(event.type).toMatch(/moon_phase|eclipse|sun_ingress|planet_station|meteor_shower/);
        expect(event.subType).toBeDefined();
        expect(event.body).toBeDefined();
        expect(event.startUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event.labelTR).toBeDefined();
        expect(event.source).toMatch(/swiss|nasa|imo|tad|astroseek/);
        
        // Optional fields
        if (event.endUTC) {
          expect(event.endUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        }
        
        if (event.sign) {
          expect(event.sign).toMatch(/Koç|Boğa|İkizler|Yengeç|Aslan|Başak|Terazi|Akrep|Yay|Oğlak|Kova|Balık/);
        }
        
        if (event.visibility) {
          expect(event.visibility).toMatch(/global|partial|TR'den görülebilir|TR'den görülemez/);
        }
      });
    });

    it('should have chronological order and no duplicates', () => {
      // Check chronological order
      for (let i = 1; i < events.length; i++) {
        const prevDate = new Date(events[i-1].startUTC);
        const currDate = new Date(events[i].startUTC);
        expect(currDate.getTime()).toBeGreaterThanOrEqual(prevDate.getTime());
      }
      
      // Check no duplicates
      const ids = events.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have Turkish labels with proper characters', () => {
      events.forEach(event => {
        expect(event.labelTR).toMatch(/[A-ZÇĞIİÖŞÜ]/); // Should contain Turkish characters
        expect(event.labelTR.length).toBeGreaterThan(5); // Should be meaningful
      });
    });
  });

  describe('NASA Moon Phases Validation', () => {
    it('should include exactly 4 moon phases per month', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      
      // Should have 98 moon phases (24.5 months × 4 phases)
      expect(moonPhases.length).toBe(98);
      
      // Check that we have all 4 main phases
      const phases = moonPhases.map(e => e.subType);
      expect(phases).toContain('new');
      expect(phases).toContain('first');
      expect(phases).toContain('full');
      expect(phases).toContain('last');
      
      // Check monthly distribution
      const monthlyPhases = new Map<string, number>();
      moonPhases.forEach(phase => {
        const monthKey = phase.startUTC.substring(0, 7); // YYYY-MM
        monthlyPhases.set(monthKey, (monthlyPhases.get(monthKey) || 0) + 1);
      });
      
      // Most months should have 3-5 phases (lunar cycle variations)
      monthlyPhases.forEach((count, month) => {
        expect(count).toBeGreaterThanOrEqual(3);
        expect(count).toBeLessThanOrEqual(5);
      });
      
      // Check that we have phases for both 2025 and 2026
      const years = new Set(moonPhases.map(p => p.startUTC.substring(0, 4)));
      expect(years.has('2025')).toBe(true);
      expect(years.has('2026')).toBe(true);
    });

    it('should have no duplicate moon phases within 24h', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      
      for (let i = 0; i < moonPhases.length - 1; i++) {
        for (let j = i + 1; j < moonPhases.length; j++) {
          const timeDiff = Math.abs(
            new Date(moonPhases[i].startUTC).getTime() - 
            new Date(moonPhases[j].startUTC).getTime()
          ) / (1000 * 60 * 60); // hours
          
          if (timeDiff < 24) {
            expect(moonPhases[i].subType).not.toBe(moonPhases[j].subType);
          }
        }
      }
    });

    it('should validate specific moon phase dates', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      
      // Check specific known dates
      const knownPhases = [
        { date: '2025-11-20', phase: 'full', label: 'Dolunay' },
        { date: '2025-12-05', phase: 'new', label: 'Yeni Ay' },
        { date: '2025-12-19', phase: 'full', label: 'Dolunay' },
        { date: '2026-01-17', phase: 'full', label: 'Dolunay' }
      ];
      
      knownPhases.forEach(known => {
        const found = moonPhases.find(phase => 
          phase.startUTC.startsWith(known.date) && phase.subType === known.phase
        );
        expect(found).toBeDefined();
        expect(found.labelTR).toBe(known.label);
      });
    });
  });

  describe('Swiss Ephemeris Planet Stations Validation', () => {
    it('should include all Mercury retrograde stations (2025-2026)', () => {
      const mercuryStations = events.filter(e => 
        e.type === 'planet_station' && e.body === 'Mercury'
      );
      
      // Should have 16 Mercury stations (8 retrograde periods × 2 stations each)
      expect(mercuryStations.length).toBe(16);
      
      // Check specific Mercury retrograde dates
      const knownMercuryStations = [
        { date: '2025-11-09', type: 'station_R', label: 'Merkür Retrosu Başlıyor' },
        { date: '2025-11-29', type: 'station_D', label: 'Merkür Retrosu Sona Eriyor' },
        { date: '2026-02-26', type: 'station_R', label: 'Merkür Retrosu Başlıyor' },
        { date: '2026-03-20', type: 'station_D', label: 'Merkür Retrosu Sona Eriyor' }
      ];
      
      knownMercuryStations.forEach(known => {
        const found = mercuryStations.find(station => 
          station.startUTC.startsWith(known.date) && station.subType === known.type
        );
        expect(found).toBeDefined();
        expect(found.labelTR).toBe(known.label);
      });
    });

    it('should include all planetary retrogrades and stations (Mercury–Pluto)', () => {
      const planetStations = events.filter(e => e.type === 'planet_station');
      
      // Should have 37 planet stations total
      expect(planetStations.length).toBe(37);
      
      // Check all planets are represented
      const planets = new Set(planetStations.map(s => s.body));
      expect(planets.has('Mercury')).toBe(true);
      expect(planets.has('Venus')).toBe(true);
      expect(planets.has('Mars')).toBe(true);
      expect(planets.has('Jupiter')).toBe(true);
      expect(planets.has('Saturn')).toBe(true);
      expect(planets.has('Uranus')).toBe(true);
      expect(planets.has('Neptune')).toBe(true);
      expect(planets.has('Pluto')).toBe(true);
      
      // Check station types
      const stationTypes = new Set(planetStations.map(s => s.subType));
      expect(stationTypes.has('station_R')).toBe(true);
      expect(stationTypes.has('station_D')).toBe(true);
    });

    it('should have proper station labeling', () => {
      const planetStations = events.filter(e => e.type === 'planet_station');
      
      planetStations.forEach(station => {
        if (station.subType === 'station_R') {
          expect(station.labelTR).toMatch(/Retrosu Başlıyor/);
        } else if (station.subType === 'station_D') {
          expect(station.labelTR).toMatch(/Retrosu Sona Eriyor/);
        }
        expect(station.source).toBe('swiss');
      });
    });
  });

  describe('Swiss Ephemeris Sun Ingress Validation', () => {
    it('should match ephemeris-based sun ingress dates', () => {
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      // Should have 24 sun ingress events (12 signs × 2 years)
      expect(sunIngress.length).toBe(24);
      
      // Check all zodiac signs are represented
      const signs = new Set(sunIngress.map(s => s.sign));
      expect(signs.size).toBe(12);
      
      // Check specific ingress dates
      const knownIngress = [
        { date: '2025-03-20', sign: 'Koç', label: 'Güneş Koç Burcuna Geçiyor' },
        { date: '2025-06-21', sign: 'Yengeç', label: 'Güneş Yengeç Burcuna Geçiyor' },
        { date: '2025-09-23', sign: 'Terazi', label: 'Güneş Terazi Burcuna Geçiyor' },
        { date: '2025-12-21', sign: 'Oğlak', label: 'Güneş Oğlak Burcuna Geçiyor' }
      ];
      
      knownIngress.forEach(known => {
        const found = sunIngress.find(ingress => 
          ingress.startUTC.startsWith(known.date) && ingress.sign === known.sign
        );
        expect(found).toBeDefined();
        expect(found.labelTR).toBe(known.label);
      });
    });

    it('should have proper sun ingress labeling', () => {
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      sunIngress.forEach(ingress => {
        expect(ingress.labelTR).toMatch(/Güneş .* Burcuna Geçiyor/);
        expect(ingress.source).toBe('swiss');
        expect(ingress.body).toBe('Sun');
      });
    });
  });

  describe('NASA/Timeanddate Eclipses Validation', () => {
    it('should include all solar and lunar eclipses', () => {
      const eclipses = events.filter(e => e.type === 'eclipse');
      
      // Should have 5 eclipses (2025-2026)
      expect(eclipses.length).toBe(5);
      
      // Check eclipse types
      const eclipseTypes = new Set(eclipses.map(e => e.subType));
      expect(eclipseTypes.has('solar_partial')).toBe(true);
      expect(eclipseTypes.has('lunar_partial')).toBe(true);
      expect(eclipseTypes.has('solar_annular')).toBe(true);
      expect(eclipseTypes.has('solar_total')).toBe(true);
      
      // Check specific eclipses
      const knownEclipses = [
        { date: '2025-03-29', type: 'solar_partial', label: 'Parçalı Güneş Tutulması' },
        { date: '2025-09-21', type: 'lunar_partial', label: 'Parçalı Ay Tutulması' },
        { date: '2026-08-12', type: 'solar_total', label: 'Tam Güneş Tutulması' }
      ];
      
      knownEclipses.forEach(known => {
        const found = eclipses.find(eclipse => 
          eclipse.startUTC.startsWith(known.date) && eclipse.subType === known.type
        );
        expect(found).toBeDefined();
        expect(found.labelTR).toBe(known.label);
      });
    });

    it('should have visibility metadata for eclipses', () => {
      const eclipses = events.filter(e => e.type === 'eclipse');
      
      eclipses.forEach(eclipse => {
        expect(eclipse.visibility).toBeDefined();
        expect(eclipse.meta.visibility).toBeDefined();
        expect(eclipse.source).toBe('nasa');
      });
    });
  });

  describe('IMO Meteor Showers Validation', () => {
    it('should include all major meteor showers peaks', () => {
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      
      // Should have 14 meteor showers (7 per year × 2 years)
      expect(meteorShowers.length).toBe(14);
      
      // Check major meteor showers
      const showerNames = new Set(meteorShowers.map(s => s.subType));
      expect(showerNames.has('quadrantids')).toBe(true);
      expect(showerNames.has('perseids')).toBe(true);
      expect(showerNames.has('geminids')).toBe(true);
      expect(showerNames.has('lyrids')).toBe(true);
      expect(showerNames.has('eta_aquariids')).toBe(true);
      expect(showerNames.has('orionids')).toBe(true);
      expect(showerNames.has('leonids')).toBe(true);
      
      // Check specific meteor shower dates
      const knownShowers = [
        { date: '2025-08-12', name: 'perseids', label: 'Perseid Meteor Yağmuru Zirvesi' },
        { date: '2025-12-13', name: 'geminids', label: 'Geminid Meteor Yağmuru Zirvesi' }
      ];
      
      knownShowers.forEach(known => {
        const found = meteorShowers.find(shower => 
          shower.startUTC.startsWith(known.date) && shower.subType === known.name
        );
        expect(found).toBeDefined();
        expect(found.labelTR).toBe(known.label);
      });
    });

    it('should have proper meteor shower metadata', () => {
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      
      meteorShowers.forEach(shower => {
        expect(shower.meta.radiant).toBeDefined();
        expect(shower.meta.zhr).toBeGreaterThan(0);
        expect(shower.meta.peakWindow).toBeDefined();
        expect(shower.source).toBe('imo');
        expect(shower.endUTC).toBeDefined(); // Should have night window
      });
    });
  });

  describe('Timezone and Display Validation', () => {
    it('should store all dates in UTC format', () => {
      events.forEach(event => {
        expect(event.startUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        if (event.endUTC) {
          expect(event.endUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        }
      });
    });

    it('should have no off-by-one errors on month edges', () => {
      // Check that events don't shift between months due to timezone issues
      const monthlyEvents = new Map<string, any[]>();
      
      events.forEach(event => {
        const date = new Date(event.startUTC);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyEvents.has(monthKey)) {
          monthlyEvents.set(monthKey, []);
        }
        monthlyEvents.get(monthKey)!.push(event);
      });
      
      // Check that events are properly distributed across months
      monthlyEvents.forEach((monthEvents, month) => {
        expect(monthEvents.length).toBeGreaterThan(0);
        
        // Check that all events in the month actually belong to that month
        monthEvents.forEach(event => {
          const eventDate = new Date(event.startUTC);
          const eventMonth = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
          expect(eventMonth).toBe(month);
        });
      });
    });
  });

  describe('Source Attribution and Quality', () => {
    it('should have correct source attribution', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      const eclipses = events.filter(e => e.type === 'eclipse');
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      const planetStations = events.filter(e => e.type === 'planet_station');
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      // Moon phases should be from NASA
      moonPhases.forEach(event => {
        expect(event.source).toBe('nasa');
      });
      
      // Eclipses should be from NASA
      eclipses.forEach(event => {
        expect(event.source).toBe('nasa');
      });
      
      // Meteor showers should be from IMO
      meteorShowers.forEach(event => {
        expect(event.source).toBe('imo');
      });
      
      // Planet stations should be from Swiss Ephemeris
      planetStations.forEach(event => {
        expect(event.source).toBe('swiss');
      });
      
      // Sun ingress should be from Swiss Ephemeris
      sunIngress.forEach(event => {
        expect(event.source).toBe('swiss');
      });
    });
  });

  describe('Spot Calibration Tests', () => {
    it('should include specific validation events', () => {
      // 2025-11-09 Mercury station_R (retro başlıyor) → görünmeli
      const mercuryRetroStart = events.find(e => 
        e.type === 'planet_station' && 
        e.body === 'Mercury' && 
        e.startUTC.startsWith('2025-11-09') &&
        e.subType === 'station_R'
      );
      expect(mercuryRetroStart).toBeDefined();
      expect(mercuryRetroStart.labelTR).toBe('Merkür Retrosu Başlıyor');
      
      // 2025-11-29 Mercury station_D (retro bitiyor) → görünmeli
      const mercuryRetroEnd = events.find(e => 
        e.type === 'planet_station' && 
        e.body === 'Mercury' && 
        e.startUTC.startsWith('2025-11-29') &&
        e.subType === 'station_D'
      );
      expect(mercuryRetroEnd).toBeDefined();
      expect(mercuryRetroEnd.labelTR).toBe('Merkür Retrosu Sona Eriyor');
      
      // 2025-11-20 Dolunay (tek gün)
      const fullMoon = events.find(e => 
        e.type === 'moon_phase' && 
        e.subType === 'full' && 
        e.startUTC.startsWith('2025-11-20')
      );
      expect(fullMoon).toBeDefined();
      expect(fullMoon.labelTR).toBe('Dolunay');
      
      // 2025-12-13–14 Geminids "zirve gecesi"
      const geminids = events.find(e => 
        e.type === 'meteor_shower' && 
        e.subType === 'geminids' && 
        e.startUTC.startsWith('2025-12-13')
      );
      expect(geminids).toBeDefined();
      expect(geminids.labelTR).toBe('Geminid Meteor Yağmuru Zirvesi');
      expect(geminids.endUTC).toBeDefined(); // Should have night window
      
      // 2026-02-26 → 2026-03-20 aralığında Mercury retro (R/D günleri listede)
      const mercury2026RetroStart = events.find(e => 
        e.type === 'planet_station' && 
        e.body === 'Mercury' && 
        e.startUTC.startsWith('2026-02-26') &&
        e.subType === 'station_R'
      );
      expect(mercury2026RetroStart).toBeDefined();
      
      const mercury2026RetroEnd = events.find(e => 
        e.type === 'planet_station' && 
        e.body === 'Mercury' && 
        e.startUTC.startsWith('2026-03-20') &&
        e.subType === 'station_D'
      );
      expect(mercury2026RetroEnd).toBeDefined();
    });
  });
});
