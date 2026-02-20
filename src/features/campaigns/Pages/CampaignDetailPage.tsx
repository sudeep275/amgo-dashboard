import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PerformanceTab from "../components/PerformanceTab";
import SimulationTab from "../components/SimulationTab";
import { mockCampaigns } from "../mockDatas";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "performance" | "simulation"
  >("overview");

  const campaign = mockCampaigns.find((c) => c.id === Number(id));

  if (!campaign) {
    return (
      <div className="p-8">
        <p>Campaign not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded text-sm transition"
      >
        ← Back
      </button>

      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">{campaign.name}</h2>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm transition ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("performance")}
            className={`pb-3 text-sm transition ${
              activeTab === "performance"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Performance
          </button>

          <button
            onClick={() => setActiveTab("simulation")}
            className={`pb-3 text-sm transition ${
              activeTab === "simulation"
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Simulation
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-4 text-sm">
            <p>
              <span className="text-gray-400">Budget:</span> ₹
              {campaign.budget.toLocaleString()}
            </p>

            <p>
              <span className="text-gray-400">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  campaign.status === "Active"
                    ? "bg-green-600/20 text-green-400 border border-green-600"
                    : "bg-yellow-600/20 text-yellow-400 border border-yellow-600"
                }`}
              >
                {campaign.status}
              </span>
            </p>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="mt-4">
            <PerformanceTab />
          </div>
        )}

        {activeTab === "simulation" && (
          <div className="mt-4">
            <SimulationTab budget={campaign.budget} />
          </div>
        )}
      </div>
    </div>
  );
}
