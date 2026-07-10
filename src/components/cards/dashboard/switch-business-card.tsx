// "use client";
// import { AnchorButton } from "@/components/ui/anchor-button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { DialogTitle } from "@/components/ui/dialog";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useBusiness } from "@/hooks";
// import { useGetCompanyList } from "@/services";
// import { AvatarImage } from "@radix-ui/react-avatar";
// import { ArrowLeftRight, BookText, Building2, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import BusinessCard from "./business-one-card";

// interface BusinessCardProps {
//   id?: string;
//   name?: string;
//   category?: string;
//   description?: string;
// }

// const LOCAL_STORAGE_KEY = "currentBusiness";

// export function BusinessSwitchCard({
//   id: propId,
//   category: propCategory,
//   name: propName,
//   description: propDescription,
// }: BusinessCardProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { companyList: businesses, isCompanyListPending } = useGetCompanyList();
//   const { businessInfo, updateBusinessInfo } = useBusiness();
//   const {
//     name: contextName,
//     category: contextCategory,
//     id: contextId,
//     description: contextDescription,
//   } = businessInfo;
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   // Use props if available, otherwise use context
//   const name = propName || contextName;
//   const category = propCategory || contextCategory;
//   const id = propId || contextId;
//   const description = propDescription || contextDescription;

//   // Set default business on initial render if none is selected
//   useEffect(() => {
//     if (!businessInfo.id && businesses?.length) {
//       // Try to get from localStorage first
//       const storedBusiness = localStorage.getItem(LOCAL_STORAGE_KEY);
//       if (storedBusiness) {
//         try {
//           const parsedBusiness = JSON.parse(storedBusiness);
//           updateBusinessInfo(parsedBusiness);
//         } catch (e) {
//           console.error("Failed to parse stored business", e);
//           // Fallback to first business if parsing fails
//           setFirstBusinessAsDefault();
//         }
//       } else {
//         // If nothing in localStorage, set first business as default
//         setFirstBusinessAsDefault();
//       }
//     }
//   }, [businesses]);

//   const setFirstBusinessAsDefault = () => {
//     if (businesses?.length) {
//       const firstBusiness = businesses[0].company;
//       handleUpdate(
//         {
//           id: firstBusiness._id,
//           name: firstBusiness.name,
//           category: firstBusiness.category,
//           description: firstBusiness.description,
//         },
//         false
//       );
//     }
//   };

//   const handleUpdate = (
//     business: {
//       id: string;
//       name: string;
//       category: string;
//       description?: string;
//     },
//     shouldNavigate: boolean = true
//   ) => {
//     updateBusinessInfo(business);
//     // Store in localStorage
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(business));
//     setIsDrawerOpen(false); // Close drawer after update

//     // Navigate to new business if props were provided
//     if (shouldNavigate && propId) {
//       // Get current path and replace the businessId part
//       const pathParts = pathname.split("/");
//       const businessIndex =
//         pathParts.findIndex((part) => part === "business") + 1;

//       if (businessIndex > 0 && businessIndex < pathParts.length) {
//         // Replace the businessId and keep the rest of the path
//         pathParts[businessIndex] = business.id;
//         const newPath = pathParts.join("/");
//         router.replace(newPath);
//       } else {
//         // Fallback to just the business dashboard if path structure is unexpected
//         router.replace(`/dashboard/business/${business.id}`);
//       }
//     }
//   };

//   // Don't render anything if there are no businesses
//   if (!isCompanyListPending && (!businesses || businesses.length === 0)) {
//     return null;
//   }

//   // Don't render switcher if no business is selected (though this shouldn't happen due to useEffect)
//   if (!id) {
//     return null;
//   }

//   return (
//     <div className="md:px-4 mb-2">
//       <Card className="group bg-linear-to-br from-[#2563eb] via-primary to-primary/85 dark:bg-primary-foreground text-primary-foreground dark:text-white shadow-none border-primary relative overflow-hidden gap-2">
//         <CardHeader>
//           <CardTitle className="flex justify-start items-center gap-2">
//             <Avatar className="h-12 w-12 sm:h-14 sm:w-14 p-1">
//               <AvatarImage src={"/"} />
//               <AvatarFallback className="capitalize text-primary dark:text-accent text-xl sm:text-2xl font-extrabold dark:bg-accent-foreground outline outline-white outline-offset-2">
//                 <Building2 className="w-5 h-5" />
//               </AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col">
//               <h2 className="text-xl font-bold line-clamp-1 capitalize">
//                 {name || "Unknown Business"}{" "}
//                 <span className="text-xs">{"(current)"}</span>
//               </h2>
//               <span className="text-sm font-medium opacity-80">{category}</span>
//             </div>
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="gap-4 space-y-4">
//           <CardDescription className="text-white capitalize pl-2 ">
//             {description}
//           </CardDescription>
//           <div className="flex flex-wrap gap-2">
//             <AnchorButton
//               href={`/dashboard/business/${id}`}
//               variant="outline"
//               className="rounded-full h-auto border p-2 flex items-center gap-2 text-gray-700 font-semibold"
//             >
//               <BookText className="w-4 h-4" />
//               View books
//             </AnchorButton>
//             <AnchorButton
//               href={`/dashboard/business/${id}/team`}
//               variant="outline"
//               className="rounded-full h-auto border p-2 flex items-center gap-2 text-gray-700 font-semibold"
//             >
//               <Users className="w-4 h-4" />
//               Members
//             </AnchorButton>

//             {businesses && businesses.length > 1 && (
//               <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
//                 <DrawerTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="rounded-full h-auto border p-2 flex items-center gap-2 text-gray-700 font-semibold"
//                   >
//                     <ArrowLeftRight className="w-4 h-4" />
//                     Switch Businesses
//                   </Button>
//                 </DrawerTrigger>
//                 <DrawerContent className="h-[80%]">
//                   <DialogTitle />
//                   <div className="p-4 overflow-y-auto">
//                     {isCompanyListPending ? (
//                       <div className="space-y-4">
//                         {[...Array(3)].map((_, i) => (
//                           <Skeleton
//                             key={i}
//                             className="h-20 w-full rounded-lg"
//                           />
//                         ))}
//                       </div>
//                     ) : businesses?.length ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:px-4 container mx-auto">
//                         {businesses
//                           .slice()
//                           .reverse()
//                           .map((business: any) => (
//                             <BusinessCard
//                               type="switch"
//                               onClick={
//                                 () =>
//                                   handleUpdate(
//                                     {
//                                       id: business.company._id,
//                                       category: business.company.category,
//                                       name: business.company.name,
//                                       description: business.company.description,
//                                     },
//                                     !!propId
//                                   ) // Only navigate if props were provided
//                               }
//                               key={business.company._id}
//                               business={business.company}
//                             />
//                           ))}
//                       </div>
//                     ) : null}
//                   </div>
//                 </DrawerContent>
//               </Drawer>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// ---------1----------------


"use client";
import { AnchorButton } from "@/components/ui/anchor-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusiness } from "@/hooks";
import { useGetCompanyList } from "@/services";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowLeftRight,
  BookText,
  Building2,
  Users,
  Calendar,
  X,
  Check,
  BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface BusinessCardProps {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  totalBooks?: number;  // New prop for total books
  isLoading?: boolean;  // New prop for loading state
}

const LOCAL_STORAGE_KEY = "currentBusiness";

export function BusinessSwitchCard({
  id: propId,
  category: propCategory,
  name: propName,
  description: propDescription,
  totalBooks = 0,  // Default value
  isLoading = false,  // Default value
}: BusinessCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { companyList: businesses, isCompanyListPending } = useGetCompanyList();
  const { businessInfo, updateBusinessInfo } = useBusiness();
  const {
    name: contextName,
    category: contextCategory,
    id: contextId,
    description: contextDescription,
  } = businessInfo;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  // Use props if available, otherwise use context
  const name = propName || contextName;
  const category = propCategory || contextCategory;
  const id = propId || contextId;
  const description = propDescription || contextDescription;

  // Handle drawer open state for animations
  useEffect(() => {
    if (isDrawerOpen) {
      const timer = setTimeout(() => {
        setAnimateCards(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateCards(false);
    }
  }, [isDrawerOpen]);

  // Set default business on initial render if none is selected
  useEffect(() => {
    if (!businessInfo.id && businesses?.length) {
      const storedBusiness = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedBusiness) {
        try {
          const parsedBusiness = JSON.parse(storedBusiness);
          updateBusinessInfo(parsedBusiness);
        } catch (e) {
          console.error("Failed to parse stored business", e);
          setFirstBusinessAsDefault();
        }
      } else {
        setFirstBusinessAsDefault();
      }
    }
  }, [businesses]);

  const setFirstBusinessAsDefault = () => {
    if (businesses?.length) {
      const firstBusiness = businesses[0].company;
      handleUpdate(
        {
          id: firstBusiness._id,
          name: firstBusiness.name,
          category: firstBusiness.category,
          description: firstBusiness.description,
        },
        false
      );
    }
  };

  const handleUpdate = (
    business: {
      id: string;
      name: string;
      category: string;
      description?: string;
    },
    shouldNavigate: boolean = true
  ) => {
    updateBusinessInfo(business);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(business));
    setIsDrawerOpen(false);

    if (shouldNavigate && propId) {
      const pathParts = pathname.split("/");
      const businessIndex = pathParts.findIndex((part) => part === "business") + 1;

      if (businessIndex > 0 && businessIndex < pathParts.length) {
        pathParts[businessIndex] = business.id;
        const newPath = pathParts.join("/");
        router.replace(newPath);
      } else {
        router.replace(`/dashboard/business/${business.id}`);
      }
    }
  };

  // Format date to "15th-Aug-2025" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  // Don't render anything if there are no businesses
  if (!isCompanyListPending && (!businesses || businesses.length === 0)) {
    return null;
  }

  // Don't render switcher if no business is selected
  if (!id) {
    return null;
  }

  return (
    <div className="md:px-4 mb-2">
      <Card className="group bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 dark:from-blue-800 dark:via-blue-700 dark:to-blue-600 text-white shadow-lg border-0 relative overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex justify-start items-center gap-3">
            <Avatar className="h-14 w-14 p-2 bg-white/20 backdrop-blur-sm">
              <AvatarFallback className="bg-transparent text-white text-lg font-bold">
                <Building2 className="w-6 h-6" />
              </AvatarFallback>

            </Avatar>

            <div className="flex flex-col">
              <h2 className="text-xl font-bold line-clamp-1 capitalize">
                {name || "Unknown Business"}
              </h2>
              {/* <span className="text-sm font-medium opacity-90 bg-white/20 px-2 py-1 rounded-full mt-1 inline-block w-fit">
                {category}
              </span> */}
              <div className="">
                {isLoading ? (
                  <div className="h-6 w-20 bg-white/30 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="w-5 h-5" />
                    {totalBooks} Books
                  </div>
                )}
              </div>


            </div>


            {/* Total Books Badge */}
            {/* <div className="ml-auto bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="h-6 w-8 bg-white/30 rounded animate-pulse"></div>
                  ) : (
                    totalBooks
                  )}
                </div>
                <div className="text-xs opacity-90">Books</div>
              </div>
            </div> */}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <CardDescription className="text-white/90 text-sm pl-2 mb-4">
            {description}
          </CardDescription>
          <div className="flex flex-wrap gap-3">
            <AnchorButton
              href={`/dashboard/business/${id}`}
              variant="outline"
              className="rounded-full h-auto border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2 flex items-center gap-2 font-medium transition-all duration-200"
            >
              <BookText className="w-4 h-4" />
              View books
            </AnchorButton>
            <AnchorButton
              href={`/dashboard/business/${id}/team`}
              variant="outline"
              className="rounded-full h-auto border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2 flex items-center gap-2 font-medium transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              Members
            </AnchorButton>

            {businesses && businesses.length > 1 && (
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-full h-auto border-white/30 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-4 py-2 flex items-center gap-2 font-medium transition-all duration-200"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Switch Business
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full ml-auto w-full max-w-md">
                  <div className="flex flex-col h-full bg-white dark:bg-gray-900">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
                          Switch Business
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Select a business to manage
                        </DrawerDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDrawerOpen(false)}
                        className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Business List */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {isCompanyListPending ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : businesses?.length ? (
                        <div className="space-y-3">
                          {businesses.map((business: any, index: number) => {
                            const isCurrent = business.company._id === id;
                            return (
                              <div
                                key={business.company._id}
                                className={`
                                  group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                                  ${isCurrent
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                                  }
                                  ${animateCards
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-full opacity-0'
                                  }
                                `}
                                style={{
                                  transitionDelay: animateCards
                                    ? `${index * 80}ms`
                                    : '0ms'
                                }}
                                onClick={() =>
                                  handleUpdate(
                                    {
                                      id: business.company._id,
                                      category: business.company.category,
                                      name: business.company.name,
                                      description: business.company.description,
                                    },
                                    !!propId
                                  )
                                }
                              >
                                {/* Current Business Indicator */}
                                {isCurrent && (
                                  <div className="absolute -top-2 -left-2">
                                    <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                      <Check className="w-3 h-3" />
                                      Current
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-4">
                                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                    <AvatarFallback className={`
                                      text-sm font-bold
                                      ${isCurrent
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                      }
                                    `}>
                                      {business.company.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className={`font-semibold text-sm truncate ${isCurrent
                                          ? 'text-blue-900 dark:text-blue-100'
                                          : 'text-gray-900 dark:text-white'
                                        }`}>
                                        {business.company.name}
                                      </h3>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${isCurrent
                                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                        }`}>
                                        {business.company.category}
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Updated {formatDate(business.company.updatedAt || business.company.createdAt)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>Created {formatDate(business.company.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {!isCurrent && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <div className="bg-blue-500 text-white p-2 rounded-lg">
                                        <ArrowLeftRight className="w-4 h-4" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {businesses?.length || 0} businesses available
                      </p>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function BusinessSwitchButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { companyList: businesses, isCompanyListPending } = useGetCompanyList();
  const { businessInfo, updateBusinessInfo } = useBusiness();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      const timer = setTimeout(() => {
        setAnimateCards(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimateCards(false);
    }
  }, [isDrawerOpen]);

  const handleUpdate = (business: {
    id: string;
    name: string;
    category: string;
    description?: string;
  }) => {
    updateBusinessInfo(business);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(business));
    setIsDrawerOpen(false);

    // Replace the businessId in the current pathname to navigate seamlessly
    const pathParts = pathname.split("/");
    const businessIndex = pathParts.findIndex((part) => part === "business") + 1;

    if (businessIndex > 0 && businessIndex < pathParts.length) {
      pathParts[businessIndex] = business.id;
      const newPath = pathParts.join("/");
      router.replace(newPath);
    } else {
      router.replace(`/dashboard/business/${business.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  if (!isCompanyListPending && (!businesses || businesses.length <= 1)) {
    return null;
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full h-9 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 flex items-center gap-2 font-semibold shadow-sm transition-all duration-200 cursor-pointer text-xs"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
          <span>Switch Business</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full ml-auto w-full max-w-md">
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <DrawerTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Switch Business
              </DrawerTitle>
              <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select a business to manage
              </DrawerDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDrawerOpen(false)}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Business List */}
          <div className="flex-1 overflow-y-auto p-6">
            {isCompanyListPending ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses?.length ? (
              <div className="space-y-3">
                {businesses.map((business: any, index: number) => {
                  const isCurrent = business.company._id === businessInfo.id;
                  return (
                    <div
                      key={business.company._id}
                      className={`
                        group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                        ${isCurrent
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                        }
                        ${animateCards
                          ? 'translate-x-0 opacity-100'
                          : 'translate-x-full opacity-0'
                        }
                      `}
                      style={{
                        transitionDelay: animateCards
                          ? `${index * 80}ms`
                          : '0ms'
                      }}
                      onClick={() =>
                        handleUpdate({
                          id: business.company._id,
                          category: business.company.category,
                          name: business.company.name,
                          description: business.company.description,
                        })
                      }
                    >
                      {/* Current Business Indicator */}
                      {isCurrent && (
                        <div className="absolute -top-2 -left-2">
                          <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Current
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarFallback className={`
                            text-sm font-bold
                            ${isCurrent
                              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }
                          `}>
                            {business.company.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm truncate ${isCurrent
                                ? 'text-blue-900 dark:text-blue-100'
                                : 'text-gray-900 dark:text-white'
                              }`}>
                              {business.company.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${isCurrent
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                              {business.company.category}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Updated {formatDate(business.company.updatedAt || business.company.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Created {formatDate(business.company.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        {!isCurrent && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="bg-blue-500 text-white p-2 rounded-lg">
                              <ArrowLeftRight className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {businesses?.length || 0} businesses available
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}