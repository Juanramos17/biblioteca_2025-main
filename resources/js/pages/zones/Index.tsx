import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Zone, useZones, useDeleteZone } from "@/hooks/zones/useZones";
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


export default function ZonesIndex() {
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
    filters.category ? `${filters.category}` : "null",
    filters.n_bookshelves ? `${filters.n_bookshelves}` : "null",
    filters.floor ? `${filters.floor}` : "null"
  ]

  console.log(combinedSearch);

  const { data: zones, isLoading, isError, refetch } = useZones({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });


  const deleteUserMutation = useDeleteZone();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserMutation.mutateAsync(id);
      refetch();
    } catch (error) {
      toast.error(t("ui.users.deleted_error") || "Error deleting floor");
      console.error("Error deleting floor:", error);
    }
  };

  const columns = useMemo(() => ([
    createTextColumn<Zone>({
      id: "name",
      header: t("ui.zones.columns.name") || "Zones' number",
      accessorKey: "name",
      format: (value) => `${t('ui.zones.zone')}: ${value}`,
    }),
    createTextColumn<Zone>({
      id: "floor_name",
      header: t("ui.floors.columns.name") || "Floors' number",
      accessorKey: "floor_name",
      format: (value) => `${t('ui.floors.floor')}: ${value}`,
    }),
    createTextColumn<Zone>({
      id: "category",
      header: t("ui.zones.columns.category") || "Category",
      accessorKey: "category",
      format: (value) => `${t(`ui.genres.${value.toLowerCase()}`)}`, 
    }),
    createTextColumn<Zone>({
      id: "n_bookshelves",
      header: t("ui.zones.columns.bookshelves") || "Bookshelves' number",
      accessorKey: "n_bookshelves",
    }),
    createTextColumn<Zone>({
      id: "count",
      header: t("ui.zones.columns.nBookshelves") || "Bookshelves' number",
      accessorKey: "count",
    }),
    createDateColumn<Zone>({
      id: "created_at",
      header: t("ui.floors.columns.created_at") || "Created At",
      accessorKey: "created_at",
    }),
    createActionsColumn<Zone>({
      id: "actions",
      header: t("ui.floors.columns.actions") || "Actions",
      renderActions: (zone) => (
        <>
          <Link href={`/zones/${zone.id}/edit?page=${currentPage}&perPage=${perPage}`}>
            <Button variant="outline" size="icon" title={t("ui.users.buttons.edit") || "Edit user"}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            id={zone.id}
            onDelete={handleDeleteUser}
            title={t("ui.zones.delete") || "Delete zone"}
            description={t("ui.zones.description") || "Are you sure you want to delete this zone? This action cannot be undone."}
            trigger={
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" title={t("ui.users.buttons.delete") || "Delete user"}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            }
          />
        </>
      ),
    }),
  ] as ColumnDef<Zone>[]), [t, handleDeleteUser]);

  return (
    <ZoneLayout title={t("ui.zones.title")}>
        <div className="p-6">
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{t('ui.zones.title')}</h1>
                      <Link href="/zones/create">
                          <Button>
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {t('ui.zones.buttons.new')}
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
                                      label: t('ui.zones.filters.name') || 'Numero',
                                      type: 'number',
                                      placeholder: t('ui.zones.placeholders.name') || 'Numero...',
                       
                                  },
                                  {
                                      id: 'category',
                                      label: t('ui.zones.filters.category') || 'Categoria',
                                      type: 'text',
                                      placeholder: t('ui.zones.placeholders.category') || 'Categoria...',
                                  },
                                  {
                                      id: 'n_bookshelves',
                                      label: t('ui.zones.filters.bookshelves') || 'Numero de estanterias',
                                      type: 'number',
                                      placeholder: t('ui.zones.placeholders.bookshelves') || 'Numero de estanterias...',
                                  },
                                  {
                                      id: 'floor',
                                      label: t('ui.zones.filters.floor') || 'Piso',
                                      type: 'number',
                                      placeholder: t('ui.zones.placeholders.floor') || 'Ubicacion...',
                                  },
                              ] as FilterConfig[]
                          }
                          onFilterChange={setFilters}
                          initialValues={filters}
                      />
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
                                      zones ?? {
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
    </ZoneLayout>
  );
}
