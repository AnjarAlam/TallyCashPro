// "use client";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useAuth } from "@/hooks";
// import Image from "next/image";
// import Link from "next/link";
// interface DashboardHeaderProps {
//   userName: string;
//   currentBusiness: { id: string; name: string };
//   businesses: { id: string; name: string }[];
//   onSelectBusiness: (businessId: string) => void;
//   onAddNewBusiness: () => void;
//   onViewProfile: () => void;
//   onSignOut: () => void;
//   onBusinessTeamClick: () => void;
//   onAddBook: () => void;
// }

// export default function DashboardHeader({
//   userName,
//   currentBusiness,
//   businesses,
//   onSelectBusiness,
//   onAddNewBusiness,
//   // onViewProfile,
//   onSignOut,
//   onBusinessTeamClick,
//   onAddBook,
// }: DashboardHeaderProps) {
//   const { logout } = useAuth();
//   const userInitial = userName.charAt(0).toUpperCase();

//   return (
//     <header className="sticky2 top-02 z-10 flex items-center justify-between h-16 px-6 border-b bg-white dark:bg-gray-800">
//       <SidebarTrigger className="md:hidden" />
//       <div className="flex items-center gap-4">
//         <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
//           <span className="w-10 h-10">
//             <Image
//               src={"/logo.png"}
//               alt="Tally Cash Pro"
//               width={100}
//               height={100}
//             />
//           </span>
//           <span className="font-bold text-xl">Tallycash Pro</span>
//         </div>
//       </div>

//       <div className="flex items-center gap-4 ">
//         {/* <BusinessSwitcher
//           currentBusiness={currentBusiness}
//           businesses={businesses}
//           onSelectBusiness={onSelectBusiness}
//           onAddNewBusiness={onAddNewBusiness}
//         /> */}

//         {/* <Button
//           variant="outline"
//           className="md:flex hidden items-center gap-2 text-sm font-medium text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
//         >
//           <Users className="h-4 w-4" />
//           Business Team
//         </Button> */}
//         {userName ? (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-blue-100 text-blue-600 dark:text-blue-100 dark:bg-blue-600">
//                     {userInitial}
//                   </AvatarFallback>
//                 </Avatar>
//                 <span className="sr-only">Toggle user menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{userName}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {/* Add user email here if available */}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 <Link href={`/dashboard/profile`}>Profile </Link>
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>             
//             </DropdownMenuContent>
//           </DropdownMenu>
//         ) : null}
//       </div>
//     </header>
//   );
// }



// --------1----

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { DeleteAccountDialog } from "@/components/settings/delete-account-dialog";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface DashboardHeaderProps {
  userName: string;
  currentBusiness: { id: string; name: string };
  businesses: { id: string; name: string }[];
  onSelectBusiness: (businessId: string) => void;
  onAddNewBusiness: () => void;
  onViewProfile: () => void;
  onSignOut: () => void;
  onBusinessTeamClick: () => void;
  onAddBook: () => void;
  userId?: string;
}

export default function DashboardHeader({
  userName,
  currentBusiness,
  businesses,
  onSelectBusiness,
  onAddNewBusiness,
  onSignOut,
  onBusinessTeamClick,
  onAddBook,
}: DashboardHeaderProps) {
  const { logout, user } = useAuth();
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = user?.email ?? "";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b bg-white dark:bg-gray-800">
      <SidebarTrigger className="md:hidden" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-blue-600">
          <span className="w-10 h-10">
            <Image
              src={"/logo.png"}
              alt="Tally Cash Pro"
              width={100}
              height={100}
            />
          </span>
          <span className="font-bold text-xl text-black">Tally Cash Pro</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell />
        {userName ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:text-blue-100 dark:bg-blue-600">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  {userEmail ? (
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  ) : null}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>Log out</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteAccountDialog
                trigger={
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Delete Account
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}