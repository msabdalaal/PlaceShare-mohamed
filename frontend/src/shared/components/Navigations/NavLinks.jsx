import "./NavLinks.css";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthShared } from "../../context/auth-context";
const NavLinks = () => {
  const nav=useNavigate();
  const AuthData = AuthShared();
  const Logout =()=>{
    AuthData.logout();
    nav('/')
  }
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" end>
          All Users
        </NavLink>
      </li>
      {AuthData.isLoggedIn && (
        <li>
          <NavLink to={`/${AuthData.userId}/places`} end>
            My Places
          </NavLink>
        </li>
      )}
      {AuthData.isLoggedIn && (
        <li>
          <NavLink to="/places/new" end>
            New Place
          </NavLink>
        </li>
      )}
      {!AuthData.isLoggedIn && (
        <li>
          <NavLink to="/auth" end>
            Auth
          </NavLink>
        </li>
      )}
      {AuthData.isLoggedIn && (
        <li>
          <button onClick={Logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};
export default NavLinks;
