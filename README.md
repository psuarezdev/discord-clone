# Fullstack Discord Clone: Next.js 14, TypeScript, PostgreSQL, Socket.io, Prisma, Tailwind

![Captura de pantalla 2024-02-12 005344](https://github.com/psuarezdev/discord-clone/assets/104940521/5a99dd52-79e5-4603-a98b-530b08421b5d)

## Prerequisites

**Node version 18.x.x**

## Setting up the project

### Cloning the repository

```shell
git clone https://github.com/psuarezdev/discord-clone.git
```

### Install packages

```shell
npm i -E
```

### Setup .env file

```js
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_APY_SECRET=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
NEXT_PUBLIC_SITE_URL=
```

### Setup Prisma

```shell
npx prisma migrate dev --name init
```

### Start the app

```shell
npm run dev
```
