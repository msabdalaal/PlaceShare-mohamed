import AppContent from "./AppContent";
import { queryClient } from "./shared/util/http";
import { QueryClientProvider } from "@tanstack/react-query";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;



// import React, { Suspense,  } from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Navigate,
// } from "react-router-dom";
// import Root from "./Root";
// import { AuthShared } from "./shared/context/auth-context";
// import { queryClient, sendToken } from "./shared/util/http";
// import { QueryClientProvider, useQuery } from "@tanstack/react-query";

// // Lazy load components
// const Users = React.lazy(() => import("./users/pages/User"));
// const UserPlaces = React.lazy(() => import("./places/pages/UserPlace"));
// const Auth = React.lazy(() => import("./users/pages/Auth"));
// const UpdatePlace = React.lazy(() => import("./places/pages/updatePlace"));
// const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));

// // Import loader for Users
// import { loader as usersLoader } from "./users/pages/User";
// import LoadingSpinner from "./shared/components/UiElement/LoadingSpinner";

// function App() {
//   const AuthData = AuthShared();
//   const { data, isLoading } = useQuery({
//     queryFn:sendToken
//   })
//   if(data.token){
//     AuthData.login({id:data.token.id})
//   }
//   if(isLoading){
//     return <LoadingSpinner />
//   }
//   let children = [];
//   if (AuthData.isLoggedIn) {
//     children = [
//       { path: "places/:placeId", element: <UpdatePlace /> },
//       { path: "places/new", element: <NewPlace /> },
//       { path: ":UserId/Places", element: <UserPlaces /> },
//     ];
//   } else {
//     children = [
//       { path: "auth", element: <Auth /> },
//       { path: ":UserId/Places", element: <UserPlaces /> },
//     ];
//   }
//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: <Root />,
//       children: [
//         { index: true, element: <Users />, loader: usersLoader },
//         ...children,
//       ],
//     },
//     { path: "*", element: <Navigate to="/" replace /> },
//   ]);
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Suspense
//         fallback={
//           <div className="center">
//             <LoadingSpinner />
//           </div>
//         }
//       >
//         <RouterProvider router={router} />;
//       </Suspense>
//     </QueryClientProvider>
//   );
// }

// export default App;
