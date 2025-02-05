"use client";

import { Ban, PhoneCall } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserUnverifiedPage({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className={cn("flex flex-col gap-6 my-[80px]", className)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-12 w-16 items-center justify-center rounded-md">
              <Ban className="size-6 mr-2" />
              <PhoneCall className="size-6" />
            </div>
          </a>
          <h1 className="text-xl font-bold">
            No estas asignado a ninguna empresa
          </h1>
          <div className="text-center text-sm">
            Por favor, contacta a tu administrador para que te asigne a una
            compañía
          </div>
        </div>
      </div>
    </div>
  );
}
