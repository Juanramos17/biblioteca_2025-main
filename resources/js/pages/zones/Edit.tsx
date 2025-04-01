
import { User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import ZoneForm from "./components/ZoneForm";
import { ZoneLayout } from "@/layouts/zones/ZoneLayout";

interface ZoneProps {
    initialData?: {
        id: string;
        name: number;
        category: string;
        n_bookshelves: number;
        floor_id: string;
    };
    genres: { id: string; name: string }[];
    floors: { id: string; name: string, n_zones:number, zones_count:number, zones:{category:string, floor_id:string, id:string}[] }[];
    zones: number[];
    page?: string;
    perPage?: string;
}

export default function CreateUser({initialData, page, perPage, genres, floors, zones} :ZoneProps) {
  const { t } = useTranslations();

  return (
    <ZoneLayout title={t("ui.zones.title")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <User size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.zones.edit")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.zones.info")}</p>
          </CardHeader>


          <ZoneForm initialData={initialData} page={page} perPage={perPage} genres={genres} floors={floors} zones={zones}/>
        </div>
      </div>

    </ZoneLayout>
  );
}
