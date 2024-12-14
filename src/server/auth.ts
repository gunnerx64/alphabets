import NextAuth, { DefaultSession, Profile, NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import {
  AUTH_CUSTOM_CODENAME,
  AUTH_CUSTOM_ID,
  AUTH_CUSTOM_SECRET,
  AUTH_CUSTOM_TITLE,
  AUTH_CUSTOM_URL,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
} from "@/config";

interface ProfilePosition {
  position?: string | null;
}

interface ProfileUnit {
  unit?: {
    id?: number | null;
    name?: string | null;
  };
}

declare module "next-auth" {
  /** Объект сессии, доступный на клиенте и сервере, содержит объект пользователя */
  interface Session {
    /** Available when AuthConfig.session is set to `strategy: "database"`. */
    user: ProfilePosition & ProfileUnit & Profile & DefaultSession["user"];
  }

  /**
   * The OAuth profile returned from your provider.
   * (In case of OIDC it will be the decoded ID Token or /userinfo response)
   * @note available when `trigger` is `"signIn"`.
   */
  interface Profile extends ProfilePosition, ProfileUnit {}
}

declare module "next-auth/jwt" {
  interface JWT extends ProfilePosition, ProfileUnit, Profile {}
}

if (!process.env.AUTH_CUSTOM_ID)
  console.error("auth: env var AUTH_CUSTOM_ID must be set");
if (!process.env.AUTH_CUSTOM_SECRET)
  console.error("auth: env var AUTH_CUSTOM_SECRET must be set");
if (!process.env.AUTH_CUSTOM_URL)
  console.error("auth: env var AUTH_CUSTOM_URL must be set");

export const providers: any[] = [];
// const AUTH_CUSTOM_CODENAME = process.env.AUTH_CUSTOM_CODENAME;
// const AUTH_CUSTOM_TITLE = process.env.AUTH_CUSTOM_TITLE;
// const AUTH_CUSTOM_URL = process.env.AUTH_CUSTOM_URL;
// const AUTH_CUSTOM_ID = process.env.AUTH_CUSTOM_ID;
// const AUTH_CUSTOM_SECRET = process.env.AUTH_CUSTOM_SECRET;
if (
  AUTH_CUSTOM_CODENAME &&
  AUTH_CUSTOM_TITLE &&
  AUTH_CUSTOM_URL &&
  AUTH_CUSTOM_ID &&
  AUTH_CUSTOM_SECRET
)
  providers.push({
    id: AUTH_CUSTOM_CODENAME,
    name: AUTH_CUSTOM_TITLE,
    type: "oidc",
    /**
     * OpenID Connect (OIDC) compliant providers can configure
     * this instead of `authorize`/`token`/`userinfo` options
     * without further configuration needed in most cases.
     * You can still use the `authorize`/`token`/`userinfo`
     * options for advanced control.
     * PS: не работает, запрашивает другой адрес '/.well-known/openid-configuration'
     */
    // wellKnown: `${process.env.OAUTH_SERVER_URL}/.well-known/oauth-authorization-server`,
    //   authorization: {
    //     url: "https://your-oauth2-server.com/oauth/authorize",
    //     params: { grant_type: "authorization_code" },
    //   },
    authorization: {
      url: `${AUTH_CUSTOM_URL}/authorize`,
      params: { scope: "openid email profile" },
    },
    token: `${AUTH_CUSTOM_URL}/token`,
    // userinfo: { url: `${process.env.OAUTH_SERVER_URL}/userinfo` },
    clientId: AUTH_CUSTOM_ID,
    clientSecret: AUTH_CUSTOM_SECRET,
    issuer: AUTH_CUSTOM_URL,
    /**
     * If set to `true`, the user information will be extracted
     * from the `id_token` claims, instead of
     * making a request to the `userinfo` endpoint.
     *
     * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
     */
    idToken: true,
    checks: ["pkce", "state", "nonce"],
    // profile(profile: Profile) {
    //   console.log("Got profile object: ", profile);
    //   console.log(`id token issued at ${new Date(profile.iat * 1000)}`);
    //   console.log(`id token expires at ${new Date(profile.exp * 1000)}`);
    //   return {
    //     id: profile.id,
    //     name: profile.name,
    //     email: profile?.email || "н/д",
    //     image: profile?.picture || "/logo/noname.png",
    //     position: profile.position || "н/д",
    //     lastname: profile?.lastname,
    //     firstname: profile.firstname,
    //     middlename: profile.middlename,
    //     unit: profile.unit || undefined,
    //   };
    // },
    style: {
      // brandColor: "#176BEF",
      brandColor: "rgb(23,107,239)",
      logo: "/img/vvaid.png",
    },
  });

if (AUTH_GOOGLE_ID && AUTH_GOOGLE_SECRET)
  providers.push(
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  );

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
  debug: false,
  // для работы через прокси
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    signIn: async ({ account, profile }) => {
      if (account?.provider === "google") {
        if (!profile?.email_verified)
          console.warn(`Эл.почта ${profile?.email} не подтверждена. Запрет.`);
        return !!profile?.email_verified;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    // user is available only with strategy "database"
    session({ session, token /* user */ }) {
      // console.log(`session(): token = `, token);
      // console.log(`id token issued at ${new Date((token.iat || 0) * 1000)}`);
      // console.log(`id token expires at ${new Date((token.exp || 0) * 1000)}`);
      return {
        ...session,
        user: {
          ...session.user,
          id: token?.id || undefined,
          nickname: token.nickname,
          position: token?.position,
          unit: token?.unit,
          given_name: token.given_name,
          middle_name: token.middle_name,
          family_name: token.family_name,
        },
      };
    },
    jwt({ token, profile }) {
      // console.log(`Auth JWT Tok = ${JSON.stringify(token)}`);
      // console.log(`Router Auth JWT account = ${JSON.stringify(account)}`);
      // console.log(`Account Profile = ${JSON.stringify(profile)}`);

      if (profile) {
        console.log(`appending profile object: ${JSON.stringify(profile)}`);
        // Store the provider's access token in the token so that we can put it in the session in the session callback above
        token.id = profile.id || profile.sub;
        token.nickname = profile.nickname;
        token.position = profile.position;
        token.unit = profile.unit;
        token.given_name = profile.given_name;
        token.middle_name = profile.middle_name;
        token.family_name = profile.family_name;
      }

      return token;
    },
  },
  //   session: {
  //     jwt: true,
  //   },
  //   callbacks: {
  //     async jwt(token, user) {
  //       if (user) {
  //         token.id = user.id;
  //       }
  //       return token;
  //     },
  //     async session(session, token) {
  //       session.user.id = token.id;
  //       return session;
  //     },
  //   },
  pages: {
    signIn: "/signin", // custom sign-in page
  },
} satisfies NextAuthConfig);
