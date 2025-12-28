import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CommentCard from '@/components/CommentCard';

const mockComment = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  content: 'This is a very long comment that should be truncated and have an expand/collapse button. '.repeat(10),
  isApproved: true,
  isHighlighted: false,
  createdAt: '2025-07-09T21:39:42.215Z',
};

const shortComment = {
  ...mockComment,
  content: 'Short comment that fits in three lines easily.',
};

describe('CommentCard', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders comment information correctly', () => {
    render(<CommentCard comment={mockComment} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/This is a very long comment/)).toBeInTheDocument();
    expect(screen.getByText((content, node) => node?.textContent === '09.07.2025')).toBeInTheDocument();
  });

  it('clamps text by default for long comments', () => {
    render(<CommentCard comment={mockComment} />);
    const content = screen.getByText(/This is a very long comment/);
    expect(content).toHaveClass('line-clamp-3');
  });

  it('shows expand button when text overflows (simulated)', () => {
    render(<CommentCard comment={mockComment} />);
    const content = screen.getByText(/This is a very long comment/);
    Object.defineProperty(content, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(content, 'clientHeight', { value: 60, configurable: true });
    fireEvent.scroll(content);
    fireEvent.resize(window);
    expect(screen.getByText('Devamını oku')).toBeInTheDocument();
  });

  it('does not show expand button when text fits three lines (simulated)', () => {
    render(<CommentCard comment={shortComment} />);
    const content = screen.getByText(/Short comment/);
    Object.defineProperty(content, 'scrollHeight', { value: 60, configurable: true });
    Object.defineProperty(content, 'clientHeight', { value: 60, configurable: true });
    fireEvent.scroll(content);
    fireEvent.resize(window);
    expect(screen.queryByText('Devamını oku')).not.toBeInTheDocument();
    expect(screen.queryByText('Gizle')).not.toBeInTheDocument();
  });

  it('expands and collapses on click', () => {
    render(<CommentCard comment={mockComment} />);
    const content = screen.getByText(/This is a very long comment/);
    Object.defineProperty(content, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(content, 'clientHeight', { value: 60, configurable: true });
    fireEvent.scroll(content);
    fireEvent.resize(window);
    const expandButton = screen.getByText('Devamını oku');
    fireEvent.click(expandButton);
    expect(screen.getByText('Gizle')).toBeInTheDocument();
    expect(content).not.toHaveClass('line-clamp-3');
    const collapseButton = screen.getByText('Gizle');
    fireEvent.click(collapseButton);
    expect(screen.getByText('Devamını oku')).toBeInTheDocument();
    expect(content).toHaveClass('line-clamp-3');
  });

  it('shows star icon for highlighted comments', () => {
    const highlightedComment = {
      ...mockComment,
      isHighlighted: true,
    };
    render(<CommentCard comment={highlightedComment} />);
    const starIcon = document.querySelector('.lucide-star');
    expect(starIcon).toBeInTheDocument();
    expect(starIcon).toHaveClass('text-amber-400');
  });

  it('has proper accessibility attributes', () => {
    render(<CommentCard comment={mockComment} />);
    const content = screen.getByText(/This is a very long comment/);
    Object.defineProperty(content, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(content, 'clientHeight', { value: 60, configurable: true });
    fireEvent.scroll(content);
    fireEvent.resize(window);
    const toggleButton = screen.getByText('Devamını oku');
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders link-style toggle with icon right', () => {
    render(<CommentCard comment={mockComment} />);
    const content = screen.getByText(/This is a very long comment/);
    Object.defineProperty(content, 'scrollHeight', { value: 100, configurable: true });
    Object.defineProperty(content, 'clientHeight', { value: 60, configurable: true });
    fireEvent.scroll(content);
    fireEvent.resize(window);
    const toggleButton = screen.getByTestId('toggle-link');
    expect(toggleButton).toHaveClass('inline-flex', 'items-center', 'text-violet-600', 'hover:underline');
    // Icon is right of text
    const icon = toggleButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon?.className.baseVal).toMatch(/ml-1/);
  });
}); 