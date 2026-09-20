import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { AccountProvider } from "@/components/account-provider";
import "./globals.css";
export const metadata: Metadata = {
  title: "socratescode | The learning lab",
  description:
    "Practice programming logic through guided questions, visual traces, and the PRIMM learning method.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AccountProvider><Shell>{children}</Shell></AccountProvider>
      </body>
    </html>
  );
}
