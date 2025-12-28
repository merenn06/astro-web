#!/usr/bin/env tsx

import { fetchAllAstroEvents } from '../src/lib/astroApis';

async function testApis() {
  console.log('🌙 Sabit Astrolojik Veri Test Başlatılıyor...\n');

  const years = [2024, 2025, 2026];
  const months = [1, 3, 6, 7, 9, 12]; // Farklı ayları test et
  
  for (const year of years) {
    console.log(`📅 ${year} yılı için test ediliyor...\n`);
    
    for (const month of months) {
      console.log(`   📆 ${month}. ay:`);
      
      try {
        const allEvents = await fetchAllAstroEvents(year, month);
        console.log(`   ✅ Toplam ${allEvents.length} astrolojik olay bulundu`);
        
        // Olayları türlerine göre grupla
        const eventsByType = allEvents.reduce((acc, event) => {
          if (!acc[event.type]) acc[event.type] = [];
          acc[event.type].push(event);
          return acc;
        }, {} as Record<string, typeof allEvents>);

        Object.entries(eventsByType).forEach(([type, events]) => {
          console.log(`      📊 ${type}: ${events.length} olay`);
          events.forEach(event => {
            const date = new Date(event.date).toLocaleDateString('tr-TR');
            console.log(`         ${event.icon} ${date}: ${event.title}`);
          });
        });
      } catch (error) {
        console.log(`   ❌ ${year}-${month} hatası:`, error);
      }
      
      console.log('');
    }
    
    console.log('─'.repeat(50));
    console.log('');
  }

  console.log('\n🎉 Test tamamlandı!');
}

// Ana fonksiyon
async function main() {
  await testApis();
}

// Script'i çalıştır
if (require.main === module) {
  main().catch(console.error);
} 