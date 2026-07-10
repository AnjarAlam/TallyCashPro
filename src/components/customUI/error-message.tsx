// components/ErrorMessage.tsx
import { Button } from "@/components/ui/button"; // Your button component

export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <p className="text-red-500">{message}</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}
