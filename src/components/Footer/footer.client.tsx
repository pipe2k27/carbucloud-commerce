import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import { WebElementTier1 } from "@/dynamo-db/web-elements.db";
import React from "react";
import Image from "next/image";

type FooterProps = {
  webElements?: WebElementTier1;
  logoUrl?: string;
};

const Footer: React.FC<FooterProps> = ({ webElements, logoUrl }) => {
  return (
    <footer className="border-t bg-muted  py-8">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & tagline */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <Link href="/" className="flex items-center gap-2 mb-1">
                <div className="text-lg logo-title flex text-primary font-bold">
                  {logoUrl && (
                    <Image src={logoUrl} alt="Logo" width={140} height={70} />
                  )}
                  {!logoUrl && (
                    <>
                      <Cloud className="mr-1" /> CarbuCloud
                    </>
                  )}
                </div>
              </Link>
              <p className="text-muted-foreground">
                Tu concesionaria de confianza.
              </p>
            </CardContent>
          </Card>

          {/* Enlaces rápidos */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <h3 className="font-bold text-lg mb-4 text-foreground">
                Enlaces rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Vehículos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <h3 className="font-bold text-lg mb-4 text-foreground">
                Contacto
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  {webElements?.contactAddress || "Buenos Aires, Argentina"}
                </li>
                <li>
                  {" "}
                  {webElements?.contactPhone || "Contactate por WhatsApp"}
                </li>
                <li>{webElements?.contactEmail || "carbucloud@gmail.com"}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <h3 className="font-bold text-lg mb-4 text-foreground">
                Horarios
              </h3>
              <div className="text-muted-foreground space-y-2">
                <p>
                  {webElements?.contactHours ||
                    "De lunes a viernes de 10 a 18hs"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Carbucloud. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
