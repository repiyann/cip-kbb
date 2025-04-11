import { ArcDataPoint, ChartComponentProps, CustomViewState, DeckGLDataPoint } from '@/types/chart';
import { generateRandomDeckGLData } from '@/utils/chart-utils';
import { ArcLayer, ScatterplotLayer } from '@deck.gl/layers';
import { DeckGL } from '@deck.gl/react';
import { Chart, ChartDataset, ChartTypeRegistry, registerables } from 'chart.js';
import { useEffect, useRef, useState } from 'react';

Chart.register(...registerables);

export default function ChartComponent({ data, type }: ChartComponentProps) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [deckGLData, setDeckGLData] = useState<DeckGLDataPoint[]>([]);
    const [viewState, setViewState] = useState<CustomViewState>({
        longitude: 0,
        latitude: 0,
        zoom: 5,
        pitch: 40,
        bearing: 0,
        transitionDuration: 0,
    });

    useEffect(() => {
        setDeckGLData(generateRandomDeckGLData());
    }, [data]);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                const chartTitle = data.topic ? `Visualisasi Data ${data.topic.charAt(0).toUpperCase() + data.topic.slice(1)}` : 'Data Visualization';
                const xAxisTitle = data.topic ? (data.topic.toLowerCase().includes('ekonomi') ? 'Periode' : 'Kategori') : 'Kategori';
                const yAxisTitle = data.datasets && data.datasets[0] ? data.datasets[0].label || 'Nilai' : 'Nilai';

                chartInstance.current = new Chart(ctx, {
                    type: type as keyof ChartTypeRegistry,
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset) => ({
                            ...dataset,
                            backgroundColor:
                                dataset.backgroundColor || type === 'line'
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(99, 102, 241, 0.7)'],
                            borderColor: dataset.borderColor || type === 'line' ? 'rgba(59, 130, 246, 1)' : 'rgba(255, 255, 255, 0.8)',
                            borderWidth: dataset.borderWidth || 2,
                            tension: type === 'line' ? 0.3 : undefined,
                        })) as ChartDataset<keyof ChartTypeRegistry, number[]>[],
                    },
                    options: {
                        responsive: true,
                        animation: {
                            duration: 800,
                            easing: 'easeOutQuart',
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: chartTitle,
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                                padding: {
                                    top: 10,
                                    bottom: 20,
                                },
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    font: {
                                        family: "'Inter', sans-serif",
                                        size: 12,
                                    },
                                },
                            },
                            tooltip: {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                titleColor: '#000',
                                bodyColor: '#000',
                                bodyFont: {
                                    family: "'Inter', sans-serif",
                                    size: 12,
                                },
                                titleFont: {
                                    family: "'Inter', sans-serif",
                                    size: 14,
                                    weight: 'bold',
                                },
                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                borderWidth: 1,
                                cornerRadius: 8,
                                boxPadding: 6,
                                callbacks: {
                                    label: function (context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }

                                        const units = (context.dataset as { customUnits?: string }).customUnits || '';
                                        if (context.parsed.y !== null) {
                                            label += context.parsed.y;
                                            if (units) {
                                                label += ` ${units}`;
                                            }
                                        }

                                        return label;
                                    },
                                },
                            },
                        },
                        scales:
                            type !== 'pie'
                                ? {
                                      x: {
                                          grid: {
                                              display: false,
                                          },
                                          ticks: {
                                              font: {
                                                  family: "'Inter', sans-serif",
                                                  size: 12,
                                              },
                                          },
                                          title: {
                                              display: true,
                                              text: xAxisTitle,
                                              font: {
                                                  family: "'Inter', sans-serif",
                                                  size: 14,
                                                  weight: 'bold',
                                              },
                                              padding: { top: 10, bottom: 0 },
                                          },
                                      },
                                      y: {
                                          grid: {
                                              color: 'rgba(0, 0, 0, 0.05)',
                                          },
                                          ticks: {
                                              font: {
                                                  family: "'Inter', sans-serif",
                                                  size: 12,
                                              },
                                          },
                                          title: {
                                              display: true,
                                              text: yAxisTitle,
                                              font: {
                                                  family: "'Inter', sans-serif",
                                                  size: 14,
                                                  weight: 'bold',
                                              },
                                              padding: { top: 0, bottom: 10 },
                                          },
                                      },
                                  }
                                : undefined,
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, type]);

    function getLayers() {
        const chartType = data.datasets[0]?.type || 'scatter';

        switch (chartType) {
            case 'arc': {
                const arcData = deckGLData.slice(0, deckGLData.length / 2).map((d, i) => ({
                    source: d.position,
                    target: deckGLData[i + deckGLData.length / 2]?.position || [0, 0, 0],
                    color: d.color,
                }));

                return [
                    new ArcLayer({
                        id: 'arc-layer',
                        data: arcData,
                        pickable: true,
                        getSourcePosition: (d: ArcDataPoint) => d.source,
                        getTargetPosition: (d: ArcDataPoint) => d.target,
                        getSourceColor: (d: ArcDataPoint) => d.color,
                        getTargetColor: (d: ArcDataPoint) => d.color,
                        getWidth: 3,
                    }),
                ];
            }
            case 'scatter':
            default:
                return [
                    new ScatterplotLayer({
                        id: 'scatter-layer',
                        data: deckGLData,
                        pickable: true,
                        opacity: 0.8,
                        stroked: true,
                        filled: true,
                        radiusScale: 6,
                        radiusMinPixels: 1,
                        radiusMaxPixels: 100,
                        lineWidthMinPixels: 1,
                        getPosition: (d: DeckGLDataPoint) => d.position as [number, number, number],
                        getRadius: (d: DeckGLDataPoint) => d.radius,
                        getFillColor: (d: DeckGLDataPoint) => d.color as [number, number, number],
                        getLineColor: [0, 0, 0],
                    }),
                ];
        }
    }

    if (data.datasets[0]?.type && ['scatter', 'arc'].includes(data.datasets[0]?.type)) {
        return (
            <div className="animate-fade-in relative h-full w-full">
                <h3 className="absolute top-2 right-0 left-0 z-10 bg-black/30 py-1 text-center text-lg font-bold text-white">
                    {data.topic ? `Visualisasi Data ${data.topic.charAt(0).toUpperCase() + data.topic.slice(1)}` : 'Data Visualization'}
                </h3>

                <div className="absolute inset-0">
                    <DeckGL
                        initialViewState={viewState}
                        controller={true}
                        layers={getLayers()}
                        onViewStateChange={({ viewState }) => {
                            const vs = viewState as CustomViewState;
                            setViewState({
                                longitude: vs.longitude || 0,
                                latitude: vs.latitude || 0,
                                zoom: vs.zoom || 5,
                                pitch: vs.pitch || 40,
                                bearing: vs.bearing || 0,
                                transitionDuration: vs.transitionDuration || 0,
                            });
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in h-full w-full p-4">
            <canvas ref={chartRef} />
        </div>
    );
}
