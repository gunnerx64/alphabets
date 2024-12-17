import { Heading } from "@/components/heading";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Check, Star } from "lucide-react";
import { ShinyButton } from "@/components/shiny-button";
import { MockDiscordUI } from "@/components/mock-discord-ui";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { DiscordMessage } from "@/components/discord-message";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Icons } from "@/components/icons";
import { env } from "@/env";

const Page = () => {
  const customServerName = env.AUTH_CUSTOM_TITLE;
  const codeSnippet = `await fetch("http://localhost:3000/api/v1/events", {
  method: "POST",
  body: JSON.stringify({
    category: "sale",
    fields: {
      plan: "PRO",
      email: "zoe.martinez2001@email.com",
      amount: 49.00
    }
  }),
  headers: {
    Authorization: "Bearer <YOUR_API_KEY>"
  }
})`;

  return (
    <>
      <section className="relative py-24 sm:py-32">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto flex flex-col items-center gap-10 text-center">
            <div>
              <Heading>
                <span>Поиск архивных алфавиток</span>
                <br className="my-1" />
                <span className="relative bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent dark:from-brand-500 dark:to-brand-700">
                  прямо в Вашем веб-браузере
                </span>
              </Heading>
            </div>

            <p className="max-w-prose text-pretty text-center text-base/7 text-zinc-700 dark:text-white/80">
              Проект Алфавитки предназначен для{" "}
              <span className="font-semibold">
                оцифровки, хранения, поиска и печати
              </span>{" "}
              архивных алфавиток.
            </p>

            <ul className="flex flex-col items-start space-y-2 text-left text-base/7 text-zinc-700 dark:text-white/80">
              {[
                "Оцифровка архивных алфавиток",
                "Фильтр и сортировка алфавиток, хранящихся в базе данных",
                "Сохранение скана оригинала алфавитки",
                "Экспорт и печать алфавиток в формализованном формате",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-1.5 text-left">
                  <Check className="size-5 shrink-0 text-brand-700" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="w-full max-w-80">
              <ShinyButton
                href="/dashboard"
                className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                Начать пользоваться
              </ShinyButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* <section className="relative pb-4">
        <div className="absolute inset-x-0 bottom-24 top-24 bg-brand-700" />
        <div className="relative mx-auto">
          <MaxWidthWrapper className="relative">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <MockDiscordUI>
                <AnimatedList>
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 12:35PM"
                    badgeText="SignUp"
                    badgeColor="#43b581"
                    title="👤 New user signed up"
                    content={{
                      name: "Mateo Ortiz",
                      email: "m.ortiz19@gmail.com",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 12:35PM"
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                    title="💰 Payment received"
                    content={{
                      amount: "$49.00",
                      email: "zoe.martinez2001@email.com",
                      plan: "PRO",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="PingPanda Avatar"
                    username="PingPanda"
                    timestamp="Today at 5:11AM"
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                    title="🚀 Revenue Milestone Achieved"
                    content={{
                      recurringRevenue: "$5.000 USD",
                      growth: "+8.2%",
                    }}
                  />
                </AnimatedList>
              </MockDiscordUI>
            </div>
          </MaxWidthWrapper>
        </div>
      </section> */}

      <section className="relative bg-slate-200 py-24 dark:bg-slate-800 sm:py-32">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              Интуитивный интерфейс веб-приложения
            </h2>
            <Heading className="text-center">
              Панель управления базой данных алфавиток
            </Heading>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {/* first bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-slate-700 lg:rounded-l-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                    Таблица поиска
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-foreground/70 max-lg:text-center">
                    В таблице в компактном виде отображены все заполненные
                    сведения об алфавитке, также доступны действия
                    редактирования, печати и удаления.
                  </p>
                </div>

                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                    <Image
                      className="size-full object-cover object-top"
                      src="/phone-screen.png"
                      alt="Phone screen displaying app interface"
                      fill
                    />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />
            </div>

            {/* second bento grid element */}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-slate-700 max-lg:rounded-t-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
                    Упрощенная авторизация
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-foreground/70 max-lg:text-center">
                    В систему можно войти через OAuth сервис {customServerName}.
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs"
                    src="/bento-any-event.png"
                    alt="Bento box illustrating event tracking"
                    width={500}
                    height={300}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
            </div>

            {/* third bento grid element */}
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-slate-700" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="tracking-tightmax-lg:text-center mt-2 text-lg/7 font-medium">
                    Администрирование
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-foreground/70 max-lg:text-center">
                    Позволяет управлять пользователями и их правами,
                    редактировать список регионов.
                  </p>
                </div>

                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs"
                    src="/bento-custom-data.png"
                    alt="Bento box illustrating custom data tracking"
                    width={500}
                    height={300}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>

            {/* fourth bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white dark:bg-slate-700 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />

              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="tracking-tightmax-lg:text-center mt-2 text-lg/7 font-medium">
                    Экспорт и печать
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text-foreground/70 max-lg:text-center">
                    Печать и экспорт алфавитки в формализованном виде доступны
                    после заполнения всех необходимых полей на странице
                    редактирования.
                  </p>
                </div>

                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                        <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                          pingpanda.js
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <div className="max-h-[30rem]">
                        <SyntaxHighlighter
                          language="typescript"
                          style={{
                            ...oneDark,
                            'pre[class*="language-"]': {
                              ...oneDark['pre[class*="language-"]'],
                              background: "transparent",
                              overflow: "hidden",
                            },
                            'code[class*="language-"]': {
                              ...oneDark['code[class*="language-"]'],
                              background: "transparent",
                            },
                          }}
                        >
                          {codeSnippet}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="relative py-24 sm:py-32">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              Опыт использования
            </h2>
            <Heading className="text-center">
              Что говорят пользователи системы
            </Heading>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 divide-y divide-gray-200 px-4 dark:divide-slate-600 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* first customer review */}
            <div className="flex flex-auto flex-col gap-4 rounded-t-[2rem] p-6 dark:bg-slate-800 sm:p-8 lg:rounded-l-[2rem] lg:rounded-tr-none lg:p-16">
              <div className="mb-2 flex justify-center gap-0.5 lg:justify-start">
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
              </div>

              <p className="text-pretty text-center text-base font-medium tracking-tight text-foreground/90 sm:text-lg lg:text-left lg:text-lg/8">
                До внедрения проекта Алфавитки я тратила до двух часов рабочего
                времени на поиск алфавиток в архиве и заполнение формы в формате
                .doc ☹️. Теперь процесс поиска и печати алфавиток занимает около
                минуты, сэкономленное время могу посвятить своему профилю в
                инстаграме 🤩.
              </p>

              <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start lg:justify-start">
                <Image
                  src="/user-2.png"
                  className="rounded-full object-cover"
                  alt="Random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="flex items-center font-semibold">
                    Светлана М.
                    <Icons.verificationBadge className="ml-1.5 inline-block size-4" />
                  </p>
                  <p className="text-sm text-gray-600">@itsfreya</p>
                </div>
              </div>
            </div>

            {/* second customer review */}
            <div className="flex flex-auto flex-col gap-4 rounded-b-[2rem] bg-white p-6 dark:bg-slate-800 sm:p-8 lg:rounded-r-[2rem] lg:rounded-bl-none lg:p-16">
              <div className="mb-2 flex justify-center gap-0.5 lg:justify-start">
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
                <Star className="size-5 fill-brand-600 text-brand-600" />
              </div>

              <p className="text-pretty text-center text-base font-medium tracking-tight text-foreground/90 sm:text-lg lg:text-left lg:text-lg/8">
                Внедрение проекта Алфавитки позволило оцифровать архив старых
                алфавиток. Теперь у меня появилось свободное время, чтобы в
                опустевшем коридоре, в котором хранился архив, сыграть в
                мини-гольф 🏑. Особая благодарность программистам за разработку
                такой чудесной программы 🚀.
              </p>

              <div className="mt-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-start lg:justify-start">
                <Image
                  src="/user-1.png"
                  className="rounded-full object-cover"
                  alt="Random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="flex items-center font-semibold">
                    Евгений Б.
                    <Icons.verificationBadge className="ml-1.5 inline-block size-4" />
                  </p>
                  <p className="text-sm text-gray-600">@kdurant_</p>
                </div>
              </div>
            </div>
          </div>

          <ShinyButton
            href="/dashboard"
            className="relative z-10 h-14 w-full max-w-xs text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Панель управления
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
    </>
  );
};

export default Page;
