import { FeatureCard, HowWeWorkCard } from "@/components/cards";

const howWeWorkConfig = [
  {
    step: 1,
    title: " Effortless Cashbook Management",
    description:
      "Create and maintain multiple cashbooks for different businesses, clients, or use-cases. Log entries, manage inflow/outflow, and track balances — all in one place.",
    imgUrl: "/images/home/19.svg",
  },
  {
    step: 2,
    title: "Team-Based Access Control",
    description:
      "Assign team members to specific businesses or books with role-based permissions (view, edit, or manage). Collaborate securely without data overlap.",
    imgUrl: "/images/home/17.svg",
  },
];

export default function Features() {
  return (
    <section className="sm:py-12 px-6">
      <div className="max-w-6xl mx-auto text-center ">
        <h2 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 max-w-xl mx-auto leading-normal">
          Smart Tools to Track & Improve Your Finances
        </h2>
        <p className="text-center mb-12 max-w-2xl mx-auto sm:text-lg text-sm">
          Simplify your financial journey with our easy-to-follow process. Track
          spending, set goals, and get personalized insights—all in one place.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {howWeWorkConfig.map((item, idx) => (
          <FeatureCard key={idx} {...item} />
        ))}
        <div className="relative col-span-1 sm:col-span-2">
          <FeatureCard
            {...{
              isLong: true,
              step: 3,
              title: "Centralized Business Dashboard",
              description:
                "Get a unified view of all your businesses, team activities, cash flow summaries, and books — right from one powerful dashboard.",
              imgUrl: "/images/home/28.svg",
            }}
          />
        </div>
      </div>
    </section>
  );
}
