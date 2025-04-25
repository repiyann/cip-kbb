import GISMap from '@/components/organisms/gis-map';
import { Card } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { BlockProperties, GeoJsonData } from '@/types/map';
import { Head, usePage } from '@inertiajs/react';
import { Feature, Geometry } from 'geojson';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { villageBackendData } from '../constants/villagedatadumm';

interface PageProps {
    flash: {
        message?: string;
    };
    [key: string]: unknown;
}

export default function Dashboard() {
    const { flash } = usePage<PageProps>().props;

    if (flash.message === 'unauthorized-access-role') {
        toast.error('You are not authorized to access this page');
    }

    const [data, setData] = useState<Feature<Geometry, BlockProperties>[]>([]);

    async function fetchData() {
        const response = await fetch('/map/id3204_bandung.json');
        const geojson: GeoJsonData = await response.json();

        // this merged data from backend data and geojson data
        // TODO: change this to real data from backend
        const mergedData = geojson.features.map((feature) => {
            const matchingBackendData = villageBackendData.find((item) => item.village_code === feature.properties.village_code);

            if (matchingBackendData) {
                return {
                    ...feature,
                    properties: {
                        ...feature.properties,
                        nilai_data: matchingBackendData.nilai_data,
                        growth: matchingBackendData.growth,
                    },
                };
            }
            return feature;
        });

        setData(mergedData);
    }

    useEffect(() => {
        fetchData();
    });

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="flex-1 overflow-hidden px-5">
                    <div className="relative h-[600px]">
                        <GISMap data={data} />
                    </div>
                </Card>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
