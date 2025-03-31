
import { User } from "lucide-react";
import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import ZoneForm from "./components/ZoneForm";

interface ZoneProps {
    initialData?: {
        id: string;
        name: number;
        category: string;
        n_bookshelves: number;
        floor_id: string;
    };
    genres: { id: string; name: string }[];
    floors: { id: string; name: string }[];
    page?: string;
    perPage?: string;
}

export default function CreateUser({initialData, page, perPage, genres, floors} :ZoneProps) {
  const { t } = useTranslations();

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


          <ZoneForm initialData={initialData} page={page} perPage={perPage} genres={genres} floors={floors}/>
        </div>
      </div>

    </FloorLayout>
  );
}
