import { Inter } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Jaimin Jariwala",
  description: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
