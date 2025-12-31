'use client';

import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface ReportRow {
    name: string;
    mealsConsumed: number;
    totalMealCost: number;
    totalDeposited: number;
    currentBalance: number;
}

interface ExportReportsButtonProps {
    data: ReportRow[];
    mealRate: number;
}

export default function ExportReportsButton({ data, mealRate }: ExportReportsButtonProps) {
    const handleExport = () => {
        // defined headers
        const headers = ['Member Name', 'Meals Consumed', 'Calculated Cost', 'Total Deposited', 'Adjusted Balance'];

        // map data to rows
        const rows = data.map(row => {
            const adjustedBalance = row.totalDeposited - row.totalMealCost;
            return [
                `"${row.name}"`, // quote strings to handle commas
                row.mealsConsumed.toFixed(1),
                row.totalMealCost.toFixed(2),
                row.totalDeposited.toFixed(2),
                adjustedBalance.toFixed(2)
            ].join(',');
        });

        // Add summary rows at the bottom
        const totalConsumption = data.reduce((sum, r) => sum + r.mealsConsumed, 0);
        const totalCost = data.reduce((sum, r) => sum + r.totalMealCost, 0);
        const totalDeposits = data.reduce((sum, r) => sum + r.totalDeposited, 0);

        const summaryRow = [
            'TOTALS',
            totalConsumption.toFixed(1),
            totalCost.toFixed(2),
            totalDeposits.toFixed(2),
            (totalDeposits - totalCost).toFixed(2)
        ].join(',');

        const metadataRow = [`"Current Meal Rate: ${mealRate.toFixed(2)}"`];

        // combine
        const csvContent = [
            metadataRow,
            headers.join(','),
            ...rows,
            '', // empty line
            summaryRow
        ].join('\n');

        // create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `mess_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
        </Button>
    );
}
