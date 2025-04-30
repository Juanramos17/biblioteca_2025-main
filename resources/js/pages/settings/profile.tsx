import { PageProps, type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useTranslations } from '@/hooks/use-translations';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Timeline } from 'primereact/timeline';
import { CheckCircle, Clock, Hourglass } from 'lucide-react';
import { format } from 'date-fns';


export default function Profile() {
    const { t } = useTranslations();
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('ui.settings.profile.title'),
            href: '/settings/profile',
        },
    ];

   
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('ui.settings.profile.title')} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title={t('Estadísticas del usuario')}
                        description={t('')}
                    />
                    
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
