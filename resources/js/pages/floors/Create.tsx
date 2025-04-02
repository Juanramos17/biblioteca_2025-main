
import { Building2, User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import FloorForm from "./components/FloorForm";
import { PageProps } from "@/types";

interface FloorProps extends PageProps{
  floors?: number[];
}

export default function CreateFloor(floors:FloorProps) {
  const { t } = useTranslations();

  return (
    <FloorLayout title={t("ui.floors.create")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.floors.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.floors.info")}</p>
          </CardHeader>


          <FloorForm floors={floors.floors}/>
        </div>
      </div>

    </FloorLayout>
  );
}
