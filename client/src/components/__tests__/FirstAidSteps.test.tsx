import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FirstAidSteps } from '../FirstAidSteps';

describe('FirstAidSteps', () => {
  it('renders nothing when steps are empty', () => {
    const { container } = render(<FirstAidSteps steps={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when steps is undefined-like', () => {
    const { container } = render(<FirstAidSteps steps={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders ordered list of steps', () => {
    const steps = ['Apply ice', 'Elevate the limb', 'Take pain relief'];
    render(<FirstAidSteps steps={steps} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
  });

  it('displays correct number of steps', () => {
    const steps = ['Apply ice', 'Elevate the limb', 'Take pain relief'];
    render(<FirstAidSteps steps={steps} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(screen.getByText('Apply ice')).toBeInTheDocument();
    expect(screen.getByText('Elevate the limb')).toBeInTheDocument();
    expect(screen.getByText('Take pain relief')).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    const steps = ['Step 1'];
    render(<FirstAidSteps steps={steps} />);
    expect(screen.getByLabelText('Immediate relief protocol')).toBeInTheDocument();
  });
});
