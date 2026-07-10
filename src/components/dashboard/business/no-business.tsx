import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NoBusinessFoundProps {
  message?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function NoBusinessFound({
  message = "No businesses found. Start by adding your first business!",
  buttonText = "Add Business",
  buttonHref = "#", // Default to a placeholder link
}: NoBusinessFoundProps) {
  return (
    <div className="flex items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-md text-center">
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-6">
          <PlusCircle className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">
            {message}
          </h3>
          <Button asChild>
            <Link href={buttonHref}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {buttonText}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
