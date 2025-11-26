import React, { useState, useEffect, useCallback } from 'react';
import { Hero } from './components/Hero';
import { SpotCard } from './components/SpotCard';
import { findAstroSpots } from './services/geminiService';
import { fetchWeatherForecast } from './services/weatherService';
import { AstroSpot, LoadingState, WeatherForecast } from './types';
import { Sparkles, Filter } from 'lucide-react';

const INITIAL_REGION = 'Germany';
const INITIAL_RADIUS = 500;

const App: React.FC = () => {
  const [spots, setSpots] = useState<AstroSpot[]>([]);
  const [spotState, setSpotState] = useState<LoadingState>(LoadingState.IDLE);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherForecast>>({});
  const [weatherStates, setWeatherStates] = useState<Record<string, LoadingState>>({});
  const [searchRegion, setSearchRegion] = useState<string>(INITIAL_REGION);
  const [searchRadius, setSearchRadius] = useState<number>(INITIAL_RADIUS);
  const [maxBortle, setMaxBortle] = useState<number>(9);

  const handleSearch = useCallback(async (region: string, radius: number) => {
    setSearchRegion(region);
    setSearchRadius(radius);
    setSpotState(LoadingState.LOADING);
    setSpots([]); // Clear previous spots
    
    try {
      const results = await findAstroSpots(region, radius);
      setSpots(results);
      setSpotState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setSpotState(LoadingState.ERROR);
    }
  }, []);

  // Initial load
  useEffect(() => {
    handleSearch(INITIAL_REGION, INITIAL_RADIUS); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyzeWeather = useCallback(async (spot: AstroSpot) => {
    setWeatherStates(prev => ({ ...prev, [spot.id]: LoadingState.LOADING }));
    
    try {
      const forecast = await fetchWeatherForecast(spot.coordinates.lat, spot.coordinates.lng, spot.id);
      setWeatherData(prev => ({ ...prev, [spot.id]: forecast }));
      setWeatherStates(prev => ({ ...prev, [spot.id]: LoadingState.SUCCESS }));
    } catch (error) {
      console.error(error);
      setWeatherStates(prev => ({ ...prev, [spot.id]: LoadingState.ERROR }));
    }
  }, []);

  const filteredSpots = spots.filter(spot => spot.bortleClass <= maxBortle);

  return (
    <div className="min-h-screen bg-astro-900 text-gray-100 flex flex-col font-sans">
      <Hero 
        onSearch={handleSearch} 
        isSearching={spotState === LoadingState.LOADING} 
        initialTerm={INITIAL_REGION}
        initialRadius={INITIAL_RADIUS}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Status Messages */}
        {spotState === LoadingState.LOADING && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-astro-700 border-t-astro-highlight rounded-full animate-spin mb-4"></div>
            <p className="text-astro-highlight animate-pulse">Scanning satellite data for dark skies...</p>
          </div>
        )}

        {spotState === LoadingState.ERROR && (
          <div className="text-center py-20 bg-red-900/10 border border-red-900 rounded-2xl">
            <h2 className="text-xl font-bold text-red-400 mb-2">Signal Lost</h2>
            <p className="text-gray-400">Could not retrieve astronomical data. Please check your connection or try a different region.</p>
          </div>
        )}

        {/* Results Grid */}
        {spotState === LoadingState.SUCCESS && (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-yellow-400" size={24} />
                  <span>Locations near {searchRegion}</span>
                </h2>
                <div className="mt-2 text-sm text-gray-400">
                  Radius: {searchRadius}km • Found {spots.length} locations • Showing {filteredSpots.length}
                </div>
              </div>
              
              <div className="bg-astro-800 border border-astro-700 rounded-xl p-4 flex items-center gap-4 shadow-lg">
                <div className="flex items-center gap-2">
                    <Filter className="text-astro-highlight" size={18} />
                    <span className="text-sm font-medium text-gray-300">Max Bortle Class</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white w-6 text-center">{maxBortle}</span>
                    <input 
                        type="range" 
                        min="1" 
                        max="9" 
                        value={maxBortle}
                        onChange={(e) => setMaxBortle(Number(e.target.value))}
                        className="w-32 h-2 rounded-lg cursor-pointer"
                        title="Filter by Bortle Class (1=Best, 9=Worst)"
                    />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpots.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  weather={weatherData[spot.id]}
                  weatherState={weatherStates[spot.id] || LoadingState.IDLE}
                  onAnalyzeWeather={handleAnalyzeWeather}
                />
              ))}
            </div>

            {filteredSpots.length === 0 && spots.length > 0 && (
                <div className="text-center py-16 bg-astro-800/20 border border-astro-700 border-dashed rounded-2xl">
                    <p className="text-gray-400 mb-4">No spots match your current light pollution filter (Bortle ≤ {maxBortle}).</p>
                    <button 
                        onClick={() => setMaxBortle(9)}
                        className="bg-astro-700 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors mx-auto"
                    >
                        Show All Spots
                    </button>
                </div>
            )}

            {spots.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No specific dark sky spots found for this query. Try increasing the radius or checking the spelling.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-astro-900 border-t border-astro-800 py-8 text-center text-gray-600 text-sm">
        <p>© {new Date().getFullYear()} AstroSpot Germany. Data powered by Gemini AI & Open-Meteo.</p>
        <p className="mt-2 text-xs">Light pollution estimates are approximate (Bortle Scale).</p>
      </footer>
    </div>
  );
};

export default App;