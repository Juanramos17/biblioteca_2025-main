import { Bookmark, Building2, Calendar, Handshake, Receipt, Repeat, User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardDescription, CardHeader } from "@/components/ui/card";
import ReservationForm from "./components/ReservationForm";
import { ReservationLayout } from "@/layouts/reservations/ReservationLayout";

export default function CreateReservation() {
  const { t } = useTranslations();
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);

  return (
    <ReservationLayout title={t("ui.reservations.create")}>
      <div className="flex w-full flex-col items-center px-4">
        <div className="bg-muted/50 flex w-full max-w-3xl flex-col rounded-lg shadow-md">
          <CardHeader className="bg-muted flex w-full flex-col items-start space-y-2 rounded-t-lg p-6">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-500" />
              <h2 className="text-2xl font-bold">{t('ui.reservations.create')}</h2>
            </div>
            <p className="text-sm text-gray-500">{t('ui.reservations.info')}</p>
            <div className="space-y-1 text-sm text-gray-600">
              <CardDescription>
                {t('ui.loans.columns.book')}: {params.get('book_title')}
              </CardDescription>
              <CardDescription>
                {t('ui.loans.columns.author')}: {params.get('book_author')}
              </CardDescription>
              <CardDescription>
                {t('ui.loans.columns.ISBN')}: {params.get('book_ISBN')}
              </CardDescription>
            </div>
          </CardHeader>

          <div className="pr-4 pl-4 w-full">
            <ReservationForm />
          </div>
        </div>
      </div>
    </ReservationLayout>
  );
}
