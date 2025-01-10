import "./NavLinks.css";
import { NavLink } from "react-router-dom";
import { AuthShared } from "../../context/auth-context";
const NavLinks = () => {
  const AuthData = AuthShared();
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
          <button onClick={AuthData.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};
export default NavLinks;
