import { IconButton } from "@/components/buttons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUserData } from "@/interface";
import { findBestIcon } from "@/lib";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { BadgeCheck, Mail, MapPin, Phone, UserPen } from "lucide-react";
import Link from "next/link";

export default function UserCard(userData: IUserData) {
  const {
    name,
    email,
    contact,
    photoURL,
    address,
    city,
    state,
    country,
    status = "active",
    createdAt,
  } = userData;

  return (
    <Card className="group bg-linear-to-br from-[#2563eb] via-primary to-primary/85 dark:bg-primary-foreground text-primary-foreground dark:text-white shadow-none border-primary w-full max-w-md mx-auto md:max-w-full">
      {/* Left Section */}
      <CardHeader className="sm:p-4 px-3">
        <CardTitle className="flex flex-row justify- items-center sm:items-center gap-3 sm:gap-4">
<Avatar className="h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden shrink-0">
  <AvatarImage
    src={photoURL || "/placeholder.svg"}
    className="h-full w-full object-cover rounded-full"
  />
  <AvatarFallback className="h-full w-full flex items-center justify-center capitalize text-primary dark:text-accent text-xl sm:text-2xl font-extrabold dark:bg-accent-foreground">
    {name?.charAt(0)}
  </AvatarFallback>
</Avatar>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 truncate capitalize">
              {name || "Unknown User"}
            </h2>
            <Badge
              className={cn(
                "text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 capitalize w-fit",
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {status === "active" && (
                <BadgeCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {status}
            </Badge>
          </div>
          <Link
            href={`/dashboard/profile`}
            className="md:hidden flex justify-center items-center bg-accent p-2 rounded-full"
          >
            <UserPen className="text-primary" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="md:flex flex-row w-full p-4 pt-0 hidden ">
        <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-2/3 relative z-10">
          {email && (
            <p className="text-sm sm:text-base font-semibold flex items-center gap-x-2">
              <Mail
                strokeWidth={2}
                className="w-4 h-4 sm:w-5 sm:h-5 min-w-4 min-h-4 sm:min-w-5 sm:min-h-5"
              />
              <span className="truncate">{email}</span>
            </p>
          )}
          {contact && (
            <p className="text-sm sm:text-base font-semibold flex items-center gap-x-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 min-w-4 min-h-4 sm:min-w-5 sm:min-h-5" />
              {contact}
            </p>
          )}
          {(address || city || state || country) && (
            <p className="text-sm sm:text-base font-semibold flex items-start sm:items-center gap-x-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 min-w-4 min-h-4 sm:min-w-5 sm:min-h-5 mt-0.5 sm:mt-0" />
              <span className="line-clamp-2">
                {[address, city, state, country].filter(Boolean).join(", ")}
              </span>
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="w-full hidden md:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 pt-0">
        {createdAt && (
          <p className="text-xs sm:text-sm font-normal">
            Joined on {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
        <Link href={`/dashboard/profile`} className="w-full sm:w-auto">
          <Button
            variant={"outline"}
            size={"sm"}
            className="text-black rounded-full flex items-center justify-center bg-white py-2 px-4 text-base hover:cursor-pointer hover:scale-105 transition-all h-12 md:h-10 w-full font-medium"
          >
            Edit Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
