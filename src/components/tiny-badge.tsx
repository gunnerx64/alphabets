import { Badge, BadgeProps } from "@/components/ui/badge";

export function TinyBadge(props: BadgeProps) {
  const { children, ...otherProps } = props;
  return (
    <Badge
      {...otherProps}
      variant="outline"
      className="px-[2px] text-primary/80"
    >
      {children}
    </Badge>
  );
}
