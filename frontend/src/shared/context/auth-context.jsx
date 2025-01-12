
import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useContext, useCallback } from "react";
import { deleteToken } from "../util/http.js";


const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
export const AuthContextProvider = ({ children }) => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const {mutate}=useQuery({
    queryKey: ["token"],
    queryFn:deleteToken,
    enabled: false
  })

  const login = useCallback(({ id }) => {
    setLoggedIn(true);
    setUserId(id);
  },[])
  const logout = () => {
    setLoggedIn(false);
    setUserId(null);
    mutate();
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
