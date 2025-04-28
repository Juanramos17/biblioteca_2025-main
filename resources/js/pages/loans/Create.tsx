
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
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <Handshake size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.loans.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.loans.info")}</p>
              <CardDescription>{t("ui.loans.columns.book")}: {params.get('book_title')}</CardDescription>
              <CardDescription>{t("ui.loans.columns.author")}: {params.get('book_author')}</CardDescription>
              <CardDescription>{t("ui.loans.columns.ISBN")}: {params.get('book_ISBN')}</CardDescription>
          </CardHeader>


          <LoanForm lang={lang}/>
        </div>
      </div>

    </LoanLayout>
  );
}
