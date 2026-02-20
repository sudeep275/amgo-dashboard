import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import Toast from "../app/components/Toast";

export default function Layout() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6">
        <h1 className="text-xl font-bold mb-8">AMGO</h1>

        <nav className="space-y-2">
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            Campaigns
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        <Outlet />
      </main>
    </div>
  );
}
