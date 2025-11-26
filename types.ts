export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AstroSpot {
  id: string;
  name: string;
  region: string;
  bortleClass: number; // 1 (Excellent) to 9 (Bad)
  coordinates: Coordinates;
  description: string;
  bestFeatures: string[];
}

export interface WeatherDataPoint {
  time: string;
  cloudCover: number; // 0-100
  visibility: number; // meters
  temperature: number; // celsius
  humidity: number; // 0-100 relative humidity
  precipitationProb: number; // 0-100 probability
}

export interface WeatherForecast {
  spotId: string;
  hourly: WeatherDataPoint[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}