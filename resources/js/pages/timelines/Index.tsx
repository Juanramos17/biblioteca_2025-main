import { useTranslations } from '@/hooks/use-translations';
import { PageProps } from '@/types';
import { CheckCircle, Clock, BookOpen, Hourglass } from 'lucide-react';
import { format } from 'date-fns';
import { TimelineLayout } from '@/layouts/timeline/TimelineLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import './TimelineDemo.css';
import { Timeline } from 'primereact/timeline';


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
        type: string; // Agrega tipo (loan o reservation)
    }[]; 
}

export default function TimelineIndex({ loans }: TimelineProps) {
    const { t } = useTranslations();

    const loanEvents = loans.filter((loan) => loan.type === 'loan');
    const reservationEvents = loans.filter((loan) => loan.type === 'reservation');

    const getStatus = (loan: any) => {
        const overdueStatus = loan.status;
        const isLoaned = loan.isLoaned;
        let statusMessage = '';
        let markerColor = '';
        let icon = null;

        if (loan.type === 'loan') {
            if (isLoaned) {
                if (overdueStatus) {
                    statusMessage = t('ui.loans.days_late', { days: loan.updated_at });
                    markerColor = 'bg-red-500';
                    icon = <Hourglass className="text-white" />;
                } else {
                    statusMessage = t('ui.loans.on_time');
                    markerColor = 'bg-green-500';
                    icon = <CheckCircle className="text-white" />;
                }
            } else {
                if (overdueStatus) {
                    statusMessage = t('ui.loans.finished_late');
                    markerColor = 'bg-yellow-500';
                    icon = <Clock className="text-white" />;
                } else {
                    statusMessage = t('ui.loans.finished_on_time');
                    markerColor = 'bg-blue-500';
                    icon = <CheckCircle className="text-white" />;
                }
            }
        } else if (loan.type === 'reservation') {
            statusMessage = t('ui.reservations.pending');
            markerColor = 'bg-purple-500';
            icon = <Clock className="text-white" />;
        }

        return { statusMessage, markerColor, icon };
    };

    const customizedContent = (item: any) => {
        const { statusMessage, markerColor, icon } = getStatus(item);

        return (
            <div className="relative w-full max-w-xs sm:max-w-sm bg-white border border-gray-200 shadow-lg rounded-lg p-4 mx-auto transition hover:scale-[1.015] duration-200">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-100 p-1 rounded-full shadow-sm">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-base text-indigo-800 text-center">{item.book.title}</h4>
                <p className="text-gray-700 text-xs mt-1 text-center">{statusMessage}</p>
                
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.book.title}
                        className="w-full h-auto max-w-[200px] mx-auto my-2 rounded-lg object-cover shadow-md"
                    />
                )}

            <div className="mt-2 text-xs text-gray-500 space-y-1 text-center">
                {item.type === 'reservation' ? (
                    <p>{t('ui.reservations.timeline.reserved_on', { date: item.loan_date })}</p>
                ) : (
                    <>
                        <p>{t('ui.loans.timeline.loaned_on', { date: format(new Date(item.created_at), 'dd MMMM yyyy') })}</p>
                        <p>
                            {item.isLoaned 
                                ? t('ui.loans.timeline.return_date', { date: format(new Date(item.updated_at), 'dd MMMM yyyy') }) 
                                : t('ui.loans.timeline.due_date', { date: format(new Date(item.due_date), 'dd MMMM yyyy') })
                            }
                        </p>
                    </>
                )}
            </div>
            </div>
        );
    };

    const customizedMarker = (item: any) => {
        const { markerColor, icon } = getStatus(item);

        return (
            <div className={`w-8 h-8 rounded-full ${markerColor} flex items-center justify-center shadow-md z-10`}>
                {icon}
            </div>
        );
    };

    return (
        <TimelineLayout title={t('ui.items.timelines')}>
            <div className="flex w-full flex-col items-center px-4 py-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                    {t('ui.loans.timeline.information_title')}
                </h2>

                <Tabs defaultValue="all" className="w-full max-w-5xl bg-muted/50 rounded-xl shadow-md p-4">
                    <TabsList className="p-tabs">
                        <TabsTrigger className="p-tabs-trigger" value="all">Todos</TabsTrigger>
                        <TabsTrigger className="p-tabs-trigger" value="loans">Préstamos</TabsTrigger>
                        <TabsTrigger className="p-tabs-trigger" value="reservations">Reservas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <Timeline
                            value={[...loanEvents, ...reservationEvents]}
                            align="alternate"
                            className="customized-timeline"
                            marker={customizedMarker}
                            content={customizedContent}
                        />
                    </TabsContent>

                    <TabsContent value="loans">
                        <Timeline
                            value={loanEvents}
                            align="alternate"
                            className="customized-timeline"
                            marker={customizedMarker}
                            content={customizedContent}
                        />
                    </TabsContent>

                    <TabsContent value="reservations">
                        <Timeline
                            value={reservationEvents}
                            align="alternate"
                            className="customized-timeline"
                            marker={customizedMarker}
                            content={customizedContent}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </TimelineLayout>
    );
}
