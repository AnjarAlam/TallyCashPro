// "use client";
// import { BusinessStatusCard, UserCard } from "@/components/cards";
// import { BusinessList } from "@/components/dashboard";
// import { UserCardSkeleton } from "@/components/skeleton";
// import { useAuth } from "@/hooks";
// import { DashboardSubLayout } from "@/layout";
// import { BusinessProvider } from "@/providers/business-cashbook-provider";

// export default function Page() {
//   const { user, loading } = useAuth();
//   return (
//     <DashboardSubLayout headerTitle="Overview">
//       <main className="gap-4 md:gap-8 md:p-2">
//         <div className="relative grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
//           <div className="col-span-2 md:col-span-3 lg:col-span-3 row-span-1 h-full">
//             {!loading ? !!user && <UserCard {...user} /> : <UserCardSkeleton />}
//           </div>
//           <div className=" col-span-2 md:col-span-3 lg:col-span-3  row-span-1">
//             <BusinessProvider>
//               <BusinessStatusCard
//                 title="Active Businesses"
//                 status="active"
//                 viewAllLink="/dashboard/business"
//               />
//             </BusinessProvider>
//           </div>
//           <div className=" col-span-2 md:col-span-4 lg:col-span-6 row-span-1">
//             {/* {mockBusinessData.map((data, index) => (
//               <BusinessACard {...data} key={index} />
//             ))} */}
//             <div className="w-full relative">
//               <BusinessProvider>
//                 <BusinessList />
//               </BusinessProvider>
//             </div>
//           </div>
//           <div className=" col-span-2 md:col-span-2 lg:col-span-2  row-span-1">
//             {/* <CashbookACard {...mockCashbookData} /> */}
//           </div>
//         </div>
//       </main>
//     </DashboardSubLayout>
//   );
// }



"use client";
import { BusinessStatusCard, UserCard } from "@/components/cards";
import { FAQButton } from "@/components/cards/dashboard/faq-button";
import { BusinessList } from "@/components/dashboard";
import { UserCardSkeleton } from "@/components/skeleton";
import { useAuth } from "@/hooks";
import { DashboardSubLayout } from "@/layout";
import { BusinessProvider } from "@/providers/business-cashbook-provider";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();


const handleFAQClick = () => {
  router.push("/dashboard/help");
};


  const supportsHeaderAction = true;

  return (
    <DashboardSubLayout 
    showTitle={false}>
      {/* Custom header with title and FAQ button in same line */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <FAQButton onClick={handleFAQClick} />
      </div>
      
    
      <div className="relative">
        {/* Show mobile-only FAQ button if DashboardSubLayout doesn't support headerAction */}
        {!supportsHeaderAction && (
          <div className="absolute top-4 right-4 z-10 md:hidden">
            <FAQButton onClick={handleFAQClick} />
          </div>
        )}
        
        <main className="gap-4 md:gap-8 md:p-2 pt-4">
          <div className="relative grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <div className="col-span-2 md:col-span-3 lg:col-span-3 row-span-1 h-full">
              {!loading ? !!user && <UserCard {...user} /> : <UserCardSkeleton />}
            </div>
            <div className=" col-span-2 md:col-span-3 lg:col-span-3  row-span-1">
              <BusinessProvider>
                <BusinessStatusCard
                  title="Active Businesses"
                  status="active"
                  viewAllLink="/dashboard/business"
                />
              </BusinessProvider>
            </div>
            <div className=" col-span-2 md:col-span-4 lg:col-span-6 row-span-1">
              <div className="w-full relative">
                <BusinessProvider>
                  <BusinessList />
                </BusinessProvider>
              </div>
            </div>
            <div className=" col-span-2 md:col-span-2 lg:col-span-2  row-span-1">
              {/* <CashbookACard {...mockCashbookData} /> */}
            </div>
          </div>
        </main>
      </div>
    </DashboardSubLayout>
  );
}