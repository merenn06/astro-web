"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
        // Google Analytics event tracking
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            'event_category': 'engagement'
          });
        }
      } else {
        const data = await res.json();
        if (data.error === "invalid") {
          setErr("Geçerli bir e-posta adresi giriniz");
        } else {
          setErr("Hata, lütfen tekrar deneyin");
        }
      }
    } catch (error) {
      setErr("Bağlantı hatası, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-sm">
        <p className="font-semibold text-green-800 mb-2">Teşekkürler!</p>
        <p className="text-green-700 mb-3">
          E-posta bültenimize başarıyla kaydoldunuz. 2025 Astro Takvimi PDF'ini indirmek için:
        </p>
        <a
          href="/assets/2025_astro_takvimi.pdf"
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          download
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF'yi İndir
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-xl border border-violet-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        📅 2025 Astro Takvimi
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        E-posta bültenimize kaydolun ve 2025 Astro Takvimi PDF'ini ücretsiz indirin!
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
        <input
          type="email"
          required
          placeholder="E-posta adresiniz"
          className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-violet-600 text-white px-6 py-3 rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
      
      {err && (
        <p className="text-red-500 text-sm mt-2">{err}</p>
      )}
    </div>
  );
} 