// AstroEvent interface'ini burada tanımlayalım
export interface AstroEvent {
  id: string;
  title: string;
  date: string;
  type: 'moon_phase' | 'astronomical';
  description: string;
  icon: string;
  color?: string;
}
import fs from 'fs';
import path from 'path';

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

// Tüm astrolojik olayları birleştir
export async function fetchAllAstroEvents(year: number, month: number): Promise<AstroApiEvent[]> {
  const { moonPhases, astronomical } = loadStaticData(year, month);
  
  const allEvents: AstroApiEvent[] = [
    ...moonPhases,
    ...astronomical
  ];

  // Tarihe göre sırala
  return allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
} 