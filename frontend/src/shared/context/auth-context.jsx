
import { useQuery } from "@tanstack/react-query";
import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { deleteToken, sendToken } from "../util/http.js";


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
  const { data:cc } = useQuery({
    queryKey:["token"],
    queryFn: sendToken,
  });
  const login = useCallback(({ id }) => {
    setLoggedIn(true);
    setUserId(id);
  },[])
  useEffect(() => {
    // استدعاء تسجيل الدخول فقط بعد استرجاع البيانات
    if (cc && cc.token) {
      login({ id: data.token.id });
    }
  }, [cc,login]); // تشغيل هذا التأثير فقط عندما تتغير البيانات أو AuthData

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
