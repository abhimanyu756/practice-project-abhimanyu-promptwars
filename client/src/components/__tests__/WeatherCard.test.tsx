import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WeatherCard } from '../WeatherCard';

const mockWeather = {
  temp: 28,
  humidity: 65,
  description: 'partly cloudy',
};

describe('WeatherCard', () => {
  it('renders temperature and humidity', () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText('28°C')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('shows weather description', () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText('partly cloudy')).toBeInTheDocument();
  });

  it('shows weather impact when provided', () => {
    render(
      <WeatherCard weather={mockWeather} weatherImpact="High humidity may worsen respiratory symptoms" />
    );
    expect(screen.getByText('High humidity may worsen respiratory symptoms')).toBeInTheDocument();
    expect(screen.getByText(/Weather-Health Correlation/)).toBeInTheDocument();
  });

  it('hides impact section when "No significant weather impact"', () => {
    render(
      <WeatherCard weather={mockWeather} weatherImpact="No significant weather impact" />
    );
    expect(screen.queryByText(/Weather-Health Correlation/)).not.toBeInTheDocument();
  });

  it('hides impact section when weatherImpact is not provided', () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.queryByText(/Weather-Health Correlation/)).not.toBeInTheDocument();
  });

  it('shows humidity level label', () => {
    render(<WeatherCard weather={mockWeather} />);
    expect(screen.getByText('High')).toBeInTheDocument();
  });
});
