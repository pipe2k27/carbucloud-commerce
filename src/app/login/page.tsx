"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "./components/login-form.client";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            CarbuCloud Store
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-secondary lg:block">
        {/* <img
          src="https://images.pexels.com/photos/29909566/pexels-photo-29909566/free-photo-of-close-up-of-red-performance-car-grille.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] grayscale"
        /> */}
        <Image
          src="/car-outline.png"
          alt="Car Outline"
          layout="fill" // Makes the image fill the parent container
          objectFit="contain" // Ensures the image fits within the container without distortion
        />
      </div>
    </div>
  );
}
