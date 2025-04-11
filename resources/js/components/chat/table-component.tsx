import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableData } from '@/contexts/app-context';

interface TableComponentProps {
    data: TableData;
}

export default function TableComponent({ data }: TableComponentProps) {
    // Check if this is a data table with a total/summary row at the end
    const hasSummaryRow = (data.rows.length > 0 && data.rows[data.rows.length - 1][0] === 'Total') || data.rows[data.rows.length - 1][0] === '';

    // Separate regular rows from summary row if it exists
    const regularRows = hasSummaryRow ? data.rows.slice(0, -1) : data.rows;
    const summaryRow = hasSummaryRow ? data.rows[data.rows.length - 1] : null;

    // Extract potential table caption/title
    const caption = data.caption || '';

    return (
        <div className="animate-fade-in w-full overflow-auto rounded-lg">
            <Table>
                {caption && <TableCaption>{caption}</TableCaption>}

                <TableHeader>
                    <TableRow>
                        {data.headers.map((header, index) => (
                            <TableHead key={index} className="font-medium">
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {regularRows.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-muted/50 transition-colors">
                            {row.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className={`py-3 ${cellIndex > 0 && typeof cell === 'string' && !isNaN(parseFloat(cell.replace(/,/g, ''))) ? 'text-right' : ''}`}
                                >
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

                {summaryRow && (
                    <TableFooter>
                        <TableRow>
                            {summaryRow.map((cell, cellIndex) => (
                                <TableCell
                                    key={cellIndex}
                                    className={`py-3 font-medium ${cellIndex > 0 && typeof cell === 'string' && !isNaN(parseFloat(cell.replace(/,/g, ''))) ? 'text-right' : ''}`}
                                >
                                    {cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </div>
    );
}
