import { Inter, Short_Stack } from "next/font/google";
import type {Metadata,Viewport} from 'next';
import type {ReactNode} from 'react';
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import StructuredData from '@/components/StructuredData';
import {SITE_URL,SITE_NAME,HOME_TITLE,SITE_DESCRIPTION,identityGraph,isDeployPreview} from '@/lib/siteSeo.ts';
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});
const shortStack = Short_Stack({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-short-stack",
});

export const metadata:Metadata = {
  metadataBase:new URL(SITE_URL),
  title:{default:HOME_TITLE,template:`%s | ${SITE_NAME}`},
  description:SITE_DESCRIPTION,
  applicationName:SITE_NAME,
  authors:[{name:SITE_NAME,url:SITE_URL}],
  creator:SITE_NAME,
  robots:isDeployPreview()?{index:false,follow:false}:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
  verification:{
    google:process.env.GOOGLE_SITE_VERIFICATION,
    ...(process.env.BING_SITE_VERIFICATION?{other:{'msvalidate.01':process.env.BING_SITE_VERIFICATION}}:{}),
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Jaimin Jariwala",
  },
};

export const viewport:Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }:{children:ReactNode}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className={`${inter.variable} ${shortStack.variable} ${inter.className}`}>
        <StructuredData data={identityGraph}/>
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
