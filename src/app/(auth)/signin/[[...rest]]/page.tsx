"use client";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, redirect } from "next/navigation";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { AUTH_CUSTOM_CODENAME, AUTH_CUSTOM_TITLE } from "@/config";

const providers: { id: string; title: string }[] = [];
if (AUTH_CUSTOM_CODENAME && AUTH_CUSTOM_TITLE) {
  providers.push({
    id: AUTH_CUSTOM_CODENAME,
    title: AUTH_CUSTOM_TITLE,
  });
}
providers.push({
  id: "google",
  title: "Google",
});

const Page = () => {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const { data: session } = useSession();
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return redirect("/dashboard");
  }

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
      {providers ? (
        providers.map((p, idx) => (
          <Button
            key={idx}
            className="background-color w-full max-w-sm rounded-sm p-2 text-base font-semibold text-white"
            onClick={() => handleOAuthSignIn(p.id)}
          >
            Продолжить с {p.title}
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
