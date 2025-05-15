import { createActionsColumn, createDateColumn, createTextColumn } from '@/components/stack-table/columnsTable';
import { DeleteDialog } from '@/components/stack-table/DeleteDialog';
import { FilterConfig, FiltersTable } from '@/components/stack-table/FiltersTable';
import { Table } from '@/components/stack-table/Table';
import { TableSkeleton } from '@/components/stack-table/TableSkeleton';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { User, useDeleteUser, useUsers } from '@/hooks/users/useUsers';
import { UserLayout } from '@/layouts/users/UserLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface PageProps {
    auth: {
        user: any,
        permissions: string[],
    }
}

export default function UsersIndex() {
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
    // Combine name and email filters into a single search string if they exist
    const combinedSearch = [
        filters.search ? `${filters.search}` : 'null',
        filters.name ? `${filters.name}` : 'null',
        filters.email ? `${filters.email}` : 'null',
    ];

    const {
        data: users,
        isLoading,
        isError,
        refetch,
    } = useUsers({
        search: combinedSearch,
        page: currentPage,
        perPage: perPage,
    });
    const deleteUserMutation = useDeleteUser();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setCurrentPage(1); 
    };

    function handleTimeline(user_id: string) {
        const formData = new FormData();
        formData.append('user_id', user_id);
        console.log(user_id);
        router.get(`/timelines`, formData);
    }

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
            toast.error(t('ui.users.deleted_error') || 'Error deleting user');
            console.error('Error deleting user:', error);
        }
    };

    const columns = useMemo(
        () =>
            [
                createTextColumn<User>({
                    id: 'name',
                    header: t('ui.users.columns.name') || 'Name',
                    accessorKey: 'name',
                }),
                createTextColumn<User>({
                    id: 'email',
                    header: t('ui.users.columns.email') || 'Email',
                    accessorKey: 'email',
                }),
                createDateColumn<User>({
                    id: 'created_at',
                    header: t('ui.users.columns.created_at') || 'Created At',
                    accessorKey: 'created_at',
                }),
                createActionsColumn<User>({
                    id: 'actions',
                    header: t('ui.users.columns.actions') || 'Actions',
                    renderActions: (user) => (
                        <>
                          {auth.permissions.includes('settings.access') && auth.permissions.includes("report.view") ?(
                            <Link href={`/users/${user.id}?page=${currentPage}&perPage=${perPage}`}>
                                <Button variant="outline" size="icon" title={t('ui.navigation.items.timelines') || 'Timeline'}>
                                    <Clock className="h-4 w-4" />
                                </Button>
                            </Link>
                            ):(
                                <Button disabled={true} variant="outline" size="icon" title={t('ui.navigation.items.timelines') || 'Timeline'}>
                                    <Clock className="h-4 w-4" />
                                </Button>
                            )}

                            {auth.permissions.includes('users.edit') ? (
                                <Link href={`/users/${user.id}/edit?page=${currentPage}&perPage=${perPage}`}>
                                    <Button variant="outline" size="icon" title={t('ui.users.buttons.edit') || 'Edit user'}>
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button disabled={true} variant="outline" size="icon" title={t('ui.users.buttons.edit') || 'Edit user'}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            )}
                      
                     

                            {auth.permissions.includes('users.delete') ? (
                               <DeleteDialog
                               id={user.id}
                               onDelete={handleDeleteUser}
                               title={t('ui.users.delete.title') || 'Delete user'}
                               description={
                                   t('ui.users.delete.description') || 'Are you sure you want to delete this user? This action cannot be undone.'
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
                                <Button disabled={true} variant="outline" size="icon" title={t('ui.users.buttons.delete') || 'Delete user'}>
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            )}
                           
                        </>
                    ),
                }),
            ] as ColumnDef<User>[],
        [t, handleDeleteUser],
    );

    return (
        <UserLayout title={t('ui.users.title')}>
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">{t('ui.users.title')}</h1>
                        {auth.permissions.includes('users.create') ? (
                            <Link href="/users/create">
                                <Button>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    {t('ui.users.buttons.new')}
                                </Button>
                            </Link>
                        ) : (
                            <Button disabled={true}>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('ui.users.buttons.new')}
                            </Button>
                        )}
                    </div>
                    <div></div>

                    <div className="space-y-4">
                        <FiltersTable
                            filters={
                                [
                                    {
                                        id: 'search',
                                        label: t('ui.users.filters.search') || 'Buscar',
                                        type: 'text',
                                        placeholder: t('ui.users.placeholders.search') || 'Buscar...',
                                    },
                                    {
                                        id: 'name',
                                        label: t('ui.users.filters.name') || 'Nombre',
                                        type: 'text',
                                        placeholder: t('ui.users.placeholders.name') || 'Nombre...',
                                    },
                                    {
                                        id: 'email',
                                        label: t('ui.users.filters.email') || 'Email',
                                        type: 'text',
                                        placeholder: t('ui.users.placeholders.email') || 'Email...',
                                    },
                                ] as FilterConfig[]
                            }
                            onFilterChange={handleFilterChange}
                            initialValues={filters}
                        />
                    </div>

                    <div>
                        {users?.meta.total !== undefined && users?.meta.total > 0 && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {users.meta.total} {t('ui.info.total') || 'Total'}
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
                                        users ?? {
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
        </UserLayout>
    );
}
