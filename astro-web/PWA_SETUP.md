# PWA ve Push Bildirim Sistemi Kurulum Rehberi

## 🚀 PWA Özellikleri

Bu proje Progressive Web App (PWA) olarak yapılandırılmıştır ve şu özellikleri içerir:

- ✅ Ana ekrana ekleme
- ✅ Offline çalışma
- ✅ Push bildirimleri
- ✅ Responsive tasarım
- ✅ App-like deneyim

## 📱 PWA Kurulumu

### 1. Gerekli Paketler

```bash
npm install next-pwa web-push
npm install --save-dev @types/next-pwa @types/web-push
```

### 2. VAPID Anahtarları

VAPID anahtarları zaten oluşturulmuştur:

**Public Key:**
```
BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4
```

**Private Key:**
```
ri5cU1e_6Zlx_LVFpHHb5z0g4nmuoUOfcnC0y8n9t3k
```

### 3. Environment Variables

`.env.local` dosyasına şu değişkenleri ekleyin:

```env
# VAPID Keys
VAPID_PUBLIC_KEY=BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4
VAPID_PRIVATE_KEY=ri5cU1e_6Zlx_LVFpHHb5z0g4nmuoUOfcnC0y8n9t3k
VAPID_SUBJECT=mailto:info@astroloji.com

# Client-side VAPID key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BOGNRgRRyMLtaV47xZkb2KDao-AIc-TqHaCOYu19rAn0Cov3j62rHUC54KMyzFE3UwgH5F6dt0JQe0yA2cIXUV4
```

## 🔔 Push Bildirim Sistemi

### 1. Veritabanı

Subscription modeli Prisma schema'sına eklenmiştir:

```prisma
model Subscription {
  id        String   @id @default(cuid())
  endpoint  String   @unique
  keys      String   // JSON string of p256dh and auth keys
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. API Endpoints

- `POST /api/push/subscribe` - Push bildirim aboneliği
- `DELETE /api/push/subscribe` - Abonelik iptali
- `GET /api/admin/notifications/subscriptions` - Abone listesi
- `POST /api/admin/notifications/send` - Bildirim gönderme
- `DELETE /api/admin/notifications/subscriptions/[id]` - Abone silme

### 3. Client-side Hook

`usePush` hook'u push bildirimleri için kullanılır:

```tsx
import { usePush } from '@/lib/usePush';

function MyComponent() {
  const { isSupported, isSubscribed, requestPermission } = usePush();
  
  return (
    <button onClick={requestPermission}>
      Bildirimleri Etkinleştir
    </button>
  );
}
```

## 🎨 PWA Manifest

`public/manifest.json` dosyası şu özellikleri içerir:

- App adı ve açıklaması
- Tema renkleri
- İkonlar (72x72'den 512x512'ye)
- App shortcuts
- Screenshots

## 🛠️ Admin Panel

Admin panelde `/admin/notifications` sayfası bulunur:

- Abone listesi görüntüleme
- Bildirim gönderme
- Hazır bildirim şablonları
- Abone silme

## 📋 Test Etme

### 1. PWA Test

```bash
# Development server'ı başlat
npm run dev

# Lighthouse ile PWA skorunu kontrol et
# Chrome DevTools > Lighthouse > PWA
```

### 2. Push Bildirim Test

```bash
# Test bildirimi gönder
npx tsx scripts/testPush.ts

# Manuel bildirim gönder
npx tsx scripts/sendPush.ts "Başlık" "Mesaj" "/url"
```

### 3. Service Worker Test

1. Chrome DevTools > Application > Service Workers
2. "Push" butonuna tıkla
3. Test bildirimi gönder

## 📱 İkonlar

PWA için gerekli ikonlar `public/icons/` klasöründe bulunur:

- `icon-72.png` - 72x72
- `icon-96.png` - 96x96
- `icon-128.png` - 128x128
- `icon-144.png` - 144x144
- `icon-152.png` - 152x152
- `icon-192.png` - 192x192
- `icon-384.png` - 384x384
- `icon-512.png` - 512x512

**Not:** Şu anda placeholder dosyalar var. Gerçek PNG ikonları ile değiştirin.

## 🔧 Özelleştirme

### 1. Bildirim Şablonları

`src/app/admin/notifications/page.tsx` dosyasında hazır bildirim şablonlarını düzenleyebilirsiniz.

### 2. Service Worker

`public/sw.js` dosyasında push bildirim davranışını özelleştirebilirsiniz.

### 3. Manifest

`public/manifest.json` dosyasında PWA ayarlarını değiştirebilirsiniz.

## 🚨 Güvenlik

- VAPID private key'i asla client-side'da kullanmayın
- Production'da proper authentication ekleyin
- Rate limiting uygulayın
- HTTPS kullanın (PWA için zorunlu)

## 📊 Monitoring

Push bildirim performansını izlemek için:

1. Admin panelde abone sayısını takip edin
2. Bildirim gönderme başarı oranını kontrol edin
3. Invalid subscription'ları otomatik temizleyin

## 🎯 Sonraki Adımlar

1. Gerçek PNG ikonları ekleyin
2. Offline cache stratejisi geliştirin
3. Background sync ekleyin
4. Analytics entegrasyonu yapın
5. A/B testing ekleyin 