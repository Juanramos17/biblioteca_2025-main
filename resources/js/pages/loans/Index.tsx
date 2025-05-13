import { createActionsColumn, createTextColumn } from '@/components/stack-table/columnsTable';
import { DeleteDialog } from '@/components/stack-table/DeleteDialog';
import { FilterConfig, FiltersTable } from '@/components/stack-table/FiltersTable';
import { Table } from '@/components/stack-table/Table';
import { TableSkeleton } from '@/components/stack-table/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Loan, useDeleteLoan, useLoans } from '@/hooks/loans/useLoans';
import { useTranslations } from '@/hooks/use-translations';
import { LoanLayout } from '@/layouts/loans/LoanLayout';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon, PlusIcon, Repeat, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface LoanProps extends PageProps{
  lang: string
}

export default function LoansIndex({lang}: LoanProps) {
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
        filters.loan_date ? filters.loan_date : 'null',
        filters.due_date ? filters.due_date : 'null',
        filters.isLoaned ? filters.isLoaned : 'null',
    ];

    const {
        data: loans,
        isLoading,
        isError,
        refetch,
    } = useLoans({
        search: combinedSearch,
        page: currentPage,
        perPage: perPage,
    });

    const deleteUserMutation = useDeleteLoan();

    function handleChangeStatus(loan_id: string, loan_user_id: string) {
        const status = true;
        const formData = new FormData();
        formData.append('borrow', status);
        formData.append('name', loan_user_id);
        formData.append('_method', 'PUT');
        router.post(`/loans/${loan_id}`, formData);
        setTimeout(function () {
            refetch();
        }, 500);
    }

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
                createTextColumn<Loan>({
                    id: 'book_id',
                    header: t('ui.loans.columns.book') || "Book' title",
                    accessorKey: 'book_id',
                }),
                createTextColumn<Loan>({
                    id: 'user_id',
                    header: t('ui.loans.columns.user') || "User' name",
                    accessorKey: 'user_id',
                }),
                createTextColumn<Loan>({
                    id: 'loan_date',
                    header: t('ui.loans.columns.loan_date') || 'Loan date',
                    accessorKey: 'loan_date',
                }),
                createTextColumn<Loan>({
                    id: 'due_date',
                    header: t('ui.loans.columns.due_date') || 'Due date',
                    accessorKey: 'due_date',
                }),
                createTextColumn<Loan>({
                    id: 'isLoaned',
                    header: t('ui.loans.columns.isLoaned') || 'Status',
                    accessorKey: 'isLoaned',
                    format: (value) => {
                        return value ? t('ui.loans.filters.loaned') : t('ui.loans.filters.finished');
                    },
                }),
                createActionsColumn<Loan>({
                    id: 'time',
                    header: t('ui.loans.columns.time') || 'Actions',
                    renderActions: (loan) => {
                        const dueDate = new Date(loan.due_date);
                        const updatedAt = new Date(loan.updated_at);
                        const today = new Date();
                    
                        dueDate.setHours(0, 0, 0, 0);
                        updatedAt.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                    
                        let overdueMessage = '';
                    
                        if (loan.isLoaned) {
                            if (dueDate < today) {
                                const diffDays = Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                                overdueMessage = t('ui.loans.days_late', { days: diffDays });
                            } else {
                                overdueMessage = t('ui.loans.on_time');
                            }
                        } else {
                            if (updatedAt > dueDate) {
                                const diffDays = Math.ceil(Math.abs(updatedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                                const returnedDate = updatedAt.toISOString().split('T')[0];
                                overdueMessage = t('ui.loans.returned_on', {
                                    date: returnedDate,
                                    days: diffDays
                                });
                            } else {
                                overdueMessage = t('ui.loans.returned_on_time')+ ' : ' + updatedAt.toISOString().split('T')[0];
                            }
                        }
                        return (
                            <>
                                <span>{overdueMessage}</span>
                            </>
                        );
                    }
                }),
                createActionsColumn<Loan>({
                    id: 'actions',
                    header: t('ui.loans.columns.actions') || 'Actions',
                    renderActions: (loan) => (
                        <>
                            <Button
                                onClick={() => handleChangeStatus(loan.id, loan.user_id)}
                                variant="outline"
                                size="icon"
                                title={t('ui.loans.buttons.loan') || 'Loan'}
                                disabled={!loan.isLoaned}
                            >
                                <Repeat className="h-4 w-4 text-green-500" />
                            </Button>

                            <Link href={`/loans/${loan.id}/edit?page=${currentPage}&perPage=${perPage}`}>
                                <Button variant="outline" size="icon" title={t('ui.users.buttons.edit') || 'Edit user'}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            </Link>

                            <DeleteDialog
                                id={loan.id}
                                onDelete={handleDeleteUser}
                                title={t('ui.bookshelves.delete') || 'Delete bookshelf'}
                                description={
                                    t('ui.bookshelves.description') || 'Are you sure you want to delete this bookshelf? This action cannot be undone.'
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
            ] as ColumnDef<Loan>[],
        [t, handleDeleteUser],
    );

    return (
        <LoanLayout title={t('ui.loans.title')}>
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{t('ui.loans.loans')}</h1>
                        <Link href="/books">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('ui.loans.create')}
                            </Button>
                        </Link>
                    </div>
                    <div></div>

                    <div className="space-y-4">
                        <FiltersTable
                            lang={lang}
                            filters={
                                [
                                    {
                                        id: 'title',
                                        label: t('ui.loans.filters.title') || 'Titulo',
                                        type: 'text',
                                        placeholder: t('ui.loans.placeholders.title') || 'Titulo...',
                                    },
                                    {
                                        id: 'user',
                                        label: t('ui.loans.filters.user') || 'Usuario',
                                        type: 'text',
                                        placeholder: t('ui.loans.placeholders.user') || 'Usuario...',
                                    },
                                    {
                                        id: 'loan_date',
                                        label: t('ui.loans.filters.loan_date') || 'Fecha de préstamo',
                                        type: 'date',
                                        placeholder: t('ui.loans.placeholders.loan_date') || 'Fecha de préstamo...',
                                    },
                                    {
                                        id: 'due_date',
                                        label: t('ui.loans.filters.due_date') || 'Fecha de devolución',
                                        type: 'date',
                                        placeholder: t('ui.loans.placeholders.due_date') || 'Fecha de devolución...',
                                    },
                                    {
                                        id: 'isLoaned',
                                        label: t('ui.loans.filters.isLoaned') || 'Estado',
                                        type: 'select',
                                        options: [
                                            { value: 'true', label: t('ui.loans.filters.loaned') || 'En préstamo' },
                                            { value: 'false', label: t('ui.loans.filters.finished') || 'Finalizado' },
                                        ],
                                        placeholder: t('ui.loans.placeholders.isLoaned') || 'Estado...',
                                    },
                                ] as FilterConfig[]
                            }
                            onFilterChange={handleFilterChange}
                            initialValues={filters}
                            containerClassName="w-full"
                        />
                    </div>

                    <div>
                        { (loans?.meta.total !== undefined && loans?.meta.total > 0) && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {loans.meta.total} {t('ui.info.total') || 'Total'}
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
                                        loans ?? {
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
        </LoanLayout>
    );
}
