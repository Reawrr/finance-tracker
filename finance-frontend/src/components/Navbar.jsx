import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">

      <div className="font-bold text-xl">
        Finance Tracker
      </div>

      <div className="flex gap-6">

        <Link
          to="/dashboard"
          className="hover:text-blue-600"
        >
          Dashboard
        </Link>

        <Link
          to="/transactions"
          className="hover:text-blue-600"
        >
          Transactions
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}