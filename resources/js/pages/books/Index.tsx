import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Book, useBooks, useDeleteBook } from "@/hooks/books/useBooks";
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
import { BookLayout } from "@/layouts/books/BookLayout";


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
    filters.title ? `${filters.title}` : "null",
    filters.bookshelf_name ? `${filters.bookshelf_name}` : "null",
    filters.author ? `${filters.author}` : "null",
    filters.publisher ? `${filters.publisher}` : "null",
    filters.ISBN ? `${filters.ISBN}` : "null",
    filters.category ? `${filters.category}` : "null"
  ];

  const { data: zones, isLoading, isError, refetch } = useBooks({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });


  const deleteUserMutation = useDeleteBook();

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
    createTextColumn<Book>({
      id: "title",
      header: t("ui.bookshelves.columns.enumeration") || "Bookshelves' enum",
      accessorKey: "title",
    }),
    createTextColumn<Book>({
      id: "bookshelf_name",
      header: t("ui.bookshelves.columns.zone") || "Zones' number",
      accessorKey: "bookshelf_name",
    }),
    createTextColumn<Book>({
      id: "zone_name",
      header: t("ui.bookshelves.columns.zone") || "Zones' number",
      accessorKey: "zone_name",
    }),
    createTextColumn<Book>({
      id: "floor_name",
      header: t("ui.bookshelves.columns.zone") || "Zones' number",
      accessorKey: "floor_name",
    }),
    createTextColumn<Book>({
      id: "genre",
      header: t("ui.bookshelves.columns.category") || "Category",
      accessorKey: "genre",
    }),
    createTextColumn<Book>({
      id: "author",
      header: t("ui.bookshelves.columns.shelves") || "Shelves",
      accessorKey: "author",
    }),
    createTextColumn<Book>({
      id: "publisher",
      header: t("ui.bookshelves.columns.books") || "Books' number",
      accessorKey: "publisher",
    }),
    createTextColumn<Book>({
      id: "ISBN",
      header: t("ui.bookshelves.columns.count") || "Count",
      accessorKey: "ISBN",
    }),
    createDateColumn<Book>({
      id: "created_at",
      header: t("ui.floors.columns.created_at") || "Created At",
      accessorKey: "created_at",
    }),
    createActionsColumn<Book>({
      id: "actions",
      header: t("ui.floors.columns.actions") || "Actions",
      renderActions: (book) => (
        <>
          <Link href={`/books/${book.id}/edit?page=${currentPage}&perPage=${perPage}`}>
            <Button variant="outline" size="icon" title={t("ui.users.buttons.edit") || "Edit user"}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteDialog
            id={book.id}
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
  ] as ColumnDef<Book>[]), [t, handleDeleteUser]);

  return (
    <BookLayout title={t("ui.bookshelves.title")}>
        <div className="p-6">
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{t('ui.bookshelves.title')}</h1>
                      <Link href="/books/create">
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
                                      id: 'title',
                                      label: t('ui.floors.filters.search') || 'Buscar',
                                      type: 'text',
                                      placeholder: t('ui.floors.placeholders.search') || 'Buscar...',
                       
                                  },
                                  {
                                      id: 'bookshelf_name',
                                      label: t('ui.floors.filters.name') || 'Nombre',
                                      type: 'number',
                                      placeholder: t('ui.floors.placeholders.name') || 'Nombre...',
                                  },
                                  {
                                      id: 'author',
                                      label: t('ui.floors.filters.ubication') || 'Ubication',
                                      type: 'text',
                                      placeholder: t('ui.floors.placeholders.ubication') || 'Ubicacion...',
                                  },
                                  {
                                      id: 'publisher',
                                      label: t('ui.floors.filters.ubication') || 'Ubication',
                                      type: 'text',
                                      placeholder: t('ui.floors.placeholders.ubication') || 'Ubicacion...',
                                  },
                                  {
                                      id: 'ISBN',
                                      label: t('ui.floors.filters.ubication') || 'Ubication',
                                      type: 'number',
                                      placeholder: t('ui.floors.placeholders.ubication') || 'Ubicacion...',
                                  },
                                  {
                                      id: 'category',
                                      label: t('ui.floors.filters.ubication') || 'Ubication',
                                      type: 'text',
                                      placeholder: t('ui.floors.placeholders.ubication') || 'Ubicacion...',
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
    </BookLayout>
  );
}
