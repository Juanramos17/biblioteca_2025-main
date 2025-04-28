import { createActionsColumn, createDateColumn, createTextColumn } from '@/components/stack-table/columnsTable';
import { DeleteDialog } from '@/components/stack-table/DeleteDialog';
import { FilterConfig, FiltersTable } from '@/components/stack-table/FiltersTable';
import { Table } from '@/components/stack-table/Table';
import { TableSkeleton } from '@/components/stack-table/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Book, useBooks, useDeleteBook } from '@/hooks/books/useBooks';
import { useTranslations } from '@/hooks/use-translations';
import { BookLayout } from '@/layouts/books/BookLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ClipboardCheck, Handshake, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function BooksIndex() {
    const { t } = useTranslations();
    const { url } = usePage();

    // Obtener los parámetros de la URL actual
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const pageParam = urlParams.get('page');
    const perPageParam = urlParams.get('per_page');

    // Inicializar el estado con los valores de la URL o los valores predeterminados
    const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
    const [perPage, setPerPage] = useState(perPageParam ? parseInt(perPageParam) : 10);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const combinedSearch = [
        filters.title ? `${filters.title}` : 'null',
        filters.bookshelf_name ? `${filters.bookshelf_name}` : 'null',
        filters.author ? `${filters.author}` : 'null',
        filters.publisher ? `${filters.publisher}` : 'null',
        filters.ISBN ? `${filters.ISBN}` : 'null',
        filters.category ? `${filters.category}` : 'null',
        filters.floor ? `${filters.floor}` : 'null',
        filters.zone ? `${filters.zone}` : 'null',
        filters.status ? `${filters.status}` : 'null',
    ];

    console.log('Combined Search:', combinedSearch);

    const {
        data: books,
        isLoading,
        isError,
        refetch,
    } = useBooks({
        search: combinedSearch,
        page: currentPage,
        perPage: perPage,
    });

    function handleCreate(book_id: string, book_ISBN: number, book_author: string, book_title: string) {
        return router.get('loans/create', { book_id, book_ISBN, book_author, book_title });
    }
    function handleCreateReservation(book_id: string, book_ISBN: number, book_author: string, book_title: string) {
        return router.get('reservations/create', { book_id, book_ISBN, book_author, book_title });
    }

    const deleteUserMutation = useDeleteBook();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        const filtersChanged = newFilters!==filters;

        if (filtersChanged) {
            setCurrentPage(1);
        }
        setFilters(newFilters);
        };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUserMutation.mutateAsync(id);
            refetch();
        } catch (error) {
            toast.error(t('ui.books.deleted_error') || 'Error deleting book');
            console.error('Error deleting book:', error);
        }
    };

    const columns = useMemo(
        () =>
            [
                createTextColumn<Book>({
                    id: 'title',
                    header: t('ui.books.columns.title') || "Book' title",
                    accessorKey: 'title',
                }),
                createTextColumn<Book>({
                    id: 'author',
                    header: t('ui.books.columns.author') || 'Author',
                    accessorKey: 'author',
                }),
                createTextColumn<Book>({
                    id: 'publisher',
                    header: t('ui.books.columns.publisher') || "Publisher's number",
                    accessorKey: 'publisher',
                }),
                createActionsColumn<Book>({
                    id: 'ISBN',
                    header: t('ui.books.columns.ISBN') || 'ISBN',
                    renderActions: (book) => {
                        return `${book.ISBN} (${book.loaned_count}/${book.total})`;
                    },
                }),
                createTextColumn<Book>({
                    id: 'is_available',
                    header: t('ui.books.columns.status') || 'ISBN',
                    accessorKey: 'is_available',
                    format: (value) => {
                        return value ? t('ui.books.columns.available') : t('ui.books.columns.not_available');
                    },
                }),
                createTextColumn<Book>({
                    id: 'genre',
                    header: t('ui.books.columns.category') || 'Category',
                    accessorKey: 'genre',
                    format: (value) => {
                        return value
                            .split(', ')
                            .map((genre) => t(`ui.genres.${genre.toLowerCase()}`))
                            .join(', ');
                    },
                }),
                createTextColumn<Book>({
                    id: 'bookshelf_name',
                    header: t('ui.books.columns.bookshelf') || "Bookshelf' number",
                    accessorKey: 'bookshelf_name',
                    format: (value) => `${t('ui.bookshelves.bookshelf')}: ${value}`,
                }),
                createTextColumn<Book>({
                    id: 'zone_name',
                    header: t('ui.bookshelves.columns.zone') || "Zone' number",
                    accessorKey: 'zone_name',
                    format: (value) => `${t('ui.zones.zone')}: ${value}`,
                }),
                createTextColumn<Book>({
                    id: 'floor_name',
                    header: t('ui.books.columns.floor') || "Floor' number",
                    accessorKey: 'floor_name',
                    format: (value) => `${t('ui.floors.floor')}: ${value}`,
                }),
                createDateColumn<Book>({
                    id: 'created_at',
                    header: t('ui.floors.columns.created_at') || 'Created At',
                    accessorKey: 'created_at',
                }),
                createActionsColumn<Book>({
                    id: 'actions',
                    header: t('ui.floors.columns.actions') || 'Actions',
                    renderActions: (book) => (
                        <>
                            {!book.is_available ? (
                                <Button
                                    variant="outline"
                                    onClick={() => handleCreateReservation(book.id, book.ISBN, book.author, book.title)}
                                    size="icon"
                                    title={t('ui.books.buttons.reservation') || 'Reserve book'}
                                >
                                    <ClipboardCheck className="h-4 w-4 text-blue-400" />
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => handleCreate(book.id, book.ISBN, book.author, book.title)}
                                    size="icon"
                                    title={t('ui.books.buttons.loan') || 'Loan book'}
                                    disabled={!book.is_available}
                                >
                                    <Handshake className="h-4 w-4 text-orange-400" />
                                </Button>
                            )}

                            <Link href={`/books/${book.id}/edit?page=${currentPage}&perPage=${perPage}`}>
                                <Button variant="outline" size="icon" title={t('ui.users.buttons.edit') || 'Edit user'}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            </Link>

                            <DeleteDialog
                                id={book.id}
                                onDelete={handleDeleteUser}
                                title={t('ui.books.delete') || 'Delete bookshelf'}
                                description={t('ui.books.description') || 'Are you sure you want to delete this book? This action cannot be undone.'}
                                trigger={
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        title={t('ui.books.buttons.delete') || 'Delete user'}
                                        disabled={!book.is_available}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                }
                            />
                        </>
                    ),
                }),
            ] as ColumnDef<Book>[],
        [t, handleDeleteUser],
    );

    return (
        <BookLayout title={t('ui.books.title')}>
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{t('ui.books.title')}</h1>
                        <Link href="/books/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('ui.books.buttons.new')}
                            </Button>
                        </Link>
                    </div>
                    <div></div>

                    <div className="space-y-6">
                        <FiltersTable
                            filters={
                                [
                                    {
                                        id: 'title',
                                        label: t('ui.books.filters.title') || 'Titulo',
                                        type: 'text',
                                        placeholder: t('ui.books.placeholders.title') || 'Titulo...',
                                    },
                                    {
                                        id: 'author',
                                        label: t('ui.books.filters.author') || 'Autor',
                                        type: 'text',
                                        placeholder: t('ui.books.placeholders.author') || 'Autor...',
                                    },
                                    {
                                        id: 'publisher',
                                        label: t('ui.books.filters.publisher') || 'Editorial',
                                        type: 'text',
                                        placeholder: t('ui.books.placeholders.publisher') || 'Editorial...',
                                    },
                                    {
                                        id: 'ISBN',
                                        label: t('ui.books.filters.ISBN') || 'ISBN',
                                        type: 'number',
                                        placeholder: t('ui.books.placeholders.ISBN') || 'ISBN...',
                                    },
                                    {
                                        id: 'status',
                                        label: t('ui.books.filters.status') || 'Status',
                                        type: 'select',
                                        options: [
                                            { value: 'false', label: t('ui.books.filters.available') || 'Available' },
                                            { value: 'true', label: t('ui.books.filters.not_available') || 'Unavailable' },
                                        ],
                                        placeholder: t('ui.books.placeholders.status') || 'Status...',
                                    },
                                    {
                                        id: 'category',
                                        label: t('ui.books.filters.genres') || 'Categoria',
                                        type: 'text',
                                        placeholder: t('ui.books.placeholders.genres') || 'Categoria...',
                                    },
                                    {
                                        id: 'floor',
                                        label: t('ui.books.filters.floor') || 'Piso',
                                        type: 'number',
                                        placeholder: t('ui.books.placeholders.floor') || 'Piso...',
                                    },
                                    {
                                        id: 'zone',
                                        label: t('ui.books.filters.zone') || 'Zona',
                                        type: 'number',
                                        placeholder: t('ui.books.placeholders.zone') || 'Zona...',
                                    },
                                    {
                                        id: 'bookshelf_name',
                                        label: t('ui.books.filters.bookshelf') || 'Estanteria',
                                        type: 'number',
                                        placeholder: t('ui.books.placeholders.bookshelf') || 'Estanteria...',
                                    },
                                ] as FilterConfig[]
                            }
                            onFilterChange={handleFilterChange}
                            initialValues={filters}
                        />
                    </div>

                    <div>
                        { (books?.meta.total !== undefined && books?.meta.total > 0) && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {books.meta.total} {t('ui.info.total') || 'Total'}
                            </div>
                        )}
                    </div>

                    <div className="w-full overflow-hidden">
                        {isLoading ? (
                            <TableSkeleton columns={4} rows={10} />
                        ) : isError ? (
                            <div className="p-4 text-center">
                                <div className="mb-4 text-red-500">{t('ui.books.error_loading')}</div>
                                <Button onClick={() => refetch()} variant="outline">
                                    {t('ui.books.buttons.retry')}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Table
                                    data={
                                        books ?? {
                                            data: [],
                                            meta: {
                                                current_page: 1,
                                                from: 0,
                                                last_page: 1,
                                                per_page: perPage,
                                                to: 0,
                                                total: 0,
                                            },
                                        }
                                    }
                                    columns={columns}
                                    onPageChange={handlePageChange}
                                    onPerPageChange={handlePerPageChange}
                                    perPageOptions={[10, 25, 50, 100]}
                                    noResultsMessage={t('ui.users.no_results') || 'No users found'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BookLayout>
    );
}
