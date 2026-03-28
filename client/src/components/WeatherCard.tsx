import React from 'react';

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="glass-card" aria-label="Current weather conditions">
      <h3 className="data-card-title">&#x1F326; Environmental Context</h3>
      <div className="stack stack--sm">
        <p className="text-body">
          <strong>{weather.temp}°C</strong>
          <span className="text-secondary"> — {weather.description}</span>
        </p>
        <p className="text-caption text-tertiary">
          Humidity: {weather.humidity}%
        </p>
      </div>
    </div>
  );
};
