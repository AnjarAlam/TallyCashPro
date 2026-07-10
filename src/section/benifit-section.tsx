import { BenifitsSectionCard } from "@/components/cards";
import { Card } from "@/components/ui/card";
import { DollarSign, LineChart, Wallet, ShieldCheck } from "lucide-react";
const benefits = [
  {
    image: "/images/home/1.svg",
    title: "Save Time with Smart Automation",
    description:
      "Automate daily entries, team roles, and reports — so you can focus on growing your business.",
    ctaButtonText: "Explore Features",
    promoText: "No manual work, no missed data",
    order: false,
  },
  {
    image: "/images/home/1.svg",
    title: "Secure Multi-User Collaboration",
    description:
      "Add your accountant or teammates to specific books or businesses with full permission control.",
    ctaButtonText: "Manage Team",
    promoText: "Data stays private & roles stay clear",
    order: true,
  },
  {
    image: "/images/home/1.svg",
    title: "Make Informed Business Decisions",
    description:
      "Use clean visuals and insights to understand cash flow and take smarter, faster decisions.",
    ctaButtonText: "See Reports",
    promoText: "Clarity that drives growth",
    order: false,
  },
];

export default function BenifitSection() {
  return (
    <section id="features">
      <Card className="border-none bg-gray-500/5 shadow-none rounded-none sm:rounded-4xl">
        <div className="max-w-6xl mx-auto text-center sm:p-0 px-4">
          <h2 className="text-xl sm:text-5xl font-bold mb-3 mx-auto leading-normal">
            Smart Tools to Track & Improve Your Finances
          </h2>
          <p className="text-center mb-3 max-w-2xl mx-auto  text-xs sm:text-base">
            Simplify your financial journey with our easy-to-follow process.
            Track spending, set goals, and get personalized insights—all in one
            place.
          </p>
        </div>
        {benefits.map((feature, index) => (
          <BenifitsSectionCard key={index} {...feature} />
        ))}
      </Card>
    </section>
  );
}

const features = [
  {
    title: "Budgeting Tools",
    description: "Create and manage budgets with ease to stay on track.",
    icon: <DollarSign className="h-10 w-10 text-primary" />,
  },
  {
    title: "Spending Analytics",
    description: "Visualize your spending habits with detailed reports.",
    icon: <LineChart className="h-10 w-10 text-primary" />,
  },
  {
    title: "Account Aggregation",
    description: "Connect all your financial accounts in one place.",
    icon: <Wallet className="h-10 w-10 text-primary" />,
  },
  {
    title: "Secure & Private",
    description: "Your financial data is protected with top-tier security.",
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
  },
];
