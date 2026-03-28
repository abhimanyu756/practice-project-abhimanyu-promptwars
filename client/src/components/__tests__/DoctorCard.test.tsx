import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DoctorCard } from '../DoctorCard';

const mockDoctor = {
  name: 'Dr. Jane Smith',
  rating: 4.5,
  address: '123 Medical Ave, Suite 100',
  placeId: 'ChIJ_test123',
  location: { lat: 40.7128, lng: -74.006 },
  totalRatings: 128,
  reviewSummary: 'Excellent bedside manner',
};

describe('DoctorCard', () => {
  it('renders doctor name', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    expect(screen.getByText(/Dr\. Jane Smith/)).toBeInTheDocument();
  });

  it('shows star rating', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    expect(screen.getByLabelText('Rating: 4.5 out of 5')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(128)')).toBeInTheDocument();
  });

  it('displays address', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    expect(screen.getByText('123 Medical Ave, Suite 100')).toBeInTheDocument();
  });

  it('shows review summary when provided', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    expect(screen.getByText(/Excellent bedside manner/)).toBeInTheDocument();
  });

  it('has directions link pointing to Google Maps', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    const link = screen.getByRole('link', { name: /get directions to dr\. jane smith/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('https://www.google.com/maps/dir/')
    );
    expect(link).toHaveAttribute('href', expect.stringContaining('40.7128'));
    expect(link).toHaveAttribute('href', expect.stringContaining('-74.006'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('has aria-label with doctor name', () => {
    render(<DoctorCard doctor={mockDoctor} />);
    expect(screen.getByLabelText('Doctor: Dr. Jane Smith')).toBeInTheDocument();
  });
});
