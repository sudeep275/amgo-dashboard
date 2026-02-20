import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockCampaigns } from "../mockDatas";
import type { Campaign } from "../types";
import { updateCampaignStatus } from "../services/campaignService";

export default function CampaignPage() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [filter, setFilter] = useState<"All" | "Active" | "Paused">("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(0);

  const itemsPerPage = 3;

  /* ================= DEBOUNCE ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  /* ================= FILTER ================= */
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => filter === "All" || c.status === filter)
      .filter((c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
  }, [campaigns, filter, debouncedSearch]);

  /* ================= SORT ================= */
  const sortedCampaigns = useMemo(() => {
    return [...filteredCampaigns].sort((a, b) =>
      sortOrder === "asc" ? a.budget - b.budget : b.budget - a.budget
    );
  }, [filteredCampaigns, sortOrder]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = sortedCampaigns.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* ================= CRUD ================= */

  const handleAddCampaign = () => {
    if (!newName || newBudget <= 0) return;

    const newCampaign: Campaign = {
      id: Date.now(),
      name: newName,
      budget: newBudget,
      status: "Active",
    };

    setCampaigns((prev) => [...prev, newCampaign]);
    setIsModalOpen(false);
    setNewName("");
    setNewBudget(0);
  };

  const handleEdit = (campaign: Campaign) => {
    const updatedName = prompt("Edit campaign name", campaign.name);
    if (!updatedName) return;

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id ? { ...c, name: updatedName } : c
      )
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this campaign?")) return;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleStatusToggle = async (campaign: Campaign) => {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";
    const previous = [...campaigns];

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id ? { ...c, status: newStatus } : c
      )
    );

    setLoadingId(campaign.id);
    setError(null);

    try {
      await updateCampaignStatus(campaign.id, newStatus);
    } catch {
      setCampaigns(previous);
      setError("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Campaign Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          + Add Campaign
        </button>
      </div>

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
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-3 py-2 rounded w-64"
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "All" | "Active" | "Paused")
          }
          className="bg-gray-800 border border-gray-700 px-3 py-2 rounded"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "asc" ? "desc" : "asc"
                  )
                }
              >
                Budget {sortOrder === "asc" ? "↑" : "↓"}
              </th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCampaigns.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-gray-400"
                >
                  No campaigns found.
                </td>
              </tr>
            ) : (
              paginatedCampaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-t border-gray-700 hover:bg-gray-700/60"
                >
                  <td
                    className="px-4 py-3 cursor-pointer"
                    onClick={() =>
                      navigate(`/campaigns/${campaign.id}`)
                    }
                  >
                    {campaign.name}
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₹{campaign.budget.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        handleStatusToggle(campaign)
                      }
                      disabled={loadingId === campaign.id}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
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

                  <td className="px-4 py-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="text-blue-400 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-400 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-gray-400">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Add Campaign
            </h2>

            <input
              type="text"
              placeholder="Campaign Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-gray-700"
            />

            <input
              type="number"
              placeholder="Budget"
              value={newBudget}
              onChange={(e) =>
                setNewBudget(Number(e.target.value))
              }
              className="w-full mb-4 px-3 py-2 rounded bg-gray-700"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                onClick={handleAddCampaign}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}