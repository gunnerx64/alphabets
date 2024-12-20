import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ErrorCard(props: {
  title: string;
  desc?: string;
  children?: ReactNode;
}) {
  return (
    <Card className="mx-auto mt-12 max-w-lg">
      <CardHeader>
        <CardTitle>Ошибка</CardTitle>
        <CardDescription>{props.title}</CardDescription>
      </CardHeader>
      {props.desc && (
        <CardContent className="break-all">{props.desc}</CardContent>
      )}
      <CardFooter>{props.children && props.children}</CardFooter>
    </Card>
  );
}
