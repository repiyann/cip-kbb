import { ChartType } from 'chart.js';

export interface ChartDataProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        type?: string;
        units?: string;
    }[];
    chartType?: string;
    topic?: string;
}

export interface DeckGLDataPoint {
    position: number[];
    color: number[];
    radius: number;
}

export interface ChartInstanceProps {
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        type?: string;
        units?: string;
    }[];
}

export interface ChartComponentProps {
    data: ChartDataProps;
    type: ChartType;
}

export interface ArcDataPoint {
    source: [number, number, number];
    target: [number, number, number];
    color: [number, number, number, number];
}

// Define the custom view state interface for local state management
export interface CustomViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
    transitionDuration: number;
}
