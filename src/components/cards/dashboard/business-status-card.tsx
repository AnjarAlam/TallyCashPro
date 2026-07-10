import { BusinessStatusCardSkeleton } from "@/components/skeleton";
import { AnchorButton } from "@/components/ui/anchor-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCompanyList } from "@/services";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Building2 } from "lucide-react";

interface BusinessStatusCardProps {
  logo?: string;
  title: string;
  status?: "active" | "inactive" | "pending";
  viewAllLink: string;
}

export function BusinessStatusCard({
  logo,
  title,
  status = "active",
  viewAllLink,
}: BusinessStatusCardProps) {
  const { companyList: businesses, isCompanyListPending } = useGetCompanyList();

  if (isCompanyListPending) {
    return <BusinessStatusCardSkeleton />;
  }

  return (
    <Card className="group bg-linear-to-br from-[#2563eb] via-primary to-primary/85 dark:bg-primary-foreground text-primary-foreground dark:text-white shadow-none border-primary h-full flex flex-col gap-3">
      {/* Card Header with Logo and Title */}

      <CardHeader className="sm:p-4 px-3">
        <CardTitle className="flex flex-row justify-start items-center sm:items-start gap-3 sm:gap-4">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 p-1 bg-white">
            <AvatarImage src={logo || "/placeholder-business.svg"} />
            <AvatarFallback className="capitalize text-primary dark:text-accent text-xl sm:text-2xl font-extrabold dark:bg-accent-foreground outline outline-white outline-offset-2">
              <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
              {/* {businesses?.length?.toLocaleString()} */}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1">
            <h2 className="text-lg sm:text-xl font-bold truncate capitalize max-w-[180px] sm:max-w-none">
              My Businesses
            </h2>
            <p className="text-xs sm:text-sm font-normal flex-1">
              Updated {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="sm:p-4 px-3">
        <div className="flex flex-col">
          <h2 className="text-xl order-1 md:order-2">Total Businesses</h2>
          <h3 className="text-6xl order-2 md:order-1 font-extrabold outline ">
            {businesses?.length?.toLocaleString()}
          </h3>
        </div>
      </CardContent>
      {/* Card Footer with View All Button */}
      <CardFooter className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 p-4 py-0">
        <div className="flex flex-row gap-2 w-full sm:w-auto">
          {/* <BusinessSheet
            triggerComp={
              <div className="text-black rounded-full font-medium flex items-center justify-center bg-white py-2 px-4 text-sm hover:cursor-pointer hover:scale-105 transition-all h-10">
                New Business <Plus className="w-4 h-4 ml-2" />
              </div>
            }
          /> */}
          <AnchorButton
            href={viewAllLink}
            variant={"outline"}
            size={"sm"}
            className="text-black rounded-full flex items-center justify-center bg-white py-2 px-4 text-base hover:cursor-pointer hover:scale-105 transition-all h-12 md:h-10 w-full font-medium"
          >
            View Businesses
            {/* <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" /> */}
          </AnchorButton>
        </div>
      </CardFooter>
    </Card>
  );
}
