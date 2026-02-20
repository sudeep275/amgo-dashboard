import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CampaignPage from "./features/campaigns/components/CampaignPage";
import CampaignDetailPage from "./features/campaigns/Pages/CampaignDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Wrapper Route */}
        <Route element={<Layout />}>
          {/* Redirect Home to Campaigns */}
          <Route path="/" element={<Navigate to="/campaigns" />} />

          {/* Campaign Pages */}
          <Route path="/campaigns" element={<CampaignPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
