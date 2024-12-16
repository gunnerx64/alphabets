"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionItem } from "@/types";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  google?: OptionItem;
  customOidc?: OptionItem;
} & React.ComponentPropsWithoutRef<"div">;

export function LoginForm({
  google,
  customOidc,
  className,
  ...props
}: LoginFormProps) {
  const handleOAuthSignIn = async (providerId: string) => {
    return await signIn(providerId, { callbackUrl: "/welcome" });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-foreground/90">
            Добро пожаловать
          </CardTitle>
          <CardDescription>
            Войдите в систему с помощью сервиса OAuth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                {customOidc && (
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => {
                      handleOAuthSignIn(customOidc.id);
                    }}
                  >
                    {customOidc.icon && <customOidc.icon />}
                    Продолжить с {customOidc.title}
                  </Button>
                )}
                {google && (
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={() => {
                      handleOAuthSignIn(google.id);
                    }}
                  >
                    {google.icon && <google.icon />}
                    Продолжить с {google.title}
                  </Button>
                )}
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Или авторизуйтесь
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input id="username" type="text" placeholder="" required />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Пароль</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Забыли пароль?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  Войти
                </Button>
              </div>
              <div className="text-center text-sm">
                Ещё не зарегистрированы?{" "}
                <a href="#" className="underline underline-offset-4">
                  Регистрация
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-pretty text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Нажимая Войти, вы соглашаетесь <a href="#">Условиями использования</a>
        <br /> и <a href="#">Политикой обработки данных</a>.
      </div>
    </div>
  );
}
