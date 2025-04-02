import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";
import { Grid, Save, X, List, Layers, MapPin } from "lucide-react";
import { useState } from "react";

interface ZoneProps {
    initialData?: {
        id: string;
        name: number;
        category: string;
        n_bookshelves: number;
        floor_id: string;
    };
    genres: { id: string; name: string }[];
    floors: { id: string; name: string, n_zones:number, zones_count:number, zones:{category:string, floor_id:string, id:string}[] }[];
    zones: number[];
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

export default function ZoneForm({ initialData, genres, floors, zones, page, perPage }: ZoneProps) {
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
                    toast.error(t("ui.messages.zones.error"));
                },
            };

            if (initialData) {
                router.put(`/zones/${initialData.id}`, value, options);
            } else {
                router.post("/zones", value, options);
            }
        },
    });

    
    if(initialData){
        floors.forEach(floor => {
            floor.zones_count==floor.zones_count--;
        });
        
    }
    
    console.log(floors);

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4" noValidate>
            <div className='pl-4 pr-4'>
                <form.Field
                     name="name"
                     validators={{
                         onChangeAsync: async ({ value }) => {
                             await new Promise((resolve) => setTimeout(resolve, 500));
                     
                             if (value === null || value === undefined || value.toString().trim() === "") {
                                 return t("ui.validation.required", { attribute: t("ui.zones.fields.name").toLowerCase() });
                             }
                     
                             const numValue = Number(value);
                     
                             if (isNaN(numValue)) {
                                 return t("ui.validation.required", { attribute: t("ui.zones.fields.name").toLowerCase() });
                             }
                     
                             if (numValue < 1) {
                                 return t("ui.validation.min.numeric", { attribute: t("ui.zones.fields.name").toLowerCase(), min: "1" });
                             }
                     
                     
                             return undefined;
                         },
                     }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center ">
                                <List size={16} className='mr-2 text-gray-500 '/>
                                <Label htmlFor={field.name}>{t("ui.zones.fields.name")}</Label>
                            </div>
                            <Input
                                id={field.name}
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.zones.placeholders.name")}
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
                                ? t("ui.validation.required", { attribute: t("ui.zones.fields.category").toLowerCase() })
                                : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Layers size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.zones.fields.category")}</Label>
                            </div>
                            <Select 
                                value={field.state.value} 
                                onValueChange={(value) => {
                                    field.handleChange(value); 
                                }}
                            >
                                <SelectTrigger className="w-full max-w-[770px] bg-muted">
                                    <SelectValue placeholder={t("ui.zones.placeholders.category")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {genres.map((genre) => (
                                            <SelectItem
                                                key={genre.id}
                                                value={genre.name}
                                            >
                                                {genre.name}
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
            
            <div className='pl-4 pr-4'>
                <form.Field
                    name="n_bookshelves"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            if (value === null || value === undefined || value.toString().trim() === "") {
                                return t("ui.validation.required", { attribute: t("ui.zones.fields.name").toLowerCase() });
                            }
                    
                            const numValue = Number(value);
                    
                            if (isNaN(numValue)) {
                                return t("ui.validation.required", { attribute: t("ui.zones.fields.bookshelves").toLowerCase() });
                            }
                    
                            if (numValue < 1) {
                                return t("ui.validation.min.numeric", { attribute: t("ui.zones.fields.bookshelves").toLowerCase(), min: "1" });
                            }
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Grid size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.zones.fields.bookshelves")}</Label>
                            </div>
                            <Input
                                id={field.name}
                                type="number"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.zones.placeholders.bookshelves")}
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
                        onChange: ({ value }) => value ? undefined : t("ui.validation.required", { attribute: t("ui.zones.fields.floor").toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                              <div className="flex m-1 align-center">
                                <MapPin size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.zones.fields.floor")}</Label>
                            </div>
                            <Select value={field.state.value} onValueChange={(value) => {field.handleChange(value); }}
>
                                <SelectTrigger className="w-full max-w-[770px] bg-muted">
                                    <SelectValue placeholder={t("ui.zones.placeholders.floor")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {floors.map((floor) => (

                                            <SelectItem 
                                                key={floor.id} 
                                                value={floor.id} 
                                                disabled={floor.n_zones == floor.zones_count}  
                                            >
                                                {t("ui.floors.floor")} {floor.name}
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
                    {t("ui.zones.buttons.cancel")}
                </Button>

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                >
                    {([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit} className='bg-blue-500 text-white'>
                            <Save />
                            {isSubmitting
                                ? t("ui.zones.buttons.saving")
                                : initialData
                                    ? t("ui.zones.buttons.update")
                                    : t("ui.zones.buttons.save")}
                                    
                        </Button>
                    )}
                </form.Subscribe>
            </div>
        </form>
    );
}
