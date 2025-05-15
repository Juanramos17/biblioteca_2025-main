import { CardHeader } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { BookLayout } from '@/layouts/books/BookLayout';
import { PageProps } from '@/types';
import { Building2 } from 'lucide-react';
import BookForm from './components/BookForm';

interface BookProps extends PageProps {
    initialData?: {
        id: string;
        title: string;
        genre: string;
        publisher: string;
        author: string;
        ISBN: string;
        bookshelf_id: string;
    };
    floor_id?: string;
    genres: { id: string; name: string }[];
    zone_id?: string;
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
        bookshelves: { category: string; zone_id: string; id: string; enumeration: number }[];
    }[];
    page?: string;
    perPage?: string;
    image_path: string;
    image: File;
}

export default function EditBook({ zones, floors, floor_id, zone_id, genres, initialData, page, perPage, image_path, image }: BookProps) {
    const { t } = useTranslations();

    return (
        <BookLayout title={t('ui.books.edit')}>
            <div className="flex w-full flex-col items-center px-4 sm:px-6 md:px-8">
                <div className="bg-muted/50 w-full max-w-[900px] rounded-lg shadow-md">
                    <CardHeader className="bg-muted flex w-full justify-start rounded-t-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Building2 size={20} className="text-blue-500" />
                            <h2 className="text-xl font-bold">{t('ui.books.edit')}</h2>
                        </div>
                        <p className="mb-3 text-sm text-gray-500">{t('ui.books.info')}</p>
                    </CardHeader>

                    <div className="p-4">
                        <BookForm genres={genres} zones={zones} floors={floors} floor_id={floor_id} zone_id={zone_id} initialData={initialData} page={page} perPage={perPage} image_path={image_path} image={image}/>
                    </div>
                </div>
            </div>
        </BookLayout>
    );
}
