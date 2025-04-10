
import { Building2, User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import LoanForm from "./components/LoanForm";
import { PageProps } from "@/types";
import { LoanLayout } from "@/layouts/loans/LoanLayout";

interface LoanProps extends PageProps{
    initialData?: {
        id: string;
        email: string;
        date: string;
    };
    page?: string;
    perPage?: string;
}

export default function CreateFloor({initialData, page, perPage}:LoanProps) {
  const { t } = useTranslations();

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
          </CardHeader>


          <LoanForm initialData={initialData} page={page} perPage={perPage} />
        </div>
      </div>

    </LoanLayout>
  );
}
