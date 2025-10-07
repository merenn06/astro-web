/**
 * Swiss Ephemeris Service
 * 
 * High-precision astronomical calculations using Swiss Ephemeris
 * Provides accurate celestial events data for the calendar
 */

import { create, calc_ut, get_planet_name, close } from 'swisseph';

export interface SwissEphemerisEvent {
  id: string;
  type: 'moon_phase' | 'planet_station' | 'sun_ingress' | 'eclipse' | 'meteor_shower';
  subType: string;
  body: string;
  startUTC: string;
  endUTC?: string;
  labelTR: string;
  source: 'swiss';
  meta?: any;
}

export interface PlanetPosition {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
}

export interface MoonPhaseData {
  phase: number; // 0-1 (0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter)
  illumination: number; // 0-1
  age: number; // days since new moon
  nextPhase: string;
  nextPhaseDate: Date;
}

class SwissEphemerisService {
  private isInitialized = false;

  /**
   * Initialize Swiss Ephemeris
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize Swiss Ephemeris
      create();
      this.isInitialized = true;
      console.log('✅ Swiss Ephemeris initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Swiss Ephemeris:', error);
      throw new Error('Swiss Ephemeris initialization failed');
    }
  }

  /**
   * Calculate planet position for given date/time
   */
  async getPlanetPosition(planetId: number, date: Date): Promise<PlanetPosition> {
    await this.initialize();

    try {
      const julianDay = this.dateToJulianDay(date);
      const result = calc_ut(julianDay, planetId, 0); // 0 = SEFLG_SWIEPH

      if (result.error) {
        throw new Error(`Swiss Ephemeris calculation error: ${result.error}`);
      }

      return {
        longitude: result.longitude,
        latitude: result.latitude,
        distance: result.distance,
        speed: result.speed
      };
    } catch (error) {
      console.error(`Error calculating planet position for planet ${planetId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate moon phase for given date
   */
  async getMoonPhase(date: Date): Promise<MoonPhaseData> {
    await this.initialize();

    try {
      const julianDay = this.dateToJulianDay(date);
      
      // Calculate Sun and Moon positions
      const sunResult = calc_ut(julianDay, 0, 0); // Sun
      const moonResult = calc_ut(julianDay, 1, 0); // Moon

      if (sunResult.error || moonResult.error) {
        throw new Error('Failed to calculate Sun/Moon positions');
      }

      // Calculate elongation (angle between Sun and Moon)
      const elongation = this.normalizeAngle(moonResult.longitude - sunResult.longitude);
      
      // Convert elongation to phase (0-1)
      const phase = elongation / 360;
      
      // Calculate illumination percentage
      const illumination = (1 + Math.cos(elongation * Math.PI / 180)) / 2;
      
      // Calculate age in days
      const age = (elongation / 360) * 29.53059; // Synodic month length
      
      // Determine next phase
      const { nextPhase, nextPhaseDate } = this.getNextMoonPhase(date, phase);

      return {
        phase,
        illumination,
        age,
        nextPhase,
        nextPhaseDate
      };
    } catch (error) {
      console.error('Error calculating moon phase:', error);
      throw error;
    }
  }

  /**
   * Get all moon phases for a given month
   */
  async getMoonPhasesForMonth(year: number, month: number): Promise<SwissEphemerisEvent[]> {
    const events: SwissEphemerisEvent[] = [];
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Check each day of the month for phase changes
    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const nextDate = new Date(year, month - 1, day + 1);

      try {
        const currentPhase = await this.getMoonPhase(currentDate);
        const nextPhase = await this.getMoonPhase(nextDate);

        // Check for phase transitions
        const phaseType = this.getPhaseType(currentPhase.phase);
        const nextPhaseType = this.getPhaseType(nextPhase.phase);

        if (phaseType !== nextPhaseType) {
          // Phase change occurred, find exact time
          const exactTime = await this.findExactPhaseTime(currentDate, nextDate, phaseType);
          
          events.push({
            id: `moon-${phaseType}-${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
            type: 'moon_phase',
            subType: phaseType,
            body: 'Moon',
            startUTC: exactTime.toISOString(),
            labelTR: this.getPhaseLabelTR(phaseType),
            source: 'swiss',
            meta: {
              illumination: currentPhase.illumination,
              age: currentPhase.age
            }
          });
        }
      } catch (error) {
        console.warn(`Error calculating moon phase for ${currentDate.toISOString()}:`, error);
      }
    }

    return events;
  }

  /**
   * Get planet stations (retrograde/direct) for a given month
   */
  async getPlanetStationsForMonth(year: number, month: number): Promise<SwissEphemerisEvent[]> {
    const events: SwissEphemerisEvent[] = [];
    const planets = [
      { id: 1, name: 'Mercury', nameTR: 'Merkür' },
      { id: 2, name: 'Venus', nameTR: 'Venüs' },
      { id: 4, name: 'Mars', nameTR: 'Mars' },
      { id: 5, name: 'Jupiter', nameTR: 'Jüpiter' },
      { id: 6, name: 'Saturn', nameTR: 'Satürn' },
      { id: 7, name: 'Uranus', nameTR: 'Uranüs' },
      { id: 8, name: 'Neptune', nameTR: 'Neptün' },
      { id: 9, name: 'Pluto', nameTR: 'Plüton' }
    ];

    for (const planet of planets) {
      try {
        const stations = await this.findPlanetStations(planet.id, year, month);
        events.push(...stations.map(station => ({
          id: `${planet.name.toLowerCase()}-${station.type}-${year}-${String(month).padStart(2, '0')}-${String(station.day).padStart(2, '0')}`,
          type: 'planet_station' as const,
          subType: station.type,
          body: planet.name,
          startUTC: new Date(year, month - 1, station.day, station.hour, 0, 0).toISOString(),
          labelTR: station.type === 'station_R' 
            ? `${planet.nameTR} Retrosu Başlıyor`
            : `${planet.nameTR} Retrosu Sona Eriyor`,
          source: 'swiss' as const,
          meta: {
            planetId: planet.id,
            longitude: station.longitude
          }
        })));
      } catch (error) {
        console.warn(`Error calculating stations for ${planet.name}:`, error);
      }
    }

    return events;
  }

  /**
   * Get Sun ingress events for a given month
   */
  async getSunIngressForMonth(year: number, month: number): Promise<SwissEphemerisEvent[]> {
    const events: SwissEphemerisEvent[] = [];
    const signs = [
      { name: 'Aries', nameTR: 'Koç', longitude: 0 },
      { name: 'Taurus', nameTR: 'Boğa', longitude: 30 },
      { name: 'Gemini', nameTR: 'İkizler', longitude: 60 },
      { name: 'Cancer', nameTR: 'Yengeç', longitude: 90 },
      { name: 'Leo', nameTR: 'Aslan', longitude: 120 },
      { name: 'Virgo', nameTR: 'Başak', longitude: 150 },
      { name: 'Libra', nameTR: 'Terazi', longitude: 180 },
      { name: 'Scorpio', nameTR: 'Akrep', longitude: 210 },
      { name: 'Sagittarius', nameTR: 'Yay', longitude: 240 },
      { name: 'Capricorn', nameTR: 'Oğlak', longitude: 270 },
      { name: 'Aquarius', nameTR: 'Kova', longitude: 300 },
      { name: 'Pisces', nameTR: 'Balık', longitude: 330 }
    ];

    for (const sign of signs) {
      try {
        const ingress = await this.findSunIngress(sign.longitude, year, month);
        if (ingress) {
          events.push({
            id: `sun-ingress-${sign.name.toLowerCase()}-${year}-${String(month).padStart(2, '0')}-${String(ingress.day).padStart(2, '0')}`,
            type: 'sun_ingress',
            subType: sign.name.toLowerCase(),
            body: 'Sun',
            startUTC: new Date(year, month - 1, ingress.day, ingress.hour, 0, 0).toISOString(),
            labelTR: `Güneş ${sign.nameTR} Burcuna Geçiyor`,
            source: 'swiss',
            meta: {
              sign: sign.name,
              longitude: sign.longitude
            }
          });
        }
      } catch (error) {
        console.warn(`Error calculating Sun ingress for ${sign.name}:`, error);
      }
    }

    return events;
  }

  /**
   * Get all celestial events for a given month
   */
  async getAllEventsForMonth(year: number, month: number): Promise<SwissEphemerisEvent[]> {
    await this.initialize();

    const events: SwissEphemerisEvent[] = [];

    try {
      // Get moon phases
      const moonPhases = await this.getMoonPhasesForMonth(year, month);
      events.push(...moonPhases);

      // Get planet stations
      const planetStations = await this.getPlanetStationsForMonth(year, month);
      events.push(...planetStations);

      // Get Sun ingress
      const sunIngress = await this.getSunIngressForMonth(year, month);
      events.push(...sunIngress);

      // Sort by date
      events.sort((a, b) => new Date(a.startUTC).getTime() - new Date(b.startUTC).getTime());

      return events;
    } catch (error) {
      console.error('Error getting all events for month:', error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.isInitialized) {
      close();
      this.isInitialized = false;
    }
  }

  // Private helper methods

  private dateToJulianDay(date: Date): number {
    return (date.getTime() / 86400000) + 2440587.5;
  }

  private julianDayToDate(julianDay: number): Date {
    return new Date((julianDay - 2440587.5) * 86400000);
  }

  private normalizeAngle(angle: number): number {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  }

  private getPhaseType(phase: number): string {
    if (phase < 0.125) return 'new';
    if (phase < 0.375) return 'first';
    if (phase < 0.625) return 'full';
    if (phase < 0.875) return 'last';
    return 'new';
  }

  private getPhaseLabelTR(phaseType: string): string {
    const labels = {
      'new': 'Yeni Ay',
      'first': 'İlk Dördün',
      'full': 'Dolunay',
      'last': 'Son Dördün'
    };
    return labels[phaseType] || 'Bilinmeyen Faz';
  }

  private getNextMoonPhase(date: Date, currentPhase: number): { nextPhase: string; nextPhaseDate: Date } {
    const phases = ['new', 'first', 'full', 'last'];
    const currentIndex = Math.floor(currentPhase * 4);
    const nextIndex = (currentIndex + 1) % 4;
    const nextPhase = phases[nextIndex];
    
    // Approximate next phase date (29.53 days / 4 phases)
    const daysToNext = 29.53 / 4;
    const nextPhaseDate = new Date(date.getTime() + daysToNext * 24 * 60 * 60 * 1000);
    
    return { nextPhase, nextPhaseDate };
  }

  private async findExactPhaseTime(startDate: Date, endDate: Date, phaseType: string): Promise<Date> {
    // Binary search for exact phase time
    let low = startDate.getTime();
    let high = endDate.getTime();
    let bestTime = startDate;

    for (let i = 0; i < 10; i++) { // 10 iterations should be enough
      const mid = new Date((low + high) / 2);
      const phase = await this.getMoonPhase(mid);
      const currentPhaseType = this.getPhaseType(phase.phase);

      if (currentPhaseType === phaseType) {
        bestTime = mid;
        high = mid.getTime();
      } else {
        low = mid.getTime();
      }
    }

    return bestTime;
  }

  private async findPlanetStations(planetId: number, year: number, month: number): Promise<Array<{ day: number; hour: number; type: string; longitude: number }>> {
    const stations: Array<{ day: number; hour: number; type: string; longitude: number }> = [];
    const endDate = new Date(year, month, 0);

    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const nextDate = new Date(year, month - 1, day + 1);

      try {
        const currentPos = await this.getPlanetPosition(planetId, currentDate);
        const nextPos = await this.getPlanetPosition(planetId, nextDate);

        // Check for station (speed near zero)
        if (Math.abs(currentPos.speed) < 0.01) {
          const type = currentPos.speed > 0 ? 'station_D' : 'station_R';
          stations.push({
            day,
            hour: 12, // Approximate
            type,
            longitude: currentPos.longitude
          });
        }
      } catch (error) {
        console.warn(`Error checking station for planet ${planetId} on day ${day}:`, error);
      }
    }

    return stations;
  }

  private async findSunIngress(targetLongitude: number, year: number, month: number): Promise<{ day: number; hour: number } | null> {
    const endDate = new Date(year, month, 0);

    for (let day = 1; day <= endDate.getDate(); day++) {
      const currentDate = new Date(year, month - 1, day);
      const nextDate = new Date(year, month - 1, day + 1);

      try {
        const currentPos = await this.getPlanetPosition(0, currentDate); // Sun
        const nextPos = await this.getPlanetPosition(0, nextDate);

        // Check if Sun crosses the target longitude
        const currentLongitude = this.normalizeAngle(currentPos.longitude);
        const nextLongitude = this.normalizeAngle(nextPos.longitude);
        const targetLongitudeNorm = this.normalizeAngle(targetLongitude);

        if ((currentLongitude < targetLongitudeNorm && nextLongitude >= targetLongitudeNorm) ||
            (currentLongitude > targetLongitudeNorm && nextLongitude <= targetLongitudeNorm)) {
          return { day, hour: 12 }; // Approximate
        }
      } catch (error) {
        console.warn(`Error checking Sun ingress for longitude ${targetLongitude} on day ${day}:`, error);
      }
    }

    return null;
  }
}

// Export singleton instance
export const swissEphemerisService = new SwissEphemerisService();
