import type { Metadata } from 'next';
import './globals.css';
import GlobalNav from '@/components/layout/GlobalNav';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: '命理 사주 — 정밀 사주팔자 분석',
  description: '생년월일시를 입력하면 사주팔자를 자동 산출하고, 오행·천간·지지 분석부터 대운·세운까지 종합 명리 해석을 제공합니다.',
  keywords: '사주, 사주팔자, 명리, 오행, 대운, 세운, 천간, 지지',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/LXGWWenKaiKR-Regular.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <GlobalNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
