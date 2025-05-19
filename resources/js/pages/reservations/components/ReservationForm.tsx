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
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { enUS, es } from 'date-fns/locale';
import { Check, ChevronsUpDown } from 'lucide-react';

interface ReservationProps {
    initialData?: {
        id: string;
        reservation_id: string;
        email: string;
        date: Date;
    };
    page?: string;
    perPage?: string;
    emails: {
        email: string;
    }[];
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

export default function ReservationForm({ initialData, page, perPage, emails }: ReservationProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const [selected, setSelected] = useState(initialData?.date || undefined);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState('');

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
                    queryClient.invalidateQueries({ queryKey: ['reservations'] });

                    // Construct URL with page parameters
                    let url = '/reservations';
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
                router.put(`/reservations/${initialData.reservation_id}`, data, options);
            } else {
                router.post('/reservations', data, options);
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
            <div className="px-4 sm:px-6 md:px-8">
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
                            <div className="flex items-center mb-2">
                                <Book size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name} className="text-sm">{t('ui.loans.fields.book')}</Label>
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
                                className="w-full"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="px-4 sm:px-6 md:px-8">
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
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" role="combobox" aria-expanded={open} className="w-auto justify-between">
                                            {value ? emails.find((email) => email.email === value)?.email : 'Select framework...'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search framework..." className="h-9 w-auto" />
                                            <CommandList>
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                    {emails.map((email) => (
                                                        <CommandItem
                                                            key={email.email}
                                                            value={email.email}
                                                            onSelect={(currentValue) => {
                                                                setValue(currentValue === value ? '' : currentValue);
                                                                setOpen(false);
                                                                field.handleChange(currentValue);
                                                            }}
                                                        >
                                                            {email.email}
                                                            <Check
                                                                className={cn('ml-auto', value === email.email ? 'opacity-100' : 'opacity-0')}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FieldInfo field={field} />
                            </>
                    )}
                </form.Field>
            </div>

            <div className="border-muted flex items-center justify-end gap-4 border-t p-4 sm:flex-row ">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = '/reservations';
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
