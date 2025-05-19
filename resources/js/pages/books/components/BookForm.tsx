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
import { set } from 'lodash';
import { Barcode, BookOpen, Factory, FileText, ImageIcon, MapPin, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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
        bookshelves: { category: string; zone_id: string; id: string; enumeration: number }[];
    }[];
    page?: string;
    perPage?: string;
    image: File;
    image_path: string;
    books: {
        ISBN: string;
        author: string;
        title: string;
        genre: string;
        publisher: string;
        path: string;
    };
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

export default function BookForm({ zones, floors, floor_id, genres, zone_id, initialData, page, perPage, image, image_path, books }: BookProps) {
    const { t } = useTranslations();
    const [selectedImage, setSelectedImage] = useState(image ?? '');
    const queryClient = useQueryClient();
    const [image2, setValueImg2] = useState<string>();
    const [selectedGenres, setSelectedGenres] = useState<string[]>(initialData?.genre ? initialData.genre.split(',').map((g) => g.trim()) : []);

    const [ISBNSelected, setISBNSelected] = useState<boolean>(false);

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
            image: '',
        },

        onSubmit: async ({ value }) => {
            const formData = new FormData();
            formData.append('title', value.title);
            formData.append('genre', selectedGenres.join(', '));
            formData.append('publisher', value.publisher);
            formData.append('author', value.author);
            formData.append('ISBN', value.ISBN);
            formData.append('bookshelf_id', value.bookshelf_id);
            formData.append('floor_id', value.floor_id);
            formData.append('zone_id', value.zone_id);
            formData.append('image', selectedImage);
            formData.append('_method', 'PUT');

            value.genre = selectedGenres.join(', ');

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
                router.post(`/books/${initialData.id}`, formData, options);
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

    const [selectedFloor, setSelectedFloor] = useState<string>(floor_id ?? '');
    useEffect(() => {
        if (floor_id) {
            setSelectedFloor(floor_id);
        }
    }, [floor_id]);

    const [selectedZone, setSelectedZone] = useState<string>(zone_id ?? '');

    useEffect(() => {
        if (zone_id) {
            setSelectedZone(zone_id);
        }
    }, [zone_id]);
    
    function handleISBN(ISBN: string) {
        if (ISBN.length == 13) {
            const confirmAction = window.confirm('¿Deseás rellenar el formulario con los datos del libro con mismo ISBN?');

            if (!confirmAction) return;

            books.map((book) => {
                if (book.ISBN == ISBN) {
                    form.setFieldValue('title', book.title);
                    setSelectedGenres(book.genre.split(', ').map((g) => g.trim()));
                    console.log(selectedGenres);
                    form.setFieldValue('publisher', book.publisher);
                    form.setFieldValue('author', book.author);
                    setValueImg2(book.path);
                    setISBNSelected(true);
                }
            });
        }
    }

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
                                disabled={form.state.isSubmitting || ISBNSelected}
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
                                onValueChange={setSelectedGenres}
                                value={selectedGenres}
                                placeholder={t('ui.books.placeholders.genres')}
                                variant="inverted"
                                animation={2}
                                maxCount={5}
                                disabled={form.state.isSubmitting || ISBNSelected}
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
                                <Label htmlFor={field.name}>{t('ui.books.fields.floor')}</Label>
                            </div>
                            <Select
                                value={selectedFloor}
                                onValueChange={(value) => {
                                    field.handleChange(value);
                                    setSelectedFloor(value);
                                }}
                            >
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.books.placeholders.floor')} />
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
                            value ? undefined : t('ui.validation.required', { attribute: t('ui.books.fields.zone').toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <MapPin size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.zone')}</Label>
                            </div>
                            <Select
                                value={selectedZone}
                                onValueChange={(value) => {
                                    field.handleChange(value);
                                    setSelectedZone(value);
                                }}
                                disabled={selectedFloor == ''}
                            >
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.books.placeholders.zone')} />
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
                            value ? undefined : t('ui.validation.required', { attribute: t('ui.books.fields.bookshelf').toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <BookOpen size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.bookshelf')}</Label>
                            </div>
                            <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)} disabled={selectedZone == ''}>
                                <SelectTrigger className="bg-muted w-full max-w-[770px]">
                                    <SelectValue placeholder={t('ui.books.placeholders.bookshelf')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {zones
                                            .find((zone) => zone.id === selectedZone)
                                            ?.bookshelves.map((bookshelf) => (
                                                <SelectItem key={bookshelf.id} value={bookshelf.id}>
                                                    {t('ui.bookshelves.bookshelf')} {bookshelf.enumeration}
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
                                disabled={form.state.isSubmitting || ISBNSelected}
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
                            value && value.trim() !== ''
                                ? undefined
                                : t('ui.validation.required', {
                                      attribute: t('ui.books.fields.publisher').toLowerCase(),
                                  }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <Factory size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.publisher')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.books.placeholders.publisher')}
                                disabled={form.state.isSubmitting || ISBNSelected}
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
                    name="ISBN"
                    validators={{
                        onChange: ({ value }) => {
                            const trimmed = value?.trim();

                            if (!trimmed) {
                                return t('ui.validation.required', {
                                    attribute: t('ui.books.fields.ISBN').toLowerCase(),
                                });
                            }

                            if (!/^\d+$/.test(trimmed)) {
                                return t('ui.validation.numeric', {
                                    attribute: t('ui.books.fields.ISBN').toLowerCase(),
                                });
                            }

                            if (trimmed.length !== 13) {
                                return t('ui.validation.length', {
                                    attribute: t('ui.books.fields.ISBN').toLowerCase(),
                                    length: '10 o 13',
                                });
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <Barcode size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.ISBN')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.value), handleISBN(e.target.value);
                                }}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.books.placeholders.ISBN')}
                                disabled={form.state.isSubmitting || ISBNSelected}
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
                    name="image"
                    validators={{
                        onChange: ({ value }) => {
                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="align-center m-1 flex">
                                <ImageIcon size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t('ui.books.fields.img_path')}</Label>
                            </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="file"
                                // value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.files[0]);
                                    console.log(e.target.files[0]);
                                    setSelectedImage(e.target.files[0]);
                                }}
                                onBlur={field.handleBlur}
                                placeholder={t('ui.books.placeholders.img_path')}
                                disabled={form.state.isSubmitting}
                                required={true}
                                autoComplete="off"
                                accept="image/*"
                            />

                            {selectedImage && (
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Preview"
                                    style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                                />
                            )}

                            {initialData && !selectedImage && (
                                <span>
                                    <img src={image_path} alt="Preview" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />
                                </span>
                            )}

                            {image2 && (
                                <span>
                                    <img src={image2} alt="Preview" style={{ width: '200px', height: 'auto', marginTop: '10px' }} />
                                </span>
                            )}
                        </>
                    )}
                </form.Field>
            </div>

            <div className="flex  sm:flex-row justify-between gap-4 bg-muted h-20 p-5 rounded-b-lg w-full">
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
