'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  content: string;
}

export default function CommentForm({ onSuccess }: CommentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Ad Soyad alanı zorunludur';
    if (!formData.email.trim()) return 'E-posta alanı zorunludur';
    if (!formData.email.includes('@')) return 'Geçerli bir e-posta adresi giriniz';
    if (!formData.content.trim()) return 'Yorum alanı zorunludur';
    if (formData.content.trim().length < 10) return 'Yorum en az 10 karakter olmalıdır';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isApproved: false,
          isHighlighted: false,
        }),
      });

      if (response.status === 429) {
        toast.error('Çok fazla istek gönderdiniz. Lütfen 1 dakika bekleyin.');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gönderim sırasında sorun oluştu');
      }

      toast.success('Yorumunuz moderasyona gönderildi');
      setFormData({ name: '', email: '', content: '' });
      onSuccess?.();
    } catch (error: any) {
      console.error('Comment submission error:', error);
      toast.error(error.message || 'Gönderim sırasında sorun oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Yorum Gönder</h2>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Ad Soyad"
          className="input input-bordered"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          className="input input-bordered"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        <textarea
          name="content"
          placeholder="Yorumunuz"
          className="textarea textarea-bordered min-h-[100px]"
          value={formData.content}
          onChange={handleChange}
          disabled={isSubmitting}
          required
        />
        {/* Honeypot field - hidden from users but visible to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
          }}
          aria-hidden="true"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gönderiliyor...
            </>
          ) : (
            'Gönder'
          )}
        </button>
      </div>
    </form>
  );
} 