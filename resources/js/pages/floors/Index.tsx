import { FloorLayout } from "@/layouts/floors/FloorLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Floor, useFloors, useDeleteFloor } from "@/hooks/floors/useFloors";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useTranslations } from "@/hooks/use-translations";
import { Table } from "@/components/stack-table/Table";
import { createTextColumn, createDateColumn, createActionsColumn } from "@/components/stack-table/columnsTable";
import { DeleteDialog } from "@/components/stack-table/DeleteDialog";
import { FiltersTable, FilterConfig } from "@/components/stack-table/FiltersTable";
import { toast } from "sonner";
import { ColumnDef, Row } from "@tanstack/react-table";


export default function FloorsIndex() {
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
    filters.name ? `${filters.name}` : "null",
    filters.zones ? `${filters.zones}` : "null"
  ];

  const { data: floors, isLoading, isError, refetch } = useFloors({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });


  const deleteUserMutation = useDeleteFloor();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
      toast.error(t("ui.floors.deleted_error") || "Error deleting floor");
      console.error("Error deleting floor:", error);
    }
  };

  const columns = useMemo(() => ([
    createTextColumn<Floor>({
      id: "name",
      header: t("ui.floors.columns.name") || "Floors' number",
      accessorKey: "name",
      format: (value) => `${t('ui.floors.floor')}: ${value}`,
    }),
    createTextColumn<Floor>({
      id: "n_zones",
      header: t("ui.floors.columns.nZones") || "Zones' number",
      accessorKey: "n_zones",
      format: (value) => `${t('ui.zones.zones')}: ${value}`,
    }),
    createTextColumn<Floor>({
      id: "count",
      header: t("ui.floors.columns.ocupedZones") || "Count",
      accessorKey: "count",
      format: (value) => `${t('ui.floors.ocuped')}: ${value}`,
    }),
    createDateColumn<Floor>({
      id: "created_at",
      header: t("ui.floors.columns.created_at") || "Created At",
      accessorKey: "created_at",
    }),
    createActionsColumn<Floor>({
      id: "actions",
      header: t("ui.floors.columns.actions") || "Actions",
      renderActions: (floor) => (
        <>
          <Link href={`/floors/${floor.id}/edit?page=${currentPage}&perPage=${perPage}`}>
            <Button variant="outline" size="icon" title={t("ui.users.buttons.edit") || "Edit user"}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            id={floor.id}
            onDelete={handleDeleteUser}
            title={t("ui.floors.delete") || "Delete Floor"}
            description={t("ui.floors.description") || "Are you sure you want to delete this floor? This action cannot be undone."}
            trigger={
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" title={t("ui.floors.buttons.delete") || "Delete floor"}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            }
          />
        </>
      ),
    }),
  ] as ColumnDef<Floor>[]), [t, handleDeleteUser]);

  return (
    <FloorLayout title={t("ui.floors.title")}>
        <div className="p-6">
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{t('ui.floors.title')}</h1>
                      <Link href="/floors/create">
                          <Button>
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {t('ui.floors.buttons.new')}
                          </Button>
                      </Link>
                  </div>
                  <div></div>

                  <div className="space-y-4">
                      <FiltersTable
                          filters={
                              [
                                  {
                                      id: 'name',
                                      label: t('ui.floors.filters.name') || 'Buscar',
                                      type: 'number',
                                      placeholder: t('ui.floors.placeholders.search') || 'Buscar...',
                       
                                  },
                                  {
                                      id: 'zones',
                                      label: t('ui.floors.filters.zones') || 'Nombre',
                                      type: 'number',
                                      placeholder: t('ui.floors.placeholders.zones') || 'Nombre...',
                                  },
                              ] as FilterConfig[]
                          }
                          onFilterChange={handleFilterChange}
                          initialValues={filters}
                      />
                  </div>

                  <div>
                        { (floors?.meta.total !== undefined && floors?.meta.total > 0) && (
                            <div className="mt-2 rounded-md px-3 py-2 text-sm font-medium shadow-sm">
                                {floors.meta.total} {t('ui.info.total') || 'Total'}
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
                                      floors ?? {
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
    </FloorLayout>
  );
}
