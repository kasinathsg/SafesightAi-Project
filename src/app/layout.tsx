import "./globals.css";
import RootLayoutInner from "../components/RootLayout";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "SafeSight AI",
  description: "Your App Description",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <RootLayoutInner>{children}</RootLayoutInner>
        <Toaster />
      </body>
    </html>
  );
}
