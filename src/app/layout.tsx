"use client";
import "./globals.css";
import type { Metadata } from "next";
import { TelegramProvider } from "@/providers/telegram-provider";
import { ContextProvider } from "@/providers/context-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  return (
    <html lang="en">
      <body>
        <TelegramProvider>
          <ContextProvider>
            <div className="menu">
              <div className="back-btn" onClick={router.back}>
                &#11013;
              </div>
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
