import { useState } from 'react';
import { Shield, Users } from "lucide-react";
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
import { FormItem } from "@/components/ui/form";



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
import { Form } from 'react-hook-form';
  

export function Permissions() {

    const { t } = useTranslations();

    const form = useForm({
        defaultValues: {
            select: "", 
            name: "",   
            permissions: {
              users: { see: false, create: false, edit: false, delete: false },
              products: { see: false, create: false, edit: false, delete: false },
              reports: { see: false, export: false, print: false },
              settings: { access: false, modify: false },
            },
          },onSubmit: async ({ value }) => {
            const options = {
                onSuccess: () => {
                    toast.success("Formulario enviado correctamente");
                },
            }}
});

    return (
        <form onSubmit={form.handleSubmit} className="space-y-4" noValidate>
  <FormItem>
    <form.Field name="select">
      {(field) => (
        <div>
          <div className='flex ml-4 m-5'>
            <Shield size={17} className='text-blue-500'/>
            <p className='ml-2 text-sm'>{t('ui.roles.principal')}</p>
          </div>
          <Select value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
            <SelectTrigger className="w-full max-w-[770px] m-4 bg-muted mb-5">
              <SelectValue placeholder={t('ui.roles.select')}  className='' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('ui.roles.roles')}</SelectLabel>
                <SelectItem value="admin">{t('ui.roles.admin')}</SelectItem>
                <SelectItem value="user">{t('ui.roles.user')}</SelectItem>
              </SelectGroup>
            </SelectContent>
            <p className='ml-5 text-gray-500 text-sm mt-0'>{t('ui.roles.info')}</p>
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
    {/* Permisos de Usuarios */}
    <FormItem>
      <Card className='m-4 bg-muted'>
        <CardHeader>
          <CardTitle className='flex'>
            <Users size={17} className='text-blue-500 mr-3 mb-3' />
            {t('ui.permissions.users.users')}
          </CardTitle>
          <form.Field name="permissions.users.see">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.users.see')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.users.create">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.users.create')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.users.edit">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.users.edit')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.users.delete">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.users.delete')}
                </label>
              </div>
            )}
          </form.Field>
        </CardHeader>
      </Card>
    </FormItem>

    {/* Permisos de Productos */}
    <FormItem>
      <Card className='m-4 bg-muted'>
        <CardHeader>
          <CardTitle>{t('ui.permissions.products.products')}</CardTitle>
          <form.Field name="permissions.products.see">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.products.see')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.products.create">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.products.create')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.products.edit">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.products.edit')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.products.delete">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.products.delete')}
                </label>
              </div>
            )}
          </form.Field>
        </CardHeader>
      </Card>
    </FormItem>

    {/* Permisos de Reportes */}
    <FormItem>
      <Card className='m-4 bg-muted'>
        <CardHeader>
          <CardTitle>{t('ui.permissions.reports.reports')}</CardTitle>
          <form.Field name="permissions.reports.see">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.reports.see')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.reports.export">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.reports.export')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.reports.print">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.reports.print')}
                </label>
              </div>
            )}
          </form.Field>
        </CardHeader>
      </Card>
    </FormItem>

    {/* Permisos de Configuración */}
    <FormItem>
      <Card className='m-4 bg-muted'>
        <CardHeader>
          <CardTitle>{t('ui.permissions.settings.settings')}</CardTitle>
          <form.Field name="permissions.settings.access">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.settings.access')}
                </label>
              </div>
            )}
          </form.Field>
          <form.Field name="permissions.settings.modify">
            {(field) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={!!field.state.value}
                  onCheckedChange={(checked) => field.handleChange(!!checked)}
                  className='border-blue-500'
                />
                <label htmlFor="terms" className="text-sm font-medium">
                  {t('ui.permissions.settings.modify')}
                </label>
              </div>
            )}
          </form.Field>
        </CardHeader>
      </Card>
    </FormItem>
  </div>
</form>

    );
}    