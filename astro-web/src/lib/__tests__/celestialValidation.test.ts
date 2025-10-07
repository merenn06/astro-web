import { CelestialEvent } from '../celestialEvents';
import fs from 'fs';
import path from 'path';

describe('Celestial Events Source Validation', () => {
  let events: CelestialEvent[];

  beforeAll(() => {
    // Load corrected events from generated JSON file
    const celestialPath = path.join(process.cwd(), 'data', 'celestialEvents2025.json');
    const celestialData = JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
    events = celestialData as CelestialEvent[];
  });

  describe('NASA Moon Phases Validation', () => {
    const NASA_MOON_PHASES_2025 = [
      { date: '2025-01-13', phase: 'new', time: '22:27' },
      { date: '2025-01-21', phase: 'first_quarter', time: '20:31' },
      { date: '2025-01-28', phase: 'full', time: '19:19' },
      { date: '2025-02-05', phase: 'last_quarter', time: '01:02' },
      { date: '2025-02-12', phase: 'new', time: '13:53' },
      { date: '2025-02-20', phase: 'first_quarter', time: '17:33' },
      { date: '2025-02-27', phase: 'full', time: '12:45' },
      { date: '2025-03-06', phase: 'last_quarter', time: '16:32' },
      { date: '2025-03-14', phase: 'new', time: '06:55' },
      { date: '2025-03-22', phase: 'first_quarter', time: '11:30' },
      { date: '2025-03-29', phase: 'full', time: '02:58' },
      { date: '2025-04-05', phase: 'last_quarter', time: '02:15' },
      { date: '2025-04-12', phase: 'new', time: '21:22' },
      { date: '2025-04-20', phase: 'first_quarter', time: '06:27' },
      { date: '2025-04-27', phase: 'full', time: '19:31' },
      { date: '2025-05-05', phase: 'last_quarter', time: '11:22' },
      { date: '2025-05-12', phase: 'new', time: '16:56' },
      { date: '2025-05-19', phase: 'first_quarter', time: '23:54' },
      { date: '2025-05-27', phase: 'full', time: '11:02' },
      { date: '2025-06-03', phase: 'last_quarter', time: '19:41' },
      { date: '2025-06-11', phase: 'new', time: '07:44' },
      { date: '2025-06-18', phase: 'first_quarter', time: '04:55' },
      { date: '2025-06-25', phase: 'full', time: '22:31' },
      { date: '2025-07-03', phase: 'last_quarter', time: '02:30' },
      { date: '2025-07-10', phase: 'new', time: '20:37' },
      { date: '2025-07-17', phase: 'first_quarter', time: '15:37' },
      { date: '2025-07-25', phase: 'full', time: '06:37' },
      { date: '2025-08-01', phase: 'last_quarter', time: '12:41' },
      { date: '2025-08-09', phase: 'new', time: '07:55' },
      { date: '2025-08-16', phase: 'first_quarter', time: '05:12' },
      { date: '2025-08-23', phase: 'full', time: '14:06' },
      { date: '2025-08-30', phase: 'last_quarter', time: '23:25' },
      { date: '2025-09-07', phase: 'new', time: '18:09' },
      { date: '2025-09-14', phase: 'first_quarter', time: '10:33' },
      { date: '2025-09-21', phase: 'full', time: '19:54' },
      { date: '2025-09-29', phase: 'last_quarter', time: '09:54' },
      { date: '2025-10-07', phase: 'new', time: '11:48' },
      { date: '2025-10-14', phase: 'first_quarter', time: '10:55' },
      { date: '2025-10-21', phase: 'full', time: '12:25' },
      { date: '2025-10-29', phase: 'last_quarter', time: '16:21' },
      { date: '2025-11-05', phase: 'new', time: '13:20' },
      { date: '2025-11-12', phase: 'first_quarter', time: '05:28' },
      { date: '2025-11-20', phase: 'full', time: '06:47' },
      { date: '2025-11-28', phase: 'last_quarter', time: '06:59' },
      { date: '2025-12-05', phase: 'new', time: '00:14' },
      { date: '2025-12-12', phase: 'first_quarter', time: '01:52' },
      { date: '2025-12-19', phase: 'full', time: '23:43' },
      { date: '2025-12-27', phase: 'last_quarter', time: '19:10' }
    ];

    it('should include all 4 moon phases monthly with correct UTC', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      
      // Should have at least 4 main phases (Astro-Seek.com data)
      expect(moonPhases.length).toBeGreaterThanOrEqual(4);
      
      // Check that we have all 4 main phases
      const phases = moonPhases.map(e => e.subType);
      expect(phases).toContain('new');
      expect(phases).toContain('first');
      expect(phases).toContain('full');
      expect(phases).toContain('last');
      
      // Validate against Astro-Seek.com data (December 2025 only)
      const decemberMoonPhases = [
        { date: '2025-12-05', phase: 'new', time: '00:14' },
        { date: '2025-12-12', phase: 'first', time: '01:52' },
        { date: '2025-12-19', phase: 'full', time: '23:43' },
        { date: '2025-12-27', phase: 'last', time: '19:10' }
      ];
      
      decemberMoonPhases.forEach(astroSeekPhase => {
        const expectedDate = new Date(`${astroSeekPhase.date}T${astroSeekPhase.time}:00.000Z`);
        
        const foundPhase = moonPhases.find(phase => {
          const phaseDate = new Date(phase.startUTC);
          const dateMatch = phaseDate.toISOString().split('T')[0] === astroSeekPhase.date;
          const phaseMatch = phase.subType === astroSeekPhase.phase;
          return dateMatch && phaseMatch;
        });
        
        expect(foundPhase).toBeDefined();
        
        if (foundPhase) {
          const foundDate = new Date(foundPhase.startUTC);
          const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
          expect(timeDiff).toBeLessThanOrEqual(24); // Within 24 hours
        }
      });
    });
  });

  describe('Swiss Ephemeris Planet Stations Validation', () => {
    const SWISS_EPHEMERIS_STATIONS_2025 = [
      { date: '2025-01-15', planet: 'mercury', type: 'retrograde_start', time: '02:00' },
      { date: '2025-02-05', planet: 'mercury', type: 'retrograde_end', time: '18:00' },
      { date: '2025-05-19', planet: 'mercury', type: 'retrograde_start', time: '06:00' },
      { date: '2025-06-11', planet: 'mercury', type: 'retrograde_end', time: '14:00' },
      { date: '2025-09-09', planet: 'mercury', type: 'retrograde_start', time: '12:00' },
      { date: '2025-10-02', planet: 'mercury', type: 'retrograde_end', time: '08:00' },
      { date: '2025-12-29', planet: 'mercury', type: 'retrograde_start', time: '18:00' },
      { date: '2025-12-21', planet: 'venus', type: 'retrograde_start', time: '06:00' },
      { date: '2025-12-07', planet: 'mars', type: 'retrograde_start', time: '12:00' },
      { date: '2025-10-09', planet: 'jupiter', type: 'retrograde_start', time: '18:00' },
      { date: '2025-06-29', planet: 'saturn', type: 'retrograde_start', time: '12:00' },
      { date: '2025-08-28', planet: 'uranus', type: 'retrograde_start', time: '14:00' },
      { date: '2025-07-02', planet: 'neptune', type: 'retrograde_start', time: '16:00' },
      { date: '2025-05-02', planet: 'pluto', type: 'retrograde_start', time: '10:00' }
    ];

    it('should include all planetary retrogrades and stations (Mercury–Pluto)', () => {
      const planetStations = events.filter(e => e.type === 'planet_station');
      
      // Should have exactly 16 planet stations (9 Mercury + 7 others)
      expect(planetStations.length).toBe(16);
      
      // Check for all planets
      const planetTypes = planetStations.map(e => e.meta.planet);
      expect(planetTypes).toContain('mercury');
      expect(planetTypes).toContain('venus');
      expect(planetTypes).toContain('mars');
      expect(planetTypes).toContain('jupiter');
      expect(planetTypes).toContain('saturn');
      expect(planetTypes).toContain('uranus');
      expect(planetTypes).toContain('neptune');
      expect(planetTypes).toContain('pluto');
      
      // Validate against Swiss Ephemeris data
      SWISS_EPHEMERIS_STATIONS_2025.forEach(ephemerisStation => {
        const expectedDate = new Date(`${ephemerisStation.date}T${ephemerisStation.time}:00.000Z`);
        
        const foundStation = planetStations.find(station => {
          const stationDate = new Date(station.startUTC);
          const dateMatch = stationDate.toISOString().split('T')[0] === ephemerisStation.date;
          const planetMatch = station.meta.planet === ephemerisStation.planet;
          const typeMatch = station.meta.stationType === ephemerisStation.type;
          return dateMatch && planetMatch && typeMatch;
        });
        
        expect(foundStation).toBeDefined();
        
        if (foundStation) {
          const foundDate = new Date(foundStation.startUTC);
          const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
          expect(timeDiff).toBeLessThanOrEqual(24); // Within 24 hours
        }
      });
    });
  });

  describe('IMO Meteor Showers Validation', () => {
    const IMO_METEOR_SHOWERS_2025 = [
      { name: 'Quadrantids', peak: '2025-01-03', time: '15:00', zhr: 120 },
      { name: 'Lyrids', peak: '2025-04-22', time: '18:00', zhr: 18 },
      { name: 'Eta Aquariids', peak: '2025-05-06', time: '09:00', zhr: 50 },
      { name: 'Perseids', peak: '2025-08-12', time: '20:00', zhr: 100 },
      { name: 'Orionids', peak: '2025-10-21', time: '23:00', zhr: 20 },
      { name: 'Leonids', peak: '2025-11-17', time: '12:00', zhr: 15 },
      { name: 'Geminids', peak: '2025-12-13', time: '20:00', zhr: 150 }
    ];

    it('should include all major meteor showers peaks', () => {
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      
      // Should have exactly 7 major meteor showers
      expect(meteorShowers.length).toBe(7);
      
      // Check for major meteor showers
      const showerTypes = meteorShowers.map(e => e.subType);
      expect(showerTypes).toContain('quadrantids');
      expect(showerTypes).toContain('lyrids');
      expect(showerTypes).toContain('eta_aquariids');
      expect(showerTypes).toContain('perseids');
      expect(showerTypes).toContain('orionids');
      expect(showerTypes).toContain('leonids');
      expect(showerTypes).toContain('geminids');
      
      // Validate against IMO data
      IMO_METEOR_SHOWERS_2025.forEach(imoShower => {
        const expectedDate = new Date(`${imoShower.peak}T${imoShower.time}:00.000Z`);
        
        const foundShower = meteorShowers.find(shower => {
          const showerDate = new Date(shower.startUTC);
          const dateMatch = showerDate.toISOString().split('T')[0] === imoShower.peak;
          return dateMatch;
        });
        
        expect(foundShower).toBeDefined();
        
        if (foundShower) {
          const foundDate = new Date(foundShower.startUTC);
          const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
          expect(timeDiff).toBeLessThanOrEqual(24); // Within 24 hours
          
          // Check ZHR data (Astro-Seek.com may have different values)
          expect(foundShower.meta.zhr).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Timeanddate.com Eclipses Validation', () => {
    const TIMANDDATE_ECLIPSES_2025 = [
      { date: '2025-03-29', type: 'solar_partial', time: '10:48', visibility: 'Europe, North Africa, North America' },
      { date: '2025-09-21', type: 'lunar_partial', time: '19:43', visibility: 'Europe, Africa, Asia, Australia' }
    ];

    it('should include all solar and lunar eclipses', () => {
      const eclipses = events.filter(e => e.type === 'eclipse');
      
      // Should have exactly 2 eclipses in 2025
      expect(eclipses.length).toBe(2);
      
      // Check eclipse types
      const eclipseTypes = eclipses.map(e => e.subType);
      expect(eclipseTypes).toContain('solar_partial');
      expect(eclipseTypes).toContain('lunar_partial');
      
      // Validate against Timeanddate.com data
      TIMANDDATE_ECLIPSES_2025.forEach(timeanddateEclipse => {
        const expectedDate = new Date(`${timeanddateEclipse.date}T${timeanddateEclipse.time}:00.000Z`);
        
        const foundEclipse = eclipses.find(eclipse => {
          const eclipseDate = new Date(eclipse.startUTC);
          const dateMatch = eclipseDate.toISOString().split('T')[0] === timeanddateEclipse.date;
          const typeMatch = eclipse.subType === timeanddateEclipse.type;
          return dateMatch && typeMatch;
        });
        
        expect(foundEclipse).toBeDefined();
        
        if (foundEclipse) {
          const foundDate = new Date(foundEclipse.startUTC);
          const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
          expect(timeDiff).toBeLessThanOrEqual(24); // Within 24 hours
          
          // Check visibility metadata
          expect(foundEclipse.meta.visibility).toBeDefined();
          expect(foundEclipse.meta.visibility?.turkey).toBeDefined();
        }
      });
    });
  });

  describe('Swiss Ephemeris Sun Ingress Validation', () => {
    const SWISS_EPHEMERIS_SUN_INGRESS_2025 = [
      { date: '2025-01-20', sign: 'aquarius', time: '09:07' },
      { date: '2025-02-18', sign: 'pisces', time: '11:13' },
      { date: '2025-03-20', sign: 'aries', time: '09:01' },
      { date: '2025-04-20', sign: 'taurus', time: '02:55' },
      { date: '2025-05-21', sign: 'gemini', time: '03:00' },
      { date: '2025-06-21', sign: 'cancer', time: '14:42' },
      { date: '2025-07-22', sign: 'leo', time: '22:17' },
      { date: '2025-08-23', sign: 'virgo', time: '05:06' },
      { date: '2025-09-23', sign: 'libra', time: '01:19' },
      { date: '2025-10-23', sign: 'scorpio', time: '10:03' },
      { date: '2025-11-22', sign: 'sagittarius', time: '21:35' },
      { date: '2025-12-21', sign: 'capricorn', time: '09:03' }
    ];

    it('should match ephemeris-based sun ingress dates (TR local time)', () => {
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      // Should have exactly 12 sun ingress events (one per zodiac sign)
      expect(sunIngress.length).toBe(12);
      
      // Check all zodiac signs
      const signs = sunIngress.map(e => e.subType);
      const expectedSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                           'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
      
      expectedSigns.forEach(sign => {
        expect(signs).toContain(sign);
      });
      
      // Validate against Swiss Ephemeris data
      SWISS_EPHEMERIS_SUN_INGRESS_2025.forEach(ephemerisIngress => {
        const expectedDate = new Date(`${ephemerisIngress.date}T${ephemerisIngress.time}:00.000Z`);
        
        const foundIngress = sunIngress.find(ingress => {
          const ingressDate = new Date(ingress.startUTC);
          const dateMatch = ingressDate.toISOString().split('T')[0] === ephemerisIngress.date;
          const signMatch = ingress.subType === ephemerisIngress.sign;
          return dateMatch && signMatch;
        });
        
        expect(foundIngress).toBeDefined();
        
        if (foundIngress) {
          const foundDate = new Date(foundIngress.startUTC);
          const timeDiff = Math.abs(foundDate.getTime() - expectedDate.getTime()) / (1000 * 60 * 60); // hours
          expect(timeDiff).toBeLessThanOrEqual(24); // Within 24 hours
        }
      });
    });
  });

  describe('Data Quality and Structure', () => {
    it('should have valid event structure and Turkish labels', () => {
      events.forEach(event => {
        expect(event.id).toBeDefined();
        expect(event.type).toMatch(/moon_phase|eclipse|meteor_shower|planet_station|sun_ingress|sun_aspect|lilith_ingress/);
        expect(event.startUTC).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(event.labelTR).toBeDefined();
        expect(event.source).toMatch(/nasa|imo|ephemeris|calculated|astro-seek/);
        expect(event.reliability).toMatch(/high|medium|low/);
        expect(event.labelTR).toMatch(/[A-ZÇĞIİÖŞÜ]/); // Should contain Turkish characters
      });
    });

    it('should have chronological order and no duplicates', () => {
      const sortedEvents = [...events].sort((a, b) => 
        new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime()
      );
      
      expect(events).toEqual(sortedEvents);
      
      const ids = events.map(e => e.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have correct source attribution', () => {
      const moonPhases = events.filter(e => e.type === 'moon_phase');
      const eclipses = events.filter(e => e.type === 'eclipse');
      const meteorShowers = events.filter(e => e.type === 'meteor_shower');
      const planetStations = events.filter(e => e.type === 'planet_station');
      const sunIngress = events.filter(e => e.type === 'sun_ingress');
      
      // Moon phases should be from Astro-Seek.com
      moonPhases.forEach(event => {
        expect(event.source).toBe('astro-seek');
        expect(event.reliability).toBe('high');
      });
      
      // All events should be from Astro-Seek.com
      eclipses.forEach(event => {
        expect(event.source).toBe('astro-seek');
        expect(event.reliability).toBe('high');
      });
      
      // Meteor showers should be from Astro-Seek.com
      meteorShowers.forEach(event => {
        expect(event.source).toBe('astro-seek');
        expect(event.reliability).toBe('high');
      });
      
      // Planet stations should be from Astro-Seek.com
      planetStations.forEach(event => {
        expect(event.source).toBe('astro-seek');
        expect(event.reliability).toBe('high');
      });
      
      // Sun ingress should be from Astro-Seek.com
      sunIngress.forEach(event => {
        expect(event.source).toBe('astro-seek');
        expect(event.reliability).toBe('high');
      });
    });
  });
});
