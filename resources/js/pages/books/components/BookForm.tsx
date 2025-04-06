import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { router } from '@inertiajs/react';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { Barcode, BookOpen, Factory, FileText, MapPin, Save, User, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BookProps {
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
        bookshelves: { category: string; zone_id: string; id: string }[];
    }[];
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

export default function FloorForm({ zones, floors, floor_id, genres, zone_id, initialData, page, perPage }: BookProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    console.log(initialData);
    console.log(floor_id);
    const form = useForm({
        defaultValues: {
            title: initialData?.title ?? '',
            genre: initialData?.genre ?? '',
            publisher: initialData?.publisher ?? '',
            author: initialData?.author ?? '',
            ISBN: initialData?.ISBN ?? '',
            bookshelf_id: initialData?.bookshelf_id ?? '',
            floor_id: floor_id ?? '',
            zone_id: zone_id ?? '',
        },
        onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['books'] });
                    // Construct URL with page parameters
                    let url = '/books';
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) {
                            url += `&per_page=${perPage}`;
                        }
                    }

                    router.visit(url);
                },
                onError: () => {
                    toast.error(t('ui.messages.zones.error'));
                },
            };

            // Submit with Inertia
            if (initialData) {
                router.put(`/books/${initialData.id}`, value, options);
            } else {
                router.post('/books', value, options);
            }
        },
    });

    // Form submission handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const [selectedGenres, setSelectedGenres] = useState<string[]>(
        initialData?.genre ? initialData.genre.split(',') : []
      );

    const [selectedFloor, setSelectedFloor] = useState<string>(floor_id ?? '');
    const [selectedZone, setSelectedZone] = useState<string>(zone_id ?? '');

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="pr-4 pl-4">
                <form.Field
                    name="title"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));

                            if (value === null || value === undefined || value.toString().trim() === '') {
                                return t('ui.validation.required', { attribute: t('ui.books.fields.title').toLowerCase() });
                            }

                            if (value.length < 3) {
                                return t('ui.validation.min.string', { attribute: t('ui.books.fields.title').toLowerCase(), min: '3' });
                            }

                            if (value.length > 255) {
                                return t('ui.validation.max.string', { attribute: t('ui.books.fields.title').toLowerCase(), max: '255' });
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <FileText size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.title')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.books.placeholders.title')}
                                disabled={form.state.isSubmitting}
                                required
                                autoComplete="off"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>
            <div className="pr-4 pl-4">
                <form.Field
                    name="genre"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));

                            if (!value || value.length === 0) {
                                return t('ui.validation.required', {
                                    attribute: t('ui.books.fields.genres').toLowerCase(),
                                });
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <Label htmlFor={field.name}>{t('ui.books.fields.genres')}</Label>
                            </div>
                            <MultiSelect
                                options={genres.map((genre) => ({
                                    value: genre.name,
                                    label: genre.name,
                                }))}
                                value={selectedGenres}
                                onValueChange={(selected: string[]) => {
                                    setSelectedGenres(selected);
                                    field.handleChange(selected.join(','));
                                }}
                                placeholder={t('ui.books.placeholders.selectGenres')}
                                variant="inverted"
                                maxCount={5}
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
                <form.Field
                    name="floor_id"
                    validators={{
                        onChange: ({ value }) =>
                            value ? undefined : t('ui.validation.required', { attribute: t('ui.zones.fields.floor').toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <MapPin size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.zones.fields.floor')}</Label>
                            </div>
                            <Select
                                value={field.state.value}
                                onValueChange={(value) => {
                                    field.handleChange(value);
                                    setSelectedFloor(value);
                                }}
                            >
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.zones.placeholders.floor')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {floors.map((floor) => (
                                            <SelectItem key={floor.id} value={floor.id} disabled={floor.n_zones == floor.zones_count}>
                                                {t('ui.floors.floor')} {floor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
                <form.Field
                    name="zone_id"
                    validators={{
                        onChange: ({ value }) =>
                            value ? undefined : t('ui.validation.required', { attribute: t('ui.zones.fields.name').toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <MapPin size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.zones.fields.name')}</Label>
                            </div>
                            <Select
                                value={field.state.value}
                                onValueChange={(value) => {
                                    field.handleChange(value);
                                    setSelectedZone(value);
                                }}
                                disabled={selectedFloor == '' || selectedGenres.length === 0}
                            >
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.zones.placeholders.name')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {zones
                                            .filter((zone) => zone.floor.id === selectedFloor && selectedGenres.includes(zone.category))
                                            .map((zone) => (
                                                <SelectItem key={zone.id} value={zone.id} disabled={zone.n_bookshelves <= zone.bookshelves_count}>
                                                    {t('ui.zones.zone')} {zone.category}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
                <form.Field
                    name="bookshelf_id"
                    validators={{
                        onChange: ({ value }) =>
                            value ? undefined : t('ui.validation.required', { attribute: t('ui.bookshelves.fields.name').toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <BookOpen size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.bookshelves.fields.name')}</Label>
                            </div>
                            <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)} disabled={selectedZone == ''}>
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.bookshelves.placeholders.name')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {zones
                                            .find((zone) => zone.id === selectedZone)
                                            ?.bookshelves.map((bookshelf) => (
                                                <SelectItem key={bookshelf.id} value={bookshelf.id}>
                                                    {t('ui.bookshelves.shelf')} {bookshelf.category}
                                                </SelectItem>
                                            ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
                <form.Field
                    name="author"
                    validators={{
                        onChange: ({ value }) =>
                            value && value.trim() !== ''
                                ? undefined
                                : t('ui.validation.required', {
                                      attribute: t('ui.books.fields.author').toLowerCase(),
                                  }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <User size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.author')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.books.placeholders.author')}
                                disabled={form.state.isSubmitting}
                                autoComplete="off"
                                className="bg-muted w-full max-w-[770px]"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className="pr-4 pl-4">
  <form.Field
    name="publisher"
    validators={{
      onChange: ({ value }) =>
        value && value.trim() !== ""
          ? undefined
          : t("ui.validation.required", {
              attribute: t("ui.books.fields.publisher").toLowerCase(),
            }),
    }}
  >
    {(field) => (
      <>
        <div className="align-center m-1 flex">
          <Factory size={16} className="mr-2 text-gray-500" />
          <Label htmlFor={field.name}>{t("ui.books.fields.publisher")}</Label>
        </div>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={t("ui.books.placeholders.publisher")}
          disabled={form.state.isSubmitting}
          autoComplete="off"
          className="w-full max-w-[770px] bg-muted"
        />
        <FieldInfo field={field} />
      </>
    )}
  </form.Field>
</div>

<div className="pr-4 pl-4">
  <form.Field
    name="ISBN"
    validators={{
      onChange: ({ value }) =>
        value && value.trim() !== ""
          ? undefined
          : t("ui.validation.required", {
              attribute: t("ui.books.fields.ISBN").toLowerCase(),
            }),
    }}
  >
    {(field) => (
      <>
        <div className="align-center m-1 flex">
          <Barcode size={16} className="mr-2 text-gray-500" />
          <Label htmlFor={field.name}>{t("ui.books.fields.ISBN")}</Label>
        </div>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={t("ui.books.placeholders.ISBN")}
          disabled={form.state.isSubmitting}
          autoComplete="off"
          className="w-full max-w-[770px] bg-muted"
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
                        let url = '/books';
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
