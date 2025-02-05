"use client";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { redirect } from "next/navigation";

export function LoginForm({
  className,
}: React.ComponentPropsWithoutRef<"form">) {
  const { data: session } = useSession();

  if (session) {
    redirect("/dashboard/products");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Gestion interna de tu Tienda Carbucloud
        </p>
      </div>
      <div className="grid gap-6">
        {!session && (
          <Button className="w-full" onClick={() => signIn("google")}>
            Iniciar sesión con Google <Car size={24} />
          </Button>
        )}
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            No tienes cuenta de google?
          </span>
        </div>
      </div>
      <div className="text-center text-sm">
        Contacto con:{" "}
        <a href="#" className="underline underline-offset-4">
          Soporte Técnico
        </a>
      </div>
    </div>
  );
}
