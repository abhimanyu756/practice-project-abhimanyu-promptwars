import React from 'react';

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
}

interface WeatherCardProps {
  weather: WeatherData;
  weatherImpact?: string;
}

function getTempIcon(temp: number): string {
  if (temp >= 35) return '\u{1F525}';
  if (temp >= 25) return '\u{2600}\u{FE0F}';
  if (temp >= 15) return '\u{26C5}';
  if (temp >= 5) return '\u{1F327}\u{FE0F}';
  return '\u{2744}\u{FE0F}';
}

function getHumidityLevel(humidity: number): string {
  if (humidity >= 80) return 'Very High';
  if (humidity >= 60) return 'High';
  if (humidity >= 40) return 'Moderate';
  return 'Low';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, weatherImpact }) => {
  return (
    <div className="glass-card" aria-label="Environmental context and health impact">
      <h3 className="data-card-title">&#x1F326; Environmental Context</h3>

      <div className="weather-stats">
        <div className="weather-stat">
          <span className="weather-stat__icon">{getTempIcon(weather.temp)}</span>
          <span className="weather-stat__value">{weather.temp}°C</span>
          <span className="weather-stat__label">Temperature</span>
        </div>
        <div className="weather-stat">
          <span className="weather-stat__icon">&#x1F4A7;</span>
          <span className="weather-stat__value">{weather.humidity}%</span>
          <span className="weather-stat__label">{getHumidityLevel(weather.humidity)}</span>
        </div>
      </div>

      <p className="text-caption text-secondary" style={{ textTransform: 'capitalize' }}>
        {weather.description}
      </p>

      {weatherImpact && weatherImpact !== 'No significant weather impact' && (
        <div className="weather-impact">
          <h4 className="data-card-title data-card-title--alert">
            &#x26A0;&#xFE0F; Weather-Health Correlation
          </h4>
          <p className="text-body text-secondary">{weatherImpact}</p>
        </div>
      )}
    </div>
  );
};
