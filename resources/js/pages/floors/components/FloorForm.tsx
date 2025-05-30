import { Eye, EyeOff, User, Mail, Lock, X, Save, PackageOpen, FileText, Settings, Grid, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { floor } from "lodash";

interface FloorProps {
    initialData?: {
        id: string;
        name: number;
        ubication: string;
        n_zones: number;
    };
    floors?: number[];
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
                <p className="mt-1 text-sm text-muted-foreground">Validando...</p>
            ) : null}
        </>
    );
}

export default function FloorForm({ floors, initialData, page, perPage }: FloorProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            name: initialData?.name ?? "",
            ubication: initialData?.ubication ?? "",
            n_zones: initialData?.n_zones ?? "",
        },
        onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["floors"] });
                    let url = "/floors";
                    if (page) {
                        url += `?page=${page}`;
                        if (perPage) {
                            url += `&per_page=${perPage}`;
                        }
                    }
                    router.visit(url);
                },
                onError: (errors: Record<string, string>) => {
                    if (Object.keys(errors).length === 0) {
                        toast.error(
                            initialData
                                ? t("messages.users.error.update")
                                : t("messages.users.error.create")
                        );
                    }
                },
            };

            // Submit with Inertia
            if (initialData) {
                router.put(`/floors/${initialData.id}`, value, options);
            } else {
                router.post("/floors", value, options);
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
            <div className="pl-4 pr-4">
                <form.Field
                    name="name"
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
                            const isUnique = !(floors ?? []).includes(numValue);
                            if (!isUnique) {
                                return t("ui.validation.unique", { attribute: t("ui.floors.fields.name").toLowerCase() });
                            }
                            return undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Building2 size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.floors.fields.name")}</Label>
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

            {/* Zones field */}
            <div className="pl-4 pr-4">
                <form.Field
                    name="n_zones"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            if (value === null || value === undefined || value.toString().trim() === "") {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.zones").toLowerCase() });
                            }
                            const numValue = Number(value);
                            if (isNaN(numValue)) {
                                return t("ui.validation.required", { attribute: t("ui.floors.fields.zones").toLowerCase() });
                            }
                            if (numValue < 1) {
                                return t("ui.validation.min.numeric", { attribute: t("ui.floors.fields.zones").toLowerCase(), min: "1" });
                            }
                        },
                    }}
                >
                    {(field) => (
                        <>
                            <div className="flex m-1 align-center">
                                <Grid size={16} className="mr-2 text-gray-500" />
                                <Label htmlFor={field.name}>{t("ui.floors.fields.zones")}</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type="number"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : "")}
                                    onBlur={field.handleBlur}
                                    placeholder={t("ui.floors.placeholders.zones")}
                                    disabled={form.state.isSubmitting}
                                    autoComplete="off"
                                    required={false}
                                    min={1}
                                />
                            </div>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            {/* Button Group */}
            <div className="flex  sm:flex-row justify-between gap-4 bg-muted h-20 p-5 rounded-b-lg w-full">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = "/floors";
                        if (page) {
                            url += `?page=${page}`;
                            if (perPage) {
                                url += `&per_page=${perPage}`;
                            }
                        }
                        router.visit(url);
                    }}
                    disabled={form.state.isSubmitting}
                    className="w-full sm:w-auto"
                >
                    <X className="mr-2 h-4 w-4" />
                    {t("ui.users.buttons.cancel")}
                </Button>

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full sm:w-auto bg-blue-500 text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
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
