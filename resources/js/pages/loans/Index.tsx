import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Loan, useLoans, useDeleteLoan } from "@/hooks/loans/useLoans";
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
import { BookshelfLayout } from "@/layouts/bookshelves/Bookshelf";


export default function LoansIndex() {
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
    filters.enumeration ? `${filters.enumeration}` : "null",
    filters.zone ? `${filters.zone}` : "null",
    filters.category ? `${filters.category}` : "null",
    filters.books ? `${filters.books}` : "null",
    filters.floor ? `${filters.floor}` : "null"
  ]

  const { data: zones, isLoading, isError, refetch } = useLoans({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });


  const deleteUserMutation = useDeleteLoan();

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
    createTextColumn<Loan>({
      id: "book_id",
      header: t("ui.bookshelves.columns.enumeration") || "Bookshelves' enum",
      accessorKey: "book_id",
    }),
    createTextColumn<Loan>({
      id: "user_id",
      header: t("ui.bookshelves.columns.zone") || "Zones' number",
      accessorKey: "user_id",
    }),
    createTextColumn<Loan>({
      id: "loan_date",
      header: t("ui.bookshelves.columns.floor") || "Zones' number",
      accessorKey: "loan_date",
    }),
    createTextColumn<Loan>({
      id: "due_date",
      header: t("ui.bookshelves.columns.category") || "Category",
      accessorKey: "due_date", 
    }),
    createTextColumn<Loan>({
      id: "isLoaned",
      header: t("ui.bookshelves.columns.books") || "Books' number",
      accessorKey: "isLoaned",
      format: (value) => {return value ? "En Prestamo" : "Disponible"},
    }),
    createTextColumn<Loan>({
      id: "overdue_messageç",
      header: t("ui.bookshelves.columns.count") || "Count",
      accessorKey: "overdue_message",
    }),
    createActionsColumn<Loan>({
      id: "actions",
      header: t("ui.floors.columns.actions") || "Actions",
      renderActions: (loan) => (
        <>
          <Link href={`/loans/${loan.id}/edit?page=${currentPage}&perPage=${perPage}`}>
            <Button variant="outline" size="icon" title={t("ui.users.buttons.edit") || "Edit user"}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            id={loan.id}
            onDelete={handleDeleteUser}
            title={t("ui.bookshelves.delete") || "Delete bookshelf"}
            description={t("ui.bookshelves.description") || "Are you sure you want to delete this bookshelf? This action cannot be undone."}
            trigger={
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" title={t("ui.users.buttons.delete") || "Delete user"}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            }
          />
        </>
      ),
    }),
  ] as ColumnDef<Loan>[]), [t, handleDeleteUser]);

  return (
    <BookshelfLayout title={t("ui.bookshelves.title")}>
        <div className="p-6">
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{t('ui.bookshelves.title')}</h1>
                      <Link href="/bookshelves/create">
                          <Button>
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {t('ui.bookshelves.buttons.new')}
                          </Button>
                      </Link>
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
    </BookshelfLayout>
  );
}
