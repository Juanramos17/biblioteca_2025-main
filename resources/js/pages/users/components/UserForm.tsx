import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, X, Save, Package, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Shield, Users } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

  import { Checkbox } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";


interface UserFormProps {
    initialData?: {
        id: string;
        name: string;
        email: string;
    };
    page?: string;
    perPage?: string;
    roles?: string[];          
    permissions?: string[]; 
    categories?: string[]; 
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

export function UserForm({ initialData, page, perPage, roles = [], permissions =[], categories = [] }: UserFormProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const [shown, setType] = useState(true);
    
    // TanStack Form setup
    const form = useForm({
        defaultValues: {
            name: initialData?.name ?? "",
            email: initialData?.email ?? "",
            password: "",
            
              select: "", 
        },
        onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                    
                    // Construct URL with page parameters
                    let url = "/users";
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
                router.put(`/users/${initialData.id}`, value, options);
            } else {
                router.post("/users", value, options);
            }
        },
    });

    // Form submission handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const handlePermissionChange = (permission: string, checked: boolean) => {
        console.log("Permiso actual:", permission);
        console.log("Estado de permisos antes de actualizar:", selectedPermissions);
    
        setSelectedPermissions((prev) =>
            checked ? [...prev, permission] : prev.filter((perm) => perm !== permission)
        );
        
        // Ten en cuenta que el siguiente log mostrará el estado anterior, no el actualizado:
        console.log("Permisos seleccionados después de intentar actualizar:", selectedPermissions);
    };
    

    const iconMap: Record<string, React.ReactNode> = {
        users: <Users size={17} className="text-blue-500 mr-3 mb-3" />,
        product: <Package size={17} className="text-blue-500 mr-3 mb-3" />,
        report: <FileText size={17} className="text-blue-500 mr-3 mb-3" />,
        settings: <Settings size={17} className="text-blue-500 mr-3 mb-3" />,
    };
    

    return (
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Tabs defaultValue="account" className="flex flex-col">
            <TabsList className="rounded-none">
              <TabsTrigger value="account">{t("ui.settings.tabs.basic")}</TabsTrigger>
              <TabsTrigger value="password">{t("ui.settings.tabs.roles")}</TabsTrigger>
            </TabsList>
            <TabsContent value="account">{/* Name field */}
            <div className='pl-4 pr-4'>
                <form.Field
                    name="name"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            return !value
                                ? t("ui.validation.required", { attribute: t("ui.users.fields.name").toLowerCase() })
                                : value.length < 2
                                    ? t("ui.validation.min.string", { attribute: t("ui.users.fields.name").toLowerCase(), min: "2" })
                                    : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                        <div className="flex m-1 align-center ">
                            <User size={16} className='mr-2 text-gray-500 '/><Label htmlFor={field.name}>{t("ui.users.fields.name")}</Label>
                        </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.users.placeholders.name")}
                                disabled={form.state.isSubmitting}
                                required={false}
                                autoComplete="off"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>

            {/* Email field */}
            <div className='pl-4 pr-4'>
                <form.Field
                    name="email"
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            return !value
                                ? t("ui.validation.required", { attribute: t("ui.users.fields.email").toLowerCase() })
                                : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                                    ? t("ui.validation.email", { attribute: t("ui.users.fields.email").toLowerCase() })
                                    : undefined;
                        },
                    }}
                >
                    {(field) => (
                        <>
                        <div className="flex m-1 align-center ">
                            <Mail size={16} className='mr-2 text-gray-500 '/><Label htmlFor={field.name}>{t("ui.users.fields.email")}</Label>
                        </div>
                            <Input
                                id={field.name}
                                name={field.name}
                                type="text"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder={t("ui.users.placeholders.email")}
                                disabled={form.state.isSubmitting}
                                required={false}
                                autoComplete="off"
                            />
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>


            {/* Password field */}
            <div className='pl-4 pr-4'>
                
                <form.Field
                    name="password"
                    
                    validators={{
                        onChangeAsync: async ({ value }) => {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            if (!initialData && (!value || value.length === 0)) {
                                return t("ui.validation.required", { attribute: t("ui.users.fields.password").toLowerCase() });
                            }
                            if (value && value.length > 0 && value.length < 8) {
                                return t("ui.validation.min.string", { attribute: t("ui.users.fields.password").toLowerCase(), min: "8" });
                            }
                            return undefined;
                        },
                    }}
                >
                    
                    {(field) => (
                        
                        <>
                        <div className="flex m-1 align-center ">
                            <Lock size={16} className='mr-2 text-gray-500 '/><Label htmlFor={field.name}>
                                {initialData
                                    ? t("ui.users.fields.password_optional")
                                    : t("ui.users.fields.password")}
                            </Label>
                        </div>
                            
                            <div className="relative" >
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type= {shown ? "password" : "text"}  
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    placeholder={t("ui.users.placeholders.password")}
                                    disabled={form.state.isSubmitting}
                                    autoComplete="off"
                                    required={false}
                                />
                                
                                <button type="submit" onClick={()=> setType(!shown)} className="absolute inset-y-0 right-3 flex items-center ">
                                    {shown ? <EyeOff size={18} /> : <Eye size={18} />} 
                                </button>

                            </div>
                            <FieldInfo field={field} />
                        </>
                    )}
                </form.Field>
            </div>
            </TabsContent>
            <TabsContent value="password">
            <FormItem>
                <form.Field name="select">

                    {(field) => (
                    <div>
                        <div className="flex ml-4 m-5">
                        <Shield size={17} className="text-blue-500" />
                        <p className="ml-2 text-sm">{t('ui.roles.principal')}</p>
                        </div>

                        <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                        <SelectTrigger className="w-full max-w-[770px] m-4 bg-muted mb-5">
                            <SelectValue placeholder={t('ui.roles.select')} className="" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>

                            <SelectLabel>{t('ui.roles.roles')}</SelectLabel>

                            {roles.map((role, index) => (
                                <SelectItem key={index} value={role.toLowerCase()}>
                                {t(`ui.roles.${role.toLowerCase()}`) || role} 
                                </SelectItem>
                            ))}

                            </SelectGroup>
                            
                        </SelectContent>
                        <p className="ml-5 text-gray-500 text-sm mt-0">{t('ui.roles.info')}</p>
                        </Select>
                    </div>
                    )}

                </form.Field>
                </FormItem>

            <div className='flex ml-5 mt-3'>
                <Shield size={17} className='mt-0.5 text-blue-500 mr-2'/>
                <h2>Permisos Específicos</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
            {categories.map((category) => (
                <FormItem key={category}>
                    <Card className="m-4 bg-muted">
                    <CardHeader>
                        <CardTitle className="flex">
                        {iconMap[category]}
                        {t(`ui.permissions.${category}.${category}`)}
                        </CardTitle>
                        
                        {permissions
                        .filter((perm) => perm.startsWith(`${category}.`))
                        .map((perm) => (
                            <div key={perm} className="flex items-center space-x-2">
                            <Checkbox
                                value={perm}
                                checked={selectedPermissions.includes(perm)}
                                onCheckedChange={(checked) =>
                                handlePermissionChange(perm, !!checked)
                                }
                                className="border-blue-500"
                            />
                            <label className="text-sm font-medium">
                                {t(`ui.permissions.${category}.${perm.split(".")[1]}`)}
                            </label>
                            </div>
                        ))}
                    </CardHeader>
                    </Card>
                </FormItem>
                ))}
            </div>
        </TabsContent>
          </Tabs>
            

            {/* Form buttons */}
            <div className="flex justify-between gap-4 bg-muted h-20 p-5 rounded-b-lg">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = "/users";
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

