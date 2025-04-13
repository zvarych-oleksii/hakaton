import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { useAuth0 } from "@auth0/auth0-react";
import { RoutesMain } from "./common/enums/routes";

const Layout: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(to top right, #380947 0%, #070329 33%, #4a0a5a 66%, #070329 100%)",
      }}
    >
      <header
        className="flex items-center justify-between p-4 backdrop-blur-xl"
        style={{ background: "rgba(0,0,0, 20%)" }}
      >
        <div className="flex items-center space-x-2">
          <Link to={RoutesMain.Main} className="font-bold text-xl">
            Pick<span className="italic">M</span>e
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <p className="text-xl font-bold">PickMy:</p>
          <nav className="flex items-center space-x-4">
            <NavLink
              to={RoutesMain.Resume}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 py-2 border-white flex items-center hover:text-gray-300"
                  : "flex items-center py-2 hover:text-gray-300"
              }
            >
              Resume
            </NavLink>
            <NavLink
              to={RoutesMain.Company}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 py-2 border-white flex items-center hover:text-gray-300"
                  : "flex items-center py-2 hover:text-gray-300"
              }
            >
              Company
            </NavLink>
            <NavLink
              to={RoutesMain.Location}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 py-2 border-white flex items-center hover:text-gray-300"
                  : "flex items-center py-2 hover:text-gray-300"
              }
            >
              Locations
            </NavLink>
          </nav>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            to={RoutesMain.Profile}
            className="flex items-center hover:text-gray-300"
          >
            <FiUser size={20} className="mr-1" />
            Profile
          </Link>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors duration-200"
          >
            Log Out
          </button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
