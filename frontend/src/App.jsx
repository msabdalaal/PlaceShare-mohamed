import React, { Suspense, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Root from "./Root";
import { AuthShared } from "./shared/context/auth-context";
import { sendToken } from "./shared/util/http";
import { useQuery } from "@tanstack/react-query";

// Lazy load components
const Users = React.lazy(() => import("./users/pages/User"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));
const UpdatePlace = React.lazy(() => import("./places/pages/updatePlace"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));

// Import loader for Users
import { loader as usersLoader } from "./users/pages/User";
import LoadingSpinner from "./shared/components/UiElement/LoadingSpinner";

function App() {
  const AuthData = AuthShared();
  const { data, isLoading } = useQuery({
    queryKey:["token"],
    queryFn: sendToken,
  });

  useEffect(() => {
    // استدعاء تسجيل الدخول فقط بعد استرجاع البيانات
    if (data && data.token) {
      AuthData.login({ id: data.token.id });
    }
  }, [data, AuthData]); // تشغيل هذا التأثير فقط عندما تتغير البيانات أو AuthData

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }
  console.log("token",data);
  console.log("is Logged IN",AuthData.isLoggedIn);
  console.log("user ID",AuthData.userId);


  let children = [];
  if (AuthData.isLoggedIn) {
    children = [
      { path: "places/:placeId", element: <UpdatePlace /> },
      { path: "places/new", element: <NewPlace /> },
      { path: ":UserId/Places", element: <UserPlaces /> },
    ];
  } else {
    children = [
      { path: "auth", element: <Auth /> },
      { path: ":UserId/Places", element: <UserPlaces /> },
    ];
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        { index: true, element: <Users key={Math.random()} />, loader: usersLoader },
        ...children,
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return (
    <Suspense
      fallback={
        <div className="center">
          <LoadingSpinner />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
export default App;
