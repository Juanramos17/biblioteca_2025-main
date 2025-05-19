import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/use-translations';
import { TimelineLayout } from '@/layouts/timeline/TimelineLayout';
import { PageProps } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BookOpen, CalendarIcon, CheckCircle, Clock, Hourglass, Info } from 'lucide-react';
import { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';


interface PageProps {
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
  name?: string;
  lang: string;
    auth: {
        user: any;
        permissions: string[];
    };
}

export default function TimelineIndex({ loans, name, lang }: PageProps) {
  const { t } = useTranslations();
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedStart, setSelectedStart] = useState<Date | undefined>();
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>();
  const page = usePage<{ props: PageProps }>();
  const auth = page.props.auth;

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
    return isValidDate(date)
      ? format(new Date(date), 'dd MMM yyyy', { locale: es })
      : t('ui.date.invalid');
  };

  const getLoanStatus = (item: any) => {
    const overdue = new Date(item.updated_at).getTime() > new Date(item.due_date).getTime();
    if (item.isLoaned && overdue) return { status: t('ui.loans.status.overdue'), color: '#f87171', icon: <Hourglass /> };
    if (item.isLoaned && !overdue) return { status: t('ui.loans.status.ontime'), color: '#34d399', icon: <CheckCircle /> };
    if (!item.isLoaned && overdue) return { status: t('ui.loans.status.finished_late'), color: '#facc15', icon: <Clock /> };
    return { status: t('ui.loans.status.finished_ontime'), color: '#60a5fa', icon: <CheckCircle /> };
  };

  const filterByDate = (items: TimelineProps['loans']) => {
    return items.filter((item) => {
      const createdAt = new Date(item.created_at).getTime();
      const from = selectedStart ? selectedStart.getTime() : null;
      const to = selectedEnd ? selectedEnd.getTime() : null;

      if (from && to) return createdAt >= from && createdAt <= to;
      if (from) return createdAt >= from;
      if (to) return createdAt <= to;
      return true;
    });
  };

  const renderTimeline = (filteredLoans: any[]) => {
    if (filteredLoans.length === 0) {
      return (
        <div className="flex flex-col items-center py-10 text-gray-500">
          <Info className="mb-2 h-12 w-12" />
          <p>{t('ui.tabs.empty')}</p>
        </div>
      );
    }

    return (
      <div>
        {name && <h3 className="text-primary mb-6 text-center text-xl font-semibold">{name}</h3>}

        <VerticalTimeline>
          {filteredLoans.map((item) => {
            const { icon, color } = getIconAndColor(item);
            const { status, icon: statusIcon } = getLoanStatus(item);

            return (
              <VerticalTimelineElement
                key={item.id}
                date={<span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>}
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
                  {item.type === 'loan' ? t('ui.loans.loan') : t('ui.reservations.reservation')}
                </p>

                {item.image && (
                  <img
                    src={item.image}
                    alt={item.book.title}
                    className="my-3 w-full max-w-xs rounded-lg shadow-md"
                  />
                )}

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>{t('ui.books.fields.author')}:</strong> {item.book.author}
                  </p>
                  <p>
                    <strong>{t('ui.books.fields.publisher')}:</strong> {item.book.publisher}
                  </p>
                  <p>
                    <strong>{t('ui.books.fields.ISBN')}:</strong> {item.book.ISBN}
                  </p>
                  <p>
                    <strong>{t('ui.books.fields.genres')}:</strong>{' '}
                    {item.book.genre
                      .split(', ')
                      .map((genre) => t(`ui.genres.${genre.toLowerCase()}`))
                      .join(', ')}
                  </p>
                  {item.type === 'reservation' ? (
                    <p>
                      <strong>{t('ui.loans.timeline.reserved_on')}:</strong>{' '}
                      {formatDate(item.created_at)}
                    </p>
                  ) : (
                    <p>
                      <strong>{status}:</strong> {formatDate(item.updated_at)}
                    </p>
                  )}
                </div>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      </div>
    );
  };

  const allLoans = filterByDate(loans);
  const loanItems = filterByDate(loans.filter((item) => item.type === 'loan'));
  const reservationItems = filterByDate(loans.filter((item) => item.type === 'reservation'));

  return (
    <TimelineLayout title={t('ui.navigation.items.timelines')}>
      {auth.permissions.includes('settings.access') ? (
      <div className="flex w-full flex-col items-center px-4 py-6">
        <h2 className="text-primary mb-8 text-2xl font-bold">{t('ui.loans.timeline.title')}</h2>

        <div className="mb-6 flex w-full flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{t('ui.loans.filters.from')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedStart ? format(selectedStart, 'PPP', { locale: es }) : t('ui.loans.utils.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedStart}
                  onSelect={setSelectedStart}
                  locale={lang === 'es' ? es : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">{t('ui.loans.filters.to')}</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedEnd ? format(selectedEnd, 'PPP', { locale: es }) : t('ui.loans.utils.pickDate')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedEnd}
                  onSelect={setSelectedEnd}
                  locale={lang}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col justify-end">
            <label className="invisible text-sm font-medium text-gray-700">Clear</label>
            <Button variant="ghost" onClick={() => { setSelectedStart(undefined); setSelectedEnd(undefined); }}>
              {t('ui.common.filters.clear')}
            </Button>
          </div>
        </div>

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

          <TabsContent value="all">{renderTimeline(allLoans)}</TabsContent>
          <TabsContent value="loans">{renderTimeline(loanItems)}</TabsContent>
          <TabsContent value="reservations">{renderTimeline(reservationItems)}</TabsContent>
        </Tabs>
      </div>
      ) : (
        ""
      )}
    </TimelineLayout>
  );
}
