import { DollarSign, LineChart, Wallet, ShieldCheck } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-12">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Key Features
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Empower Your Financial Journey
          </h2>
          <p className="max-w-2xl text-muted-foreground text-base md:text-lg">
            Cash Track provides you with the tools you need to take control of
            your money.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border bg-background p-6 shadow-md transition hover:shadow-lg hover:-translate-y-1 duration-200 text-center"
            >
              <div className="flex justify-center items-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
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
