import { CardHeader } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { BookshelfLayout } from '@/layouts/bookshelves/Bookshelf';
import { PageProps } from '@/types';
import { Building2 } from 'lucide-react';
import BookshelfForm from './components/BookshelfForm';

interface BookshelfProps extends PageProps {
    initialData?: {
        id: string;
        enumeration: number;
        category: string;
        n_books: number;
        zone_id: string;
    };
    floor_id?: string;
    floors: {
        id: string;
        name: string;
        n_zones: number;
        zones_count: number;
        zones: { category: string; floor_id: string; id: string; name: number }[];
    }[];
    zones: {
        id: string;
        name: string;
        n_bookshelves: number;
        floor: { id: string; name: number };
        bookshelves_count: number;
        category: string;
        bookshelves: { category: string; zone_id: string; id: string }[];
    }[];
    page?: string;
    perPage?: string;
}

export default function EditBookshelf({ zones, floors, floor_id, initialData, page, perPage }: BookshelfProps) {
    const { t } = useTranslations();

    return (
        <BookshelfLayout title={t('ui.bookshelves.edit')}>
            <div className="flex w-full flex-col items-center">
                <div className="bg-muted/50 flex w-full flex-col rounded-lg sm:max-w-[640px] lg:max-w-[800px]">
                    <CardHeader className="bg-muted flex w-full justify-start rounded-t-lg p-4">
                        <div className="flex space-x-2">
                            <Building2 size={20} className="text-blue-500" />
                            <h2 className="text-xl font-bold">{t('ui.bookshelves.edit')}</h2>
                        </div>
                        <p className="mb-3 text-sm text-gray-500">{t('ui.floors.info')}</p>
                    </CardHeader>

                    <BookshelfForm zones={zones} floors={floors} floor_id={floor_id} initialData={initialData} page={page} perPage={perPage} />
                </div>
            </div>
        </BookshelfLayout>
    );
}
