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

  return (
    <div>
      <div className='flex ml-4 m-5'>
        <Shield size={17} className='text-blue-500'/>
        <p className='ml-2 text-sm'>{t('ui.roles.principal')}</p>
      </div>
          <Select>
            <SelectTrigger className="w-full max-w-[770px] m-4 bg-muted mb-5">
              <SelectValue placeholder={t('ui.roles.select')}  className=''/>
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

          <div className='flex ml-5 mt-3'>
            <Shield size={17} className='mt-0.5 text-blue-500 mr-2'/>
            <h2>Permisos Específicos</h2>
          </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
       
        {/* Card Users Permissions */}
        <Card className='m-4 bg-muted'>
          <CardHeader>
            <CardTitle className='flex'>
              <Users size={17} className='text-blue-500 mr-3 mb-3' />
              {t('ui.permissions.users.users')}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.create')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.edit')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.users.delete')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Products Permissions */}
        <Card className='m-4 bg-muted'>
          <CardHeader>
            <CardTitle>{t('ui.permissions.products.products')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.create')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.edit')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.products.delete')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Reports Permissions */}
        <Card className='m-4 bg-muted'>
          <CardHeader>
            <CardTitle>{t('ui.permissions.reports.reports')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.see')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.export')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.reports.print')}
              </label>
            </div>
          </CardHeader>
        </Card>

        {/* Card Settings Permissions */}
        <Card className='m-4 bg-muted'>
          <CardHeader>
            <CardTitle>{t('ui.permissions.settings.settings')}</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('ui.permissions.settings.access')}
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox className='border-blue-500'/>
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
