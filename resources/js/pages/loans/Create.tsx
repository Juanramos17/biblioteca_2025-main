import { CardDescription, CardHeader } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { LoanLayout } from '@/layouts/loans/LoanLayout';
import { PageProps } from '@/types';
import { Handshake } from 'lucide-react';
import LoanForm from './components/LoanForm';

interface LoanProps extends PageProps {
    lang: string;
}

export default function CreateLoan({ lang }: LoanProps) {
    const { t } = useTranslations();
    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);

    return (
        <LoanLayout title={t('ui.loans.create')}>
            <div className="flex w-full flex-col items-center px-4">
                <div className="bg-muted/50 flex w-full max-w-3xl flex-col rounded-lg shadow-md">
                    <CardHeader className="bg-muted flex w-full flex-col items-start space-y-2 rounded-t-lg p-6">
                        <div className="flex items-center space-x-2">
                            <Handshake size={20} className="text-blue-500" />
                            <h2 className="text-2xl font-bold">{t('ui.loans.create')}</h2>
                        </div>
                        <p className="text-sm text-gray-500">{t('ui.loans.info')}</p>
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
                        {/* Aquí se elimina el grid de columnas y se hace que todo se ajuste en una sola columna */}
                        <LoanForm lang={lang} />
                    </div>
                </div>
            </div>
        </LoanLayout>
    );
}
