import type { Metadata, Viewport } from "next";
import { Agbalumo, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const agbalumo = Agbalumo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-agbalumo",
  // 이렇게 하면 내부적으로 이런 css를 생성함
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

const APP_NAME = "WagleWagle";
const APP_DESCRIPTION =
  "축제의 모든 즐거움이 와글와글! 실시간 혼잡도를 확인하세요.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "와글와글 - 실시간 축제 현황",
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b1e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${agbalumo.variable} ${notoSansKR.variable} bg-[#0a0b1e] text-white antialiased min-h-dvh w-full overflow-x-hidden`}
        style={{ fontFamily: "var(--font-noto)" }}
      >
        <main className="mx-auto min-h-screen max-w-[430px] shadow-2xl shadow-black/50">
          {children}
        </main>
      </body>
    </html>
  );
}
