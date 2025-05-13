import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { GraphLayout } from '@/layouts/graphs/GraphLayout';
import { PageProps } from '@/types';
import React from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface GraphProps extends PageProps {
    topBooks: {
        title: string;
        value: number;
        isbn: string;
        author: string;
        genres: string;
        publisher: string;
    }[];
    topUsers: {
        name: string;
        value: number;
        loans: number;
        reservations: number;
    }[];
    topZones: {
        zone: string;
        value: number;
        loans: number;
        reservations: number;
        floor: string;
    }[];
}

export default function GraphIndex({ topBooks, topUsers, topZones }: GraphProps) {
    const { t } = useTranslations();

    const bookData = topBooks.map((book, index) => ({
        name: `Top ${index + 1}`,
        title: book.title,
        loans: book.value,
        total: book.value,
        reservations: 0,
        isbn: book.isbn,
        author: book.author,
        genres: book.genres,
        publisher: book.publisher,
    }));

    const userData = topUsers.map((user, index) => ({
        name: `Top ${index + 1}`,
        title: user.name,
        total: user.value,
        loans: user.loans,
        reservations: user.reservations,
    }));

    const zoneData = topZones.map((zone, index) => ({
        name: `Top ${index + 1}`,
        zone: zone.zone,
        total: zone.value,
        loans: zone.loans,
        reservations: zone.reservations,
        floor: zone.floor,
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const isBook = !!data.isbn;

            return (
                <div className="w-[300px] rounded-md border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-lg">
                    <p className="text-base font-semibold">{label}</p>
                    {data.title && <p>{data.title}</p>}
                    {data.zone && (
                        <p>
                            {t('ui.zones.zone')} {data.zone}
                        </p>
                    )}
                    {data.floor && (
                        <p>
                            {t('ui.floors.floor')} {data.floor}
                        </p>
                    )}
                    {data.isbn && <p>ISBN: {data.isbn}</p>}
                    {data.author && <p>Autor: {data.author}</p>}
                    {data.publisher && <p>Editorial: {data.publisher}</p>}
                    {data.genres && <p>Géneros: {data.genres}</p>}
                    {!isBook && data.loans !== undefined && <p>Préstamos: {data.loans}</p>}
                    {!isBook && data.reservations !== undefined && <p>Reservas: {data.reservations}</p>}
                    <p className="mt-1 font-semibold">Total: {data.total ?? data.loans}</p>
                </div>
            );
        }
        return null;
    };

    const handleDomain = (number: number) => {
        return number % 2 === 0 ? number + 2 : number + 1;
    };

    const renderChart = (data: any[], title: string, color1: string, color2: string) => (
        <div className="w-full rounded-2xl p-4 shadow-md sm:p-6">
            <h3 className="text-primary mb-4 text-xl font-bold sm:mb-6 sm:text-2xl">{title}</h3>
            <div className="overflow-x-auto">
                <div className="h-[400px] min-w-[700px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 60 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#999999' }} interval={0} />
                            <YAxis tick={{ fill: '#999999' }} domain={[0, handleDomain(data[0].total)]} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" />
                            <Bar
                                dataKey="loans"
                                stackId="a"
                                fill={color1}
                                barSize={70}
                                name="Préstamos"
                                animationDuration={1000}
                                animationEasing="linear"
                            />
                            <Bar
                                dataKey="reservations"
                                stackId="a"
                                fill={color2}
                                barSize={30}
                                name="Reservas"
                                animationBegin={1000}
                                animationDuration={1000}
                                animationEasing="linear"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );

    const [selectedGraph, setSelectedGraph] = React.useState('books');

    const handleSelectChange = (value: string) => {
        setSelectedGraph(value);
    };

    return (
        <GraphLayout title={t('ui.graph.title')}>
            <div className="flex w-full flex-col items-start justify-center px-4 sm:items-center sm:px-6">
                <h2 className="text-primary mb-6 text-2xl font-bold sm:text-3xl">{t('ui.graph.stadistics_title')}</h2>
                <Select value={selectedGraph} onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-muted mb-4 w-full max-w-[220px] sm:max-w-[400px]">
                        <SelectValue placeholder={t('ui.graph.select_graph')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="books">{t('ui.graph.top_books')}</SelectItem>
                            <SelectItem value="users">{t('ui.graph.top_users')}</SelectItem>
                            <SelectItem value="zones">{t('ui.graph.top_zones')}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="mx-auto w-full max-w-screen-lg px-4">
                
                {selectedGraph === 'books' && renderChart(bookData, t('ui.graph.top_books'), '#4CAF50', '#9C27B0')}
                {selectedGraph === 'users' && renderChart(userData, t('ui.graph.top_users'), '#4CAF50', '#9C27B0')}
                {selectedGraph === 'zones' && renderChart(zoneData, t('ui.graph.top_zones'), '#4CAF50', '#9C27B0')}
            </div>
        </GraphLayout>
    );
}
