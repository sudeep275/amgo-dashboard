import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCampaigns } from "../mockDatas";
import type { Campaign } from "../types";
import { updateCampaignStatus } from "../services/campaignService";

export default function CampaignPage() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  const [filter, setFilter] = useState<"All" | "Active" | "Paused">("All");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 3;

  /* ========================
     Debounce Search
  ======================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* ========================
     Filter
  ======================== */
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => filter === "All" || c.status === filter)
      .filter((c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
  }, [campaigns, filter, debouncedSearch]);

  /* ========================
     Sort
  ======================== */
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) =>
      sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget,
    );
  }, [filteredCampaigns, sortOrder]);

  /* ========================
     Pagination
  ======================== */
  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedCampaigns = sortedCampaigns.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const isAllSelected =
    paginatedCampaigns.length > 0 &&
    paginatedCampaigns.every((c) => selectedIds.includes(c.id));

  /* ========================
     Status Toggle
  ======================== */
  const handleStatusToggle = async (campaign: Campaign) => {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";

    const previous = [...campaigns];

    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaign.id ? { ...c, status: newStatus } : c)),
    );

    setLoadingId(campaign.id);
    setError(null);

    try {
      await updateCampaignStatus(campaign.id, newStatus);
    } catch (err: any) {
      setCampaigns(previous);
      setError(err?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const handleBulkStatus = (status: "Active" | "Paused") => {
    setCampaigns((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status } : c)),
    );
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected campaigns?",
    );

    if (!confirmDelete) return;

    setCampaigns((prev) => prev.filter((c) => !selectedIds.includes(c.id)));

    setSelectedIds([]);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearch]);

  /* ========================
     UI
  ======================== */

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Campaign Management</h1>

      {error && (
        <div className="mb-4 text-red-400 bg-red-900/40 border border-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search campaign..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value as "All" | "Active" | "Paused");
            setCurrentPage(1);
          }}
          className="bg-gray-800 border border-gray-700 text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-gray-800 border border-gray-700 p-4 rounded mb-4">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => handleBulkStatus("Active")}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
            >
              Activate
            </button>

            <button
              onClick={() => handleBulkStatus("Paused")}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
            >
              Pause
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-gray-300 sticky top-0 z-10">
            <tr>
              <th className="w-12 px-4 py-3">
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    className="accent-blue-500 cursor-pointer"
                    checked={isAllSelected}
                    onChange={() => {
                      if (isAllSelected) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(paginatedCampaigns.map((c) => c.id));
                      }
                    }}
                  />
                </div>
              </th>

              <th className="px-4 py-3 text-left">Name</th>

              <th
                className="px-4 py-3 text-right cursor-pointer select-none"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                Budget {sortOrder === "asc" ? "↑" : "↓"}
              </th>

              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCampaigns.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No campaigns found.
                </td>
              </tr>
            ) : (
              paginatedCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  className="border-t border-gray-700 hover:bg-gray-700/60 transition cursor-pointer"
                >
                  <td className="w-12 px-4 py-3">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        onClick={(e) => e.stopPropagation()}
                        checked={selectedIds.includes(campaign.id)}
                        onChange={() => {
                          setSelectedIds((prev) =>
                            prev.includes(campaign.id)
                              ? prev.filter((id) => id !== campaign.id)
                              : [...prev, campaign.id],
                          );
                        }}
                        className="accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 text-left font-medium">
                    {campaign.name}
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₹{campaign.budget.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(campaign);
                      }}
                      disabled={loadingId === campaign.id}
                      className={`px-3 py-1 rounded text-xs font-semibold transition ${
                        campaign.status === "Active"
                          ? "bg-green-600/20 text-green-400 border border-green-600"
                          : "bg-yellow-600/20 text-yellow-400 border border-yellow-600"
                      }`}
                    >
                      {loadingId === campaign.id
                        ? "Updating..."
                        : campaign.status}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {paginatedCampaigns.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-400">
                No campaigns found.
              </td>
            </tr>
          )}
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => {
            setSelectedIds([]);
            setCurrentPage((prev) => prev - 1);
          }}
          className={`px-4 py-2 rounded text-sm transition ${
            currentPage === 1
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Prev
        </button>

        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => {
            setSelectedIds([]);
            setCurrentPage((prev) => prev + 1);
          }}
          className={`px-4 py-2 rounded text-sm transition ${
            currentPage >= totalPages
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-700 text-gray-200 hover:bg-gray-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
