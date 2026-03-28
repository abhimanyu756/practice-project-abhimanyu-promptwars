import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SoapNote } from '../SoapNote';

const mockSoap = {
  subjective: 'Patient reports headache for 3 days',
  objective: 'BP 120/80, Temp 98.6F',
  assessment: 'Tension headache',
  plan: ['Take ibuprofen 400mg', 'Rest in dark room', 'Follow up in 1 week'],
};

describe('SoapNote', () => {
  it('renders all 4 SOAP sections (S, O, A, P)', () => {
    render(<SoapNote soap={mockSoap} />);
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('displays plan items as ordered list', () => {
    render(<SoapNote soap={mockSoap} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(screen.getByText('Take ibuprofen 400mg')).toBeInTheDocument();
    expect(screen.getByText('Rest in dark room')).toBeInTheDocument();
    expect(screen.getByText('Follow up in 1 week')).toBeInTheDocument();
  });

  it('uses semantic dl/dt/dd elements', () => {
    const { container } = render(<SoapNote soap={mockSoap} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    const dtElements = container.querySelectorAll('dt');
    const ddElements = container.querySelectorAll('dd');
    expect(dtElements).toHaveLength(4);
    expect(ddElements).toHaveLength(4);
  });

  it('shows section badges with correct labels', () => {
    render(<SoapNote soap={mockSoap} />);
    expect(screen.getByText('Subjective')).toBeInTheDocument();
    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
  });
});
