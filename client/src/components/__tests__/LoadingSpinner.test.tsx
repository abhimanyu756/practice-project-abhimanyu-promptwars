import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders spinner element', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('has role="status" for accessibility', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite"', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('shows loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Synthesizing Clinical Dossier...')).toBeInTheDocument();
    expect(screen.getByText(/Cross-referencing symptoms/)).toBeInTheDocument();
  });
});
