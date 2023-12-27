import { Roboto } from "next/font/google";
import { ReactNode } from "react";
import Header from "./components/Header/Header";

const inter = Roboto({ weight: ["100", "300", "400"], subsets: ["latin"] });

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
