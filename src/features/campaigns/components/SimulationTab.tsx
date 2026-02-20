import { useState } from "react";
import { runCampaignSimulation } from "../services/jobSimulationService";
import type { SimulationResult } from "../services/jobSimulationService";

export default function SimulationTab({ budget }: { budget: number }) {
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const totalImpressions = results.reduce((sum, r) => sum + r.impressions, 0);

  const totalClicks = results.reduce((sum, r) => sum + r.clicks, 0);

  const totalSpend = results.reduce((sum, r) => sum + r.spend, 0);

  const finalBudget =
    results.length > 0 ? results[results.length - 1].remainingBudget : budget;

  const ctr =
    totalImpressions > 0
      ? ((totalClicks / totalImpressions) * 100).toFixed(2)
      : "0";

  const handleRun = async () => {
    setLoading(true);
    const data = await runCampaignSimulation(budget);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={loading}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium transition"
      >
        {loading ? "Running..." : "Run Simulation"}
      </button>

      {/* KPI Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400">Impressions</p>
            <p className="text-lg font-semibold">{totalImpressions}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400">Clicks</p>
            <p className="text-lg font-semibold">{totalClicks}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400">CTR (%)</p>
            <p className="text-lg font-semibold">{ctr}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400">Total Spend</p>
            <p className="text-lg font-semibold">₹{totalSpend}</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-4 rounded">
            <p className="text-xs text-gray-400">Remaining Budget</p>
            <p className="text-lg font-semibold">₹{finalBudget}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {results.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Day</th>
                <th className="px-4 py-3 text-right">Impressions</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Spend</th>
                <th className="px-4 py-3 text-right">Remaining Budget</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="px-4 py-3 text-left">{r.day}</td>

                  <td className="px-4 py-3 text-right">{r.impressions}</td>

                  <td className="px-4 py-3 text-right">{r.clicks}</td>

                  <td className="px-4 py-3 text-right">₹{r.spend}</td>

                  <td className="px-4 py-3 text-right">₹{r.remainingBudget}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
