
import { Building2} from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import BookForm from "./components/BookForm";
import { PageProps } from "@/types";
import { BookLayout } from "@/layouts/books/BookLayout";

interface BookshelfProps extends PageProps{
  initialData?: {
    id: string;
    title: string;
    genre: string;
    publisher: string;
    author: string;
    ISBN: string;
    bookshelf_id: string;
};
    floor_id?: string;
    floors: { id: string; name: string, n_zones:number, zones_count:number, zones:{category:string, floor_id:string, id:string, name:number}[] }[];   
    zones: { id: string; name: string, n_bookshelves:number,floor:{id:string, name:number}, bookshelves_count:number, category:string,       bookshelves:{category:string, zone_id:string, id:string}[] }[];
    page?: string;
    perPage?: string;  
}

export default function EditBook({zones, floors, floor_id, genres, initialData, page, perPage}:BookshelfProps) {
  const { t } = useTranslations();

  return (
    <BookLayout title={t("ui.floors.create")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.floors.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.floors.info")}</p>
          </CardHeader>


          <BookForm genres={genres} zones={zones} floors={floors} floor_id={floor_id} initialData={initialData} page={page} perPage={perPage} />
        </div>
      </div>

    </BookLayout>
  );
}
