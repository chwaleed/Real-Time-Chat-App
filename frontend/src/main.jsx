import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/socketContext.jsx";
import { ThemeProvider } from "./components/theme-provider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SocketProvider>
        <App />
        <Toaster closeButton />
      </SocketProvider>
    </ThemeProvider>
  </React.StrictMode>
);
