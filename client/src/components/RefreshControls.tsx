import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RefreshControlsProps {
  refreshInterval: number;
  onRefreshIntervalChange: (interval: number) => void;
  onManualRefresh: () => void;
  isRefreshing?: boolean;
}

const REFRESH_OPTIONS = [
  { value: 0, label: "Off" },
  { value: 5000, label: "5 seconds" },
  { value: 10000, label: "10 seconds" },
  { value: 30000, label: "30 seconds" },
  { value: 60000, label: "1 minute" },
  { value: 300000, label: "5 minutes" },
];

export default function RefreshControls({
  refreshInterval,
  onRefreshIntervalChange,
  onManualRefresh,
  isRefreshing = false,
}: RefreshControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={refreshInterval.toString()}
        onValueChange={(value) => onRefreshIntervalChange(parseInt(value))}
      >
        <SelectTrigger className="w-32" data-testid="select-refresh-interval">
          <SelectValue placeholder="Auto-refresh" />
        </SelectTrigger>
        <SelectContent>
          {REFRESH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={onManualRefresh}
        disabled={isRefreshing}
        data-testid="button-manual-refresh"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
