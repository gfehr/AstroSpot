import React, { useEffect } from 'react';
import { Telescope, Search, MapPin } from 'lucide-react';

interface HeroProps {
  onSearch: (term: string, radius: number) => void;
  isSearching: boolean;
  initialTerm?: string;
  initialRadius?: number;
}

export const Hero: React.FC<HeroProps> = ({ 
  onSearch, 
  isSearching, 
  initialTerm = 'Germany', 
  initialRadius = 100 
}) => {
  const [term, setTerm] = React.useState(initialTerm);
  const [radiusStr, setRadiusStr] = React.useState(initialRadius.toString());

  useEffect(() => {
    setTerm(initialTerm);
    setRadiusStr(initialRadius.toString());
  }, [initialTerm, initialRadius]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const radius = parseInt(radiusStr, 10);
    const validRadius = isNaN(radius) || radius <= 0 ? 100 : radius;
    onSearch(term, validRadius);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadiusStr(e.target.value);
  };

  return (
    <div className="relative overflow-hidden bg-astro-900 border-b border-astro-700">
      {/* Abstract Star Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-60 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-astro-accent rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-1/4 right-10 w-0.5 h-0.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <div className="p-3 bg-astro-800 rounded-full mb-6 border border-astro-700 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Telescope className="w-10 h-10 text-astro-highlight" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-astro-highlight to-astro-accent">Dark Sky</span>
        </h1>
        
        <p className="max-w-2xl text-lg text-gray-400 mb-8">
          Discover the best locations for astrophotography. 
          Powered by AI to find low light pollution zones within your specified radius.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="City or Region (e.g., Berlin)" 
              className="w-full bg-astro-800 border border-astro-700 rounded-xl text-white px-4 py-3 pl-12 focus:outline-none focus:border-astro-highlight focus:ring-1 focus:ring-astro-highlight transition-all placeholder-gray-500"
            />
          </div>

          <div className="relative w-full sm:w-40">
             <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="number" 
              value={radiusStr}
              onChange={handleRadiusChange}
              min={1}
              max={2000}
              placeholder="Radius"
              className="w-full bg-astro-800 border border-astro-700 rounded-xl text-white px-4 py-3 pl-12 pr-8 focus:outline-none focus:border-astro-highlight focus:ring-1 focus:ring-astro-highlight transition-all placeholder-gray-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">km</span>
          </div>

          <button 
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto bg-astro-accent hover:bg-violet-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Scanning...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
};