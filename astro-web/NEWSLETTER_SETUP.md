# Newsletter PDF System Setup Guide

Bu rehber, e-posta bülteni sistemi ve PDF indirme özelliğinin kurulumunu açıklar.

## 🎯 Özellikler

- ✅ Mailchimp entegrasyonu
- ✅ E-posta doğrulama
- ✅ PDF indirme linki
- ✅ Google Analytics entegrasyonu
- ✅ Responsive tasarım
- ✅ Hata yönetimi
- ✅ Test coverage

## 📋 Gereksinimler

### 1. Mailchimp Hesabı

1. [Mailchimp](https://mailchimp.com)'e kaydolun
2. Yeni bir Audience (liste) oluşturun:
   - **Audience Adı:** `Astro_Bülten`
   - **Audience ID:** Not alın (API'de kullanılacak)

### 2. API Anahtarı

1. Mailchimp Dashboard → Account → Extras → API Keys
2. "Create A Key" butonuna tıklayın
3. API anahtarını güvenli bir yere kaydedin

### 3. Datacenter Kodu

API anahtarınızın sonundaki kodu not alın:
- Örnek: `abc123def456-us21` → `us21` datacenter kodu

## 🔧 Kurulum

### 1. Environment Variables

`.env.local` dosyasına aşağıdaki değişkenleri ekleyin:

```env
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_AUDIENCE_ID=your_audience_id_here
MAILCHIMP_DC=us21
```

### 2. PDF Dosyası

`/public/assets/2025_astro_takvimi.pdf` dosyasını gerçek PDF ile değiştirin:

```bash
# Mevcut placeholder PDF'yi silin
rm public/assets/2025_astro_takvimi.pdf

# Gerçek PDF'yi kopyalayın (≤ 2MB önerilir)
cp /path/to/your/2025_astro_takvimi.pdf public/assets/
```

### 3. Google Analytics (Opsiyonel)

`src/app/layout.tsx` dosyasında Google Analytics kuruluysa, gtag fonksiyonu otomatik olarak çağrılacaktır.

## 🧪 Test

### Unit Tests

```bash
npm test -- --testPathPattern=newsletter
```

### API Test

```bash
# Geçerli e-posta testi
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Geçersiz e-posta testi
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'
```

## 📍 Entegrasyon Noktaları

### 1. Ana Sayfa
- **Dosya:** `src/app/page.tsx`
- **Konum:** Newsletter section (Hero altında)

### 2. Blog Detay Sayfası
- **Dosya:** `src/app/blog/[slug]/BlogPostClient.tsx`
- **Konum:** Yazı sonunda CTA kutusu

### 3. API Route
- **Dosya:** `src/app/api/newsletter/route.ts`
- **Endpoint:** `POST /api/newsletter`

## 🎨 Özelleştirme

### NewsletterForm Bileşeni

```tsx
// src/components/NewsletterForm.tsx
// - Renkler: violet-600, purple-50
// - Metinler: Türkçe
// - PDF link: /assets/2025_astro_takvimi.pdf
```

### Stil Değişiklikleri

```css
/* Ana renkler */
--newsletter-primary: #7c3aed; /* violet-600 */
--newsletter-secondary: #faf5ff; /* purple-50 */
--newsletter-success: #dcfce7; /* green-50 */
```

## 🔍 Hata Ayıklama

### Yaygın Sorunlar

1. **API Key Hatası**
   - API anahtarının doğru olduğunu kontrol edin
   - Datacenter kodunun doğru olduğunu kontrol edin

2. **Audience ID Hatası**
   - Mailchimp'te Audience ID'yi kontrol edin
   - Audience'nin aktif olduğunu kontrol edin

3. **PDF İndirme Hatası**
   - PDF dosyasının `/public/assets/` klasöründe olduğunu kontrol edin
   - Dosya adının doğru olduğunu kontrol edin

### Log Kontrolü

```bash
# Development logları
npm run dev

# Production logları
npm run build && npm start
```

## 📊 Analytics

### Google Analytics Events

Başarılı kayıtlar otomatik olarak şu event'i tetikler:

```javascript
gtag('event', 'newsletter_signup', {
  'event_category': 'engagement'
});
```

### Mailchimp Analytics

Mailchimp Dashboard'da şu metrikleri takip edebilirsiniz:
- Subscription rate
- Open rate
- Click rate
- Unsubscribe rate

## 🔒 Güvenlik

- ✅ E-posta doğrulama (regex)
- ✅ Rate limiting (middleware)
- ✅ CORS koruması
- ✅ Input sanitization

## 📱 Responsive Tasarım

- ✅ Mobile-first approach
- ✅ Flexbox layout
- ✅ Tailwind CSS
- ✅ Touch-friendly buttons

## 🚀 Production Deployment

1. Environment variables'ları production'a ekleyin
2. PDF dosyasını production'a yükleyin
3. Mailchimp webhook'larını ayarlayın (opsiyonel)
4. SSL sertifikası kurun (HTTPS gerekli)

## 📞 Destek

Sorun yaşarsanız:
1. Test dosyalarını çalıştırın
2. Console loglarını kontrol edin
3. Mailchimp API dokümantasyonunu inceleyin
4. GitHub Issues'da sorun açın 