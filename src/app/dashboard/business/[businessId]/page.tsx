//app/business/[businessId]/page.tsx

import { use } from "react";
import { BusinessPage } from "./business-page";

export default function Page({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = use(params);

  return <BusinessPage businessId={businessId} />;
}
