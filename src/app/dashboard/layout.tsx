import { Metadata } from "next";
import { Sidebar } from "./_components/sidebar.client";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

import { ReactNode } from "react";

export default function DashboardPage({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-4">
      <Sidebar />
      <>{children}</>
    </div>
  );
}
