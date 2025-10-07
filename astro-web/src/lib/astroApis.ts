import fs from 'fs';
import path from 'path';
import { CelestialEvent, generateEventLabel, getEventIcon, getEventColor } from './celestialEvents';
import { astronomyEngineService } from './astronomyEngineService';

// Legacy interface for backward compatibility
export interface AstroEvent {
  id: string;
  title: string;
  date: string;
  type: 'moon_phase' | 'astronomical';
  description: string;
  icon: string;
  color?: string;
}

export interface AstroApiEvent {
  id: string;
  title: string;
  date: string;
  type: 'moon_phase' | 'astronomical';
  description: string;
  icon: string;
  color?: string;
}

interface StaticEvent {
  date: string;
  type: string;
  emoji: string;
  description: string;
}

// Tarih validasyonu fonksiyonu
function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Sabit JSON dosyalarından veri okuma fonksiyonu
function loadStaticData(year: number, month: number): { moonPhases: AstroApiEvent[], astronomical: AstroApiEvent[] } {
  const moonPhases: AstroApiEvent[] = [];
  const astronomical: AstroApiEvent[] = [];
  
  try {
    // Ay evreleri dosyasını oku
    const moonPhasesPath = path.join(process.cwd(), 'data', `moonPhases${year}.json`);
    if (fs.existsSync(moonPhasesPath)) {
      const moonData: StaticEvent[] = JSON.parse(fs.readFileSync(moonPhasesPath, 'utf8'));
      
      moonData.forEach((event, index) => {
        // Tarih validasyonu
        if (!validateDate(event.date)) {
          throw new Error(`Geçersiz tarih: ${event.date} (moonPhases${year}.json, index: ${index})`);
        }
        
        // Gerekli alanları kontrol et
        if (!event.date || !event.type || !event.emoji || !event.description) {
          console.warn(`Eksik alan bulundu (moonPhases${year}.json, index: ${index}):`, {
            date: event.date,
            type: event.type,
            emoji: event.emoji,
            description: event.description
          });
        }
        
        // String filtreleme ile ay kontrolü (daha güvenilir)
        const paddedMonth = String(month).padStart(2, "0");
        if (event.date.startsWith(`${year}-${paddedMonth}`)) {
          // Create date at noon UTC to match moon phase calculations
          const eventDate = new Date(event.date + 'T12:00:00.000Z');
          
          // Map static data phase names to standard format
          let normalizedType = event.type;
          if (event.type === 'Yeniay') normalizedType = 'Yeni Ay';
          if (event.type === 'İlk Dördün') normalizedType = 'İlk Dördün';
          if (event.type === 'Dolunay') normalizedType = 'Dolunay';
          if (event.type === 'Son Dördün') normalizedType = 'Son Dördün';
          
          moonPhases.push({
            id: `moonphase-${year}-${month}-${index}`,
            title: normalizedType,
            date: eventDate.toISOString(),
            type: 'moon_phase',
            description: event.description,
            icon: event.emoji,
            color: '#f3e8ff'
          });
        }
      });
    }
    
    // Astronomik olaylar dosyasını oku
    const astronomicalPath = path.join(process.cwd(), 'data', `astronomicalEvents${year}.json`);
    if (fs.existsSync(astronomicalPath)) {
      const astroData: StaticEvent[] = JSON.parse(fs.readFileSync(astronomicalPath, 'utf8'));
      
      astroData.forEach((event, index) => {
        // Tarih validasyonu
        if (!validateDate(event.date)) {
          throw new Error(`Geçersiz tarih: ${event.date} (astronomicalEvents${year}.json, index: ${index})`);
        }
        
        // Gerekli alanları kontrol et
        if (!event.date || !event.type || !event.emoji || !event.description) {
          console.warn(`Eksik alan bulundu (astronomicalEvents${year}.json, index: ${index}):`, {
            date: event.date,
            type: event.type,
            emoji: event.emoji,
            description: event.description
          });
        }
        
        // String filtreleme ile ay kontrolü (daha güvenilir)
        const paddedMonth = String(month).padStart(2, "0");
        if (event.date.startsWith(`${year}-${paddedMonth}`)) {
          const eventDate = new Date(event.date);
          astronomical.push({
            id: `astronomical-${year}-${month}-${index}`,
            title: event.type,
            date: eventDate.toISOString(),
            type: 'astronomical',
            description: event.description,
            icon: event.emoji,
            color: '#fef3c7'
          });
        }
      });
    }
  } catch (error) {
    console.error('Error loading static data:', error);
    throw error; // Hatayı yukarı fırlat
  }
  
  return { moonPhases, astronomical };
}

// Load celestial events from new format
function loadCelestialEvents(year: number, month: number): AstroApiEvent[] {
  const events: AstroApiEvent[] = [];
  
  try {
    // Try to load new celestial events format first
    const celestialPath = path.join(process.cwd(), 'data', `celestialEvents${year}.json`);
    if (fs.existsSync(celestialPath)) {
      const celestialData: CelestialEvent[] = JSON.parse(fs.readFileSync(celestialPath, 'utf8'));
      
      celestialData.forEach((event) => {
        const eventDate = new Date(event.startUTC);
        const eventMonth = eventDate.getMonth() + 1;
        
      // Filter by year and month
      const eventYear = new Date(event.startUTC).getFullYear();
      if (eventYear === year && eventMonth === month) {
        events.push({
          id: event.id,
          title: generateEventLabel(event),
          date: event.startUTC,
          type: event.type === 'moon_phase' ? 'moon_phase' : 'astronomical',
          description: event.labelTR,
          icon: getEventIcon(event),
          color: getEventColor(event)
        });
      }
      });
      
      return events;
    }
  } catch (error) {
    console.warn('Error loading celestial events, falling back to legacy format:', error);
  }
  
  // Fallback to legacy format
  const { moonPhases, astronomical } = loadStaticData(year, month);
  return [...moonPhases, ...astronomical];
}

// Astronomy Engine'dan veri yükle
async function loadAstronomyEngineEvents(year: number, month: number): Promise<AstroApiEvent[]> {
  try {
    const astronomyEvents = await astronomyEngineService.getAllEventsForMonth(year, month);
    
    return astronomyEvents.map(event => ({
      id: event.id,
      title: event.labelTR,
      date: event.startUTC,
      type: event.type === 'moon_phase' ? 'moon_phase' : 'astronomical',
      description: event.labelTR,
      icon: getEventIcon(event),
      color: getEventColor(event)
    }));
  } catch (error) {
    console.warn('Astronomy Engine data loading failed, falling back to static data:', error);
    return [];
  }
}

// Tüm astrolojik olayları birleştir
export async function fetchAllAstroEvents(year: number, month: number): Promise<AstroApiEvent[]> {
  // Önce Astronomy Engine'dan veri almaya çalış
  const astronomyEvents = await loadAstronomyEngineEvents(year, month);
  
  if (astronomyEvents.length > 0) {
    console.log(`✅ Loaded ${astronomyEvents.length} events from Astronomy Engine for ${year}-${month}`);
    return astronomyEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Fallback to static data
  console.log(`⚠️  Astronomy Engine failed, using static data for ${year}-${month}`);
  const allEvents = loadCelestialEvents(year, month);

  // Tarihe göre sırala
  return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
} 