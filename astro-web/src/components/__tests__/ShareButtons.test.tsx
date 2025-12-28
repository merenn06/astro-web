import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ShareButtons from '../ShareButtons';

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/blog/test-post',
}));

// Mock gtag
(global as any).gtag = jest.fn();

describe('ShareButtons', () => {
  const mockProps = {
    title: 'Test Blog Post Title',
    excerpt: 'This is a test excerpt for the blog post that should be included in the share text.'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders share buttons with correct platforms', () => {
    render(<ShareButtons {...mockProps} />);
    
    expect(screen.getByText('Paylaş:')).toBeInTheDocument();
    expect(screen.getByLabelText('WhatsApp ile paylaş')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram ile paylaş')).toBeInTheDocument();
    expect(screen.getByLabelText('Linki kopyala')).toBeInTheDocument();
  });

  it('generates correct WhatsApp share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    const href = whatsappButton.getAttribute('href');
    expect(href).toContain('wa.me/?text=');
    expect(decodeURIComponent(href || '')).toContain('Test Blog Post Title');
    expect(decodeURIComponent(href || '')).toContain('This is a test excerpt');
  });

  it('generates correct Instagram share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const instagramButton = screen.getByLabelText('Instagram ile paylaş');
    const href = instagramButton.getAttribute('href');
    expect(href).toContain('instagram.com/?url=');
    expect(decodeURIComponent(href || '')).toContain('/blog/test-post');
  });



  it('opens links in new tab with proper attributes', () => {
    render(<ShareButtons {...mockProps} />);
    
    const buttons = screen.getAllByRole('link');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('target', '_blank');
      expect(button).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('tracks analytics when buttons are clicked', () => {
    render(<ShareButtons {...mockProps} />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    fireEvent.click(whatsappButton);
    
    expect((global as any).gtag).toHaveBeenCalledWith('event', 'share_click', {
      event_category: 'engagement',
      event_label: 'WhatsApp',
      value: 1
    });
  });

  it('works without excerpt prop', () => {
    render(<ShareButtons title="Test Title" />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    const href = whatsappButton.getAttribute('href');
    expect(decodeURIComponent(href || '')).toContain('Test Title');
    expect(href).not.toContain('undefined');
  });

  it('truncates long excerpts in share text', () => {
    const longExcerpt = 'A'.repeat(200); // Very long excerpt
    render(<ShareButtons title="Test Title" excerpt={longExcerpt} />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    const href = whatsappButton.getAttribute('href');
    const decodedHref = decodeURIComponent(href || '');
    
    // Should contain truncated text (around 100 chars + title)
    expect(decodedHref).toContain('Test Title - ');
    expect(decodedHref).toContain('A'.repeat(100));
    expect(decodedHref).toContain('...');
  });

  it('has proper styling classes', () => {
    render(<ShareButtons {...mockProps} />);
    
    const container = screen.getByText('Paylaş:').closest('div');
    expect(container).toHaveClass('flex', 'items-center', 'gap-3');
    
    const buttons = screen.getAllByRole('link');
    buttons.forEach(button => {
      expect(button).toHaveClass('w-10', 'h-10', 'rounded-full', 'flex', 'items-center', 'justify-center');
    });
  });

  it('uses correct platform colors', () => {
    render(<ShareButtons {...mockProps} />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    const instagramButton = screen.getByLabelText('Instagram ile paylaş');
    
    expect(whatsappButton).toHaveClass('bg-[#25D366]');
    expect(instagramButton).toHaveClass('bg-gradient-to-tr', 'from-[#feda75]', 'via-[#d62976]', 'to-[#4f5bd5]');
  });

  it('copies link to clipboard when copy button is clicked', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<ShareButtons {...mockProps} />);
    
    const copyButton = screen.getByLabelText('Linki kopyala');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://localhost:3000/blog/test-post');
  });

  it('tracks analytics when copy button is clicked', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<ShareButtons {...mockProps} />);
    
    const copyButton = screen.getByLabelText('Linki kopyala');
    
    await act(async () => {
      fireEvent.click(copyButton);
    });
    
    await waitFor(() => {
      expect((global as any).gtag).toHaveBeenCalledWith('event', 'share_click', {
        event_category: 'engagement',
        event_label: 'CopyLink',
        value: 1
      });
    });
  });

  it('shows success message when link is copied', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<ShareButtons {...mockProps} />);
    
    const copyButton = screen.getByLabelText('Linki kopyala');
    
    await act(async () => {
      fireEvent.click(copyButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('✓ Link kopyalandı!')).toBeInTheDocument();
    });
  });

  it('changes copy button appearance when clicked', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    render(<ShareButtons {...mockProps} />);
    
    const copyButton = screen.getByLabelText('Linki kopyala');
    
    // Before click - should have clipboard icon
    expect(copyButton.querySelector('svg')).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click(copyButton);
    });
    
    await waitFor(() => {
      // After click - should have checkmark icon and green background
      expect(copyButton).toHaveClass('bg-green-500', 'text-white');
      expect(copyButton.querySelector('path')).toHaveAttribute('d', 'M5 13l4 4L19 7');
    });
  });
}); 