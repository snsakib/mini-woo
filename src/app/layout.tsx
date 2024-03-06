"use client";
import "./globals.css";
import type { Metadata } from "next";
import { TelegramProvider } from "@/providers/telegram-provider";
import { ContextProvider } from "@/providers/context-provider";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// export const metadata: Metadata = {
//   title: "MiniWoo",
//   description: "Telegram mini app for woocommerce integration",
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     userScalable: false,
//     viewportFit: "cover",
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <TelegramProvider>
          <ContextProvider>
            <div className="menu">
              {pathname !== "/" && (
                <button className="back-btn" onClick={() => router.back()}>
                  &#11013;
                </button>
              )}
              <Link href="/" className="back-btn">
                Home
              </Link>
            </div>
            {children}
          </ContextProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
