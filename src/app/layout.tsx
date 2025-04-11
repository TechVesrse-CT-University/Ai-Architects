import {Metadata} from 'next';
import {Inter} from 'next/font/google';
import "./globals.css";
import {ThemeProvider} from '@/components/theme-provider';
import {ProctorProvider} from "@/context/ProctorContext";
import {AuthProvider} from "@/context/AuthContext";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ProctorAI',
  description: 'AI-powered exam proctoring system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProctorProvider>
              {children}
              <Toaster />
            </ProctorProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
