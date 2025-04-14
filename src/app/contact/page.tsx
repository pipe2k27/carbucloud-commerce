"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleWarning,
  SearchCheckIcon,
} from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="bg-background text-foreground py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Contacto</h1>
        <p className="text-lg text-muted-foreground mb-10">
          ¿Querés comunicarte con nosotros?
        </p>

        <Card className="text-left">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <MapPinIcon className="w-5 h-5 text-primary" />
              <span>Av. Corrientes 1234, Buenos Aires, Argentina</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-primary" />
              <span>+54 9 11 6822 0080</span>
            </div>
            <div className="flex items-center gap-3">
              <MailIcon className="w-5 h-5 text-primary" />
              <span>contacto@automercado.com</span>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="default" className=" px-6 py-4">
            <a
              href="https://wa.me/5491168220080"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircleWarning className="ml-[-2px] scale-110" />
              Contactarse por WhatsApp
            </a>
          </Button>

          <Button variant="secondary" className="px-6 py-4">
            Agendar visita
            <SearchCheckIcon size={20} className="ml-[-4px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
