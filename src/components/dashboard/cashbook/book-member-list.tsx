import { BookMemberCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useBookMembers } from "@/services/team.service";
import { Loader2 } from "lucide-react";

interface BookMemberListSectionProps {
  companyId: string;
  bookId: string;
}

export function BookMemberListSection({
  companyId,
  bookId,
}: BookMemberListSectionProps) {
  const { data, isLoading, isError, error, refetch } = useBookMembers(
    companyId,
    bookId
  );

  const { user } = useAuth();

  const isMemberIsAuth = data?.data.find(
    (member) => member.user._id === user?._id
  );
  const handleRemoveMember = (memberId: string) => {
    // Implement your remove member logic here
    console.log("Removing member:", memberId);
    // After successful removal, you might want to:
    // refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading book members: {error?.message}
        <Button onClick={() => refetch()} variant="ghost" className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No members have access to this book
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {isMemberIsAuth && (
          <BookMemberCard
            companyId={companyId}
            bookId={bookId}
            member={isMemberIsAuth}
            onRemove={() => {}}
          />
        )}
        {data.data
          .filter((checkMember) => checkMember.user._id !== user?._id)
          .map(
            (member) =>
              member.user && (
                <BookMemberCard
                  companyId={companyId}
                  bookId={bookId}
                  key={member.id}
                  member={member}
                  onRemove={() => handleRemoveMember(member.id)}
                />
              )
          )}
      </div>
    </div>
  );
}
