import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  title: "Jaimin Jariwala",
  description: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>
          <main>{children}</main>
        </ClientShell>
      </body>
    </html>
  );
}
