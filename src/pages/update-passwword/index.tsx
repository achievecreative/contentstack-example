import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";

const UpdatePasswordPage = () => {
  const updatePassword = () => {
    const config: Configuration = {
      auth: {
        clientId: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_ID!,
        authority: `https://${process.env.NEXT_PUBLIC_AZURE_AD_B2C_TENANT_ID}.ciamlogin.com/`,
        clientSecret: process.env.NEXT_PUBLIC_AZURE_AD_B2C_CLIENT_SECRET!,
      },
    };

    // Create msal application object
    const cca = new ConfidentialClientApplication(config);

    cca
      .acquireTokenByClientCredential({ scopes: ["User.ReadWrite.All"] })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  };
  return (
    <main
      className={`relative max-w-7xl mx-auto px-4 focus:outline-none sm:px-3 md:px-5 p-10`}
    >
      <div className="text-md">
        <div className="text-4xl pb-10">Update password</div>
        <div className="flex flex-row gap-4">
          <button
            className="bg-blue-500 rounded w-64 px-10 py-5 text-white"
            onClick={updatePassword}
          >
            Update
          </button>
        </div>
      </div>
    </main>
  );
};

export default UpdatePasswordPage;
