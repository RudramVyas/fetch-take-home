import axios, { AxiosInstance } from 'axios';
import {
    Dog,
    Location,
    Coordinates,
    DogSearchResponse,
    LocationSearchResponse,
    Match,
} from './types';

// Axios instance

// const BASE_URL = "https://frontend-take-home-service.fetch.com";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // include HttpOnly auth cookie automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

// Helper types
export interface DogSearchParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number; // defaults to 25
    from?: number;
    sort?: 'breed' | 'name' | 'age';
    sortDirection?: 'asc' | 'desc';
}

export interface LocationSearchParams {
    city?: string;
    states?: string[]; // 2‑letter abbreviations
    geoBoundingBox?:
        | {
              top: number;
              left: number;
              bottom: number;
              right: number;
          }
        | {
              bottom_left: Coordinates;
              top_right: Coordinates;
          }
        | {
              bottom_right: Coordinates;
              top_left: Coordinates;
          };
    size?: number; // defaults to 25
    from?: number;
}

// Auth
export const login = (name: string, email: string) =>
    api.post('/auth/login', { name, email });

export const logout = () => api.post('/auth/logout');

// Dogs
export const getBreeds = () => api.get<string[]>('/dogs/breeds');

export const searchDogs = (params: DogSearchParams) => {
    const {
        breeds,
        zipCodes,
        ageMin,
        ageMax,
        size,
        from,
        sort,
        sortDirection,
    } = params;

    const query = new URLSearchParams();

    if (breeds?.length) breeds.forEach((b) => query.append('breeds', b));
    if (zipCodes?.length) zipCodes.forEach((z) => query.append('zipCodes', z));
    if (ageMin !== undefined) query.append('ageMin', String(ageMin));
    if (ageMax !== undefined) query.append('ageMax', String(ageMax));
    if (size !== undefined) query.append('size', String(size));
    if (from !== undefined) query.append('from', String(from));
    if (sort && sortDirection) query.append('sort', `${sort}:${sortDirection}`);

    return api.get<DogSearchResponse>(`/dogs/search?${query.toString()}`);
};

export const getDogsByIds = (ids: string[]) => api.post<Dog[]>('/dogs', ids);

export const matchDogs = (ids: string[]) => api.post<Match>('/dogs/match', ids);

// Locations
export const getLocationsByZip = (zipCodes: string[]) =>
    api.post<Location[]>('/locations', zipCodes);

export const searchLocations = (body: LocationSearchParams) =>
    api.post<LocationSearchResponse>('/locations/search', body);

export default api;
