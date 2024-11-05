import { AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva("border text-center p-4 flex items-center w-full", {
  variants: {
    variant: {
      warning: "bg-yellow-200/80 border-yellow-300 text-primary",
      success: "bg-emerald-700 border-emerald-800 text-secondary",
    },
  },
  defaultVariants: {
    variant: "warning",
  },
});

interface BannerVariantProps extends VariantProps<typeof bannerVariants> {
  label: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
};

const Banner = ({ label, variant }: BannerVariantProps) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};

export default Banner;
