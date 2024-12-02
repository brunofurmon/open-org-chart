import { Inter } from "next/font/google";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
  return (
    <html>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
