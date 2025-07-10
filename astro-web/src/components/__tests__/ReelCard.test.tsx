import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReelCard } from '../ReelCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('ReelCard', () => {
  const defaultProps = {
    title: 'Test Reel Title',
    thumbnail: '/test-thumbnail.jpg',
    publishedAt: new Date('2024-01-15'),
    onClick: jest.fn(),
  };

  it('renders reel information correctly', () => {
    render(<ReelCard {...defaultProps} />);

    expect(screen.getByText('Test Reel Title')).toBeInTheDocument();
    expect(screen.getByText('15 Oca 2024')).toBeInTheDocument();
    expect(screen.getByAltText('Test Reel Title')).toHaveAttribute('src', '/test-thumbnail.jpg');
  });

  it('calls onClick when clicked', () => {
    render(<ReelCard {...defaultProps} />);

    const card = screen.getByText('Test Reel Title').closest('div');
    fireEvent.click(card!);

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('shows calendar badge when calendarUrl is provided', () => {
    render(<ReelCard {...defaultProps} calendarUrl="https://calendar.google.com/event" />);

    expect(screen.getByText('Takvim')).toBeInTheDocument();
  });

  it('does not show calendar badge when calendarUrl is not provided', () => {
    render(<ReelCard {...defaultProps} />);

    expect(screen.queryByText('Takvim')).not.toBeInTheDocument();
  });

  it('formats date correctly for Turkish locale', () => {
    const testDate = new Date('2024-03-20');
    render(<ReelCard {...defaultProps} publishedAt={testDate} />);

    expect(screen.getByText('20 Mar 2024')).toBeInTheDocument();
  });
}); 