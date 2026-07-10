import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: number;
  trend: "up" | "down" | "neutral";
}

export function SummaryCard({ title, value, trend }: SummaryCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-blue-600",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "≡",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className={`${trendColors[trend]}`}>{trendIcons[trend]}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

interface TransactionSummaryProps {
  cashIn: number;
  cashOut: number;
}

export function TransactionSummary({
  cashIn,
  cashOut,
}: TransactionSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <SummaryCard title="Cash In" value={cashIn} trend="up" />
      <SummaryCard title="Cash Out" value={cashOut} trend="down" />
      <SummaryCard
        title="Net Balance"
        value={cashIn - cashOut}
        trend={cashIn - cashOut >= 0 ? "up" : "down"}
      />
    </div>
  );
}
