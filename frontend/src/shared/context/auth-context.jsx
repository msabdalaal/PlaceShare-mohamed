import { createContext, useState, useContext, useCallback } from "react";
import Cookies from "js-cookie";
const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const login = useCallback(({ id }) => {
    setLoggedIn(true);
    setUserId(id);
  },[])
  const logout = () => {
    setLoggedIn(false);
    setUserId(null);

    Cookies.remove("jwt");
  };
  const data = {
    isLoggedIn,
    login,
    logout,
    userId,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
export const AuthShared = () => {
  const dataShared = useContext(AuthContext);
  return dataShared;
};
