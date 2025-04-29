
import { Building2, Handshake, Receipt, Repeat, User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardDescription, CardHeader } from "@/components/ui/card";
import LoanForm from "./components/LoanForm";
import { PageProps } from "@/types";
import { LoanLayout } from "@/layouts/loans/LoanLayout";

interface LoanProps extends PageProps{
  lang: string
}
export default function CreateFloor({lang}: LoanProps) {
  const { t } = useTranslations();
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);

  return (
    <LoanLayout title={t("ui.loans.create")}>
  <div className="flex flex-col items-center w-full px-4">
    <div className="w-full max-w-3xl flex flex-col bg-muted/50 rounded-lg shadow-md">

      <CardHeader className="w-full flex flex-col items-start bg-muted p-6 rounded-t-lg space-y-2">
        <div className="flex items-center space-x-2">
          <Handshake size={20} className="text-blue-500" />
          <h2 className="font-bold text-2xl">{t("ui.loans.create")}</h2>
        </div>
        <p className="text-gray-500 text-sm">{t("ui.loans.info")}</p>
        <div className="space-y-1 text-sm text-gray-600">
          <CardDescription>{t("ui.loans.columns.book")}: {params.get('book_title')}</CardDescription>
          <CardDescription>{t("ui.loans.columns.author")}: {params.get('book_author')}</CardDescription>
          <CardDescription>{t("ui.loans.columns.ISBN")}: {params.get('book_ISBN')}</CardDescription>
        </div>
      </CardHeader>

      <LoanForm lang={lang} />
      
    </div>
  </div>
</LoanLayout>
  );
}
