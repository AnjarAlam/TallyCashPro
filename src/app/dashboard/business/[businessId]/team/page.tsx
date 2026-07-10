import TeamMemberPage from "./team-page";

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return <TeamMemberPage businessId={businessId} />;
}
