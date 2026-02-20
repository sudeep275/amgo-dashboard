import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  fetchPerformanceData,
  type PerformanceMetric,
} from "../services/performanceService";

export default function PerformanceTab() {
  const [data, setData] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchPerformanceData();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return <p className="text-gray-500">Loading performance data...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (data.length === 0)
    return <p className="text-gray-500">No performance data available.</p>;

  return (
    <div className="h-72">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#3b82f6" />
          <Line type="monotone" dataKey="impressions" stroke="#10b981" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
