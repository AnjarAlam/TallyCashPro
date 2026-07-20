import SignupLayout from "@/layout/signup-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <SignupLayout>
        {children}
      </SignupLayout>
    </section>
  );
}
