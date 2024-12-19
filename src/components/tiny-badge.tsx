import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TinyBadge(props: BadgeProps) {
  const { children, className, ...otherProps } = props;
  return (
    <Badge
      variant="secondary"
      className={cn("px-[2px]", className)}
      {...otherProps}
    >
      {children}
    </Badge>
  );
}
