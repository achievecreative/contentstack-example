import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return <div className={inter.className}>{children}</div>;
};

export default Layout;
