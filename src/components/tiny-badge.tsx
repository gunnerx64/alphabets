import { Badge, BadgeProps } from "@/components/ui/badge";

export function TinyBadge(props: BadgeProps) {
  const { children, ...otherProps } = props;
  return (
    <Badge {...otherProps} variant="secondary" className="px-[2px]">
      {children}
    </Badge>
  );
}
