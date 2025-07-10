import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsletterForm from '../NewsletterForm';

// Mock fetch globally
global.fetch = jest.fn();

// Mock gtag
(global as any).gtag = jest.fn();

describe('NewsletterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders newsletter form with correct elements', () => {
    render(<NewsletterForm />);
    
    expect(screen.getByText('📅 2025 Astro Takvimi')).toBeInTheDocument();
    expect(screen.getByText('E-posta bültenimize kaydolun ve 2025 Astro Takvimi PDF\'ini ücretsiz indirin!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-posta adresiniz')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gönder' })).toBeInTheDocument();
  });

  it('shows loading state when form is submitted', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Gönderiliyor...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('shows success message and PDF download link after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Teşekkürler!')).toBeInTheDocument();
      expect(screen.getByText('E-posta bültenimize başarıyla kaydoldunuz. 2025 Astro Takvimi PDF\'ini indirmek için:')).toBeInTheDocument();
      expect(screen.getByText('PDF\'yi İndir')).toBeInTheDocument();
    });
  });

  it('shows error message for invalid email', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ 
      ok: false, 
      json: () => Promise.resolve({ error: 'invalid' }) 
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Geçerli bir e-posta adresi giriniz')).toBeInTheDocument();
    });
  });

  it('shows generic error message for server errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ 
      ok: false, 
      json: () => Promise.resolve({ error: 'mailchimp' }) 
    });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hata, lütfen tekrar deneyin')).toBeInTheDocument();
    });
  });

  it('shows connection error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Bağlantı hatası, lütfen tekrar deneyin')).toBeInTheDocument();
    });
  });

  it('calls gtag when subscription is successful', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'newsletter_signup', {
        'event_category': 'engagement'
      });
    });
  });

  it('calls API with correct data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    const submitButton = screen.getByRole('button', { name: 'Gönder' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
    });
  });

  it('requires email input', () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    expect(emailInput).toHaveAttribute('required');
  });

  it('has correct input type for email', () => {
    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('E-posta adresiniz');
    expect(emailInput).toHaveAttribute('type', 'email');
  });
}); 