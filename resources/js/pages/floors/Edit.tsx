import { PageProps } from "@inertiajs/core";
import { User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import FloorForm from "./components/FloorForm";

interface EditFloorProps extends PageProps {
    initialData?: {
        id: string;
        name: number;
        ubication: string;
        n_zones: number;
    };
    page?: string;
    perPage?: string; 
}


export default function EditUser({initialData, page, perPage} :EditFloorProps) {
  const { t } = useTranslations();
  console.log(initialData);

  return (
    <FloorLayout title={t("ui.floors.title")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <User size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.info.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.info.info")}</p>
          </CardHeader>


          <FloorForm initialData={initialData} page={page} perPage={perPage}/>
        </div>
      </div>

    </FloorLayout>
  );
}
