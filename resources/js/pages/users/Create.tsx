import { UserForm } from "@/pages/users/components/UserForm";
import { User } from "lucide-react";
import { UserLayout } from "@/layouts/users/UserLayout";
import { useTranslations } from "@/hooks/use-translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardHeader } from "@/components/ui/card";


interface CreateUserProps {
  roles?: string[];          
  permissions?: string[]; 
  categories?: string[]; 
}


export default function CreateUser({ roles, permissions, categories }: CreateUserProps) {
  const { t } = useTranslations();

  return (
    <UserLayout title={t("ui.users.create")}>
      <div className="flex flex-col items-center w-full">
        <div className="w-[1000px] flex flex-col bg-muted/50 rounded-lg">

          <CardHeader className="w-full flex justify-start bg-muted p-4 rounded-t-lg">
            <div className="flex space-x-2">
              <User size={20} className="text-blue-500" />
              <h2 className="font-bold text-xl">Crear Nuevo Usuario</h2>
            </div>
              <p className="text-gray-500 text-sm mb-3">Ingresa la información para crear un nuevo usuario en el sistema</p>
          </CardHeader>


          <UserForm roles={roles} permissions={permissions} categories={categories}/>
        </div>
      </div>

    </UserLayout>
  );
}
