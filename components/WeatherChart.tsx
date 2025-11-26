import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  ComposedChart,
  Bar
} from 'recharts';
import { WeatherForecast } from '../types';
import { CloudRain, Eye, Thermometer, Droplets, Umbrella } from 'lucide-react';

interface WeatherChartProps {
  forecast: WeatherForecast;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ forecast }) => {
  if (!forecast || !forecast.hourly.length) return null;

  // Analysis logic: Find the best time with lowest cloud cover and no rain
  const bestTime = forecast.hourly.reduce((prev, current) => {
    // Prioritize low clouds, then low rain, then low humidity
    const prevScore = prev.cloudCover + (prev.precipitationProb * 2);
    const currScore = current.cloudCover + (current.precipitationProb * 2);
    return (prevScore < currScore) ? prev : current;
  });

  const isGoodConditions = bestTime.cloudCover < 20 && bestTime.precipitationProb < 10;
  const isHumid = bestTime.humidity > 85;

  return (
    <div className="mt-6 bg-astro-900/50 rounded-xl p-4 border border-astro-700 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">48h Sky Forecast</h3>
        <div className={`text-xs px-2 py-1 rounded-full border ${isGoodConditions ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>
          {isGoodConditions ? 'CLEAR SKIES AHEAD' : 'POOR VISIBILITY'}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={forecast.hourly}>
            <defs>
              <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1F253D" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              interval={1}
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#15192B', borderColor: '#1F253D', color: '#E2E8F0' }}
              itemStyle={{ fontSize: '12px' }}
              labelStyle={{ color: '#94A3B8', marginBottom: '0.5rem' }}
            />
            {/* Precipitation Probability as Bars */}
            <Bar 
              dataKey="precipitationProb" 
              name="Rain Prob %" 
              fill="#4F46E5" 
              opacity={0.6}
              barSize={20}
            />
            {/* Cloud Cover as Area */}
            <Area 
              type="monotone" 
              dataKey="cloudCover" 
              name="Cloud Cover %"
              stroke="#38BDF8" 
              fillOpacity={1} 
              fill="url(#colorCloud)" 
            />
             <Line 
              type="monotone" 
              dataKey="humidity" 
              name="Humidity %"
              stroke="#10B981" 
              strokeWidth={0}
              dot={false}
              activeDot={false}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="bg-astro-800 p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
             <Thermometer size={12} /> Temp
          </div>
          <span className="text-white font-mono text-sm">{bestTime.temperature}°C</span>
        </div>
        
        <div className="bg-astro-800 p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
             <CloudRain size={12} /> Cloud
          </div>
          <span className={`font-mono text-sm ${bestTime.cloudCover < 20 ? 'text-green-400' : 'text-yellow-400'}`}>
            {bestTime.cloudCover}%
          </span>
        </div>

        <div className="bg-astro-800 p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
             <Droplets size={12} /> Humid
          </div>
          <span className={`font-mono text-sm ${bestTime.humidity > 85 ? 'text-red-400' : 'text-blue-300'}`}>
            {bestTime.humidity}%
          </span>
        </div>

        <div className="bg-astro-800 p-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 text-xs mb-1">
             <Umbrella size={12} /> Rain
          </div>
          <span className={`font-mono text-sm ${bestTime.precipitationProb > 20 ? 'text-red-400' : 'text-gray-300'}`}>
            {bestTime.precipitationProb}%
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3 px-1">
        <p className="text-xs text-gray-500">
          Best potential: <span className="text-gray-300">{bestTime.time}</span>
        </p>
        {isHumid && <span className="text-[10px] text-yellow-500 flex items-center gap-1">⚠️ High Dew Risk</span>}
      </div>
    </div>
  );
};