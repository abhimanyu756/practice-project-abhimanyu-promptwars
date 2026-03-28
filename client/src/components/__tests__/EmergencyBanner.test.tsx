import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmergencyBanner } from '../EmergencyBanner';

describe('EmergencyBanner', () => {
  it('renders nothing when isEmergency is false', () => {
    const { container } = render(
      <EmergencyBanner isEmergency={false} severity="low" keywords={[]} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('shows emergency alert when isEmergency is true', () => {
    render(
      <EmergencyBanner isEmergency={true} severity="critical" keywords={['chest pain']} />
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/EMERGENCY DETECTED/)).toBeInTheDocument();
  });

  it('displays severity keywords as badges', () => {
    render(
      <EmergencyBanner isEmergency={true} severity="critical" keywords={['chest pain', 'breathing difficulty']} />
    );
    expect(screen.getByText('chest pain')).toHaveClass('badge', 'badge--critical');
    expect(screen.getByText('breathing difficulty')).toHaveClass('badge', 'badge--critical');
  });

  it('has aria-live="assertive" for screen readers', () => {
    render(
      <EmergencyBanner isEmergency={true} severity="critical" keywords={['seizure']} />
    );
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('shows 911 call button', () => {
    render(
      <EmergencyBanner isEmergency={true} severity="critical" keywords={['bleeding']} />
    );
    const button = screen.getByRole('button', { name: /call ambulance immediately/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('CALL AMBULANCE — 911');
  });
});
