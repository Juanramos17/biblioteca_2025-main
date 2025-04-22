import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import { router } from '@inertiajs/react';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { Book, Building2, Calendar, Mail, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useState } from 'react';

interface LoanProps {
    initialData?: {
        id: string;
        loan_id: string;
        email: string;
        date: Date;
    };
    page?: string;
    perPage?: string;
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

export default function LoanForm({ initialData, page, perPage }: LoanProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const [selected, setSelected] = useState(initialData?.date || undefined);

    const form = useForm({
        defaultValues: {
            id: initialData?.id ?? params.get('book_id') ?? '',
            email: initialData?.email ?? '',
            borrow: "false",
            date: initialData?.date ?? '',
        },
        onSubmit: async ({ value }) => {
            const data = {
                ...value,
                date: selected,

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

    return (

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="pr-4 pl-4">
                <form.Field
                    name="id"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));

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
                <form.Field
                    name="date"
                    validators={{
                       
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <Calendar size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.loans.fields.date')}</Label>
                            </div>
                            <DayPicker
                                timeZone='Europe/Madrid'
                                animate
                                mode="single"
                                selected={selected}
                                onSelect={setSelected}
                                footer={
                                    selected ? ` ${new Date(selected).toISOString().split("T")[0]}` : ""
                                }
                                />
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
