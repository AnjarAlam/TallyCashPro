import BookMemberPage from "./team-page";

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string; cashbookId: string }>;
}) {
  const { businessId, cashbookId } = await params;
  return <BookMemberPage businessId={businessId} cashbookId={cashbookId} />;
}
