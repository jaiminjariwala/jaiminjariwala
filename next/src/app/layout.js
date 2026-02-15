import { Inter, Short_Stack } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
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

export const metadata = {
  title: "Jaimin Jariwala",
  description: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${shortStack.variable} ${inter.className}`}>
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
