import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import React from "react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

const InfoCard = ({ icon, label, variant, numberOfItems }: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge icon={icon} variant={variant} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
