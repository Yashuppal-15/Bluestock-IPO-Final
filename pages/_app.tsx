import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Hide Navbar and Footer on admin pages
  const hideNavFooter = router.pathname.startsWith("/admin");

  return (
    <SessionProvider session={(pageProps as any).session}>
      {!hideNavFooter && <Navbar />}
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
        {!hideNavFooter && <Footer />}
      </div>
    </SessionProvider>
  );
}

export default MyApp;
