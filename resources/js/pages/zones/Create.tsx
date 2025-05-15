import { MapPin, User } from "lucide-react";
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

export default function CreateZone({genres, floors, zones}: ZoneProps) {
  const { t } = useTranslations();

  return (
    <ZoneLayout title={t("ui.zones.create")}>
      <div className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <MapPin size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.zones.create")}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-3">{t("ui.zones.info")}</p>
          </CardHeader>

          <ZoneForm genres={genres} floors={floors} zones={zones} />
        </div>
      </div>
    </ZoneLayout>
  );
}
