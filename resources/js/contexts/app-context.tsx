import { ChartDataProps } from '@/types/chart';
import { createContext, ReactNode, useContext, useState } from 'react';

export type DataType = 'chart' | 'table' | null;

export interface TableData {
    headers: string[];
    rows: string[][];
    caption?: string;
}

type AppContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    activeData: DataType;
    setActiveData: (type: DataType) => void;
    chartData: ChartDataProps | null;
    setChartData: (data: ChartDataProps | null) => void;
    tableData: TableData | null;
    setTableData: (data: TableData | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [activeData, setActiveData] = useState<DataType>(null);
    const [chartData, setChartData] = useState<ChartDataProps | null>(null);
    const [tableData, setTableData] = useState<TableData | null>(null);

    return (
        <AppContext.Provider
            value={{
                isAuthenticated,
                setIsAuthenticated,
                activeData,
                setActiveData,
                chartData,
                setChartData,
                tableData,
                setTableData,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
