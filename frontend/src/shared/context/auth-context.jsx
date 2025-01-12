import { useMutation } from "@tanstack/react-query";
import { createContext, useState, useContext, useCallback } from "react";
import { deleteToken } from "../util/http";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const{mutate}=useMutation({
    mutationFn:deleteToken,
    onSuccess: () => {
      // التنقل إلى الصفحة الحالية لإعادة العرض
      navigate(0); // هذا يُعيد تحميل الصفحة كـ SPA
    }
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
