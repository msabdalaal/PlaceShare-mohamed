import { Link } from "react-router-dom";
import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UiElement/Backdrop";
import { useState } from "react";
const MainNavigation = () => {
  const [isClicked, setClicked] = useState(false);
  let clickButton = () => {
    setClicked(true);
  };
  let UnclickButton = () => {
    setClicked(false);
  };
  return (
    <>
      {isClicked && <Backdrop click={UnclickButton} />}
      <SideDrawer isShow={isClicked} click={UnclickButton} >
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={clickButton}>
          <span />
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/"> Your Places</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};
export default MainNavigation;
