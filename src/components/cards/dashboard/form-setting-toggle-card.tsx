import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { fieldConfigurations } from "@/config";

export default function FieldToggleCard({
  field,
  isVisible,
  onToggle,
}: {
  field: string;
  isVisible: boolean;
  onToggle: () => void;
}) {
  const config = fieldConfigurations[field];

  if (!config) return null;

  return (
    <Label
      htmlFor={field}
      // onClick={onToggle}
      className={`flex flex-col items-center justify-between p-4 rounded-lg border gap-2 cursor-pointer transition-all
        ${
          isVisible
            ? "bg-green-100/80 border-green-300 shadow-sm hover:shadow-md hover:border-green-400"
            : "bg-gray-100/70 border-gray-200 hover:bg-gray-200/50 hover:border-gray-300"
        }
        hover:shadow-sm whover:translate-y-[-1px] active:translate-y-0`}
    >
      <div className="flex items-start justify-between w-full">
        <div className="space-y-1 flex-1 w-full">
          <h2 className="font-medium flex items-center">
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          <p
            className={`text-xs ${
              isVisible ? "text-green-700" : "text-gray-600"
            }`}
          >
            {config.description}
          </p>
        </div>
        <div className="space-y-2">
          <div
            className={`p-2 rounded-md transition-colors ${
              isVisible
                ? "bg-green-200 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            <config.icon className="h-4 w-4" />
          </div>
          <Switch
            id={field}
            checked={isVisible}
            onCheckedChange={onToggle}
            className={`${
              isVisible ? "data-[state=checked]:bg-green-600" : ""
            }`}
          />
        </div>
      </div>
    </Label>
  );
}
