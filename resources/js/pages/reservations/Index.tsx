import { createActionsColumn, createTextColumn } from '@/components/stack-table/columnsTable';
import { DeleteDialog } from '@/components/stack-table/DeleteDialog';
import { FilterConfig, FiltersTable } from '@/components/stack-table/FiltersTable';
import { Table } from '@/components/stack-table/Table';
import { TableSkeleton } from '@/components/stack-table/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Reservation, useDeleteReservation, useReservations } from '@/hooks/reservations/useReservations';
import { useTranslations } from '@/hooks/use-translations';
import { LoanLayout } from '@/layouts/loans/LoanLayout';
import { ReservationLayout } from '@/layouts/reservations/ReservationLayout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, PlusIcon, Repeat, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface ReservationProps extends PageProps{
  lang: string
}

export default function ReservationsIndex({ lang }: ReservationProps) {
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
        filters.title ? filters.title : 'null',
        filters.user ? filters.user : 'null',
        filters.created_date ? filters.created_date : 'null',
    ];

    const {
        data: reservations,
        isLoading,
        isError,
        refetch,
    } = useReservations({
        search: combinedSearch,
        page: currentPage,
        perPage: perPage,
    });

    const deleteUserMutation = useDeleteReservation();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const handleFilterChange = (newFilters: Record<string, any>) => {
        const filtersChanged = newFilters!==filters;

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
                createTextColumn<Reservation>({
                    id: 'book_id',
                    header: t('ui.reservations.columns.book') || "Book' title",
                    accessorKey: 'book_id',
                }),
                createTextColumn<Reservation>({
                    id: 'user_id',
                    header: t('ui.reservations.columns.user') || "User' name",
                    accessorKey: 'user_id',
                }),
                createTextColumn<Reservation>({
                    id: 'created_at',
                    header: t('ui.reservations.columns.reservation_date') || "User' name",
                    accessorKey: 'created_at',
                }),
                
                createActionsColumn<Reservation>({
                    id: 'actions',
                    header: t('ui.reservations.columns.actions') || 'Actions',
                    renderActions: (reservation) => (
                        <>
                           

                            <DeleteDialog
                                id={reservation.id}
                                onDelete={handleDeleteUser}
                                title={t('ui.reservations.delete') || 'Delete reservation'}
                                description={
                                    t('ui.reservations.description') || 'Are you sure you want to delete this reservation? This action cannot be undone.'
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
                        </>
                    ),
                }),
            ] as ColumnDef<Reservation>[],
        [t, handleDeleteUser],
    );

    return (
        <ReservationLayout title={t('ui.reservations.title')}>
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{t('ui.reservations.reservation')}</h1>
                    </div>
                    <div></div>

                    <div className="space-y-4">
                        <FiltersTable
                        lang={lang}
                            filters={
                                [
                                    {
                                        id: 'title',
                                        label: t('ui.reservations.filters.title') || 'Titulo',
                                        type: 'text',
                                        placeholder: t('ui.reservations.placeholders.title') || 'Titulo...',
                                    },
                                    {
                                        id: 'user',
                                        label: t('ui.reservations.filters.user') || 'Usuario',
                                        type: 'text',
                                        placeholder: t('ui.reservations.placeholders.user') || 'Usuario...',
                                    },
                                    {
                                        id: 'created_date',
                                        label: t('ui.reservations.filters.loan_date') || 'Fecha de Reserva',
                                        type: 'date',
                                        placeholder: t('ui.reservations.placeholders.loan_date') || 'Fecha de Reserva...',
                                    },
                                   
                                ] as FilterConfig[]
                            }
                            onFilterChange={handleFilterChange}
                            initialValues={filters}
                            containerClassName="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                        />
                    </div>

                    <div>
                        { (reservations?.meta.total !== undefined && reservations?.meta.total > 0) && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {reservations.meta.total} {t('ui.info.total') || 'Total'}
                            </div>
                        )}
                    </div>


                    <div className="w-full overflow-hidden">
                        {isLoading ? (
                            <TableSkeleton columns={4} rows={10} />
                        ) : isError ? (
                            <div className="p-4 text-center">
                                <div className="mb-4 text-red-500">{t('ui.loans.error_loading')}</div>
                                <Button onClick={() => refetch()} variant="outline">
                                    {t('ui.users.buttons.retry')}
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <Table
                                    data={
                                        reservations ?? {
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
                                    noResultsMessage={t('ui.users.no_results') || 'No loans found'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ReservationLayout>
    );
}
