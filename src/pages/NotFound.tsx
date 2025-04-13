import { Link } from "react-router-dom";
import { RoutesMain } from "../common/enums/routes";

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#380947] via-[#070329] to-[#681065] flex flex-col">
      <header
        className="flex items-center justify-between p-4 backdrop-blur-xl"
        style={{ background: "rgba(0,0,0, 20%)" }}
      >
        <Link to={RoutesMain.Main} className="text-white text-2xl font-bold">
          PICK<span className="italic">M</span>e
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <h2 className="text-white text-[200px] font-bold mb-4">404</h2>
        <p className="text-white text-lg">Page Not Found</p>
      </main>
    </div>
  );
};
