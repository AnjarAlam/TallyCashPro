import { MemberCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { useCompanyMembers } from "@/services/team.service";
import { Loader2 } from "lucide-react";

interface MemberListSectionProps {
  companyId: string;
}

export function MemberListSection({ companyId }: MemberListSectionProps) {
  const { user } = useAuth();
  const { data, isLoading, isError, error, refetch } =
    useCompanyMembers(companyId);
  const ownerMember = data?.data.find(
    (checkMember) => checkMember.user._id === user?._id
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
        Error loading members: {error?.message}
        <Button onClick={() => refetch()} variant="ghost" className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No members found in this company
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      <div className="grid gap-4 mx-4">
        {ownerMember && (
          <MemberCard
            member={ownerMember}
            onRemove={() => handleRemoveMember(ownerMember._id)}
          />
        )}

        {data.data
          .filter((checkMember) => checkMember.user._id !== user?._id)
          .sort((a: any, b: any) => a.user.name.localeCompare(b.user.name))
          .map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onRemove={() => handleRemoveMember(member._id)}
            />
          ))}
      </div>
    </div>
  );
}
