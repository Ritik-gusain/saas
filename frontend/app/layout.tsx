import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luminescent.io — Team AI Chatbot for Modern Teams",
  description:
    "Stop paying ₹1,600/user for individual ChatGPT seats. Luminescent gives your entire team unified AI with shared history, system prompts, and autonomous agents — at half the cost.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "team AI chatbot",
    "ChatGPT for teams",
    "AI team collaboration",
    "AI SaaS India",
    "Bytez AI",
    "team AI subscription",
  ],
  openGraph: {
    title: "Luminescent.io — Team AI Chatbot for Modern Teams",
    description:
      "One AI subscription for your whole team. Shared history, brand-voice prompts, and AI agents that actually do the work.",
    url: "https://luminescent.io",
    siteName: "Luminescent.io",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminescent.io — Team AI Chatbot",
    description: "Replace fragmented individual AI seats with one unified team plan.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased bg-[var(--bg)]">{children}</body>
    </html>
  );
}
