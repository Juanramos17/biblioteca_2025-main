import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useTranslations } from "@/hooks/use-translations";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
  

export function RolesForm() {
  const { t } = useTranslations();

  const [permissions, setPermissions] = useState({
    users: { see: false, create: false, edit: false, delete: false },
    products: { see: false, create: false, edit: false, delete: false },
    reports: { see: false, export: false, print: false },
    settings: { access: false, modify: false },
  });

  const handleRoleChange = (selectedRole: string) => {

    if (selectedRole === 'admin') {
      setPermissions({
        users: { see: true, create: true, edit: true, delete: true },
        products: { see: true, create: true, edit: true, delete: true },
        reports: { see: true, export: true, print: true },
        settings: { access: true, modify: true },
      });
    } else if (selectedRole === 'user') {
      setPermissions({
        users: { see: true, create: false, edit: false, delete: false },
        products: { see: true, create: false, edit: false, delete: false },
        reports: { see: true, export: false, print: false },
        settings: { access: false, modify: false },
      });
    } else {
      setPermissions({
        users: { see: false, create: false, edit: false, delete: false },
        products: { see: false, create: false, edit: false, delete: false },
        reports: { see: false, export: false, print: false },
        settings: { access: false, modify: false },
      });
    }
  };

  return (
    <div>
      <p>{t('ui.roles.principal')}</p>
      <Select onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('ui.roles.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('ui.roles.roles')}</SelectLabel>
            <SelectItem value="admin">{t('ui.roles.admin')}</SelectItem>
            <SelectItem value="user">{t('ui.roles.user')}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Card Users Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ui.permissions.users.users')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.users.see} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.users.create} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.create')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.users.edit} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.edit')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.users.delete} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.delete')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Products Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ui.permissions.products.products')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.products.see} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.products.create} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.create')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.products.edit} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.edit')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.products.delete} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.delete')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Reports Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ui.permissions.reports.reports')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.reports.see} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.reports.export} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.export')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.reports.print} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.print')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Settings Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ui.permissions.settings.settings')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.settings.access} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.settings.access')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox checked={permissions.settings.modify} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.settings.modify')}
              </label>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
