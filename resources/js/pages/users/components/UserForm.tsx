import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/use-translations';
import { router } from '@inertiajs/react';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, FileText, Lock, Mail, PackageOpen, Save, Settings, Shield, User, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Checkbox } from '@/components/ui/checkbox';
import { FormItem } from '@/components/ui/form';

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
    userPermissions?: string[];
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

export function UserForm({ initialData, page, perPage, roles = [], permissions = [], categories = [], userPermissions = [] }: UserFormProps) {
    const { t } = useTranslations();
    const queryClient = useQueryClient();
    const [shown, setType] = useState(true);

    // Al cargar la pagina los permisos que tiene el usuario se cargan
    useEffect(() => {
        setSelectedPermissions(userPermissions);
    }, []);

    // TanStack Form setup
    const form = useForm({
        defaultValues: {
            name: initialData?.name ?? '',
            email: initialData?.email ?? '',
            password: '',
            select: '',
        },
        onSubmit: async ({ value }) => {
            const data = {
                ...value,
                permissions: selectedPermissions,
            };

            const options = {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['users'] });

                    // Construct URL with page parameters
                    let url = '/users';
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
                        toast.error(initialData ? t('messages.users.error.update') : t('messages.users.error.create'));
                    }
                },
            };

            // Submit with Inertia
            if (initialData) {
                router.put(`/users/${initialData.id}`, data, options);
            } else {
                router.post('/users', data, options);
            }
        },
    });

    // Form submission handler
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    const userPerm = ['users.view', 'product.view', 'report.view'];

    // Array con los permisos que se seleccionan
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    function handlePermissionChange(permission: string, checked: boolean) {
        setSelectedPermissions((prev) => (checked ? [...prev, permission] : prev.filter((perm) => perm !== permission)));
    }

    // Cambia los permisos según el rol seleccionado
    function handleRoleChange(value: string) {
        if (value === 'admin') {
            setSelectedPermissions(permissions);
        } else if (value === 'user') {
            setSelectedPermissions(userPerm);
        } else {
            setSelectedPermissions([]);
        }
    }

    const iconMap: Record<string, React.ReactNode> = {
        users: <Users size={17} className="mr-3 mb-3 text-blue-500" />,
        product: <PackageOpen size={17} className="mr-3 mb-3 text-blue-500" />,
        report: <FileText size={17} className="mr-3 mb-3 text-blue-500" />,
        settings: <Settings size={17} className="mr-3 mb-3 text-blue-500" />,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Tabs defaultValue="account" className="flex flex-col">
                <TabsList className="rounded-none">
                    <TabsTrigger value="account">{t('ui.settings.tabs.basic')}</TabsTrigger>
                    <TabsTrigger value="password">{t('ui.settings.tabs.roles')}</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    {/* Name field */}
                    <div className="pr-4 pl-4">
                        <form.Field
                            name="name"
                            validators={{
                                onChangeAsync: async ({ value }) => {
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    return !value
                                        ? t('ui.validation.required', { attribute: t('ui.users.fields.name').toLowerCase() })
                                        : value.length < 2
                                          ? t('ui.validation.min.string', { attribute: t('ui.users.fields.name').toLowerCase(), min: '2' })
                                          : undefined;
                                },
                            }}
                        >
                            {(field) => (
                                <>
                                    <div className="align-center m-1 flex">
                                        <User size={16} className="mr-2 text-gray-500" />
                                        <Label htmlFor={field.name}>{t('ui.users.fields.name')}</Label>
                                    </div>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        placeholder={t('ui.users.placeholders.name')}
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

                    {/* Password field */}
                    <div className="pr-4 pl-4">
                        <form.Field
                            name="password"
                            validators={{
                                onChangeAsync: async ({ value }) => {
                                    await new Promise((resolve) => setTimeout(resolve, 500));
                                    if (!initialData && (!value || value.length === 0)) {
                                        return t('ui.validation.required', { attribute: t('ui.users.fields.password').toLowerCase() });
                                    }
                                    if (value && value.length > 0 && value.length < 8) {
                                        return t('ui.validation.min.string', { attribute: t('ui.users.fields.password').toLowerCase(), min: '8' });
                                    }
                                    return undefined;
                                },
                            }}
                        >
                            {(field) => (
                                <>
                                    <div className="align-center m-1 flex">
                                        <Lock size={16} className="mr-2 text-gray-500" />
                                        <Label htmlFor={field.name}>
                                            {initialData ? t('ui.users.fields.password_optional') : t('ui.users.fields.password')}
                                        </Label>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type={shown ? 'password' : 'text'}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            onBlur={field.handleBlur}
                                            placeholder={t('ui.users.placeholders.password')}
                                            disabled={form.state.isSubmitting}
                                            autoComplete="off"
                                            required={false}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setType(!shown)}
                                            className="absolute inset-y-0 right-3 flex items-center"
                                        >
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
                                <div className="w-full px-4">
                                    <div className="mb-2 flex items-center">
                                        <Shield size={17} className="text-blue-500" />
                                        <p className="ml-2 text-sm">{t('ui.roles.principal')}</p>
                                    </div>

                                    <Select
                                        value={field.state.value}
                                        onValueChange={(value) => {
                                            field.handleChange(value);
                                            handleRoleChange(value);
                                        }}
                                    >
                                        <SelectTrigger className="bg-muted w-full">
                                            <SelectValue placeholder={t('ui.roles.select')} />
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
                                    </Select>

                                    <p className="mt-2 text-sm text-gray-500">{t('ui.roles.info')}</p>
                                </div>
                            )}
                        </form.Field>
                    </FormItem>

                    <div className="mt-3 ml-5 flex">
                        <Shield size={17} className="mt-0.5 mr-2 text-blue-500" />
                        <h2>Permisos Específicos</h2>
                    </div>

                    {/* Grid de permisos responsive */}
                    <div className="mt-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {categories.map((category) => (
                            <FormItem key={category}>
                                <Card className="bg-muted m-4">
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
                                                        onCheckedChange={(checked) => handlePermissionChange(perm, !!checked)}
                                                        className="border-blue-500"
                                                    />
                                                    <label className="text-sm font-medium">
                                                        {t(`ui.permissions.${category}.${perm.split('.')[1]}`)}
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

            {/* Botones del formulario */}
            <div className="bg-muted flex h-20 justify-between gap-4 rounded-b-lg p-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        let url = '/users';
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
