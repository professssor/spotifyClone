import { getProviders, signIn } from "next-auth/react";
function login({ providers }) {
  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center  ">
      <img
        className="w-40 h-140"
        src="https://links.papareact.com/9xl"
        alt=""
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className="  mt-4 rounded-2xl bg-[#18D860] text-white transition-all ease-in-out  duration-200 p-5 text-sm hover:text-black hover:bg-[#9A9483] hover:font-semibold"
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;
export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
