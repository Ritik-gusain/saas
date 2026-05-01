import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luminescent — Team AI Chatbot for Modern Teams",
  description:
    "Stop paying ₹1,600/user for individual ChatGPT seats. Luminescent gives your entire team unified AI with shared history, system prompts, and autonomous agents — at half the cost.",
  keywords: [
    "team AI chatbot",
    "ChatGPT for teams",
    "AI team collaboration",
    "AI SaaS India",
    "Luminescent",
    "team AI subscription",
  ],
  openGraph: {
    title: "Luminescent — Team AI Chatbot for Modern Teams",
    description:
      "One AI subscription for your whole team. Shared history, brand-voice prompts, and AI agents that actually do the work.",
    url: "https://frontend-lilac-nine-28.vercel.app",
    siteName: "Luminescent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminescent — Team AI Chatbot",
    description: "Replace fragmented individual AI seats with one unified team plan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@100..900&family=DM+Mono:wght@400;500&family=Lora:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen antialiased bg-[var(--bg)] font-['Inter']">{children}</body>
    </html>
  );
}
