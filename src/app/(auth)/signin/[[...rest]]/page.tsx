"use client";
import { useSession, getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useEffect, useState } from "react";
import { OptionItem } from "@/types";
import Image from "next/image";
import { CircleUserIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import { LoginForm } from "@/components/login-form";

const Page = () => {
  // const [providers, setProviders] = useState<OptionItem[] | null>(null);
  const [google, setGoogle] = useState<OptionItem | undefined>(undefined);
  const [customOidc, setCustomOidc] = useState<OptionItem | undefined>(
    undefined,
  );
  const { data: session } = useSession();
  // If the user is already logged in, redirect.
  if (session) {
    return redirect("/dashboard");
  }

  const { data: configuredProviders, isPending } = useQuery({
    queryKey: ["get-providers"],
    queryFn: getProviders,
  });

  useEffect(() => {
    if (configuredProviders) {
      Object.keys(configuredProviders).forEach((key) => {
        if (key === "google")
          setGoogle({
            id: configuredProviders[key].id,
            title: configuredProviders[key].name,
            icon: Icons.google,
          });
        else if (key !== "google" && key !== "credentials")
          setCustomOidc({
            id: configuredProviders[key]?.id as string,
            title: configuredProviders[key]?.name as string,
            icon: CircleUserIcon,
          });
      });
    } else {
      setGoogle(undefined);
      setCustomOidc(undefined);
    }
    // if (configuredProviders) {
    //   setProviders(
    //     Object.keys(configuredProviders).map((key) => ({
    //       id: configuredProviders[key]?.id as string,
    //       title: configuredProviders[key]?.name as string,
    //     })),
    //   );
    // } else setProviders(null);
  }, [configuredProviders]);

  // const handleOAuthSignIn = async (providerId: string) => {
  //   try {
  //     const response = await signIn(providerId, { callbackUrl: "/welcome" });
  //     console.log("success oauth2 res: ", response);
  //   } catch (e: any) {
  //     console.log("oauth2 req failed: ", e);
  //   }
  // };

  return (
    <div className="mt-4 flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <Image width={32} height={32} src={"/favicon.ico"} alt="logo"></Image>
        <h2 className="text-2xl/8 font-semibold text-foreground/90">
          Вход в Алфавитки
        </h2>
      </div>

      {isPending ? (
        <div className="flex flex-col gap-4">
          <p>Получаем список доступных способов авторизации...</p>
          <LoadingSpinner />
        </div>
      ) : google || customOidc ? (
        <LoginForm google={google} customOidc={customOidc} />
      ) : (
        <p className="mt-4 font-semibold">Нет доступных способов авторизации</p>
      )}
      {/* {providers ? (
        providers.map((provider, idx) => (
          <Button
            key={idx}
            className="background-color w-full max-w-sm rounded-sm p-2 text-base font-semibold text-white"
            onClick={() => handleOAuthSignIn(provider.id)}
          >
            Продолжить с {provider.title}
          </Button>
        ))
      ) : (
        <p className="font-semibold">Нет доступных способов авторизации</p>
      )} */}

      {/* <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      /> */}
    </div>
  );
};

export default Page;
