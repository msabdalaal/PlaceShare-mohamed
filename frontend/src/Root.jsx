import { Outlet } from "react-router-dom";
import MainNavigation from "./shared/components/Navigations/MainNavigation";
const Root = () => {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default Root;
