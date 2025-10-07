import { fetchAllAstroEvents } from '../astroApis';

describe('Astronomical Events Validation', () => {
  it('should match NASA and AstroSeek event dates (2025)', async () => {
    const marchEvents = await fetchAllAstroEvents(2025, 3);
    const aprilEvents = await fetchAllAstroEvents(2025, 4);
    const allEvents = [...marchEvents, ...aprilEvents];
    
    // Check for Mercury retrograde start on March 15, 2025
    const mercuryRetroStart = allEvents.find(e => 
      e.title.includes('Merkür Retrosu Başlıyor') && 
      e.date.startsWith('2025-03-15')
    );
    expect(mercuryRetroStart).toBeDefined();
    
    // Check for Mercury retrograde end on April 7, 2025
    const mercuryRetroEnd = allEvents.find(e => 
      e.title.includes('Merkür Retrosu Sona Eriyor') && 
      e.date.startsWith('2025-04-07')
    );
    expect(mercuryRetroEnd).toBeDefined();
    
    // Check for solar eclipse on March 29, 2025
    const solarEclipse = marchEvents.find(e => 
      e.title.includes('Güneş Tutulması') && 
      e.date.startsWith('2025-03-29')
    );
    expect(solarEclipse).toBeDefined();
  });

  it('should contain 3 Mercury retro periods in 2025', async () => {
    const marchEvents = await fetchAllAstroEvents(2025, 3);
    const julyEvents = await fetchAllAstroEvents(2025, 7);
    const novemberEvents = await fetchAllAstroEvents(2025, 11);
    
    const allEvents = [...marchEvents, ...julyEvents, ...novemberEvents];
    
    const mercuryRetroStarts = allEvents.filter(e => 
      e.title.includes('Merkür Retrosu Başlıyor')
    );
    
    expect(mercuryRetroStarts).toHaveLength(3);
    
    // Verify specific dates
    const dates = mercuryRetroStarts.map(e => e.date.split('T')[0]);
    expect(dates).toContain('2025-03-15');
    expect(dates).toContain('2025-07-17');
    expect(dates).toContain('2025-11-09');
  });

  it('should include Geminid Meteor Shower on Dec 14', async () => {
    const events = await fetchAllAstroEvents(2025, 12);
    
    const geminidMeteor = events.find(e => 
      e.title.includes('Geminid Meteor Yağmuru') && 
      e.date.startsWith('2025-12-14')
    );
    
    expect(geminidMeteor).toBeDefined();
    expect(geminidMeteor?.description).toContain('Geminid meteor yağmuru');
  });

  it('should list Sun sign ingress dates accurately', async () => {
    const marchEvents = await fetchAllAstroEvents(2025, 3);
    const juneEvents = await fetchAllAstroEvents(2025, 6);
    const septemberEvents = await fetchAllAstroEvents(2025, 9);
    const decemberEvents = await fetchAllAstroEvents(2025, 12);
    
    const allEvents = [...marchEvents, ...juneEvents, ...septemberEvents, ...decemberEvents];
    
    // Check for Sun sign transitions
    const sunTransitions = allEvents.filter(e => 
      e.title.includes('Güneş') && e.title.includes('Burcuna Geçiş')
    );
    
    expect(sunTransitions.length).toBeGreaterThanOrEqual(4);
    
    // Verify specific transitions
    const ariesTransition = sunTransitions.find(e => 
      e.title.includes('Koç Burcuna Geçiş') && e.date.startsWith('2025-03-20')
    );
    expect(ariesTransition).toBeDefined();
    
    const cancerTransition = sunTransitions.find(e => 
      e.title.includes('Yengeç Burcuna Geçiş') && e.date.startsWith('2025-06-21')
    );
    expect(cancerTransition).toBeDefined();
    
    const libraTransition = sunTransitions.find(e => 
      e.title.includes('Terazi Burcuna Geçiş') && e.date.startsWith('2025-09-23')
    );
    expect(libraTransition).toBeDefined();
    
    const capricornTransition = sunTransitions.find(e => 
      e.title.includes('Oğlak Burcuna Geçiş') && e.date.startsWith('2025-12-21')
    );
    expect(capricornTransition).toBeDefined();
  });

  it('should have proper event type normalization', async () => {
    const events = await fetchAllAstroEvents(2025, 3);
    
    // Check that retrograde events have proper naming
    const retroEvents = events.filter(e => e.title.includes('Retrosu'));
    
    retroEvents.forEach(event => {
      expect(event.title).toMatch(/Başlıyor|Sona Eriyor|Retrosu$/);
      expect(event.description).toBeTruthy();
      expect(event.icon).toBe('🔄');
    });
  });

  it('should include all major astronomical events for 2025', async () => {
    const marchEvents = await fetchAllAstroEvents(2025, 3);
    const julyEvents = await fetchAllAstroEvents(2025, 7);
    const novemberEvents = await fetchAllAstroEvents(2025, 11);
    const decemberEvents = await fetchAllAstroEvents(2025, 12);
    const allEvents = [...marchEvents, ...julyEvents, ...novemberEvents, ...decemberEvents];
    
    // Check for various event types
    const eventTypes = allEvents.map(e => e.type);
    
    expect(eventTypes).toContain('moon_phase');
    expect(eventTypes).toContain('astronomical');
    
    // Check for specific events
    const titles = allEvents.map(e => e.title);
    
    expect(titles.some(title => title.includes('Merkür Retrosu'))).toBe(true);
    expect(titles.some(title => title.includes('Güneş Tutulması'))).toBe(true);
    expect(titles.some(title => title.includes('Ay Tutulması'))).toBe(true);
    expect(titles.some(title => title.includes('Meteor Yağmuru'))).toBe(true);
    expect(titles.some(title => title.includes('Burcuna Geçiş'))).toBe(true);
  });

  it('should validate 2026 events as well', async () => {
    const augustEvents = await fetchAllAstroEvents(2026, 8);
    const septemberEvents = await fetchAllAstroEvents(2026, 9);
    const allEvents = [...augustEvents, ...septemberEvents];
    
    // Check for Mercury retrograde in 2026
    const mercuryRetro = allEvents.find(e => 
      e.title.includes('Merkür Retrosu') && 
      e.date.startsWith('2026-09-19')
    );
    expect(mercuryRetro).toBeDefined();
    
    // Check for solar eclipse in 2026
    const solarEclipse = augustEvents.find(e => 
      e.title.includes('Güneş Tutulması') && 
      e.date.startsWith('2026-08-12')
    );
    expect(solarEclipse).toBeDefined();
  });
});
