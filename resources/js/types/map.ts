import { Geometry } from 'geojson';

// Tooltip
export interface BlockProperties {
    district_code: string;
    growth: number;
    nilai_data: number;
    district: string;
    village: string;
    village_code: string;
}

export interface GeoJsonFeature {
    type: 'Feature';
    geometry: Geometry;
    properties: BlockProperties;
}

// GeoJson
export interface GeoJsonData {
    type: 'FeatureCollection';
    features: GeoJsonFeature[];
}
