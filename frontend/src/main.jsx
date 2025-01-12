
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./shared/context/auth-context.jsx";
import "./index.css";
import App from "./App.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/util/http.js";

createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </QueryClientProvider>

);
