import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

type InfoCardProps = {
  numberOfItems: number;
  icon: LucideIcon;
  variant: "default" | "success";
  label: string;
};

export default function InfoCard({
  numberOfItems,
  icon: Icon,
  variant,
  label,
}: InfoCardProps) {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <div className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </div>
      </div>
    </div>
  );
}
