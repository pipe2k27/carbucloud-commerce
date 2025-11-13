"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/constants/message-constants";

export default function WhatsAppButton() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // Replace with actual WhatsApp number
  const message = WHATSAPP_DEFAULT_MESSAGE;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-md shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
      aria-label="Contactarse por WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium text-sm inline">
        Contactarse por WhatsApp
      </span>
    </Link>
  );
}
