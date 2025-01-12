
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
  const {refetch,data:DATA }=useQuery({
    queryKey: ["token"],
    queryFn:deleteToken,
    enabled: false
  })
  const login = useCallback(({ id }) => {
    setLoggedIn(true);
    setUserId(id);
  },[])
  const logout = async  () => {
    await refetch ();
    if(DATA){
      console.log(DATA);
      setLoggedIn(false);
      setUserId(null);
    }

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
