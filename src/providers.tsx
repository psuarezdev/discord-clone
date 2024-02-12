'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import ThemeProvider from './components/providers/theme-provider';
import ModalProvider from './components/providers/modal-provider';
import SocketProvider from './components/providers/socket-provider';
import QueryProvider from './components/providers/query-provider';

export default function Providers({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        enableSystem={false}
        storageKey="discord-clone-theme"
      >
        <SocketProvider>
          <ModalProvider />
          <QueryProvider>
            {children}
          </QueryProvider>
        </SocketProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
