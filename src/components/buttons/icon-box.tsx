import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  icon: LucideIcon;
  iconClass?: string;
  containerClass?: string;
} & React.HTMLAttributes<HTMLDivElement>;

function IconBox({ icon: Icon, iconClass, containerClass, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn(
        `p-2 rounded-md bg-green-100 hover:cursor-pointer hover:shadow-md transition-shadow duration-300`,
        containerClass
      )}
    >
      <Icon className={cn(`h-4 w-4 text-green-700`, iconClass)} />
    </div>
  );
}

export default IconBox;
