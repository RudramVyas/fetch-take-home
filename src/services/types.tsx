// Unified TypeScript interfaces for the Fetch dog‑adoption API

export interface Dog {
    id: string;
      img: string;
      name: string;
      age: number;
      zip_code: string;
      breed: string;
  }
  
  export interface Location {
      zip_code: string;
      latitude: number;
      longitude: number;
      city: string;
      state: string;
      county: string;
  }
  
  export interface Coordinates {
      lat: number;
      lon: number;
  }
  
  export interface DogSearchResponse {
      resultIds: string[];
      total: number;
      next?: string;
      prev?: string;
  }
  
  export interface Match {
      match: string;
  }
  
  export interface LocationSearchResponse {
      results: Location[];
      total: number;
  }
  