import { Metadata } from "next";
import { Sidebar } from "./_components/sidebar.client";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

import { ReactNode } from "react";
import StepTabs from "@/components/StepsTabs/step-tabs.client";

export default function DashboardPage({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[60px_1fr] gap-4">
      <Sidebar />
      <div />
      <div>
        <StepTabs />
        {children}
      </div>
    </div>
  );
}
