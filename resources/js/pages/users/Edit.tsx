import { UserForm } from "@/pages/users/components/UserForm";
import { UserLayout } from "@/layouts/users/UserLayout";
import { PageProps } from "@inertiajs/core";
import { User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { CardHeader } from "@/components/ui/card";

interface EditUserProps extends PageProps {
  user: {
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

export default function EditUser({ user, page, perPage, roles, permissions, categories, userPermissions }: EditUserProps) {
  const { t } = useTranslations();

  return (

<UserLayout title={t("ui.users.edit")}>
<div className="flex flex-col items-center w-full">
  <div className="w-[1000px] flex flex-col bg-muted/50 rounded-lg">

    <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
      <div className="flex space-x-2">
        <User size={20} className="text-blue-500" />
        <h2 className="font-bold text-xl">{t("ui.info.edit")}</h2>
      </div>
        <p className="text-gray-500 text-sm mb-3">{t("ui.info.info")}</p>
    </CardHeader>

    <UserForm initialData={user} page={page} perPage={perPage} roles={roles} permissions={permissions} categories={categories} userPermissions={userPermissions}/>
  </div>
</div>

</UserLayout>
  );
}
