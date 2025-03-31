import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";
import { Grid, Save, X, List, Layers } from "lucide-react";

interface ZoneProps {
    initialData?: {
        id: string;
        name: number;
        category: string;
        n_bookshelves: number;
        floor_id: string;
    };
    genres: { id: string; name: string }[];
    floors: { id: string; name: string }[];
    page?: string;
    perPage?: string;
}

function FieldInfo({ field }: { field: any }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
            ) : null}
        </>
    );
}

export default function ZoneForm({ initialData, genres, floors, page, perPage }: ZoneProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            n_bookshelves: initialData?.n_bookshelves ?? "",
            floor_id: initialData?.floor_id ?? "",
        },
        onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["zones"] });
                    let url = "/zones";
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) {
                            url += `&per_page=${perPage}`;
                        }
                    }
                    router.visit(url);
                },
                onError: () => {
                    toast.error(t("messages.bookshelves.error"));
                },
            };

            if (initialData) {
                router.put(`/zones/${initialData.id}`, value, options);
            } else {
                router.post("/zones", value, options);
            }
        },
    });

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4" noValidate>
            <div className='pl-4 pr-4'>
                <form.Field
                    name="name"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            const numValue = Number(value);
                            return isNaN(numValue) || numValue < 1
                                ? t("ui.validation.required", { attribute: t("ui.bookshelves.fields.name").toLowerCase() })
                                : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center ">
                                <List size={16} className='mr-2 text-gray-500 '/>
                                <Label htmlFor={field.name}>{t("ui.bookshelves.fields.name")}</Label>
                            </div>
                            <Input
                                id={field.name}
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.bookshelves.placeholders.name")}
                                disabled={form.state.isSubmitting}
                                autoComplete="off"
                                required={false}
                                min={1}
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>


            <div className='pl-4 pr-4'>
                <form.Field
                    name="category"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            return !value
                                ? t("ui.validation.required", { attribute: t("ui.bookshelves.fields.category").toLowerCase() })
                                : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Layers size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.bookshelves.fields.category")}</Label>
                            </div>
                            <Select value={field.state.value} onValueChange={field.handleChange}>
                                <SelectTrigger className="w-full max-w-[770px] bg-muted">
                                    <SelectValue placeholder={t("ui.bookshelves.placeholders.category")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {genres.map((genre) => (
                                            <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            <div className='pl-4 pr-4'>
                <form.Field
                    name="n_bookshelves"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            const numValue = Number(value);
                            return isNaN(numValue) || numValue < 1
                                ? t("ui.validation.required", { attribute: t("ui.bookshelves.fields.n_bookshelves").toLowerCase() })
                                : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Grid size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.bookshelves.fields.n_bookshelves")}</Label>
                            </div>
                            <Input
                                id={field.name}
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.bookshelves.placeholders.n_bookshelves")}
                                disabled={form.state.isSubmitting}
                                autoComplete="off"
                                required
                                min={1}
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>


            <div className='pl-4 pr-4'>
                <form.Field
                    name="floor_id"
                    validators={{
                        onChange: ({ value }) => value ? undefined : t("ui.validation.required", { attribute: t("ui.bookshelves.fields.floor").toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Layers size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.bookshelves.fields.floor")}</Label>
                            </div>
                            <Select value={field.state.value} onValueChange={field.handleChange}>
                                <SelectTrigger className="w-full max-w-[770px] bg-muted">
                                    <SelectValue placeholder={t("ui.bookshelves.placeholders.floor")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {floors.map((floor) => (
                                            <SelectItem key={floor.id} value={floor.id}>{floor.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>


            <div className="flex justify-between gap-4 bg-muted h-20 p-5 rounded-b-lg">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = "/zones";
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
                    {t("ui.users.buttons.cancel")}
                </Button>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit} className='bg-blue-500 text-white'>
                            <Save />
                            {isSubmitting
                                ? t("ui.users.buttons.saving")
                                : initialData
                                    ? t("ui.users.buttons.update")
                                    : t("ui.users.buttons.save")}
                                    
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
