import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import useApi from "../lib/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";

export const LoginPage = () => {
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const { getCurrentUser } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchToken() {
      try {
        const userData = await getCurrentUser();
        navigate(RoutesMain.Profile);
        console.log(userData);
      } catch (error) {
        console.error("Error fetching access token or data:", error);
      }
    }

    fetchToken();
  }, [isAuthenticated, getCurrentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#380947] via-[#070329] to-[#681065] flex flex-col">
      <header
        className="flex items-center justify-between p-4 backdrop-blur-xl"
        style={{ background: "rgba(0,0,0, 20%)" }}
      >
        <Link to={RoutesMain.Main} className="text-white text-2xl font-bold">
          Hakaton
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-md w-full space-y-4">
          <button
            onClick={() =>
              loginWithPopup({
                authorizationParams: { connection: "windowslive" },
              })
            }
            className="flex items-center justify-center w-full gap-2 px-4 py-5 
                           bg-[rgb(40,40,40)] hover:bg-gray-800 text-white rounded 
                           transition-colors duration-200"
          >
            <FaMicrosoft size={20} />
            <span className="font-bold">
              Sign in with Microsoft Corporate Account
            </span>
          </button>

          <div className="flex items-center justify-between">
            <span className="h-[1px] bg-white block w-[100px]" />
            <div className="text-center text-white">or continue with</div>
            <span className="h-[1px] bg-white block w-[100px]" />
          </div>

          <button
            onClick={() =>
              loginWithPopup({
                authorizationParams: { connection: "google-oauth2" },
              })
            }
            className="flex items-center justify-center w-full gap-2 px-4 py-5 
                           bg-[rgb(40,40,40)] hover:bg-gray-800 text-white rounded 
                           transition-colors duration-200"
          >
            <FaGoogle size={20} />
            <span className="font-bold">
              Sign in with Google Corporate Account
            </span>
          </button>
        </div>
      </main>
    </div>
  );
};
