import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/stack-table/TableSkeleton";
import { Loan, useLoans, useDeleteLoan } from "@/hooks/loans/useLoans";
import { PencilIcon, PlusIcon, Repeat, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useTranslations } from "@/hooks/use-translations";
import { Table } from "@/components/stack-table/Table";
import { createTextColumn, createDateColumn, createActionsColumn } from "@/components/stack-table/columnsTable";
import { DeleteDialog } from "@/components/stack-table/DeleteDialog";
import { FiltersTable, FilterConfig } from "@/components/stack-table/FiltersTable";
import { toast } from "sonner";
import { ColumnDef, Row } from "@tanstack/react-table";
import { LoanLayout } from "@/layouts/loans/LoanLayout";


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
    filters.title ? filters.title : "null",
    filters.user ? filters.user : "null",
    filters.loan_date ? filters.loan_date : "null",
    filters.due_date ? filters.due_date : "null",
    filters.isLoaned ? filters.isLoaned : "null"
  ]

  console.log(combinedSearch);

  const { data: loans, isLoading, isError, refetch } = useLoans({
    search: combinedSearch,
    page: currentPage,
    perPage: perPage,
  });


  const deleteUserMutation = useDeleteLoan();

  function handleChangeStatus (loan_id: string){
    const status = true;
    const formData = new FormData();
    formData.append('borrow', status);
    formData.append('_method', 'PUT');
    router.post(`/loans/${loan_id}`, formData);
    setTimeout(function(){
      refetch();

    },500)
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      toast.error(t("ui.users.deleted_error") || "Error deleting floor");
      console.error("Error deleting floor:", error);
    }
  };
  const columns = useMemo(() => ([
    createTextColumn<Loan>({
      id: "book_id",
      header: t("ui.loans.columns.book") || "Book' title",
      accessorKey: "book_id",
    }),
    createTextColumn<Loan>({
      id: "user_id",
      header: t("ui.loans.columns.user") || "User' name",
      accessorKey: "user_id",
    }),
    createTextColumn<Loan>({
      id: "loan_date",
      header: t("ui.loans.columns.loan_date") || "Loan date",
      accessorKey: "loan_date",
    }),
    createTextColumn<Loan>({
      id: "due_date",
      header: t("ui.loans.columns.due_date") || "Due date",
      accessorKey: "due_date", 
    }),
    createTextColumn<Loan>({
      id: "isLoaned",
      header: t("ui.loans.columns.isLoaned") || "Status",
      accessorKey: "isLoaned",
      format: (value) => {return value ? t('ui.loans.filters.loaned') : t('ui.loans.filters.finished')},
    }),
    createTextColumn<Loan>({
      id: "overdue_message",
      header: t("ui.loans.columns.days") || "Days overdue",
      accessorKey: "overdue_message",
    }),
    createActionsColumn<Loan>({
      id: "actions",
      header: t("ui.loans.columns.actions") || "Actions",
      renderActions: (loan) => (
        <>

            <Button
                    onClick={() => handleChangeStatus(loan.id)}
                    variant="outline"
                    size="icon"
                    title={t("ui.loans.buttons.loan") || "Loan"}
                    disabled={!loan.isLoaned} 
                  >
              <Repeat className="h-4 w-4" />
            </Button>

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
    <LoanLayout title={t("ui.loans.title")}>
        <div className="p-6">
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-bold">{t('ui.loans.loans')}</h1>
                      <Link href="/loans/create">
                          <Button>
                              <PlusIcon className="mr-2 h-4 w-4" />
                              {t('ui.loans.create')}
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
                                          { value: 'true', label:  t('ui.loans.filters.loaned') || 'En préstamo' },
                                          { value: 'false', label: t('ui.loans.filters.finished') || 'Finalizado' },
                                      ],
                                      placeholder: t('ui.loans.placeholders.isLoaned') || 'Estado...',
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
