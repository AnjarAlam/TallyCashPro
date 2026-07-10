import { icons, LucideProps } from "lucide-react";
import { useMemo } from "react";

type LucideIcon = React.ForwardRefExoticComponent<
  LucideProps & React.RefAttributes<SVGSVGElement>
>;

const iconEntries = Object.entries(icons) as [string, LucideIcon][];

// Basic version without React hooks
export const findBestIcon = (category: string): LucideIcon => {
  const normalized = category.toLowerCase();

  const exactMatch = iconEntries.find(([name]) => name === normalized);
  if (exactMatch) return exactMatch[1];

  const partialMatch = iconEntries.find(
    ([name]) => name.includes(normalized) || normalized.includes(name)
  );

  return partialMatch?.[1] || icons["Folder"];
};

// React hook version that memoizes the result
export const useBestIcon = (category: string) => {
  return useMemo(() => findBestIcon(category), [category]);
};
