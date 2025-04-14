import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const alliance = localFont({
  src: [
    {
      path: "../font/AllianceNo1-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../font/AllianceNo1-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../font/AllianceNo1-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../font/AllianceNo1-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../font/AllianceNo1-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../font/AllianceNo1-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../font/AllianceNo1-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    template: "%s - MSMT Patient Dashboard",
    default: "MSMT Patient Dashboard",
  },
  description:
    "Empowering your mental health journey - Access top-tier mental health care from certified psychiatrists and psychologists—all from the comfort of your home.",
  icons: { icon: "/icon.ico" },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  creator: "MSMT",
  metadataBase: new URL("https://msmt-members-portal.vercel.app/"),
  openGraph: {
    title: "MSMT Patient Dashboard",
    description: "Empowering your mental health journey - Access top-tier mental health care from certified psychiatrists and psychologists—all from the comfort of your home.",
    url: "https://msmt-members-portal.vercel.app/",
    siteName: "MSMT Patient Dashboard",
    images: [
      {
        url: "https://msmt-members-portal.vercel.app/meta-img.png",
        width: 1200,
        height: 628,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(alliance.className, "antialiased")}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
