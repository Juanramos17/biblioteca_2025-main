import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";


interface FlashMessages {
  success?: string;
  error?: string;
}

interface PageProps {
  flash: FlashMessages;
  [key: string]: unknown;
}

interface TimelineLayoutProps extends PropsWithChildren {
  title: string;
}

export function TimelineLayout({ title, children }: TimelineLayoutProps) {
  const { flash } = usePage<PageProps>().props;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ];

  if (title !== "Reservas") {
    breadcrumbs.push({
      title,
      href: "#",
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />
      {children}
    </AppLayout>
  );
}
