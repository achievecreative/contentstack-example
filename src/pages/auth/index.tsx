import { useEffect } from "react";
import { msalInstance } from "../_app";
import { loginRequest } from "@/libs/authConfig";

const SignInPage = () => {
  const signIn = () => {
    //msalInstance.clearCache();
    msalInstance.loginRedirect(loginRequest);
  };

  useEffect(() => {
    async function callBack() {
      const request = {
        code: "",
      };
      //const token = await msalInstance.acquireTokenByCode(request);
      //console.log(token);
    }

    callBack();
  }, []);

  return (
    <>
      <div className="max-w-lg m-auto pt-10">
        <button
          className="rounded bg-blue-500 text-white m-10 p-10 py-3"
          onClick={signIn}
        >
          Sign In
        </button>
      </div>
    </>
  );
};

export default SignInPage;
