import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("ownerToken");
    navigate("/admin/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Owner Panel
            </h1>

            <p className="text-sm text-gray-500">
              Northline Roofing & Exteriors
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-gray-900">
            Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            Configuration editor and lead management will be added next.
          </p>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;