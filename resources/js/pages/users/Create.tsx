import { UserForm } from "@/pages/users/components/UserForm";
import { RolesForm } from "@/pages/users/components/RolesForm";
import { UserLayout } from "@/layouts/users/UserLayout";
import { useTranslations } from "@/hooks/use-translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardHeader } from "@/components/ui/card";


export default function CreateUser() {
  const { t } = useTranslations();

  return (
    <UserLayout title={t("ui.users.create")}>
      <div className="p-6">
        <div className="max-w-xl">
          <CardHeader>afssssssssssss</CardHeader>
          <Tabs defaultValue="account" className="w-[800px] flex justify-center flex-col">
            <TabsList>
              <TabsTrigger value="account">{t("ui.settings.tabs.basic")}</TabsTrigger>
              <TabsTrigger value="password">{t("ui.settings.tabs.roles")}</TabsTrigger>
            </TabsList>
            <TabsContent value="account"><UserForm /></TabsContent>
            <TabsContent value="password"><RolesForm /></TabsContent>
          </Tabs>

        </div>
      </div>
    </UserLayout>
  );
}
