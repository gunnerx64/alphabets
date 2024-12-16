"use client";
import { signIn, useSession, getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useEffect, useState } from "react";
import { OptionItem } from "@/types";

const Page = () => {
  // const searchParams = useSearchParams();
  // const intent = searchParams.get("intent");
  const [providers, setProviders] = useState<OptionItem[] | null>(null);
  const { data: session } = useSession();
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return redirect("/dashboard");
  }

  const { data: configuredProviders, isPending } = useQuery({
    queryKey: ["get-providers"],
    queryFn: getProviders,
  });

  useEffect(() => {
    if (configuredProviders) {
      setProviders(
        Object.keys(configuredProviders).map((key) => ({
          id: configuredProviders[key]?.id as string,
          title: configuredProviders[key]?.name as string,
        })),
      );
    } else setProviders(null);
  }, [configuredProviders]);

  const handleOAuthSignIn = async (providerId: string) => {
    try {
      const response = await signIn(providerId, { callbackUrl: "/welcome" });
      console.log("success oauth2 res: ", response);
    } catch (e: any) {
      console.log("oauth2 req failed: ", e);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-4">
      <Heading className="mb-8">Вход в систему</Heading>
      {isPending ? (
        <div className="flex flex-col gap-4">
          <p>Получаем список доступных способов авторизации...</p>
          <LoadingSpinner />
        </div>
      ) : providers ? (
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
        <p className="font-bold">Нет доступных способов авторизации</p>
      )}

      {/* <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      /> */}
    </div>
  );
};

export default Page;
