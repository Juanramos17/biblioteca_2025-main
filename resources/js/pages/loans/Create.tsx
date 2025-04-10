
import { Building2, User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardDescription, CardHeader } from "@/components/ui/card";
import LoanForm from "./components/LoanForm";
import { PageProps } from "@/types";
import { LoanLayout } from "@/layouts/loans/LoanLayout";

interface LoanProps extends PageProps{
    initialData?: {
        id: string;
        email: string;
        date: string;
    };
}

export default function CreateFloor({initialData}:LoanProps) {
  const { t } = useTranslations();
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);

  return (
    <LoanLayout title={t("ui.floors.create")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.floors.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.floors.info")}</p>
              <CardDescription>Title: {params.get('book_title')}</CardDescription>
              <CardDescription>Author: {params.get('book_author')}</CardDescription>
              <CardDescription>ISBN: {params.get('book_ISBN')}</CardDescription>
          </CardHeader>


          <LoanForm initialData={initialData}/>
        </div>
      </div>

    </LoanLayout>
  );
}
