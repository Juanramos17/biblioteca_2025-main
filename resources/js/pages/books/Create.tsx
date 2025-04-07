
import { Building2, User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import BookForm from "./components/BookForm";
import { PageProps } from "@/types";
import { BookshelfLayout } from "@/layouts/bookshelves/Bookshelf";

interface BookProps extends PageProps{
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
genres: { id: string; name: string }[];
zone_id?: string;
floors: {
    id: string;
    name: string;
    n_zones: number;
    zones_count: number;
    zones: { category: string; floor_id: string; id: string; name: number }[];
}[];
zones: {
    id: string;
    name: string;
    n_bookshelves: number;
    floor: { id: string; name: number };
    bookshelves_count: number;
    category: string;
    bookshelves: { category: string; zone_id: string; id: string, enumeration: number }[];
}[];
page?: string;
perPage?: string; 
}

export default function CreateBookshelf({zones, floors, genres}:BookProps) {
  const { t } = useTranslations();

  return (
    <BookshelfLayout title={t("ui.books.create")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[800px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.books.create")}</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">{t("ui.books.info")}</p>
          </CardHeader>

          <BookForm zones={zones} floors={floors} genres={genres}/>
        </div>
      </div>

    </BookshelfLayout>
  );
}
