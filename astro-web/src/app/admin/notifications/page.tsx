'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, Trash2, Users, CheckCircle, XCircle } from 'lucide-react';

interface Subscription {
  id: string;
  endpoint: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotificationsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    url: '',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const response = await fetch('/api/admin/notifications/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function sendNotification() {
    if (!notification.title || !notification.body) {
      alert('Başlık ve mesaj alanları zorunludur');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Bildirim ${result.sent} aboneye gönderildi`);
        setNotification({ title: '', body: '', url: '' });
      } else {
        alert('Bildirim gönderilemedi');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Bildirim gönderilemedi');
    } finally {
      setSending(false);
    }
  }

  async function deleteSubscription(id: string) {
    if (!confirm('Bu aboneliği silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/notifications/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  }

  const predefinedNotifications = [
    {
      title: 'Merkür Retrosu Başladı!',
      body: 'İletişimde gecikmelere dikkat 🚀',
      url: '/blog/merkur-retrosu-iletisim-ve-teknoloji',
    },
    {
      title: 'Dolunay Ritüeli',
      body: 'Bu gece dolunay enerjisini kullanın 🌕',
      url: '/blog/dolunay-ritueli',
    },
    {
      title: 'Günlük Burç Yorumları',
      body: 'Bugünün burç yorumları hazır! ✨',
      url: '/horoscope/daily',
    },
    {
      title: 'Danışmanlık Hatırlatması',
      body: 'Astroloji danışmanlığı için randevu alın 📅',
      url: '/danismanlik',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Push Bildirimleri</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{subscriptions.length} abone</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Aktif</span>
            </div>
          </div>
        </div>

        {/* Send Notification Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Bildirim Gönder
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık *
              </label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bildirim başlığı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mesaj *
              </label>
              <textarea
                value={notification.body}
                onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Bildirim mesajı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL (Opsiyonel)
              </label>
              <input
                type="url"
                value={notification.url}
                onChange={(e) => setNotification({ ...notification, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={sendNotification}
                disabled={sending || !notification.title || !notification.body}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Gönder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Predefined Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Hazır Bildirimler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedNotifications.map((predefined, index) => (
              <button
                key={index}
                onClick={() => setNotification(predefined)}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{predefined.title}</div>
                <div className="text-sm text-gray-600 mt-1">{predefined.body}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Aboneler</h3>
          
          {subscriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Henüz abone yok</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {subscription.endpoint}
                    </div>
                    <div className="text-xs text-gray-500">
                      Abone olma: {new Date(subscription.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSubscription(subscription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Aboneliği sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 