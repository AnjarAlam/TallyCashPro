import type React from "react";
import { PreviousPage, TitleHeader } from "@/components/navigation";
import type { compConfigProps } from "@/components/navigation/dashboard/title-header"; // Using type import for compConfigProps
import TitleHeaderMobile from "@/components/navigation/dashboard/title-header-mobile";

export default function DashboardSubLayout({
  children,
  headerTitle,
  showPreviousPage,
  compList,
  showTitle = true,
  headerTitlePosition,
  aside, // New prop for the aside content
}: {
  children: React.ReactNode;
  headerTitle?: string;
  headerTitlePosition?: number;
  showPreviousPage?: boolean;
  showTitle?: boolean;
  compList?: compConfigProps;
  aside?: React.ReactNode; // Define the type for the new prop
}) {
  return (
    <section className="relative ">
      {showTitle && (
        <div className="sticky bg-background border-b hidden md:flex">
          <TitleHeader
            showPreviousPage={showPreviousPage}
            headerTitle={headerTitle}
            headerTitlePosition={headerTitlePosition}
            {...(compList ? { components: compList } : null)}
          />
        </div>
      )}
      {/* {showTitle && (
        <div className="sticky top-0 bg-background z-10 border-b md:hidden flex">
          <TitleHeaderMobile
            showPreviousPage={showPreviousPage}
            headerTitle={headerTitle}
            headerTitlePosition={headerTitlePosition}
            {...(compList ? { components: compList } : null)}
          />
        </div>
      )} */}

      <div className="flex flex-col lg:flex-row gap-4 p-2 md:px-6 md:py-4 min-w-0 overflow-x-hidden">
        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
        {aside && (
          <aside className="w-full lg:w-64 p-4  border rounded-lg bg-card text-card-foreground h-min mt-24 pt-10 top-32
 shrink-0">
            {aside}
          </aside>
        )}
      </div>
    </section>
  );
}
