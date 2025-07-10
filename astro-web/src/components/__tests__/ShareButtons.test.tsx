import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(screen.getByLabelText('X (Twitter) ile paylaş')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn ile paylaş')).toBeInTheDocument();
    expect(screen.getByLabelText('Facebook ile paylaş')).toBeInTheDocument();
  });

  it('generates correct WhatsApp share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const whatsappButton = screen.getByLabelText('WhatsApp ile paylaş');
    const href = whatsappButton.getAttribute('href');
    expect(href).toContain('wa.me/?text=');
    expect(decodeURIComponent(href || '')).toContain('Test Blog Post Title');
    expect(decodeURIComponent(href || '')).toContain('This is a test excerpt');
  });

  it('generates correct X/Twitter share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const twitterButton = screen.getByLabelText('X (Twitter) ile paylaş');
    const href = twitterButton.getAttribute('href');
    expect(href).toContain('twitter.com/intent/tweet');
    expect(decodeURIComponent(href || '')).toContain('Test Blog Post Title');
  });

  it('generates correct LinkedIn share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const linkedinButton = screen.getByLabelText('LinkedIn ile paylaş');
    const href = linkedinButton.getAttribute('href');
    expect(href).toContain('linkedin.com/sharing/share-offsite');
    expect(decodeURIComponent(href || '')).toContain('/blog/test-post');
  });

  it('generates correct Facebook share URL', () => {
    render(<ShareButtons {...mockProps} />);
    
    const facebookButton = screen.getByLabelText('Facebook ile paylaş');
    const href = facebookButton.getAttribute('href');
    expect(href).toContain('facebook.com/sharer/sharer.php');
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
      event_label: 'whatsapp',
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
    const twitterButton = screen.getByLabelText('X (Twitter) ile paylaş');
    const linkedinButton = screen.getByLabelText('LinkedIn ile paylaş');
    const facebookButton = screen.getByLabelText('Facebook ile paylaş');
    
    expect(whatsappButton).toHaveClass('bg-[#25D366]');
    expect(twitterButton).toHaveClass('bg-black');
    expect(linkedinButton).toHaveClass('bg-[#0A66C2]');
    expect(facebookButton).toHaveClass('bg-[#1877F2]');
  });
}); 