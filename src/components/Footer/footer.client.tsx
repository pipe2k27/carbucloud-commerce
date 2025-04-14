import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & tagline */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <Link href="/" className="flex items-center gap-2 mb-1">
                <div className="text-lg logo-title flex text-primary font-bold">
                  <Cloud className="mr-1" /> CarbuCloud
                </div>
              </Link>
              <p className="text-gray-600 dark:text-gray-400">
                Tu concesionaria de confianza.
              </p>
            </CardContent>
          </Card>

          {/* Enlaces rápidos */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                Enlaces rápidos
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-primary dark:text-gray-300"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/browse"
                    className="text-gray-600 hover:text-primary dark:text-gray-300"
                  >
                    Vehículos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-primary dark:text-gray-300"
                  >
                    Sobre nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-primary dark:text-gray-300"
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
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                Contacto
              </h3>
              <ul className="space-y-3">
                <li className="text-gray-600 dark:text-gray-400">
                  Av. Corrientes 1234, Buenos Aires, Argentina
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  +54 9 11 6822 0080
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  contacto@automercado.com
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card className="bg-transparent shadow-none border-none">
            <CardContent className="p-0">
              <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">
                Horarios
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Lunes a viernes: 9:00 - 18:00
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Sábados: 10:00 - 14:00
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Domingos: Cerrado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Carbucloud. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
