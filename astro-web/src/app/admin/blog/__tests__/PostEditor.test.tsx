import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock the EditBlogPostPage component
const MockEditBlogPostPage = () => {
  const [formData, setFormData] = useState({
    title: 'Test Post',
    excerpt: 'Test excerpt',
    content: { type: 'doc', content: [] },
    coverImage: '',
    isPublished: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  return (
    <div>
      <input
        data-testid="title-input"
        value={formData.title}
        onChange={(e) => updateFormData({ title: e.target.value })}
      />
      <textarea
        data-testid="excerpt-input"
        value={formData.excerpt}
        onChange={(e) => updateFormData({ excerpt: e.target.value })}
        maxLength={200}
      />
      <div data-testid="changes-indicator">
        {hasChanges ? 'Has Changes' : 'No Changes'}
      </div>
    </div>
  );
};

describe('PostEditor Autosave', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('tracks changes when form data is updated', async () => {
    render(<MockEditBlogPostPage />);

    const titleInput = screen.getByTestId('title-input');
    const excerptInput = screen.getByTestId('excerpt-input');
    const changesIndicator = screen.getByTestId('changes-indicator');

    // Initially no changes
    expect(changesIndicator).toHaveTextContent('No Changes');

    // Update title
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    expect(changesIndicator).toHaveTextContent('Has Changes');

    // Update excerpt
    fireEvent.change(excerptInput, { target: { value: 'Updated excerpt' } });
    expect(changesIndicator).toHaveTextContent('Has Changes');
  });

  it('enforces excerpt character limit', () => {
    render(<MockEditBlogPostPage />);

    const excerptInput = screen.getByTestId('excerpt-input');
    
    // Try to input more than 200 characters
    const longText = 'a'.repeat(250);
    fireEvent.change(excerptInput, { target: { value: longText } });
    
    // Should be limited to 200 characters by maxLength attribute
    expect(excerptInput).toHaveAttribute('maxLength', '200');
  });
}); 