import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Book, useBooks, useDeleteBook } from "@/hooks/books/useBooks";
import { Handshake, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, router, usePage } from "@inertiajs/react";
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
    filters.category ? `${filters.category}` : "null",
    filters.floor ? `${filters.floor}` : "null",
    filters.zone ? `${filters.zone}` : "null",
  ];

  const { data: zones, isLoading, isError, refetch } = useBooks({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });

  function handleCreate(book_id: string, book_ISBN: number, book_author: string, book_title: string) {
    return router.get('loans/create', {book_id, book_ISBN, book_author, book_title});
  };


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
      toast.error(t("ui.books.deleted_error") || "Error deleting book");
      console.error("Error deleting book:", error);
    }
  };

  const columns = useMemo(() => ([
    createTextColumn<Book>({
      id: "title",
      header: t("ui.books.columns.title") || "Book' title",
      accessorKey: "title",
    }),
    createTextColumn<Book>({
      id: "author",
      header: t("ui.books.columns.author") || "Author",
      accessorKey: "author",
    }),
    createTextColumn<Book>({
      id: "publisher",
      header: t("ui.books.columns.publisher") || "Publisher's number",
      accessorKey: "publisher",
    }),
    createActionsColumn<Book>({
      id: "ISBN",
      header: t("ui.books.columns.ISBN") || "ISBN",
      renderActions: (book) => {
        return `${book.ISBN} (${book.loaned_count}/${book.total})`;
      },
    }),
    createTextColumn<Book>({
      id: "is_available",
      header: t("ui.books.columns.ISBN") || "ISBN",
      accessorKey:"is_available",
      format: (value) => {
        return value ? "Disponible" : "No disponible";
      },
    }),
    createTextColumn<Book>({
      id: "genre",
      header: t("ui.books.columns.category") || "Category",
      accessorKey: "genre",
      format: (value) => {
        return value
          .split(", ") 
          .map((genre) => t(`ui.genres.${genre.toLowerCase()}`)) 
          .join(", "); 
      },
    }),
    createTextColumn<Book>({
      id: "bookshelf_name",
      header: t("ui.books.columns.bookshelf") || "Bookshelf' number",
      accessorKey: "bookshelf_name",
      format: (value) => `${t('ui.bookshelves.bookshelf')}: ${value}`,
    }),
    createTextColumn<Book>({
      id: "zone_name",
      header: t("ui.bookshelves.columns.zone") || "Zone' number",
      accessorKey: "zone_name",
      format: (value) => `${t('ui.zones.zone')}: ${value}`,
    }),
    createTextColumn<Book>({
      id: "floor_name",
      header: t("ui.books.columns.floor") || "Floor' number",
      accessorKey: "floor_name",
      format: (value) => `${t('ui.floors.floor')}: ${value}`,
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

      <Button 
        variant="outline" 
        onClick={() => handleCreate(book.id, book.ISBN, book.author, book.title)}
        size="icon" 
        title={t("ui.users.buttons.edit") || "Edit user"} 
        disabled={!book.is_available}
      >
        <Handshake className="h-4 w-4" />
      </Button>
  


          <Link href={`/books/${book.id}/edit?page=${currentPage}&perPage=${perPage}`}>
            <Button variant="outline" size="icon" title={t("ui.users.buttons.edit") || "Edit user"}>
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>


          <DeleteDialog
            id={book.id}
            onDelete={handleDeleteUser}
            title={t("ui.books.delete") || "Delete bookshelf"}
            description={t("ui.books.description") || "Are you sure you want to delete this book? This action cannot be undone."}
            trigger={
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" title={t("ui.books.buttons.delete") || "Delete user"}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            }
          />
        </>
      ),
    }),
  ] as ColumnDef<Book>[]), [t, handleDeleteUser]);

  return (
    <BookLayout title={t("ui.books.title")}>
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
                                      id: 'bookshelf_name',
                                      label: t('ui.books.filters.bookshelf') || 'Estanteria',
                                      type: 'number',
                                      placeholder: t('ui.books.placeholders.bookshelf') || 'Estanteria...',
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
                              <div className="mb-4 text-red-500">{t('ui.books.error_loading')}</div>
                              <Button onClick={() => refetch()} variant="outline">
                                  {t('ui.books.buttons.retry')}
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
