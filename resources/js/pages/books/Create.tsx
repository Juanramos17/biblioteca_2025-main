import { Building2 } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";
import BookForm from "./components/BookForm";
import { PageProps } from "@/types";
import { BookshelfLayout } from "@/layouts/bookshelves/Bookshelf";
import { BookLayout } from "@/layouts/books/BookLayout";

interface BookProps extends PageProps {
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
    bookshelves: { category: string; zone_id: string; id: string; enumeration: number }[];
  }[];
  page?: string;
  perPage?: string;
}

export default function CreateBookshelf({ zones, floors, genres }: BookProps) {
  const { t } = useTranslations();

  return (
    <BookLayout title={t("ui.books.create")}>
      <div className="flex flex-col items-center w-full px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[900px] bg-muted/50 rounded-lg shadow-md">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Building2 size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">{t("ui.books.create")}</h2>
            </div>
            <p className="text-gray-500 text-sm mb-3">{t("ui.books.info")}</p>
          </CardHeader>

          <div className="p-4">
            <BookForm zones={zones} floors={floors} genres={genres} />
          </div>
        </div>
      </div>
    </BookLayout>
  );
}
