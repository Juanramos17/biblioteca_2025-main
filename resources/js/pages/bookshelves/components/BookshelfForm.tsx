import { FloorLayout } from "@/layouts/floors/FloorLayout";
import { Eye, EyeOff, User, Mail, Lock, X, Save, PackageOpen, FileText, Settings, Grid, MapPin, Building2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { floor } from "lodash";
import { useState } from "react";

interface BookshelfProps {
    initialData?: {
        id: string;
        enumeration: number;
        category: string;
        n_books: number;
        zone_id: string;
    };
    floor_id?: string;
    floors: { id: string; name: string, n_zones:number, zones_count:number, zones:{category:string, floor_id:string, id:string, name:number}[] }[];  
    zones: { id: string; name: string, n_bookshelves:number,floor:{id:string, name:number}, bookshelves_count:number, category:string, bookshelves:{category:string, zone_id:string, id:string}[] }[];
    page?: string;
    perPage?: string;  
}



// Field error display component
function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <p className="mt-1 text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                </p>
            ) : null}
            {field.state.meta.isValidating ? (
                <p className="mt-1 text-sm text-muted-foreground">Validating...</p>
            ) : null}
        </>
    );
}

export default function FloorForm({ zones, floors,floor_id, initialData, page, perPage }: BookshelfProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const form = useForm({
            defaultValues: {
                enumeration: initialData?.enumeration ?? "",
                category: initialData?.category ?? "",
                n_books: initialData?.n_books ?? "",
                zone_id: initialData?.zone_id ?? "",
                floor_id: floor_id ?? "",
                
                 
            },
            onSubmit: async ({ value }) => {
                
               
                const data = {
                    ...value,
                    category: zones.find((zone) => zone.id === value.zone_id)?.category || '', 
                };
                const options = {

                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["bookshelves"] });
                        
                        // Construct URL with page parameters
                        let url = "/bookshelves";
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

    
                // Submit with Inertia
                if (initialData) {
                    router.put(`/bookshelves/${initialData.id}`, data, options);
                } else {
                    router.post("/bookshelves", data, options);
                }
            },
        });
        
    
        // Form submission handler
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
        };

        const [selectedFloor, setSelectedFloor] = useState<string>(floor_id??"");
        

        console.log(floors);
    
    return (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className='pl-4 pr-4'>
                <form.Field
                    name="enumeration"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                    
                            if (value === null || value === undefined || value.toString().trim() === "") {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.name").toLowerCase() });
                            }
                    
                            const numValue = Number(value);
                    
                            if (isNaN(numValue)) {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.name").toLowerCase() });
                            }
                    
                            if (numValue < 1) {
                                return t("ui.validation.min.numeric", { attribute: t("ui.floors.fields.name").toLowerCase(), min: "1" });
                            }

                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                        <div className="flex m-1 align-center ">
                            <Building2 size={16} className='mr-2 text-gray-500 '/><Label htmlFor={field.name}>{t("ui.floors.fields.name")}</Label>
                        </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.floors.placeholders.name")}
                                disabled={form.state.isSubmitting}
                                required={false}
                                autoComplete="off"
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
                                <Select value={field.state.value} onValueChange={(value) => {field.handleChange(value);setSelectedFloor(value);}}
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

            <div className='pl-4 pr-4'>
                <form.Field
                    name="zone_id"
                    validators={{
                        onChange: ({ value }) => value ? undefined : t("ui.validation.required", { attribute: t("ui.zones.fields.name").toLowerCase() }),
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <MapPin size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.zones.fields.name")}</Label>
                            </div>
                            <Select 
                                value={field.state.value} 
                                defaultValue={initialData?.zone_id}
                                onValueChange={(value) => field.handleChange(value)}
                                disabled={selectedFloor==""} 
                            >
                                <SelectTrigger className="w-full max-w-[770px] bg-muted">
                                    <SelectValue placeholder={t("ui.zones.placeholders.name")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {zones
                                            .filter(zone => zone.floor.id === selectedFloor) 
                                            .map((zone) => (
                                                <SelectItem 
                                                    key={zone.id} 
                                                    value={zone.id} 
                                                    disabled={zone.n_bookshelves <= zone.bookshelves_count}  
                                                >
                                                    {t("ui.zones.zone")} {zone.category}
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
                    name="n_books"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            if (value === null || value === undefined || value.toString().trim() === "") {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.name").toLowerCase() });
                            }
                    
                            const numValue = Number(value);
                    
                            if (isNaN(numValue)) {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.name").toLowerCase() });
                            }
                    
                            if (numValue < 1) {
                                return t("ui.validation.min.numeric", { attribute: t("ui.floors.fields.name").toLowerCase(), min: "1" });
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
            <div className="flex justify-between gap-4 bg-muted h-20 p-5 rounded-b-lg">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = "/bookshelves";
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
    )
}

