# Alphabets - Проект для управления алфавитками

Разработан с использованием Next.js, React, Drizzle ORM, Postgres, TypeScript, TailwindCSS, Auth.js и shadcn-ui.

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

![Project Image](https://github.com/gunnerx64/alphabets/blob/master/public/thumbnail.jpg)

## Features

- 💻 Beautiful landing page included
- 🌟 Clean, modern UI on top of shadcn-ui
- 🔑 Authentication using Auth.js
- ⌨️ 100% written in TypeScript

## Getting started

To get started with this project, run

```bash
  git clone https://github.com/gunnerx64/alphabets.git
```

and copy the .env.example variables into a separate .env file, fill them out & and that's all you need to get started!

## Особенности

- для работы shadcn ComboBox пакет cmdk должен быть версии не выше 0.2.1

```bash
  pnpm add cmdk@0.2.1
```

- trpc использует класс TextDecoderStream, он поддерживается в Firefox 105+, для поддержки старых браузеров необходимо импортировать библиотеку @stardazed/streams-polyfill

```bash
  pnpm add @stardazed/streams-polyfill
```

В файле клиентского провайдера, например, ThemeProvider:

```js
import "@stardazed/streams-polyfill";
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
