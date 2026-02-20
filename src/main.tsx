import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { CampaignProvider } from "./app/store/CampaignContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CampaignProvider>
      <App />
    </CampaignProvider>
  </StrictMode>,
);
