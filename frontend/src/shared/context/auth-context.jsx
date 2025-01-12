import { useMutation } from "@tanstack/react-query";
import { createContext, useState, useContext, useCallback } from "react";
import { deleteToken, queryClient } from "../util/http";

const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {},
});
export const AuthContextProvider = ({ children }) => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const{mutate}=useMutation({
    mutationFn:deleteToken,
    onMutate:async(data)=>{
      console.log("delete Token",data);
      await queryClient.cancelQueries({ queryKey: ["token"] });
      setLoggedIn(false);
      setUserId(null);
      const prev1 = queryClient.getQueryData(["token"]);
      queryClient.setQueryData(["token"], data);
      return { prev1}
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["token"], context.prev1);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['token'])
    },
    onSuccess:()=>{
      setLoggedIn(false);
      setUserId(null);
    }
  })
  const login = useCallback(({ id }) => {
    setLoggedIn(true);
    setUserId(id);
  },[])
  const logout = () => {
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
