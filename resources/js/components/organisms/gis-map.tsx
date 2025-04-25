import { BlockProperties } from '@/types/map';
import type { Color, PickingInfo, Position } from '@deck.gl/core';
import { AmbientLight, LightingEffect, MapViewState, _SunLight as SunLight } from '@deck.gl/core';
import { GeoJsonLayer, PolygonLayer } from '@deck.gl/layers';
import { DeckGL } from '@deck.gl/react';
import { CompassWidget, ZoomWidget } from '@deck.gl/widgets';
import '@deck.gl/widgets/stylesheet.css';
import { scaleThreshold } from 'd3-scale';
import { Feature, Geometry } from 'geojson';
import { useCallback, useState } from 'react';
import { Map } from 'react-map-gl/maplibre';

export default function GISMap({ data }: { data: Feature<Geometry, BlockProperties>[] }) {
    const COLOR_SCALE = scaleThreshold<number, Color>()
        .domain([-50, -37.5, -25, -12.5, 0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100])
        .range([
            [65, 182, 196],
            [127, 205, 187],
            [199, 233, 180],
            [237, 248, 177],
            // zero
            [255, 255, 204],
            [255, 237, 160],
            [254, 217, 118],
            [254, 178, 76],
            [253, 141, 60],
            [252, 78, 42],
            [227, 26, 28],
            [189, 0, 38],
            [128, 0, 38],
        ]);

    const INITIAL_VIEW_STATE: MapViewState = {
        latitude: -7.1124,
        longitude: 107.5541,
        zoom: 9.8,
        maxZoom: 16,
        pitch: 30,
        bearing: 0,
    };

    const mapStyle = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

    const ambientLight = new AmbientLight({
        color: [255, 255, 255],
        intensity: 1.0,
    });

    // light direction
    const dirLight = new SunLight({
        timestamp: Date.UTC(2025, 3, 24, 4, 0),
        color: [255, 255, 255],
        intensity: 1.5,
        _shadow: true,
    });

    // land cover, currently at Vancouver
    const landCover: Position[][] = [
        [
            [-123.0, 49.196],
            [-123.0, 49.324],
            [-123.306, 49.324],
            [-123.306, 49.196],
        ],
    ];

    const [effects] = useState(() => {
        const lightingEffect = new LightingEffect({ ambientLight, dirLight });
        lightingEffect.shadowColor = [0, 0, 0, 0.5];
        return [lightingEffect];
    });

    const getTooltip = useCallback(({ object }: PickingInfo<Feature<Geometry, BlockProperties>>) => {
        if (!object) {
            return null;
        }

        return (
            object && {
                html: `\
    <div><b>Data Kabupaten Bandung</b></div>
    <div>Nama Kecamatan: ${object.properties.district}</div>
    <div>Nama Desa: ${object.properties.village}</div>
    <div><b>Growth</b></div>
    <div>${object.properties.nilai_data}</div>
    `,
            }
        );
    }, []);

    const layers = [
        // only needed when using shadows - a plane for shadows to drop on
        new PolygonLayer<Position[]>({
            id: 'ground',
            data: landCover,
            stroked: false,
            getPolygon: (f) => f,
            getFillColor: [0, 0, 0, 0],
        }),
        new GeoJsonLayer<BlockProperties>({
            id: 'geojson',
            data,
            opacity: 0.8,
            stroked: false,
            filled: true,
            extruded: true,
            wireframe: true,
            getElevation: (f) => Math.sqrt(f.properties.nilai_data) * 100,
            getFillColor: (f) => COLOR_SCALE(f.properties.growth),
            getLineColor: [255, 255, 255],
            pickable: true,
        }),
    ];

    const widgets = [new ZoomWidget({ id: 'zoom' }), new CompassWidget({ id: 'compass' })];

    return (
        <DeckGL layers={layers} effects={effects} initialViewState={INITIAL_VIEW_STATE} widgets={widgets} controller={true} getTooltip={getTooltip}>
            <Map reuseMaps mapStyle={mapStyle} attributionControl={false} />
        </DeckGL>
    );
}
