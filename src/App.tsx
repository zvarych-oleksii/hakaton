import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import ProtectedRoutes from "./ProtectedRoute";
import { RoutesMain } from "./common/enums/routes";
import ProfilePage from "./pages/Profile";
import Layout from "./Layout";
import { NotFoundPage } from "./pages/NotFound";
import PickLocationPage from "./pages/PickLocation.tsx";
import CreateLocation from "./pages/CreateLocation.tsx";
import MainMapPage from "./pages/MainMap.tsx";
import LocationProfilePage from "./pages/LocationProfilePage.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={RoutesMain.Login} element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route element={<ProtectedRoutes />}>
          <Route path={RoutesMain.Profile} element={<ProfilePage />} />
          <Route path={RoutesMain.LocationCreate} element={<CreateLocation />} />
          <Route path={RoutesMain.Location} element={<PickLocationPage />} />
          <Route
            path={RoutesMain.LocationProfile}
            element={<LocationProfilePage/>}
          />
          <Route path={RoutesMain.Main} element={<MainMapPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
