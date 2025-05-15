import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { router } from '@inertiajs/react';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { format, isSunday } from 'date-fns';
import { Book, CalendarIcon, Mail, Save, X } from 'lucide-react';
import * as React from 'react';
import 'react-day-picker/style.css';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { enUS, es } from 'date-fns/locale';

interface LoanProps {
    initialData?: {
        id: string;
        loan_id: string;
        email: string;
        date: Date;
    };
    page?: string;
    perPage?: string;
    lang: string;
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-destructive text-xs mt-1">{field.state.meta.errors.join(', ')}</p>
            ) : null}
            {field.state.meta.isValidating ? <p className="text-muted-foreground text-xs mt-1">Validando...</p> : null}
        </>
    );
}

export default function LoanForm({ initialData, page, perPage, lang }: LoanProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const [date, setDate] = React.useState(initialData?.date || undefined);

    const form = useForm({
        defaultValues: {
            id: initialData?.id ?? new URLSearchParams(window.location.search).get('book_id') ?? '',
            email: initialData?.email ?? '',
            borrow: 'false',
            date: initialData?.date ?? '',
        },
        onSubmit: async ({ value }) => {
            const data = { ...value, date: date };
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['loans'] });
                    let url = '/loans';
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) url += `&per_page=${perPage}`;
                    }
                },
                onError: (errors: Record<string, string>) => {
                    if (Object.keys(errors).length === 0) {
                        toast.error(initialData ? t('messages.users.error.update') : t('messages.users.error.create'));
                    }
                },
            };

            if (initialData) {
                router.put(`/loans/${initialData.loan_id}`, data, options);
            } else {
                router.post('/loans', data, options);
            }
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const langMap = { en: enUS, es: es };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 px-4 sm:px-6 md:px-8 lg:px-10" noValidate>
            <div className="grid gap-4 pt-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                <div className="col-span-1">
                    <form.Field
                        name="id"
                        validators={{
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) => setTimeout(resolve, 500));
                                if (!value?.toString().trim()) {
                                    return t('ui.validation.required', {
                                        attribute: t('ui.books.fields.book').toLowerCase(),
                                    });
                                }
                                return undefined;
                            },
                        }}
                    >
                        {(field) => (
                            <>
                                <div className="mb-1 flex items-center gap-1">
                                    <Book size={14} className="text-gray-500" />
                                    <Label htmlFor={field.name} className="text-sm">
                                        {t('ui.loans.fields.book')}
                                    </Label>
                                </div>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    placeholder={t('ui.loans.placeholders.book')}
                                    disabled
                                    autoComplete="off"
                                    className="w-full text-sm py-2"
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    </form.Field>
                </div>

                <div className="col-span-1">
                    <form.Field
                        name="email"
                        validators={{
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) => setTimeout(resolve, 500));
                                return !value
                                    ? t('ui.validation.required', { attribute: t('ui.users.fields.email').toLowerCase() })
                                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                                      ? t('ui.validation.email', { attribute: t('ui.users.fields.email').toLowerCase() })
                                      : undefined;
                            },
                        }}
                    >
                        {(field) => (
                            <>
                                <div className="mb-1 flex items-center gap-1">
                                    <Mail size={14} className="text-gray-500" />
                                    <Label htmlFor={field.name} className="text-sm">
                                        {t('ui.users.fields.email')}
                                    </Label>
                                </div>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    placeholder={t('ui.users.placeholders.email')}
                                    disabled={form.state.isSubmitting}
                                    autoComplete="off"
                                    className="w-full text-sm py-2"
                                />
                                <FieldInfo field={field} />
                            </>
                        )}
                    </form.Field>
                </div>

                <div className="col-span-1">
                    <form.Field
                        name="date"
                        validators={{
                            onChangeAsync: async ({ value }) => {
                                await new Promise((resolve) => setTimeout(resolve, 300));
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const selectedDate = new Date(value);
                                selectedDate.setHours(0, 0, 0, 0);

                                if (selectedDate < today) {
                                    return t('ui.validation.after_or_equal', {
                                        attribute: t('ui.loans.fields.date').toLowerCase(),
                                        date: t('ui.validation.today'),
                                    });
                                }
                                const nextYear = new Date();
                                nextYear.setFullYear(today.getFullYear() + 1);
                                if (selectedDate > nextYear) {
                                    return t('ui.validation.before_or_equal', {
                                        attribute: t('ui.loans.fields.date').toLowerCase(),
                                        date: nextYear.toISOString().split('T')[0],
                                    });
                                }
                                return undefined;
                            },
                        }}
                    >
                        {(field) => (
                            <>
                                <div className="mb-1 flex items-center gap-1">
                                    <Label htmlFor={field.name} className="text-sm">
                                        {t('ui.loans.fields.date')}
                                    </Label>
                                </div>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn('w-full justify-start text-left font-normal sm:w-[240px]', !date && 'text-muted-foreground')}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, 'PPP') : <span>{t('ui.info.select')}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            timeZone="Europe/Madrid"
                                            disabled={[{ before: new Date() }, new Date(), isSunday]}
                                            mode="single"
                                            locale={langMap[lang]}
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FieldInfo field={field} />
                            </>
                        )}
                    </form.Field>
                </div>
            </div>

            <div className="border-muted flex items-center justify-end gap-4 border-t p-4 sm:flex-row">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = '/loans';
                        if (page) {
                            url += `?page=${page}`;
                            if (perPage) url += `&per_page=${perPage}`;
                        }
                        router.visit(url);
                    }}
                    disabled={form.state.isSubmitting}
                    className="flex w-full items-center justify-center sm:w-auto text-sm"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t('ui.users.buttons.cancel')}
                </Button>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="flex w-full items-center justify-center bg-blue-500 text-white hover:bg-blue-600 sm:w-auto text-sm"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? t('ui.users.buttons.saving') : initialData ? t('ui.users.buttons.update') : t('ui.users.buttons.save')}
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
