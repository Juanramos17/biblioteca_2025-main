import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/use-translations';
import { TimelineLayout } from '@/layouts/timeline/TimelineLayout';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { BookOpen, CheckCircle, Clock, Hourglass, Info } from 'lucide-react';
import { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

interface TimelineProps extends PageProps {
    loans: {
        id: string;
        book_id: string;
        user_id: string;
        isLoaned: boolean;
        loan_date: string;
        due_date: string;
        created_at: string;
        updated_at: string;
        book: {
            id: string;
            ISBN: string;
            title: string;
            publisher: string;
            author: string;
            genre: string;
        };
        status: boolean;
        image: string;
        type: string;
    }[];
}

export default function TimelineIndex({ loans }: TimelineProps) {
    const { t } = useTranslations();
    const [selectedTab, setSelectedTab] = useState('all');

    const getIconAndColor = (item: any) => {
        if (item.type === 'loan') {
            if (item.isLoaned && item.status) return { icon: <Hourglass />, color: '#f87171' };
            if (item.isLoaned && !item.status) return { icon: <CheckCircle />, color: '#34d399' };
            if (!item.isLoaned && item.status) return { icon: <Clock />, color: '#facc15' };
            return { icon: <CheckCircle />, color: '#60a5fa' };
        }
        return { icon: <BookOpen />, color: '#a78bfa' };
    };

    const isValidDate = (date: string) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    };

    const formatDate = (date: string) => {
        return isValidDate(date) ? format(new Date(date), 'dd MMM yyyy') : t('ui.date.invalid');
    };

    const getLoanStatus = (item: any) => {
        const overdue = new Date(item.updated_at).getTime() > new Date(item.due_date).getTime();
        if (item.isLoaned && overdue) return { status: t('ui.loans.status.overdue'), color: '#f87171', icon: <Hourglass /> };
        if (item.isLoaned && !overdue) return { status: t('ui.loans.status.ontime'), color: '#34d399', icon: <CheckCircle /> };
        if (!item.isLoaned && overdue) return { status: t('ui.loans.status.finished_late'), color: '#facc15', icon: <Clock /> };
        return { status: t('ui.loans.status.finished_ontime'), color: '#60a5fa', icon: <CheckCircle /> };
    };

    const renderTimeline = (filteredLoans: any[], tab: string) => {
        if (filteredLoans.length === 0) {
            return (
                <div className="flex flex-col items-center py-10 text-gray-500">
                    <Info className="mb-2 h-12 w-12" />
                    <p>{t('ui.tabs.empty')}</p>
                </div>
            );
        }

        return (
            <VerticalTimeline>
                {filteredLoans.map((item) => {
                    const { icon, color } = getIconAndColor(item);
                    const { status, icon: statusIcon } = getLoanStatus(item);

                    return (
                        <VerticalTimelineElement
                            key={item.id}
                            date={formatDate(item.created_at)}
                            iconStyle={{ background: color, color: '#fff' }}
                            icon={icon}
                            contentStyle={{
                                background: '#ffffff',
                                color: '#1f2937',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                            }}
                            contentArrowStyle={{ borderRight: `7px solid ${color}` }}
                        >
                            <h3 className="mb-1 text-xl font-semibold text-gray-800">{item.book.title}</h3>
                            <p className="mb-4 text-sm text-gray-500">
                                {item.type === 'loan' ? t('ui.loans.timeline.loan_label') : t('ui.loans.timeline.reservation_label')}
                            </p>

                            {item.image && <img src={item.image} alt={item.book.title} className="my-3 w-full max-w-xs rounded-lg shadow-md" />}

                            <div className="space-y-1 text-sm text-gray-700">
                                <p>
                                    <strong>{t('ui.book.author')}:</strong> {item.book.author}
                                </p>
                                <p>
                                    <strong>{t('ui.book.publisher')}:</strong> {item.book.publisher}
                                </p>
                                <p>
                                    <strong>{t('ui.book.isbn')}:</strong> {item.book.ISBN}
                                </p>
                                <p>
                                    <strong>{t('ui.book.genre')}:</strong> {item.book.genre}
                                </p>
                                {item.type === 'reservation' ? (
                                    <p>
                                        <strong>{t('ui.loans.timeline.reserved_on')}:</strong> {formatDate(item.created_at)}
                                    </p>
                                ) : (
                                    <p>
                                        <strong>{status}:</strong> {statusIcon} {formatDate(item.updated_at)}
                                    </p>
                                )}
                            </div>
                        </VerticalTimelineElement>
                    );
                })}
            </VerticalTimeline>
        );
    };

    const allLoans = loans;
    const loanItems = loans.filter((item) => item.type === 'loan');
    const reservationItems = loans.filter((item) => item.type === 'reservation');

    return (
        <TimelineLayout title={t('ui.items.timelines')}>
            <div className="flex w-full flex-col items-center px-4 py-6">
                <h2 className="mb-8 text-2xl font-bold text-gray-800">{t('ui.loans.timeline.information_title')}</h2>

                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="bg-muted/50 w-full rounded-xl p-4 shadow-md">
                    <TabsList className="mb-4 grid w-full grid-cols-3 gap-2">
                        <TabsTrigger className="w-full" value="all">
                            {t('ui.tabs.all')}
                        </TabsTrigger>
                        <TabsTrigger className="w-full" value="loans">
                            {t('ui.tabs.loans')}
                        </TabsTrigger>
                        <TabsTrigger className="w-full" value="reservations">
                            {t('ui.tabs.reservations')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">{renderTimeline(allLoans, 'all')}</TabsContent>
                    <TabsContent value="loans">{renderTimeline(loanItems, 'loans')}</TabsContent>
                    <TabsContent value="reservations">{renderTimeline(reservationItems, 'reservations')}</TabsContent>
                </Tabs>
            </div>
        </TimelineLayout>
    );
}
