import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Header from "./components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({
  children,
  header,
}: {
  children: ReactNode;
  header: any;
}): JSX.Element => {
  return (
    <div className={inter.className}>
      <Header {...header} />
      {children}
    </div>
  );
};

export default Layout;
