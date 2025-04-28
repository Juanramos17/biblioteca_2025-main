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

// Field error display component
function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="text-destructive mt-1 text-sm">{field.state.meta.errors.join(', ')}</p>
            ) : null}
            {field.state.meta.isValidating ? <p className="text-muted-foreground mt-1 text-sm">Validating...</p> : null}
        </>
    );
}

export default function LoanForm({ initialData, page, perPage, lang }: LoanProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const [date, setDate] = React.useState(initialData?.date || undefined);

    const form = useForm({
        defaultValues: {
            id: initialData?.id ?? params.get('book_id') ?? '',
            email: initialData?.email ?? '',
            borrow: 'false',
            date: initialData?.date ?? '',
        },
        onSubmit: async ({ value }) => {
            const data = {
                ...value,
                date: date,
            };
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['loans'] });

                    // Construct URL with page parameters
                    let url = '/loans';
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) {
                            url += `&per_page=${perPage}`;
                        }
                    }

                    // router.visit(url);
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

    // Form submission handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const langMap = {
        en:enUS, 
        es:es
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="pr-4 pl-4">
                <form.Field
                    name="id"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                    
                            if (value === null || value === undefined || value.toString().trim() === '') {
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
                            <div className="align-center m-1 flex">
                                <Book size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.loans.fields.book')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.loans.placeholders.book')}
                                disabled={true}
                                required={false}
                                autoComplete="off"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
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
                            <div className="align-center m-1 flex">
                                <Mail size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.users.fields.email')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.users.placeholders.email')}
                                disabled={form.state.isSubmitting}
                                required={false}
                                autoComplete="off"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
                <form.Field name="date"  validators={{
                    onChangeAsync: async ({ value }) => {
                    await new Promise((resolve) => setTimeout(resolve, 300));

                    const attribute = t('ui.loans.fields.date').toLowerCase();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0); 


                    const selectedDate = new Date(value);
                    selectedDate.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        return t('ui.validation.after_or_equal', { attribute, date: t('ui.validation.today') || 'hoy' });
                    }

                    const nextYear = new Date();
                    nextYear.setFullYear(today.getFullYear() + 1);

                    if (selectedDate > nextYear) {
                        return t('ui.validation.before_or_equal', {
                        attribute,
                        date: nextYear.toISOString().split('T')[0],
                        });
                    }

                    return undefined;
                    },
                }}>
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <Label htmlFor={field.name}>{t('ui.loans.fields.date')}</Label>
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, 'PPP') : <span>{t('ui.info.select')}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar 
                                    timeZone='Europe/Madrid'
                                    disabled={[{ before: new Date()}, new Date(), isSunday]}
                                    mode="single" 
                                    locale={langMap[lang]}
                                    selected={date} 
                                    onSelect={setDate} 
                                    initialFocus />
                                </PopoverContent>
                            </Popover>

                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>
            <div className="bg-muted flex h-20 justify-between gap-4 rounded-b-lg p-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = '/loans';
                        if (page) {
                            url += `?page=${page}`;
                            if (perPage) {
                                url += `&per_page=${perPage}`;
                            }
                        }
                        router.visit(url);
                    }}
                    disabled={form.state.isSubmitting}
                >
                    <X />
                    {t('ui.users.buttons.cancel')}
                </Button>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit} className="bg-blue-500 text-white">
                            <Save />
                            {isSubmitting ? t('ui.users.buttons.saving') : initialData ? t('ui.users.buttons.update') : t('ui.users.buttons.save')}
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
