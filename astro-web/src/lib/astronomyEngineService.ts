/**
 * Astronomy Engine Service
 * 
 * High-precision astronomical calculations using Astronomy Engine library
 * Provides accurate celestial events data for the calendar
 */

import { 
  Astronomy, 
  MoonPhase, 
  Planet, 
  Body, 
  SearchMoonPhase, 
  SearchPlanetApsis, 
  SearchPlanetRetrograde,
  SearchSunLongitude,
  Time,
  AngleFromLongitude,
  LongitudeFromAngle
} from 'astronomy-engine';

export interface AstronomyEngineEvent {
  id: string;
  type: 'moon_phase' | 'planet_station' | 'sun_ingress' | 'eclipse' | 'meteor_shower';
  subType: string;
  body: string;
  startUTC: string;
  endUTC?: string;
  labelTR: string;
  source: 'astronomy_engine';
  meta?: any;
}

export interface MoonPhaseData {
  phase: MoonPhase;
  illumination: number;
  age: number;
  nextPhase: MoonPhase;
  nextPhaseDate: Date;
}

class AstronomyEngineService {
  private cache = new Map<string, AstronomyEngineEvent[]>();
  private cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get moon phases for a given month
   */
  async getMoonPhasesForMonth(year: number, month: number): Promise<AstronomyEngineEvent[]> {
    const cacheKey = `moon_phases_${year}_${month}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const events: AstronomyEngineEvent[] = [];
      const startTime = new Time(year, month, 1, 0, 0, 0);
      const endTime = new Time(year, month + 1, 1, 0, 0, 0);

      // Find all moon phases in the month
      let searchTime = startTime;
      let phaseCount = 0;
      const maxPhases = 8; // Safety limit

      while (searchTime.ut < endTime.ut && phaseCount < maxPhases) {
        try {
          const phaseTime = SearchMoonPhase(MoonPhase.NewMoon, searchTime, 30);
          
          if (phaseTime.ut >= endTime.ut) break;

          const phase = this.getMoonPhaseType(phaseTime);
          const phaseName = this.getMoonPhaseNameTR(phase);
          
          events.push({
            id: `moon-${phase}-${year}-${String(month).padStart(2, '0')}-${phaseTime.date.day}`,
            type: 'moon_phase',
            subType: phase,
            body: 'Moon',
            startUTC: phaseTime.date.toISOString(),
            labelTR: phaseName,
            source: 'astronomy_engine',
            meta: {
              phase: phase,
              illumination: this.calculateIllumination(phase),
              age: this.calculateAge(phase)
            }
          });

          // Move to next phase
          searchTime = new Time(phaseTime.ut + 7.4, phaseTime.date); // ~7.4 days between phases
          phaseCount++;
        } catch (error) {
          console.warn(`Error finding moon phase at ${searchTime.date}:`, error);
          searchTime = new Time(searchTime.ut + 1, searchTime.date); // Move forward 1 day
        }
      }

      this.setCachedData(cacheKey, events);
      return events;
    } catch (error) {
      console.error('Error calculating moon phases:', error);
      throw error;
    }
  }

  /**
   * Get planet stations (retrograde/direct) for a given month
   */
  async getPlanetStationsForMonth(year: number, month: number): Promise<AstronomyEngineEvent[]> {
    const cacheKey = `planet_stations_${year}_${month}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const events: AstronomyEngineEvent[] = [];
      const planets = [
        { body: Body.Mercury, name: 'Mercury', nameTR: 'Merkür' },
        { body: Body.Venus, name: 'Venus', nameTR: 'Venüs' },
        { body: Body.Mars, name: 'Mars', nameTR: 'Mars' },
        { body: Body.Jupiter, name: 'Jupiter', nameTR: 'Jüpiter' },
        { body: Body.Saturn, name: 'Saturn', nameTR: 'Satürn' },
        { body: Body.Uranus, name: 'Uranus', nameTR: 'Uranüs' },
        { body: Body.Neptune, name: 'Neptune', nameTR: 'Neptün' },
        { body: Body.Pluto, name: 'Pluto', nameTR: 'Plüton' }
      ];

      const startTime = new Time(year, month, 1, 0, 0, 0);
      const endTime = new Time(year, month + 1, 1, 0, 0, 0);

      for (const planet of planets) {
        try {
          // Find retrograde start
          const retrogradeStart = SearchPlanetRetrograde(planet.body, startTime, 30);
          if (retrogradeStart.ut >= startTime.ut && retrogradeStart.ut < endTime.ut) {
            events.push({
              id: `${planet.name.toLowerCase()}-station_R-${year}-${String(month).padStart(2, '0')}-${retrogradeStart.date.day}`,
              type: 'planet_station',
              subType: 'station_R',
              body: planet.name,
              startUTC: retrogradeStart.date.toISOString(),
              labelTR: `${planet.nameTR} Retrosu Başlıyor`,
              source: 'astronomy_engine',
              meta: {
                planet: planet.name,
                stationType: 'retrograde_start'
              }
            });
          }

          // Find retrograde end
          const retrogradeEnd = SearchPlanetRetrograde(planet.body, new Time(retrogradeStart.ut + 1, retrogradeStart.date), 30);
          if (retrogradeEnd.ut >= startTime.ut && retrogradeEnd.ut < endTime.ut) {
            events.push({
              id: `${planet.name.toLowerCase()}-station_D-${year}-${String(month).padStart(2, '0')}-${retrogradeEnd.date.day}`,
              type: 'planet_station',
              subType: 'station_D',
              body: planet.name,
              startUTC: retrogradeEnd.date.toISOString(),
              labelTR: `${planet.nameTR} Retrosu Sona Eriyor`,
              source: 'astronomy_engine',
              meta: {
                planet: planet.name,
                stationType: 'retrograde_end'
              }
            });
          }
        } catch (error) {
          console.warn(`Error finding stations for ${planet.name}:`, error);
        }
      }

      this.setCachedData(cacheKey, events);
      return events;
    } catch (error) {
      console.error('Error calculating planet stations:', error);
      throw error;
    }
  }

  /**
   * Get Sun ingress events for a given month
   */
  async getSunIngressForMonth(year: number, month: number): Promise<AstronomyEngineEvent[]> {
    const cacheKey = `sun_ingress_${year}_${month}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const events: AstronomyEngineEvent[] = [];
      const signs = [
        { longitude: 0, name: 'Aries', nameTR: 'Koç' },
        { longitude: 30, name: 'Taurus', nameTR: 'Boğa' },
        { longitude: 60, name: 'Gemini', nameTR: 'İkizler' },
        { longitude: 90, name: 'Cancer', nameTR: 'Yengeç' },
        { longitude: 120, name: 'Leo', nameTR: 'Aslan' },
        { longitude: 150, name: 'Virgo', nameTR: 'Başak' },
        { longitude: 180, name: 'Libra', nameTR: 'Terazi' },
        { longitude: 210, name: 'Scorpio', nameTR: 'Akrep' },
        { longitude: 240, name: 'Sagittarius', nameTR: 'Yay' },
        { longitude: 270, name: 'Capricorn', nameTR: 'Oğlak' },
        { longitude: 300, name: 'Aquarius', nameTR: 'Kova' },
        { longitude: 330, name: 'Pisces', nameTR: 'Balık' }
      ];

      const startTime = new Time(year, month, 1, 0, 0, 0);
      const endTime = new Time(year, month + 1, 1, 0, 0, 0);

      for (const sign of signs) {
        try {
          const ingressTime = SearchSunLongitude(AngleFromLongitude(sign.longitude), startTime, 30);
          
          if (ingressTime.ut >= startTime.ut && ingressTime.ut < endTime.ut) {
            events.push({
              id: `sun-ingress-${sign.name.toLowerCase()}-${year}-${String(month).padStart(2, '0')}-${ingressTime.date.day}`,
              type: 'sun_ingress',
              subType: sign.name.toLowerCase(),
              body: 'Sun',
              startUTC: ingressTime.date.toISOString(),
              labelTR: `Güneş ${sign.nameTR} Burcuna Geçiyor`,
              source: 'astronomy_engine',
              meta: {
                sign: sign.name,
                longitude: sign.longitude,
                signTR: sign.nameTR
              }
            });
          }
        } catch (error) {
          console.warn(`Error finding Sun ingress for ${sign.name}:`, error);
        }
      }

      this.setCachedData(cacheKey, events);
      return events;
    } catch (error) {
      console.error('Error calculating Sun ingress:', error);
      throw error;
    }
  }

  /**
   * Get all celestial events for a given month
   */
  async getAllEventsForMonth(year: number, month: number): Promise<AstronomyEngineEvent[]> {
    const cacheKey = `all_events_${year}_${month}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const [moonPhases, planetStations, sunIngress] = await Promise.all([
        this.getMoonPhasesForMonth(year, month),
        this.getPlanetStationsForMonth(year, month),
        this.getSunIngressForMonth(year, month)
      ]);

      const allEvents = [...moonPhases, ...planetStations, ...sunIngress];
      
      // Sort by date
      allEvents.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());

      this.setCachedData(cacheKey, allEvents);
      return allEvents;
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  }

  /**
   * Get detailed moon phase information for a specific date
   */
  async getMoonPhaseForDate(date: Date): Promise<MoonPhaseData> {
    const time = new Time(date);
    const phase = Astronomy.MoonPhase(time);
    const illumination = Astronomy.Illumination(Body.Moon, time).phase;
    const age = (phase / 360) * 29.53059; // Synodic month length

    // Find next phase
    const nextPhase = this.getNextMoonPhase(phase);
    const nextPhaseTime = SearchMoonPhase(nextPhase, time, 30);

    return {
      phase: phase,
      illumination: illumination,
      age: age,
      nextPhase: nextPhase,
      nextPhaseDate: nextPhaseTime.date
    };
  }

  // Private helper methods

  private getCachedData(key: string): AstronomyEngineEvent[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - Date.parse(cached[0]?.startUTC || '0') > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached;
  }

  private setCachedData(key: string, data: AstronomyEngineEvent[]): void {
    this.cache.set(key, data);
  }

  private getMoonPhaseType(phase: number): string {
    if (phase < 45) return 'new';
    if (phase < 135) return 'first';
    if (phase < 225) return 'full';
    if (phase < 315) return 'last';
    return 'new';
  }

  private getMoonPhaseNameTR(phase: string): string {
    const names = {
      'new': 'Yeni Ay',
      'first': 'İlk Dördün',
      'full': 'Dolunay',
      'last': 'Son Dördün'
    };
    return names[phase] || 'Bilinmeyen Faz';
  }

  private getNextMoonPhase(currentPhase: number): MoonPhase {
    if (currentPhase < 45) return MoonPhase.FirstQuarter;
    if (currentPhase < 135) return MoonPhase.FullMoon;
    if (currentPhase < 225) return MoonPhase.LastQuarter;
    return MoonPhase.NewMoon;
  }

  private calculateIllumination(phase: string): number {
    const illuminations = {
      'new': 0,
      'first': 0.5,
      'full': 1,
      'last': 0.5
    };
    return illuminations[phase] || 0;
  }

  private calculateAge(phase: string): number {
    const ages = {
      'new': 0,
      'first': 7.4,
      'full': 14.8,
      'last': 22.1
    };
    return ages[phase] || 0;
  }
}

// Export singleton instance
export const astronomyEngineService = new AstronomyEngineService();
