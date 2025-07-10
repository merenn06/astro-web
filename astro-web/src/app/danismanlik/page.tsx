'use client';

import { useState } from 'react';
import { Calendar, MapPin, User, Mail, MessageSquare, Star } from 'lucide-react';

export default function DanismanlikPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    birthDate: '',
    birthPlace: '',
    question: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    if (!form.name || !form.email || !form.birthDate || !form.birthPlace || !form.question) {
      setError('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', birthDate: '', birthPlace: '', question: '' });
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-950 dark:via-gray-950 dark:to-black">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Star className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Astroloji Danışmanlığı
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Gökyüzünün sırlarını keşfedin, hayatınızın en önemli kararlarını alırken yanınızdayım
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-primary/20 dark:border-primary/30">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Randevu Al
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Kişisel astroloji danışmanlığı için aşağıdaki formu doldurun
              </p>
            </div>

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span className="font-medium">Başvurunuz alındı. En kısa sürede size dönüş yapacağım!</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl mb-6">
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 inline mr-2" />
                    Ad Soyad
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-posta
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Doğum Tarihi
                  </label>
                  <input 
                    type="date" 
                    name="birthDate" 
                    value={form.birthDate} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Doğum Yeri
                  </label>
                  <input 
                    type="text" 
                    name="birthPlace" 
                    value={form.birthPlace} 
                    onChange={handleChange} 
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Sorunuz / Danışmak İstediğiniz Konu
                </label>
                <textarea 
                  name="question" 
                  value={form.question} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                  rows={5} 
                  placeholder="Astroloji danışmanlığı almak istediğiniz konuyu detaylı bir şekilde açıklayın..."
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus:ring-4 focus:ring-primary/30"
              >
                {loading ? 'Gönderiliyor...' : 'Randevu Talebi Gönder'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 