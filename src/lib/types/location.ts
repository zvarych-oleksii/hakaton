export interface Coordinates {
    lat: number;
    lng: number;
}

export type LocationType = "education" | "enjoy" | "interesting";

export interface LocationCreate {
    name: string;
    coordinates: Coordinates;
    type: LocationType;
    factors?: { list: string[] } | null;
    description?: string | null;
}

export interface Location {
    id: string;
    name: string;
    coordinates: Coordinates;
    type: LocationType;
    factors?: { list: string[] } | null;
    description?: string | null;
}