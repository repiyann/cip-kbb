import useAppContext from '@/contexts/app-context';
import ChartComponent from './chart-component';
import TableComponent from './table-component';

export default function DataVisualizer() {
    const { activeData, chartData, tableData } = useAppContext();

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b p-4">
                <h2 className="text-xl font-semibold">
                    {activeData === 'chart' ? 'Chart Visualization' : activeData === 'table' ? 'Data Table' : 'Data Visualizer'}
                </h2>
            </div>

            <div className="flex-1 overflow-hidden p-2">
                {activeData === 'chart' && chartData && (
                    <ChartComponent data={chartData} type={(chartData.datasets[0]?.type || 'bar') as 'bar' | 'line' | 'pie'} />
                )}

                {activeData === 'table' && tableData && <TableComponent data={tableData} />}

                {!activeData && (
                    <div className="text-muted-foreground flex h-full items-center justify-center p-8 text-center">
                        <p>Ask the virtual assistant to display chart or table data</p>
                    </div>
                )}
            </div>
        </div>
    );
}
