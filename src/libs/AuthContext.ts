import { createContext } from "react";

export type Account = {
  account?: {
    name: string;
  };
};

const authContext = createContext<Account>({});
export default authContext;
