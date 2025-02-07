import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

type DataCardProps = {
  value: number | undefined;
  label: string;
  shouldFormat?: boolean;
};
export default function DataCard({
  value,
  label,
  shouldFormat,
}: DataCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>{shouldFormat ? formatPrice(value ?? 0) : value}</div>
      </CardContent>
    </Card>
  );
}
