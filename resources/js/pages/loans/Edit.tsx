import { Building2, Handshake, User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardDescription, CardHeader } from "@/components/ui/card";
import LoanForm from "./components/LoanForm";
import { PageProps } from "@/types";
import { LoanLayout } from "@/layouts/loans/LoanLayout";

interface LoanProps extends PageProps {
    initialData?: {
        id: string;
        loan_id: string;
        email: string;
        date: Date;
    };
    page?: string;
    perPage?: string;
    lang: string;
}

export default function EditLoan({ initialData, page, perPage, lang }: LoanProps) {
  const { t } = useTranslations();
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);

  return (
    <LoanLayout title={t("ui.loans.create")}>
      <div className="flex w-full flex-col items-center px-4">
        <div className="bg-muted/50 flex w-full max-w-3xl flex-col rounded-lg shadow-md">
          <CardHeader className="bg-muted flex w-full flex-col items-start space-y-2 rounded-t-lg p-6">
            <div className="flex items-center space-x-2">
              <Handshake size={20} className="text-blue-500" />
              <h2 className="text-2xl font-bold">{t('ui.loans.edit')}</h2>
            </div>
            <p className="text-sm text-gray-500">{t('ui.loans.info')}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <CardDescription>
                {t('ui.loans.columns.book')}: {params.get('book_title')}
              </CardDescription>
              <CardDescription>
                {t('ui.loans.columns.author')}: {params.get('book_author')}
              </CardDescription>
              <CardDescription>
                {t('ui.loans.columns.ISBN')}: {params.get('book_ISBN')}
              </CardDescription>
            </div>
          </CardHeader>

          <div className="pr-4 pl-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <LoanForm initialData={initialData} page={page} perPage={perPage} lang={lang} />
          </div>
        </div>
      </div>
    </LoanLayout>
  );
}
