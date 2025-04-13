import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";
import ProtectedRoutes from "./ProtectedRoute";
import { RoutesMain } from "./common/enums/routes";
import ProfilePage from "./pages/Profile";
import Layout from "./Layout";
import PartnerCompaniesPage from "./pages/PartnerCompanies";
import CompanyProfilePage from "./pages/CompanyProfile";
import BoostResumePage from "./pages/BoostResume";
import { NotFoundPage } from "./pages/NotFound";
import CreateStartUp from "./pages/CreateStartUp";
import PickStartupPage from "./pages/PickStartUp";
import StartupDiscussionPage from "./pages/StartUpDiscussion";
import ImproveStartupPage from "./pages/ImproveStartUp";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={RoutesMain.Login} element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route element={<ProtectedRoutes />}>
          <Route path={RoutesMain.Profile} element={<ProfilePage />} />
          <Route path={RoutesMain.StartupCreate} element={<CreateStartUp />} />
          <Route path={RoutesMain.Startup} element={<PickStartupPage />} />
          <Route
            path={RoutesMain.StartupProfile}
            element={<StartupDiscussionPage />}
          />
          <Route path={RoutesMain.Resume} element={<BoostResumePage />} />
          <Route path={RoutesMain.Main} element={<ImproveStartupPage />} />
          <Route path={RoutesMain.Company} element={<PartnerCompaniesPage />} />
          <Route
            path={RoutesMain.CompanyProfile}
            element={<CompanyProfilePage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
