import { createActionsColumn, createDateColumn, createTextColumn } from '@/components/stack-table/columnsTable';
import { DeleteDialog } from '@/components/stack-table/DeleteDialog';
import { FilterConfig, FiltersTable } from '@/components/stack-table/FiltersTable';
import { Table } from '@/components/stack-table/Table';
import { TableSkeleton } from '@/components/stack-table/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Bookshelf, useBookshelves, useDeleteBookshelf } from '@/hooks/bookshelves/useBookshelves';
import { useTranslations } from '@/hooks/use-translations';
import { BookshelfLayout } from '@/layouts/bookshelves/Bookshelf';
import { Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    auth: {
        user: any;
        permissions: string[];
    };
}

export default function BookshelvesIndex() {
    const { t } = useTranslations();
    const { url } = usePage();
    const page = usePage<{ props: PageProps }>();
    const auth = page.props.auth;

    // Obtener los parámetros de la URL actual
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const pageParam = urlParams.get('page');
    const perPageParam = urlParams.get('per_page');

    // Inicializar el estado con los valores de la URL o los valores predeterminados
    const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
    const [perPage, setPerPage] = useState(perPageParam ? parseInt(perPageParam) : 10);
    const [filters, setFilters] = useState<Record<string, any>>({});

    const combinedSearch = [
        filters.enumeration ? `${filters.enumeration}` : 'null',
        filters.zone ? `${filters.zone}` : 'null',
        filters.category ? `${filters.category}` : 'null',
        filters.books ? `${filters.books}` : 'null',
        filters.floor ? `${filters.floor}` : 'null',
    ];

    const {
        data: bookshelves,
        isLoading,
        isError,
        refetch,
    } = useBookshelves({
        search: combinedSearch,
        page: currentPage,
        perPage: perPage,
    });

    const deleteUserMutation = useDeleteBookshelf();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        const filtersChanged = newFilters !== filters;

        if (filtersChanged) {
            setCurrentPage(1);
        }
        setFilters(newFilters);
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUserMutation.mutateAsync(id);
            refetch();
        } catch (error) {
            toast.error(t('ui.users.deleted_error') || 'Error deleting floor');
            console.error('Error deleting floor:', error);
        }
    };

    const columns = useMemo(
        () =>
            [
                createTextColumn<Bookshelf>({
                    id: 'enumeration',
                    header: t('ui.bookshelves.columns.enumeration') || "Bookshelves' enum",
                    accessorKey: 'enumeration',
                    format: (value) => `${t('ui.bookshelves.bookshelf')}: ${value}`,
                }),
                createTextColumn<Bookshelf>({
                    id: 'zone_name',
                    header: t('ui.bookshelves.columns.zone') || "Zones' number",
                    accessorKey: 'zone_name',
                    format: (value) => `${t('ui.zones.zone')}: ${value}`,
                }),
                createTextColumn<Bookshelf>({
                    id: 'floor_name',
                    header: t('ui.bookshelves.columns.floor') || "Zones' number",
                    accessorKey: 'floor_name',
                    format: (value) => `${t('ui.floors.floor')}: ${value}`,
                }),
                createTextColumn<Bookshelf>({
                    id: 'category',
                    header: t('ui.bookshelves.columns.category') || 'Category',
                    accessorKey: 'category',
                    format: (value) => `${t(`ui.genres.${value.toLowerCase()}`)}`,
                }),
                createTextColumn<Bookshelf>({
                    id: 'n_books',
                    header: t('ui.bookshelves.columns.books') || "Books' number",
                    accessorKey: 'n_books',
                }),
                createTextColumn<Bookshelf>({
                    id: 'count',
                    header: t('ui.bookshelves.columns.count') || 'Count',
                    accessorKey: 'count',
                }),
                createDateColumn<Bookshelf>({
                    id: 'created_at',
                    header: t('ui.floors.columns.created_at') || 'Created At',
                    accessorKey: 'created_at',
                }),
                createActionsColumn<Bookshelf>({
                    id: 'actions',
                    header: t('ui.floors.columns.actions') || 'Actions',
                    renderActions: (bookshelf) => (
                        <>
                            {auth.permissions.includes('report.print') ? (
                                <Link href={`/bookshelves/${bookshelf.id}/edit?page=${currentPage}&perPage=${perPage}`}>
                                    <Button variant="outline" size="icon" title={t('ui.users.buttons.edit') || 'Edit user'}>
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="outline" size="icon" disabled title={t('ui.users.buttons.edit') || 'Edit user'}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            )}

                            {auth.permissions.includes('report.print') ? (
                                <DeleteDialog
                                    id={bookshelf.id}
                                    successMessage={t('messages.bookshelves.deleted')}
                                    onDelete={handleDeleteUser}
                                    title={t('ui.bookshelves.delete') || 'Delete bookshelf'}
                                    description={
                                        t('ui.bookshelves.description') ||
                                        'Are you sure you want to delete this bookshelf? This action cannot be undone.'
                                    }
                                    trigger={
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            title={t('ui.users.buttons.delete') || 'Delete user'}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    }
                                />
                            ) : (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled
                                    className="text-destructive hover:text-destructive"
                                    title={t('ui.users.buttons.delete') || 'Delete user'}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            )}
                        </>
                    ),
                }),
            ] as ColumnDef<Bookshelf>[],
        [t, handleDeleteUser],
    );

    return (
        <BookshelfLayout title={t('ui.bookshelves.title')}>
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{t('ui.bookshelves.title')}</h1>
                        {auth.permissions.includes('report.print') ? (
                        <Link href="/bookshelves/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('ui.bookshelves.buttons.new')}
                            </Button>
                        </Link>
                        ) : (
                            <Button disabled>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('ui.bookshelves.buttons.new')}
                            </Button>
                        )}
                    </div>
                    <div></div>

                    <div className="space-y-4">
                        <FiltersTable
                            filters={
                                [
                                    {
                                        id: 'enumeration',
                                        label: t('ui.bookshelves.filters.enumeration') || 'Enumeracion',
                                        type: 'number',
                                        placeholder: t('ui.bookshelves.placeholders.enumeration') || 'Enumeracion...',
                                    },
                                    {
                                        id: 'zone',
                                        label: t('ui.bookshelves.filters.zone') || 'Zonas',
                                        type: 'number',
                                        placeholder: t('ui.bookshelves.placeholders.zone') || 'Zonas...',
                                    },
                                    {
                                        id: 'category',
                                        label: t('ui.bookshelves.filters.category') || 'Categoria',
                                        type: 'text',
                                        placeholder: t('ui.bookshelves.placeholders.category') || 'Categoria...',
                                    },
                                    {
                                        id: 'books',
                                        label: t('ui.bookshelves.filters.books') || 'Libros',
                                        type: 'number',
                                        placeholder: t('ui.bookshelves.placeholders.books') || 'Libros...',
                                    },
                                    {
                                        id: 'floor',
                                        label: t('ui.bookshelves.filters.floor') || 'Piso',
                                        type: 'number',
                                        placeholder: t('ui.bookshelves.placeholders.floor') || 'Piso...',
                                    },
                                ] as FilterConfig[]
                            }
                            onFilterChange={handleFilterChange}
                            initialValues={filters}
                        />
                    </div>

                    <div>
                        {bookshelves?.meta.total !== undefined && bookshelves?.meta.total > 0 && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {bookshelves.meta.total} {t('ui.info.total') || 'Total'}
                            </div>
                        )}
                    </div>

                    <div className="w-full overflow-hidden">
                        {isLoading ? (
                            <TableSkeleton columns={4} rows={10} />
                        ) : isError ? (
                            <div className="p-4 text-center">
                                <div className="mb-4 text-red-500">{t('ui.users.error_loading')}</div>
                                <Button onClick={() => refetch()} variant="outline">
                                    {t('ui.users.buttons.retry')}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Table
                                    data={
                                        bookshelves ?? {
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
        </BookshelfLayout>
    );
}
