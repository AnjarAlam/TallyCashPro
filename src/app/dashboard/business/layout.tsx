import { BusinessProvider } from "@/providers/business-cashbook-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BusinessProvider>{children}</BusinessProvider>;
}
