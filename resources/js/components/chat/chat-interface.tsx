import useAppContext from '@/contexts/app-context';
import { useChat } from '@/hooks/use-chat';
import { generateRandomChartData, generateTableData } from '@/utils/chart-utils';
import { useEffect, useState } from 'react';
import ChatInput from './chat-input';
import ChatMessages from './chat-message';

export default function ChatInterface() {
    const { setActiveData, setChartData, setTableData } = useAppContext();
    const { messages, isTyping, isResponseComplete, lastResponseData, sendMessage } = useChat();
    const [processedResponse, setProcessedResponse] = useState<string | null>(null);

    // Process response to create visualization only when response is complete
    useEffect(() => {
        // Only run when we have a complete response with new data
        if (isResponseComplete && lastResponseData && processedResponse !== lastResponseData) {
            setProcessedResponse(lastResponseData);

            // Look at the last message if it exists and is from the user
            const lastUserMessageIndex = [...messages].reverse().findIndex((msg) => msg.sender === 'user');
            if (lastUserMessageIndex === -1) return;

            const lastUserMessage = messages[messages.length - 1 - lastUserMessageIndex];
            const text = lastUserMessage.text.toLowerCase();

            // Check if user wants to see a chart (includes 'grafik')
            const wantsChart = text.includes('grafik');

            // Check if user wants to see a table
            const wantsTable = text.includes('table') || text.includes('tabel');

            // Check for general visualization keywords
            const hasGenericKeyword = ['tampilkan', 'cari', 'sajikan', 'grafikkan', 'visualisasikan', 'contoh'].some((keyword) =>
                text.includes(keyword.toLowerCase()),
            );

            // Check for specific structured data in the message (like tables)
            const hasStructuredData =
                lastResponseData.includes('No.') ||
                lastResponseData.includes('Kecamatan') ||
                lastResponseData.includes('Merek') ||
                (lastResponseData.includes('|') && lastResponseData.includes('-')) ||
                (lastResponseData.includes('Jumlah') && lastResponseData.includes('Persentase')) ||
                lastResponseData.includes('Jumlah Terjual');

            // Additional table-related keywords
            const tableRelatedKeywords = [
                'penjualan',
                'data',
                'statistik',
                'angka',
                'perbandingan',
                'mobil',
                'jakarta',
                'penduduk',
                'miskin',
                'kota',
                'bandung',
            ];
            const hasTableKeywords = tableRelatedKeywords.some((keyword) => text.includes(keyword.toLowerCase()));

            // Check for topic-specific keywords
            const topicKeywords = {
                pertanian: ['panen', 'hasil', 'tani', 'pertanian', 'sawah', 'kebun'],
                ekonomi: ['ekonomi', 'keuangan', 'uang', 'inflasi', 'pasar', 'bisnis', 'rupiah', 'dollar'],
                pendidikan: ['pendidikan', 'sekolah', 'universitas', 'kampus', 'siswa', 'guru', 'dosen'],
                kesehatan: ['kesehatan', 'rumah sakit', 'dokter', 'puskesmas', 'obat', 'pasien'],
                pertahanan: ['pertahanan', 'militer', 'tentara', 'keamanan', 'polisi', 'senjata'],
                otomotif: ['mobil', 'kendaraan', 'motor', 'otomotif', 'merek', 'toyota', 'honda', 'suzuki'],
                demografi: ['penduduk', 'miskin', 'kota', 'bandung', 'kecamatan', 'jiwa', 'persentase'],
            };

            let detectedTopic = '';

            // Detect topic from user message
            for (const [topic, keywords] of Object.entries(topicKeywords)) {
                if (keywords.some((keyword) => text.includes(keyword))) {
                    detectedTopic = topic;
                    break;
                }
            }

            // Additional topic detection from assistant's response
            if (!detectedTopic) {
                const response = lastResponseData.toLowerCase();
                for (const [topic, keywords] of Object.entries(topicKeywords)) {
                    if (keywords.some((keyword) => response.includes(keyword))) {
                        detectedTopic = topic;
                        break;
                    }
                }
            }

            // Process structured car sales data if present
            if (lastResponseData.includes('Merek Mobil') && lastResponseData.includes('Jumlah Terjual')) {
                // Create custom table for car sales data
                const headers = ['No.', 'Merek Mobil', 'Model', 'Jumlah Terjual (Unit)', 'Kategori'];
                const rows = [
                    ['1', 'Toyota', 'Avanza', '12,345', 'MPV'],
                    ['2', 'Daihatsu', 'Xenia', '10,987', 'MPV'],
                    ['3', 'Honda', 'HR-V', '9,876', 'SUV'],
                    ['4', 'Suzuki', 'Ertiga', '8,765', 'MPV'],
                    ['5', 'Mitsubishi', 'Xpander', '7,654', 'MPV'],
                    ['6', 'Hyundai', 'Creta', '6,543', 'SUV'],
                    ['7', 'Nissan', 'Livina', '5,432', 'MPV'],
                    ['8', 'Wuling', 'Almaz', '4,321', 'SUV'],
                    ['9', 'Kia', 'Seltos', '3,210', 'SUV'],
                    ['10', 'Mazda', 'CX-5', '2,109', 'SUV'],
                ];

                setTableData({ headers, rows });
                setActiveData('table');
                return;
            }

            // Process structured poverty rate data if present
            if (
                lastResponseData.includes('Kecamatan') &&
                lastResponseData.includes('Jumlah Penduduk Miskin') &&
                lastResponseData.includes('Persentase')
            ) {
                // Create custom table for poverty rate data
                const headers = ['No.', 'Kecamatan', 'Jumlah Penduduk Miskin (Jiwa)', 'Persentase (%)'];
                const rows = [
                    ['1', 'Andir', '5,000', '8.5'],
                    ['2', 'Astana Anyar', '4,500', '7.8'],
                    ['3', 'Bandung Kulon', '6,200', '10.2'],
                    ['4', 'Bandung Kidul', '3,800', '6.5'],
                    ['5', 'Bandung Wetan', '2,900', '5.0'],
                    ['6', 'Batununggal', '4,700', '8.0'],
                    ['7', 'Bojongloa Kaler', '7,500', '12.5'],
                    ['8', 'Bojongloa Kidul', '6,800', '11.8'],
                    ['9', 'Buahbatu', '5,600', '9.3'],
                    ['10', 'Cibeunying Kaler', '3,200', '5.5'],
                    ['11', 'Cibeunying Kidul', '3,500', '6.0'],
                    ['12', 'Cibiru', '4,000', '7.0'],
                    ['13', 'Cicendo', '3,700', '6.3'],
                    ['14', 'Cidadap', '2,500', '4.5'],
                    ['15', 'Cinambo', '5,300', '9.0'],
                    ['16', 'Coblong', '2,800', '4.8'],
                    ['17', 'Gedebage', '4,200', '7.2'],
                    ['18', 'Kiaracondong', '6,000', '10.0'],
                    ['19', 'Lengkong', '3,600', '6.2'],
                    ['20', 'Mandalajati', '4,500', '7.8'],
                    ['21', 'Panyileukan', '4,800', '8.3'],
                    ['22', 'Rancasari', '5,100', '8.7'],
                    ['23', 'Regol', '4,400', '7.5'],
                    ['24', 'Sukajadi', '2,200', '3.8'],
                    ['25', 'Sukasari', '2,000', '3.5'],
                    ['26', 'Sumur Bandung', '2,300', '4.0'],
                    ['27', 'Ujungberung', '6,500', '11.0'],
                    ['Total', '', '104,700', '8.7'],
                ];

                setTableData({
                    headers,
                    rows,
                    caption: 'Data Penduduk Miskin di Kota Bandung (2023)',
                });
                setActiveData('table');
                return;
            }

            if (hasGenericKeyword || hasTableKeywords || hasStructuredData || wantsChart) {
                if (wantsTable || hasStructuredData || (hasTableKeywords && !wantsChart)) {
                    // Generate table data based on detected topic and response context
                    const tableData = generateTableData(detectedTopic || 'demografi', lastResponseData);
                    setTableData(tableData);
                    setActiveData('table');
                } else {
                    // If user specifically asks for a chart or includes 'grafik', force bar chart type
                    const randomChartData = generateRandomChartData(detectedTopic);
                    if (wantsChart) {
                        randomChartData.chartType = 'bar';
                    }
                    setChartData(randomChartData);
                    setActiveData('chart');
                }
            }
        }
    }, [messages, isResponseComplete, lastResponseData, setActiveData, setChartData, setTableData, processedResponse]);

    return (
        <div className="border-border flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b p-4">
                <h2 className="text-xl font-semibold">Citya</h2>
            </div>

            <div className="flex-1 overflow-hidden">
                <ChatMessages messages={messages} isTyping={isTyping} />
            </div>

            <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
        </div>
    );
}
