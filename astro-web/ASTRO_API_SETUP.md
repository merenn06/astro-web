# 🌙 Sabit Astrolojik Veri Sistemi

Bu dokümantasyon, sabit JSON dosyalarından astrolojik verileri okuyan sistemin nasıl kurulacağını ve kullanılacağını açıklar.

## 🔧 Kurulum

### 1. Veri Dosyaları

Sistem şu sabit JSON dosyalarını kullanır:

```
data/
├── moonPhases2024.json      # 2024 ay evreleri
├── moonPhases2025.json      # 2025 ay evreleri
├── moonPhases2026.json      # 2026 ay evreleri
├── astronomicalEvents2024.json  # 2024 astronomik olaylar
├── astronomicalEvents2025.json  # 2025 astronomik olaylar
└── astronomicalEvents2026.json  # 2026 astronomik olaylar
```

### 2. Test Etme

```bash
# Sabit verileri test et
npm run test:astro
```

## 📁 Dosya Yapısı

```
astro-web/
├── data/                    # Sabit JSON verileri
│   ├── moonPhases*.json
│   └── astronomicalEvents*.json
├── src/
│   ├── lib/
│   │   └── astroApis.ts     # Veri okuma fonksiyonları
│   ├── app/
│   │   ├── api/
│   │   │   └── astro-events/ # API endpoint
│   │   └── takvim/
│   │       ├── page.tsx      # Ana takvim sayfası
│   │       └── TakvimClient.tsx # Client-side logic
│   └── components/
│       └── AstroCalendar.tsx # Takvim bileşeni
└── scripts/
    └── testAstroApis.ts     # Test scripti
```

## 🌟 Özellikler

### ✅ Mevcut Özellikler
- **Sabit Veriler**: Her çağrıda aynı sonuçlar
- **Ay Evreleri**: Yeniay, İlk Dördün, Dolunay, Son Dördün
- **Astronomik Olaylar**: Burç geçişleri, retrolar, tutulmalar, meteor yağmurları
- **Tooltip Desteği**: Hover ile detaylı bilgi
- **Responsive Tasarım**: Mobil uyumlu
- **Dark Mode**: Karanlık tema desteği

### 🎨 UI Özellikleri
- **Renkli İkonlar**: Her olay türü için özel emoji
- **Hover Efektleri**: Tooltip ile detaylı bilgi
- **Gradient Arka Planlar**: Görsel zenginlik
- **Smooth Animasyonlar**: Geçiş efektleri

## 🔌 API Endpoint

### GET /api/astro-events

**Parametreler:**
- `year` (number): Yıl (2024, 2025, 2026)
- `month` (number): Ay (1-12)

**Örnek:**
```bash
curl "http://localhost:3000/api/astro-events?year=2025&month=7"
```

**Response:**
```json
{
  "events": [
    {
      "id": "moonphase-2025-7-24",
      "title": "Yeniay",
      "date": "2025-07-01T00:00:00.000Z",
      "type": "moon_phase",
      "description": "Yengeç burcunda yeniay",
      "icon": "🌑",
      "color": "#f3e8ff"
    },
    {
      "id": "astronomical-2025-7-6",
      "title": "Burç Geçişi",
      "date": "2025-07-22T00:00:00.000Z",
      "type": "astronomical",
      "description": "Güneş Aslan burcuna geçer",
      "icon": "☀️",
      "color": "#fef3c7"
    }
  ],
  "year": 2025,
  "month": 7,
  "total": 6,
  "timestamp": "2025-07-28T08:39:26.024Z"
}
```

## 📊 Veri Formatları

### Ay Evreleri (moonPhases*.json)
```json
[
  {
    "date": "2025-07-01",
    "type": "Yeniay",
    "emoji": "🌑",
    "description": "Yengeç burcunda yeniay"
  },
  {
    "date": "2025-07-08",
    "type": "İlk Dördün",
    "emoji": "🌓",
    "description": "Terazi burcunda ilk dördün"
  }
]
```

### Astronomik Olaylar (astronomicalEvents*.json)
```json
[
  {
    "date": "2025-07-22",
    "type": "Burç Geçişi",
    "emoji": "☀️",
    "description": "Güneş Aslan burcuna geçer"
  },
  {
    "date": "2025-07-31",
    "type": "Mavi Ay",
    "emoji": "🌕",
    "description": "Ayın ikinci dolunayı"
  }
]
```

## 🛠️ Geliştirme

### Yeni Yıl Ekleme

1. `data/moonPhasesYYYY.json` dosyası oluştur
2. `data/astronomicalEventsYYYY.json` dosyası oluştur
3. Gerçek ay evresi ve astronomik olay tarihlerini ekle

### Yeni Olay Türü Ekleme

1. JSON dosyalarına yeni olay türü ekle
2. İkon ve açıklama belirle
3. UI bileşenlerini güncelle

### Test Etme

```bash
# Tüm yılları test et
npm run test:astro

# Belirli bir ayı test et
curl "http://localhost:3000/api/astro-events?year=2025&month=7"
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar

1. **Dosya Bulunamadı Hatası**
   - `data/` klasörünün varlığını kontrol et
   - JSON dosya isimlerini kontrol et

2. **Veri Görünmüyor**
   - JSON formatını kontrol et
   - Tarih formatını kontrol et (YYYY-MM-DD)

3. **Yanlış Ay Verisi**
   - JSON dosyasındaki tarihleri kontrol et
   - Ay numarasını kontrol et (1-12)

### Debug Modu

```bash
# Detaylı loglar için
DEBUG=astro:* npm run dev
```

## 📈 Performans

- **Sabit Veriler**: Her çağrıda aynı sonuçlar
- **Hızlı Okuma**: JSON dosyalarından direkt okuma
- **No Network**: İnternet bağlantısı gerektirmez
- **Deterministik**: Rastgelelik yok

## 🔮 Avantajlar

### ✅ Sabit Veri Sistemi
- **Tutarlılık**: Her çağrıda aynı sonuçlar
- **Güvenilirlik**: API bağımlılığı yok
- **Hız**: Anında veri okuma
- **Offline**: İnternet gerektirmez

### 📊 Veri Kalitesi
- **Doğru Tarihler**: Gerçek astronomik veriler
- **Detaylı Açıklamalar**: Her olay için açıklama
- **Burç Bilgisi**: Ay evrelerinin hangi burçta olduğu
- **Çeşitlilik**: Farklı olay türleri

## 🎯 Kullanım Senaryoları

1. **Astroloji Uygulamaları**: Burç takvimleri
2. **Eğitim**: Astronomi dersleri
3. **Planlama**: Özel günler için hazırlık
4. **Araştırma**: Astrolojik veri analizi

---

**Not**: Bu sistem tamamen sabit JSON dosyalarından veri okur. Rastgelelik yoktur ve her çağrıda aynı sonuçları verir. 