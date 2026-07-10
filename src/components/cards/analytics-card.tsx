// components/cards/analytics-card.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useGetEnhancedAnalytics } from "@/services/analytics.service";
import { useGetCashbookById } from "@/services/cashbook.service";
import { CurrencyCode, formatCurrencyAmount, getCurrencyInfo } from "@/constants/currency";
import { ExportButton } from "../buttons/export-button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface AnalyticsCardProps {
  bookId: string;
  businessId: string;
  token: string;
}

export function AnalyticsCard({ bookId, businessId, token }: AnalyticsCardProps) {
  const router = useRouter();

  const {
    analyticsData,
    isAnalyticsPending: isLoading,
    isAnalyticsError: isError,
    analyticsError,
    refetchAnalytics,
  } = useGetEnhancedAnalytics(bookId);

  const { cashbook } = useGetCashbookById(businessId, bookId);
  const currency = (cashbook?.currency || "USD") as CurrencyCode;
  const currencySymbol = getCurrencyInfo(currency).symbol;

  const handleCategoryClick = useCallback((originalName: string) => {
    const category = originalName?.trim();
    if (!category) return;

    router.push(
      `/dashboard/business/${businessId}/${bookId}?category=${encodeURIComponent(category)}`
    );
  }, [router, businessId, bookId]);

  // Function to truncate to 2 decimal places without rounding
  const truncateToTwoDecimals = (value: number): number => {
    return Math.floor(value * 100) / 100;
  };

  // Function to format number to exactly 2 decimal places without rounding
  const formatTwoDecimals = (value: number): string => {
    const truncated = truncateToTwoDecimals(value);
    return truncated.toFixed(2);
  };

  const formatCompactCurrency = (value: number) => {
    const truncatedValue = truncateToTwoDecimals(value);

    if (truncatedValue >= 1000000) {
      return `${currencySymbol}${formatTwoDecimals(truncatedValue / 1000000)}M`;
    }
    if (truncatedValue >= 1000) {
      return `${currencySymbol}${formatTwoDecimals(truncatedValue / 1000)}K`;
    }
    return `${currencySymbol}${formatTwoDecimals(truncatedValue)}`;
  };

  const formatFullCurrency = (value: number) => {
    const truncatedValue = truncateToTwoDecimals(value);
    return formatCurrencyAmount(truncatedValue, currency, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Function to format category names - handle IDs and special cases
  const formatCategoryName = (name: string): string => {
    if (!name) return "Uncategorized";
    
    // If it looks like a MongoDB ID (24 hex chars), return "Other" or handle differently
    if (/^[0-9a-fA-F]{24}$/.test(name)) {
      return "Other";
    }
    
    // Convert to title case
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (isError || !analyticsData) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTitle>Error loading analytics</AlertTitle>
        <AlertDescription className="text-sm">
          {analyticsError?.message || "Failed to load analytics data"}
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-3 text-sm"
          onClick={() => refetchAnalytics()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // Process category breakdown for pie chart with formatted names
  const categoryPieData = analyticsData.categoryBreakdown
    .filter(item => item.totalAmount > 0)
    .map(item => ({
      originalName: item._id.category,
      name: formatCategoryName(item._id.category),
      type: item._id.type,
      value: truncateToTwoDecimals(item.totalAmount),
      count: item.count,
      color: item._id.type === 'cash_in' ? '#10b981' : '#ef4444'
    }))
    .sort((a, b) => b.value - a.value);

  // Process monthly trends for bar chart - combine cash_in and cash_out
  const monthMap = new Map();
  
  analyticsData.monthlyTrends.forEach(trend => {
    const key = `${trend._id.year}-${trend._id.month}`;
    const monthName = new Date(trend._id.year, trend._id.month - 1).toLocaleString('default', { month: 'short' });
    const displayName = `${monthName} ${trend._id.year.toString().slice(-2)}`;
    
    if (!monthMap.has(key)) {
      monthMap.set(key, {
        name: displayName,
        fullMonth: `${monthName} ${trend._id.year}`,
        month: trend._id.month,
        year: trend._id.year,
        cashIn: 0,
        cashOut: 0,
      });
    }
    
    const monthData = monthMap.get(key);
    if (trend._id.type === "cash_in") {
      monthData.cashIn = truncateToTwoDecimals(monthData.cashIn + trend.totalAmount);
    } else if (trend._id.type === "cash_out") {
      monthData.cashOut = truncateToTwoDecimals(monthData.cashOut + trend.totalAmount);
    }
  });

  // Convert to array and sort by date (most recent first)
  const monthlyBarData = Array.from(monthMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    })
    .reverse()
    .slice(-4)
    .map(item => ({
      ...item,
      cashIn: truncateToTwoDecimals(item.cashIn),
      cashOut: truncateToTwoDecimals(item.cashOut)
    }));

  // Calculate max value for Y-axis scaling
  const maxValue = Math.max(...monthlyBarData.map(m => Math.max(m.cashIn, m.cashOut)));

  // Colors for charts
  const COLORS = {
    cashIn: '#10b981',
    cashOut: '#ef4444',
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="flex items-center text-sm">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 mr-2">{entry.name}:</span>
              <span className="font-semibold text-gray-900">
                {formatFullCurrency(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderPieInsideLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (
      cx == null ||
      cy == null ||
      midAngle == null ||
      innerRadius == null ||
      outerRadius == null
    ) {
      return null;
    }

    const truncatedPercent = truncateToTwoDecimals((percent || 0) * 100);
    if (truncatedPercent < 2) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={truncatedPercent < 5 ? 10 : 12}
        fontWeight={600}
      >
        {`${truncatedPercent % 1 === 0 ? truncatedPercent.toFixed(0) : truncatedPercent.toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[180px]">
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold text-gray-900">{formatFullCurrency(data.value)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-semibold capitalize">{data.type.replace('_', ' ')}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Transactions:</span>
              <span className="font-semibold">{data.count}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Prepare summary data with truncated values
  const summaryData = {
    cash_in: {
      totalAmount: truncateToTwoDecimals(analyticsData.summary.cash_in?.totalAmount || 0),
      count: analyticsData.summary.cash_in?.count || 0
    },
    cash_out: {
      totalAmount: truncateToTwoDecimals(analyticsData.summary.cash_out?.totalAmount || 0),
      count: analyticsData.summary.cash_out?.count || 0
    }
  };

  const netBalance = truncateToTwoDecimals(analyticsData.netBalance);
  const income = truncateToTwoDecimals(analyticsData.income);
  const expense = truncateToTwoDecimals(analyticsData.expense);

  return (
    <div className="w-full space-y-6">
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      {/* Top Row: Cash In, Cash Out, Net Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash In Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Cash In</h3>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCompactCurrency(summaryData.cash_in.totalAmount)}
              </div>
              <div className="text-sm text-gray-500">
                {summaryData.cash_in.count} transaction{summaryData.cash_in.count !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-400">
                Exact: {formatFullCurrency(summaryData.cash_in.totalAmount)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Out Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">Cash Out</h3>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCompactCurrency(summaryData.cash_out.totalAmount)}
              </div>
              <div className="text-sm text-gray-500">
                {summaryData.cash_out.count} transaction{summaryData.cash_out.count !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-gray-400">
                Exact: {formatFullCurrency(summaryData.cash_out.totalAmount)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Balance Card */}
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Net Balance</h3>
              <div className={`text-4xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCompactCurrency(netBalance)}
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Income: {formatCompactCurrency(income)}</span>
                <span>Expense: {formatCompactCurrency(expense)}</span>
              </div>
              <div className="text-xs text-gray-400">
                Exact: {formatFullCurrency(netBalance)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <Separator className="my-4" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends - Bar Chart */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyBarData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  barSize={40}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => formatCompactCurrency(value)}
                    domain={[0, maxValue * 1.1]}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm font-medium text-gray-700">
                        {value === 'cashIn' ? 'Cash In' : 'Cash Out'}
                      </span>
                    )}
                  />
                  <Bar 
                    dataKey="cashIn" 
                    name="Cash In"
                    radius={[4, 4, 0, 0]}
                    fill={COLORS.cashIn}
                  />
                  <Bar 
                    dataKey="cashOut" 
                    name="Cash Out"
                    radius={[4, 4, 0, 0]}
                    fill={COLORS.cashOut}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown - Pie Chart */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderPieInsideLabel}
                    outerRadius={90}
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer"
                    onClick={(data) => {
                      const entry = data?.payload as { originalName?: string } | undefined;
                      if (entry?.originalName) {
                        handleCategoryClick(entry.originalName);
                      }
                    }}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2 px-1">
              {categoryPieData.map((entry, index) => (
                <button
                  key={`legend-${index}`}
                  type="button"
                  onClick={() => handleCategoryClick(entry.originalName)}
                  disabled={!entry.originalName?.trim()}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:underline cursor-pointer disabled:cursor-default disabled:hover:no-underline disabled:opacity-60 min-w-0 text-left"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="truncate">
                    {entry.name}: {formatCompactCurrency(entry.value)}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <Separator className="my-4" />

      {/* Download Report Button */}
      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <ExportButton
              bookId={bookId}
              businessId={businessId}
              token={token}
              variant="default"
              className="w-full max-w-xs bg-gray-900 hover:bg-gray-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </ExportButton>
            <span className="text-xs text-gray-500">
              Generated on: {new Date().toLocaleDateString('en-IN', { 
                month: 'short', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}