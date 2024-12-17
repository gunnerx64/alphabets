import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Profile, type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { Role } from "@/types";
import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // extra user properties
  interface User {
    position?: string | null;
    unitId?: number | null;
    unitName?: string | null;
    active: boolean;
    role: Role;
  }
}

/**
 * Add more providers here.
 *
 * Most other providers require a bit more work than the Discord provider. For example, the
 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
 *
 * @see https://next-auth.js.org/providers/github
 */
export const providers: Provider[] = [];

if (
  env.AUTH_CUSTOM_CODENAME &&
  env.AUTH_CUSTOM_TITLE &&
  env.AUTH_CUSTOM_URL &&
  env.AUTH_CUSTOM_ID &&
  env.AUTH_CUSTOM_SECRET
)
  providers.push({
    id: env.AUTH_CUSTOM_CODENAME,
    name: env.AUTH_CUSTOM_TITLE,
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
      url: `${env.AUTH_CUSTOM_URL}/authorize`,
      params: { scope: "openid email profile" },
    },
    token: `${env.AUTH_CUSTOM_URL}/token`,
    // userinfo: { url: `${process.env.OAUTH_SERVER_URL}/userinfo` },
    clientId: env.AUTH_CUSTOM_ID,
    clientSecret: env.AUTH_CUSTOM_SECRET,
    issuer: env.AUTH_CUSTOM_URL,
    /**
     * If set to `true`, the user information will be extracted
     * from the `id_token` claims, instead of
     * making a request to the `userinfo` endpoint.
     *
     * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
     */
    idToken: true,
    checks: ["pkce", "state", "nonce"],
    //  profile(profile: Profile) {
    //    console.log("Got profile object: ", profile);
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
      logo: "/custom.png",
    },
  });

if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET)
  providers.push(
    GoogleProvider({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  );

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers,
  // providers: [
  //   GoogleProvider,
  // ],
  debug: false,
  //? FIXME for work behind proxy
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    authorized: async ({ auth }) => {
      console.log("Auth.js: authorized callback called");
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    signIn: async ({ account, profile }) => {
      console.log("Auth.js: signIn callback called");
      if (account?.provider === "google") {
        if (!profile?.email_verified)
          console.warn(`Эл.почта ${profile?.email} не подтверждена. Запрет.`);
        return !!profile?.email_verified;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    // user is available only with strategy "database"
    session: ({ session, user /*token*/ }) => ({
      // console.log(`session(): token = `, token);
      ...session,
      user: {
        ...session.user,
        id: user.id,
        active: user.active,
        role: user.role,
        position: user.position,
        unitId: user.unitId,
        unitName: user.unitName,
      },
    }),
    // available when strategy is jwt
    jwt({ token, profile }) {
      console.log("Auth.js: jwt callback called");
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
} satisfies NextAuthConfig;
