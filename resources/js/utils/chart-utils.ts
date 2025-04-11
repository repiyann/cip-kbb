import { TableData } from '@/contexts/app-context';
import { ChartDataProps, DeckGLDataPoint } from '@/types/chart';

// Function to generate random chart data
export function generateRandomChartData(topic?: string): ChartDataProps {
    const chartTypes = ['bar', 'line', 'scatter', 'arc'];
    const randomType = chartTypes[Math.floor(Math.random() * chartTypes.length)];

    // Define context-specific chart data
    let labels: string[] = [];
    let dataLabels: string[] = [];
    let units: string = '';

    // Set up context-specific data for the chart
    if (topic) {
        const lowerTopic = topic.toLowerCase();

        if (lowerTopic.includes('pertanian')) {
            labels = ['Padi', 'Jagung', 'Kedelai', 'Cabai', 'Bawang', 'Kopi', 'Tebu'];
            dataLabels = ['Produksi (ton)', 'Luas Lahan (ha)'];
            units = 'ton';
        } else if (lowerTopic.includes('ekonomi') || lowerTopic.includes('keuangan')) {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
            dataLabels = ['Pendapatan', 'Pengeluaran', 'Investasi'];
            units = 'Rp';
        } else if (lowerTopic.includes('pendidikan')) {
            labels = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
            dataLabels = ['Jumlah Siswa', 'Jumlah Guru', 'Jumlah Sekolah'];
            units = 'orang';
        } else if (lowerTopic.includes('kesehatan')) {
            labels = ['Puskesmas', 'RSUD', 'RS Swasta', 'Klinik', 'Apotek'];
            dataLabels = ['Pasien', 'Tenaga Medis', 'Ketersediaan Obat'];
            units = 'unit';
        } else if (lowerTopic.includes('pertahanan') || lowerTopic.includes('keamanan')) {
            labels = ['Angkatan Darat', 'Angkatan Laut', 'Angkatan Udara', 'Kepolisian', 'Intelijen'];
            dataLabels = ['Personel', 'Anggaran', 'Peralatan'];
            units = 'personel';
        } else {
            // Default labels if no specific context is detected
            labels = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => `Kategori ${i + 1}`);
            dataLabels = ['Dataset 1', 'Dataset 2'];
            units = 'unit';
        }
    } else {
        // Random labels if no topic is provided
        labels = Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => `Kategori ${i + 1}`);
        dataLabels = ['Dataset 1', 'Dataset 2'];
        units = 'unit';
    }

    // Generate random datasets based on the context
    const datasetCount = Math.min(dataLabels.length, Math.floor(Math.random() * 2) + 1);

    const datasets = Array.from({ length: datasetCount }, (_, i) => {
        // Generate random data points
        const data = labels.map(() => Math.floor(Math.random() * 100));

        // Generate random colors
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        return {
            label: dataLabels[i],
            data,
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.7)`,
            borderColor: `rgba(${r}, ${g}, ${b}, 1)`,
            type: randomType,
            units: units,
        };
    });

    return {
        labels,
        datasets,
        chartType: randomType,
        topic: topic || 'General',
    };
}

// Function to generate table data based on topic and response context
export function generateTableData(topic?: string, responseContent?: string): TableData {
    let headers: string[] = [];
    let rows: string[][] = [];

    // Define context-specific table headers and sample data based on the topic
    if (topic) {
        const lowerTopic = topic.toLowerCase();

        if (lowerTopic.includes('pertanian')) {
            headers = ['Jenis Tanaman', 'Produksi (ton)', 'Luas Lahan (ha)', 'Produktivitas (ton/ha)', 'Periode'];
            rows = [
                ['Padi', '5.700', '1.200', '4.75', 'Jan-Mar 2023'],
                ['Jagung', '3.200', '800', '4.00', 'Jan-Mar 2023'],
                ['Kedelai', '1.500', '600', '2.50', 'Jan-Mar 2023'],
                ['Cabai', '800', '200', '4.00', 'Jan-Mar 2023'],
                ['Bawang', '1.200', '150', '8.00', 'Jan-Mar 2023'],
            ];
        } else if (lowerTopic.includes('ekonomi') || lowerTopic.includes('keuangan')) {
            headers = ['Indikator', 'Nilai', 'Perubahan (%)', 'Periode', 'Keterangan'];
            rows = [
                ['PDB', 'Rp 4.580 T', '+3.7%', 'Q2 2023', 'Naik dari Q1'],
                ['Inflasi', '3.5%', '+0.2%', 'Agt 2023', 'Komponen makanan dominan'],
                ['Kurs USD/IDR', '15.450', '-0.8%', '10 Sept 2023', 'Menguat dari sebelumnya'],
                ['Suku Bunga BI', '5.75%', '0%', 'Sept 2023', 'Tetap dari bulan lalu'],
                ['Ekspor', 'USD 22.4 M', '+5.2%', 'Juli 2023', 'Komoditas pertanian naik'],
            ];
        } else if (lowerTopic.includes('pendidikan')) {
            headers = ['Jenjang', 'Jumlah Siswa', 'Jumlah Guru', 'Rasio Siswa:Guru', 'APK (%)'];
            rows = [
                ['SD', '25.650.000', '1.500.000', '17:1', '98.2%'],
                ['SMP', '10.120.000', '650.000', '16:1', '94.5%'],
                ['SMA', '4.850.000', '320.000', '15:1', '88.7%'],
                ['SMK', '5.320.000', '350.000', '15:1', '72.3%'],
                ['Perguruan Tinggi', '8.750.000', '450.000', '19:1', '32.5%'],
            ];
        } else if (lowerTopic.includes('kesehatan')) {
            headers = ['Fasilitas', 'Jumlah', 'Kapasitas', 'Tenaga Medis', 'Rasio per 1000 Penduduk'];
            rows = [
                ['Rumah Sakit', '2.850', '310.500 tempat tidur', '45.200 dokter', '0.17'],
                ['Puskesmas', '10.350', 'N/A', '15.600 dokter', '0.06'],
                ['Klinik', '8.750', '52.500 tempat tidur', '25.300 dokter', '0.09'],
                ['Apotek', '28.350', 'N/A', '32.600 apoteker', '0.12'],
                ['Posyandu', '289.450', 'N/A', '315.000 kader', '1.16'],
            ];
        } else if (lowerTopic.includes('pertahanan') || lowerTopic.includes('keamanan')) {
            headers = ['Institusi', 'Personel', 'Anggaran (T Rp)', 'Peralatan Utama', 'Cakupan Wilayah'];
            rows = [
                ['TNI AD', '328.500', '58.2', '450 tank, 1.250 Panser', 'Seluruh Indonesia'],
                ['TNI AL', '74.000', '42.5', '156 kapal perang, 5 kapal selam', 'Perairan Indonesia'],
                ['TNI AU', '37.850', '38.7', '102 pesawat tempur, 72 helikopter', 'Wilayah Udara NKRI'],
                ['POLRI', '435.000', '104.2', '25.000 kendaraan operasional', 'Seluruh Indonesia'],
                ['Basarnas', '12.800', '8.5', '46 kapal, 28 helikopter', 'Seluruh Indonesia'],
            ];
        } else {
            // Default generic table if no specific topic is detected
            headers = ['Kategori', 'Nilai 1', 'Nilai 2', 'Nilai 3', 'Keterangan'];
            rows = [
                ['Item 1', '125', '37.5%', '5.200', 'Keterangan 1'],
                ['Item 2', '240', '42.8%', '8.750', 'Keterangan 2'],
                ['Item 3', '180', '21.5%', '4.320', 'Keterangan 3'],
                ['Item 4', '310', '55.2%', '12.450', 'Keterangan 4'],
                ['Item 5', '95', '18.7%', '2.850', 'Keterangan 5'],
            ];
        }
    } else {
        // Generic table if no topic is provided
        headers = ['Kategori', 'Nilai 1', 'Nilai 2', 'Nilai 3', 'Keterangan'];
        rows = [
            ['Item 1', '125', '37.5%', '5.200', 'Keterangan 1'],
            ['Item 2', '240', '42.8%', '8.750', 'Keterangan 2'],
            ['Item 3', '180', '21.5%', '4.320', 'Keterangan 3'],
            ['Item 4', '310', '55.2%', '12.450', 'Keterangan 4'],
            ['Item 5', '95', '18.7%', '2.850', 'Keterangan 5'],
        ];
    }

    // Extract potential data from the response content
    if (responseContent) {
        // Try to find numbers in the response to populate the table with more relevant data
        const numbers = responseContent.match(/\b\d+(?:\.\d+)?\b/g);

        if (numbers && numbers.length > 0) {
            // Use some of the extracted numbers to replace values in the table
            // This makes the table data feel more connected to the response
            const min = Math.min(numbers.length, rows.length * 2);
            for (let i = 0; i < min; i++) {
                const rowIndex = i % rows.length;
                const colIndex = 1 + Math.floor(i / rows.length); // Start from column 1 (values)
                if (colIndex < headers.length) {
                    rows[rowIndex][colIndex] = numbers[i];
                }
            }
        }
    }

    return {
        headers,
        rows,
    };
}

// Function to generate random 3D data for deck.gl
export function generateRandomDeckGLData(): DeckGLDataPoint[] {
    const dataPoints = Math.floor(Math.random() * 500) + 100; // 100-600 points

    return Array.from({ length: dataPoints }, () => ({
        position: [
            (Math.random() - 0.5) * 1000, // x
            (Math.random() - 0.5) * 1000, // y
            Math.random() * 100, // z
        ],
        color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
        radius: Math.random() * 10 + 2,
    }));
}
