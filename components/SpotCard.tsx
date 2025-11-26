import React from 'react';
import { AstroSpot, WeatherForecast, LoadingState } from '../types';
import { MapPin, Star, CloudLightning, ExternalLink } from 'lucide-react';
import { WeatherChart } from './WeatherChart';

interface SpotCardProps {
  spot: AstroSpot;
  weather: WeatherForecast | undefined;
  weatherState: LoadingState;
  onAnalyzeWeather: (spot: AstroSpot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({ spot, weather, weatherState, onAnalyzeWeather }) => {
  const isBortleGood = spot.bortleClass <= 4;
  const isLoading = weatherState === LoadingState.LOADING;

  return (
    <div className="bg-astro-800 rounded-2xl border border-astro-700 overflow-hidden hover:border-astro-highlight transition-all duration-300 shadow-xl flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-astro-700 text-astro-highlight border border-astro-700 mb-2">
              {spot.region}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight">{spot.name}</h2>
          </div>
          <div className="flex flex-col items-end">
             <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isBortleGood ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'}`}>
                <span className="font-bold font-mono text-lg">{spot.bortleClass}</span>
             </div>
             <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Bortle</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
          {spot.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {spot.bestFeatures.slice(0, 3).map((feature, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-astro-900/50 border border-astro-700/50 text-gray-300">
              <Star size={10} className="text-astro-accent" /> {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-astro-700 flex items-center justify-between gap-3">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${spot.coordinates.lat},${spot.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <MapPin size={16} />
            <span>Map</span>
            <ExternalLink size={12} />
          </a>

          {!weather && (
            <button
              onClick={() => onAnalyzeWeather(spot)}
              disabled={isLoading}
              className="bg-astro-700 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  <CloudLightning size={16} className="text-astro-highlight" />
                  Analyze Weather
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {weather && (
        <div className="px-6 pb-6">
           <WeatherChart forecast={weather} />
        </div>
      )}
    </div>
  );
};