import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { type Metadata } from "next";
import { DocumentProvider } from "@/components/document-provider";

export const metadata: Metadata = {
  title: "Collaboration Rerender Demo",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={` ${inter.className}`}>
      <DocumentProvider documentId="my-document">
        <body>{children}</body>
      </DocumentProvider>
    </html>
  );
}
